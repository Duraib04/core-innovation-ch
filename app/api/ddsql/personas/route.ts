import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { DdSQL } from '@/lib/DdSQL'

const DB = 'ecommerce'
const PERSONA_TABLE = 'customer_personas'

function daysBetween(a: Date, b: Date) {
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24))
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'root') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Load source data
    const [customers, products, orders, items, reviews] = await Promise.all([
      DdSQL.getTableData(DB, 'customers'),
      DdSQL.getTableData(DB, 'products'),
      DdSQL.getTableData(DB, 'orders'),
      DdSQL.getTableData(DB, 'order_items'),
      DdSQL.getTableData(DB, 'reviews'),
    ]) as [any[], any[], any[], any[], any[]]

    // Build indices
    const productMap = new Map<string, any>()
    products.forEach(p => productMap.set(String(p.id || p.product_id || p.sku || p.prod_id), p))

    const orderItemsByOrder = new Map<string, any[]>()
    items.forEach(oi => {
      const k = String(oi.order_id)
      const arr = orderItemsByOrder.get(k) || []
      arr.push(oi)
      orderItemsByOrder.set(k, arr)
    })

    const ordersByCustomer = new Map<string, any[]>()
    orders.forEach(o => {
      const k = String(o.customer_id)
      const arr = ordersByCustomer.get(k) || []
      arr.push(o)
      ordersByCustomer.set(k, arr)
    })

    // Category average price for price-sensitivity
    const categoryAgg: Record<string, { sum: number; count: number }> = {}
    products.forEach(p => {
      const cat = String(p.category || 'Other')
      const price = Number(p.price || 0)
      if (!categoryAgg[cat]) categoryAgg[cat] = { sum: 0, count: 0 }
      categoryAgg[cat].sum += price
      categoryAgg[cat].count += 1
    })
    const categoryAvg: Record<string, number> = {}
    Object.entries(categoryAgg).forEach(([cat, agg]) => {
      categoryAvg[cat] = agg.count ? agg.sum / agg.count : 0
    })

    // Prepare target table schema (no-op in Postgres)
    await DdSQL.createTable(DB, PERSONA_TABLE, {
      customer_id: 'string',
      persona: 'string',
      summary: 'string',
      tags: 'string',
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

    // Compute personas
    const now = new Date()
    const personaRows: Array<Record<string, unknown>> = []
    customers.forEach(c => {
      const cid = String(c.id || c.customer_id)
      const custOrders = (ordersByCustomer.get(cid) || []).sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
      const orderCount = custOrders.length
      const totalSpend = custOrders.reduce((acc, o) => acc + Number(o.total_amount || 0), 0)
      const avgOrderValue = orderCount ? totalSpend / orderCount : 0
      const lastOrderDateStr = orderCount ? String(custOrders[0].order_date) : ''
      const recencyDays = orderCount ? daysBetween(now, new Date(custOrders[0].order_date)) : 9999

      // Build category preferences from order items
      const categoryCount: Record<string, number> = {}
      for (const o of custOrders) {
        const its = orderItemsByOrder.get(String(o.id)) || []
        for (const it of its) {
          const prod = productMap.get(String(it.product_id))
          const cat = String(prod?.category || 'Other')
          categoryCount[cat] = (categoryCount[cat] || 0) + Number(it.quantity || 1)
        }
      }
      const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

      // Price sensitivity via average unit price vs category average
      let purchasedAvgUnit = 0
      let unitCount = 0
      for (const o of custOrders) {
        const its = orderItemsByOrder.get(String(o.id)) || []
        for (const it of its) {
          const price = Number(it.unit_price || 0)
          purchasedAvgUnit += price
          unitCount += 1
        }
      }
      purchasedAvgUnit = unitCount ? purchasedAvgUnit / unitCount : 0
      const catAvg = topCategory in categoryAvg ? categoryAvg[topCategory] : 0
      const priceSensitivity = purchasedAvgUnit && catAvg
        ? (purchasedAvgUnit < catAvg * 0.9 ? 'Bargain-Seeking' : purchasedAvgUnit > catAvg * 1.1 ? 'Premium-Leaning' : 'Balanced')
        : 'Unknown'

      // Reviews summary
      const myReviews = reviews.filter(r => String(r.customer_id) === cid)
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

      const summary = `${persona}: ${c.name || cid} tends to buy ${topCategory}, spent ${totalSpend.toFixed(0)}, ${orderCount} orders, ${reviewCount} reviews. Price: ${priceSensitivity}.`

      personaRows.push({
        customer_id: cid,
        persona,
        summary,
        tags: tags.join(','),
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
      })
    })

    await Promise.all(personaRows.map(row => DdSQL.insertRow(DB, PERSONA_TABLE, row)))

    return NextResponse.json({ success: true, count: customers.length, table: PERSONA_TABLE })
  } catch (error) {
    console.error('[Personas] Error:', error)
    return NextResponse.json({ error: 'Failed to generate personas' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'root') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const rows = await DdSQL.getTableData(DB, PERSONA_TABLE)
    return NextResponse.json({ data: rows })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
