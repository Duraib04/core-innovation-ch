import { NextRequest, NextResponse } from 'next/server'
import { getCustomerSession } from '@/lib/customerAuth'
import { DdSQL } from '@/lib/DdSQL'

const DB = 'ecommerce'

export async function GET(request: NextRequest) {
  try {
    const session = await getCustomerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const email = session.email?.toLowerCase()

    const customers = DdSQL.getTableData(DB, 'customers') as any[]
    const reviews = DdSQL.getTableData(DB, 'reviews') as any[]
    const products = DdSQL.getTableData(DB, 'products') as any[]

    const me = customers.find((c) => String(c.email || '').toLowerCase() === String(email))
    if (!me) return NextResponse.json({ reviews: [] })

    const productMap = new Map<string, any>()
    products.forEach((p) => productMap.set(String(p.id), p))

    const myReviews = reviews
      .filter((r) => String(r.customer_id) === String(me.id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((r) => {
        const p = productMap.get(String(r.product_id))
        return {
          ...r,
          product_name: p?.name || r.product_id,
          category: p?.category,
        }
      })

    return NextResponse.json({ reviews: myReviews })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
