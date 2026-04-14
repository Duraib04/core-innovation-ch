import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { DdSQL } from '@/lib/DdSQL'

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'root') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbName = 'ecommerce'

    // Recreate the sample database so repeated init calls stay deterministic.
    const deleted = await DdSQL.deleteDatabase(dbName)
    if (!deleted) {
      return NextResponse.json({
        error: 'Database is not configured for write operations.',
        details: 'Set DATABASE_URL in Vercel project settings and redeploy.'
      }, { status: 500 })
    }

    // Create database
    const dbCreated = await DdSQL.createDatabase(dbName)
    if (!dbCreated) {
      return NextResponse.json({
        error: 'Failed to prepare database namespace.',
      }, { status: 500 })
    }

    // Create tables with schemas
    const tables = {
      customers: {
        id: 'string',
        name: 'string',
        email: 'string',
        phone: 'string',
        address: 'string',
        city: 'string',
        country: 'string',
        created_at: 'string'
      },
      products: {
        id: 'string',
        name: 'string',
        description: 'string',
        price: 'number',
        category: 'string',
        stock: 'number',
        image_url: 'string',
        created_at: 'string'
      },
      orders: {
        id: 'string',
        customer_id: 'string',
        order_date: 'string',
        total_amount: 'number',
        status: 'string',
        shipping_address: 'string'
      },
      order_items: {
        id: 'string',
        order_id: 'string',
        product_id: 'string',
        quantity: 'number',
        unit_price: 'number',
        subtotal: 'number'
      },
      reviews: {
        id: 'string',
        product_id: 'string',
        customer_id: 'string',
        rating: 'number',
        title: 'string',
        review_text: 'string',
        created_at: 'string'
      },
      product_stock_history: {
        id: 'string',
        product_id: 'string',
        quantity_changed: 'number',
        reason: 'string',
        timestamp: 'string'
      }
    }

    // Create all tables
    for (const [tableName, schema] of Object.entries(tables)) {
      const created = await DdSQL.createTable(dbName, tableName, schema)
      if (!created) {
        return NextResponse.json({
          error: `Failed to create table: ${tableName}`,
        }, { status: 500 })
      }
    }

    // Insert sample data
    const now = new Date().toISOString()

    // Sample customers
    const customers = [
      {
        id: 'cust_001',
        name: 'Ahmed Hassan',
        email: 'ahmed@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'Cairo',
        country: 'Egypt',
        created_at: now
      },
      {
        id: 'cust_002',
        name: 'Fatima Ali',
        email: 'fatima@example.com',
        phone: '+1987654321',
        address: '456 Oak Ave',
        city: 'Alexandria',
        country: 'Egypt',
        created_at: now
      },
      {
        id: 'cust_003',
        name: 'Mohamed Ibrahim',
        email: 'mohamed@example.com',
        phone: '+1122334455',
        address: '789 Pine Rd',
        city: 'Giza',
        country: 'Egypt',
        created_at: now
      }
    ]

    {
      const results = await Promise.all(customers.map((c, i) => DdSQL.insertRow(dbName, 'customers', { ...c, id: `cust_${String(i + 1).padStart(3, '0')}` })))
      if (results.some((ok) => !ok)) {
        return NextResponse.json({ error: 'Failed to insert sample customers' }, { status: 500 })
      }
    }

    // Sample products
    const products = [
      {
        id: 'prod_001',
        name: 'Smart Door Lock RFID',
        description: 'IoT Smart Door Lock with RFID access control',
        price: 2500,
        category: 'Smart Home',
        stock: 45,
        image_url: '/products/door-lock.jpg',
        created_at: now
      },
      {
        id: 'prod_002',
        name: 'Smart Lift Guard',
        description: 'IoT device for elevator monitoring and safety',
        price: 3500,
        category: 'Smart Building',
        stock: 28,
        image_url: '/products/lift-guard.jpg',
        created_at: now
      },
      {
        id: 'prod_003',
        name: 'Smart Night Lamp',
        description: 'IoT Smart Lamp with motion detection and scheduling',
        price: 1200,
        category: 'Smart Lighting',
        stock: 120,
        image_url: '/products/night-lamp.jpg',
        created_at: now
      },
      {
        id: 'prod_004',
        name: 'Smart Water Planting Kit',
        description: 'IoT system for automatic plant watering',
        price: 1800,
        category: 'Smart Garden',
        stock: 56,
        image_url: '/products/water-kit.jpg',
        created_at: now
      },
      {
        id: 'prod_005',
        name: 'Gas Monitoring System',
        description: 'IoT Smart Home Gas leak detection',
        price: 2200,
        category: 'Smart Safety',
        stock: 34,
        image_url: '/products/gas-monitor.jpg',
        created_at: now
      },
      {
        id: 'prod_006',
        name: 'Chat Application License',
        description: 'Real-time chat website deployment package',
        price: 5000,
        category: 'Software',
        stock: 100,
        image_url: '/products/chat-app.jpg',
        created_at: now
      }
    ]

    {
      const results = await Promise.all(products.map((p, i) => DdSQL.insertRow(dbName, 'products', { ...p, id: `prod_${String(i + 1).padStart(3, '0')}` })))
      if (results.some((ok) => !ok)) {
        return NextResponse.json({ error: 'Failed to insert sample products' }, { status: 500 })
      }
    }

    // Sample orders
    const orders = [
      {
        id: 'order_001',
        customer_id: 'cust_001',
        order_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        total_amount: 5700,
        status: 'Delivered',
        shipping_address: '123 Main St, Cairo, Egypt'
      },
      {
        id: 'order_002',
        customer_id: 'cust_002',
        order_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        total_amount: 3500,
        status: 'Shipped',
        shipping_address: '456 Oak Ave, Alexandria, Egypt'
      },
      {
        id: 'order_003',
        customer_id: 'cust_003',
        order_date: new Date().toISOString(),
        total_amount: 7200,
        status: 'Processing',
        shipping_address: '789 Pine Rd, Giza, Egypt'
      }
    ]

    {
      const results = await Promise.all(orders.map((o, i) => DdSQL.insertRow(dbName, 'orders', { ...o, id: `order_${String(i + 1).padStart(3, '0')}` })))
      if (results.some((ok) => !ok)) {
        return NextResponse.json({ error: 'Failed to insert sample orders' }, { status: 500 })
      }
    }

    // Sample order items
    const orderItems = [
      {
        id: 'oi_001',
        order_id: 'order_001',
        product_id: 'prod_001',
        quantity: 2,
        unit_price: 2500,
        subtotal: 5000
      },
      {
        id: 'oi_002',
        order_id: 'order_001',
        product_id: 'prod_003',
        quantity: 1,
        unit_price: 1200,
        subtotal: 1200
      },
      {
        id: 'oi_003',
        order_id: 'order_002',
        product_id: 'prod_002',
        quantity: 1,
        unit_price: 3500,
        subtotal: 3500
      },
      {
        id: 'oi_004',
        order_id: 'order_003',
        product_id: 'prod_004',
        quantity: 2,
        unit_price: 1800,
        subtotal: 3600
      },
      {
        id: 'oi_005',
        order_id: 'order_003',
        product_id: 'prod_005',
        quantity: 2,
        unit_price: 2200,
        subtotal: 4400
      }
    ]

    {
      const results = await Promise.all(orderItems.map((oi, i) => DdSQL.insertRow(dbName, 'order_items', { ...oi, id: `oi_${String(i + 1).padStart(3, '0')}` })))
      if (results.some((ok) => !ok)) {
        return NextResponse.json({ error: 'Failed to insert sample order items' }, { status: 500 })
      }
    }

    // Sample reviews
    const reviews = [
      {
        id: 'rev_001',
        product_id: 'prod_001',
        customer_id: 'cust_001',
        rating: 5,
        title: 'Excellent Security!',
        review_text: 'The smart door lock works flawlessly. Highly recommended!',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'rev_002',
        product_id: 'prod_003',
        customer_id: 'cust_001',
        rating: 4,
        title: 'Great for saving energy',
        review_text: 'Smart lamp with motion detection is very convenient',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'rev_003',
        product_id: 'prod_002',
        customer_id: 'cust_002',
        rating: 5,
        title: 'Perfect for building safety',
        review_text: 'The lift guard system is reliable and easy to install',
        created_at: now
      },
      {
        id: 'rev_004',
        product_id: 'prod_004',
        customer_id: 'cust_003',
        rating: 4,
        title: 'Plants are thriving!',
        review_text: 'Automated watering system keeps my plants healthy',
        created_at: now
      }
    ]

    {
      const results = await Promise.all(reviews.map((r, i) => DdSQL.insertRow(dbName, 'reviews', { ...r, id: `rev_${String(i + 1).padStart(3, '0')}` })))
      if (results.some((ok) => !ok)) {
        return NextResponse.json({ error: 'Failed to insert sample reviews' }, { status: 500 })
      }
    }

    // Sample stock history
    const stockHistory = [
      {
        id: 'sh_001',
        product_id: 'prod_001',
        quantity_changed: -2,
        reason: 'Sold - Order #order_001',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sh_002',
        product_id: 'prod_003',
        quantity_changed: -1,
        reason: 'Sold - Order #order_001',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sh_003',
        product_id: 'prod_002',
        quantity_changed: -1,
        reason: 'Sold - Order #order_002',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sh_004',
        product_id: 'prod_001',
        quantity_changed: 50,
        reason: 'Stock replenishment',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    {
      const results = await Promise.all(stockHistory.map((sh, i) => DdSQL.insertRow(dbName, 'product_stock_history', { ...sh, id: `sh_${String(i + 1).padStart(3, '0')}` })))
      if (results.some((ok) => !ok)) {
        return NextResponse.json({ error: 'Failed to insert sample stock history' }, { status: 500 })
      }
    }

    console.log('[DdSQL Init] Sample ecommerce database created with all tables and data')
    return NextResponse.json({ 
      success: true, 
      message: 'Sample ecommerce database initialized',
      database: dbName,
      tables: Object.keys(tables),
      data: {
        customers: customers.length,
        products: products.length,
        orders: orders.length,
        order_items: orderItems.length,
        reviews: reviews.length,
        product_stock_history: stockHistory.length
      }
    })
  } catch (error) {
    console.error('[DdSQL Init] Error:', error)
    return NextResponse.json({ 
      error: 'Failed to initialize database',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
