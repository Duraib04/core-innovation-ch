import { NextRequest, NextResponse } from 'next/server'
import { getCustomerSession } from '@/lib/customerAuth'
import { DdSQL } from '@/lib/DdSQL'

const DB = 'ecommerce'

export async function GET(request: NextRequest) {
  try {
    const session = await getCustomerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const email = session.email?.toLowerCase()

    const [customers, orders, items, products] = await Promise.all([
      DdSQL.getTableData(DB, 'customers'),
      DdSQL.getTableData(DB, 'orders'),
      DdSQL.getTableData(DB, 'order_items'),
      DdSQL.getTableData(DB, 'products'),
    ]) as [any[], any[], any[], any[]]

    const me = customers.find((c) => String(c.email || '').toLowerCase() === String(email))
    if (!me) return NextResponse.json({ orders: [] })

    const myOrders = orders
      .filter((o) => String(o.customer_id) === String(me.id))
      .sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())

    const productMap = new Map<string, any>()
    products.forEach((p) => productMap.set(String(p.id), p))

    const result = myOrders.map((o) => {
      const lineItems = items.filter((it) => String(it.order_id) === String(o.id)).map((it) => {
        const p = productMap.get(String(it.product_id))
        return {
          ...it,
          product_name: p?.name || it.product_id,
          category: p?.category,
        }
      })
      return { ...o, items: lineItems }
    })

    return NextResponse.json({ orders: result })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
