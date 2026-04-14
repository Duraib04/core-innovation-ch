import { NextRequest, NextResponse } from 'next/server'
import { getCustomerSession } from '@/lib/customerAuth'
import { DdSQL } from '@/lib/DdSQL'

const DB = 'ecommerce'
const CACHE_TABLE = 'customer_persona_cache'
const CACHE_TTL_HOURS = 6

function daysBetween(a: Date, b: Date) {
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24))
}

export async function GET(request: NextRequest) {
  try {
    const session = await getCustomerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const email = session.email?.toLowerCase()
    const name = session.name

    // Ensure cache table exists (no-op in Postgres)
    await DdSQL.createTable(DB, CACHE_TABLE, {
      email: 'string',
      persona: 'string',
      tags: 'string',
      summary: 'string',
      top_category: 'string',
      avg_order_value: 'number',
      total_spend: 'number',
      order_count: 'number',
      last_order_date: 'string',
      recency_days: 'number',
      review_count: 'number',
      avg_rating: 'number',
      price_sensitivity: 'string',
      last_updated: 'string'
    })

    const [customers, products, orders, items, reviews] = await Promise.all([
      DdSQL.getTableData(DB, 'customers'),
      DdSQL.getTableData(DB, 'products'),
      DdSQL.getTableData(DB, 'orders'),
      DdSQL.getTableData(DB, 'order_items'),
      DdSQL.getTableData(DB, 'reviews'),
    ]) as [any[], any[], any[], any[], any[]]

    const me = customers.find((c) => String(c.email || '').toLowerCase() === String(email))

    // Check cache first
    const cacheRows = await DdSQL.queryTable(DB, CACHE_TABLE, { email }) as any[]
    const cached = cacheRows[cacheRows.length - 1]
    if (cached) {
      const ageHrs = (Date.now() - new Date(cached.last_updated).getTime()) / (1000 * 60 * 60)
      if (ageHrs <= CACHE_TTL_HOURS) {
        return NextResponse.json({
          user: me ? { id: me.id, name: me.name, email: me.email } : { name, email },
          persona: {
            persona: cached.persona,
            tags: (cached.tags as string)?.split(',').filter(Boolean) || [],
            summary: cached.summary,
            top_category: cached.top_category,
            avg_order_value: Number(cached.avg_order_value || 0),
            total_spend: Number(cached.total_spend || 0),
            order_count: Number(cached.order_count || 0),
            last_order_date: cached.last_order_date,
            recency_days: Number(cached.recency_days || 0),
            review_count: Number(cached.review_count || 0),
            avg_rating: Number(cached.avg_rating || 0),
            price_sensitivity: cached.price_sensitivity,
            last_updated: cached.last_updated,
          },
          cached: true
        })
      }
    }

    // If not present in ecommerce DB, return Prospect default
    if (!me) {
      const personaData = {
        persona: 'Prospect',
        tags: ['No Orders'],
        summary: `${name || email} has not placed any orders yet.`,
        top_category: 'N/A',
        avg_order_value: 0,
        total_spend: 0,
        order_count: 0,
        recency_days: 9999,
        review_count: 0,
        avg_rating: 0,
        price_sensitivity: 'Unknown',
        last_updated: new Date().toISOString()
      }

      // cache prospect too
      await DdSQL.insertRow(DB, CACHE_TABLE, {
        email,
        persona: personaData.persona,
        tags: personaData.tags.join(','),
        summary: personaData.summary,
        top_category: personaData.top_category,
        avg_order_value: personaData.avg_order_value,
        total_spend: personaData.total_spend,
        order_count: personaData.order_count,
        last_order_date: '',
        recency_days: personaData.recency_days,
        review_count: personaData.review_count,
        avg_rating: personaData.avg_rating,
        price_sensitivity: personaData.price_sensitivity,
        last_updated: personaData.last_updated,
      })

      return NextResponse.json({
        user: { name, email },
        persona: personaData,
        cached: true
      })
    }

    const productMap = new Map<string, any>()
    products.forEach((p) => productMap.set(String(p.id), p))

    const myOrders = orders.filter((o) => String(o.customer_id) === String(me.id))
    const myItems = items.filter((it) => myOrders.some((o) => String(o.id) === String(it.order_id)))

    const now = new Date()
    const orderCount = myOrders.length
    const totalSpend = myOrders.reduce((acc, o) => acc + Number(o.total_amount || 0), 0)
    const avgOrderValue = orderCount ? totalSpend / orderCount : 0
    const lastOrderDateStr = orderCount ? String(myOrders.sort((a,b)=> new Date(b.order_date).getTime() - new Date(a.order_date).getTime())[0].order_date) : ''
    const recencyDays = orderCount ? daysBetween(now, new Date(lastOrderDateStr)) : 9999

    // Category preference
    const categoryCount: Record<string, number> = {}
    myItems.forEach((it) => {
      const p = productMap.get(String(it.product_id))
      const cat = String(p?.category || 'Other')
      categoryCount[cat] = (categoryCount[cat] || 0) + Number(it.quantity || 1)
    })
    const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    // Price sensitivity
    let purchasedAvgUnit = 0
    let unitCount = 0
    myItems.forEach((it) => {
      purchasedAvgUnit += Number(it.unit_price || 0)
      unitCount += 1
    })
    purchasedAvgUnit = unitCount ? purchasedAvgUnit / unitCount : 0

    const categoryAgg: Record<string, { sum: number; count: number }> = {}
    products.forEach((p) => {
      const cat = String(p.category || 'Other')
      const price = Number(p.price || 0)
      if (!categoryAgg[cat]) categoryAgg[cat] = { sum: 0, count: 0 }
      categoryAgg[cat].sum += price
      categoryAgg[cat].count += 1
    })
    const catAvg = topCategory in categoryAgg
      ? categoryAgg[topCategory].sum / (categoryAgg[topCategory].count || 1)
      : 0

    const priceSensitivity = purchasedAvgUnit && catAvg
      ? (purchasedAvgUnit < catAvg * 0.9 ? 'Bargain-Seeking' : purchasedAvgUnit > catAvg * 1.1 ? 'Premium-Leaning' : 'Balanced')
      : 'Unknown'

    // Reviews
    const myReviews = reviews.filter((r) => String(r.customer_id) === String(me.id))
    const reviewCount = myReviews.length
    const avgRating = reviewCount ? myReviews.reduce((a, r) => a + Number(r.rating || 0), 0) / reviewCount : 0

    // Persona rules
    let persona = 'Prospect'
    const tags: string[] = []
    if (orderCount === 0) {
      persona = 'Prospect'
      tags.push('No Orders')
    } else {
      if (totalSpend >= 7000 || (orderCount >= 3 && avgOrderValue >= 2000)) tags.push('High Spender')
      if (recencyDays <= 14) tags.push('Active')
      if (recencyDays > 60) tags.push('Churn Risk')
      if (reviewCount >= 2) tags.push('Engaged Reviewer')
      if (topCategory !== 'N/A') tags.push(`${topCategory} Enthusiast`)

      if (tags.includes('High Spender') && tags.includes('Active')) persona = 'Loyal High-Spender'
      else if (tags.includes('Churn Risk')) persona = 'Dormant Buyer'
      else if (tags.includes('Engaged Reviewer')) persona = 'Advocate'
      else persona = 'Occasional Buyer'
    }

    const summary = `${persona}: ${me.name || email} tends to buy ${topCategory}, spent ${totalSpend.toFixed(0)}, ${orderCount} orders, ${reviewCount} reviews. Price: ${priceSensitivity}.`

    const personaData = {
      persona,
      tags,
      summary,
      top_category: topCategory,
      avg_order_value: Number(avgOrderValue.toFixed(2)),
      total_spend: Number(totalSpend.toFixed(2)),
      order_count: orderCount,
      last_order_date: lastOrderDateStr,
      recency_days: recencyDays,
      review_count: reviewCount,
      avg_rating: Number(avgRating.toFixed(2)),
      price_sensitivity: priceSensitivity,
      last_updated: new Date().toISOString()
    }

    // cache
    await DdSQL.insertRow(DB, CACHE_TABLE, {
      email,
      persona: personaData.persona,
      tags: tags.join(','),
      summary: personaData.summary,
      top_category: personaData.top_category,
      avg_order_value: personaData.avg_order_value,
      total_spend: personaData.total_spend,
      order_count: personaData.order_count,
      last_order_date: personaData.last_order_date,
      recency_days: personaData.recency_days,
      review_count: personaData.review_count,
      avg_rating: personaData.avg_rating,
      price_sensitivity: personaData.price_sensitivity,
      last_updated: personaData.last_updated,
    })

    return NextResponse.json({
      user: { id: me.id, name: me.name, email: me.email },
      persona: personaData,
      cached: false
    })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
