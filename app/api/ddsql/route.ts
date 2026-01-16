import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { DdSQL } from '@/lib/DdSQL'

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'root') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const action = url.searchParams.get('action')
    const db = url.searchParams.get('db')
    const table = url.searchParams.get('table')

    console.log('[DdSQL API] GET request:', { action, db, table })

    switch (action) {
      case 'listDatabases': {
        const databases = DdSQL.listDatabases()
        console.log('[DdSQL API] listDatabases result:', databases)
        // Convert string array to objects with name property
        return NextResponse.json({ databases: databases.map(db => ({ name: db })) })
      }

      case 'listTables':
        if (!db) return NextResponse.json({ error: 'Database required' }, { status: 400 })
        const tables = DdSQL.listTables(db)
        // Convert string array to objects with name property
        return NextResponse.json({ tables: tables.map(t => ({ name: t })) })

      case 'getTableData':
        if (!db || !table) return NextResponse.json({ error: 'Database and table required' }, { status: 400 })
        const rows = DdSQL.getTableData(db, table)
        return NextResponse.json({ data: rows })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[DdSQL API] GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'root') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, db, table, schema, data, filter } = body

    console.log('[DdSQL API] POST request:', { action, db, table })

    switch (action) {
      case 'createDatabase': {
        if (!db) return NextResponse.json({ error: 'Database name required' }, { status: 400 })
        const created = DdSQL.createDatabase(db)
        console.log('[DdSQL API] createDatabase result:', { db, created })
        return NextResponse.json({ success: created })
      }

      case 'deleteDatabase':
        if (!db) return NextResponse.json({ error: 'Database name required' }, { status: 400 })
        const deleted = DdSQL.deleteDatabase(db)
        return NextResponse.json({ success: deleted })

      case 'createTable':
        if (!db || !table || !schema) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        const tableCreated = DdSQL.createTable(db, table, schema)
        return NextResponse.json({ success: tableCreated })

      case 'deleteTable':
        if (!db || !table) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        const tableDeleted = DdSQL.deleteTable(db, table)
        return NextResponse.json({ success: tableDeleted })

      case 'insertRow':
        if (!db || !table || !data) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        const inserted = DdSQL.insertRow(db, table, data)
        return NextResponse.json({ success: inserted })

      case 'deleteRow':
        if (!db || !table || !data?.id) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        const rowDeleted = DdSQL.deleteRow(db, table, data.id)
        return NextResponse.json({ success: rowDeleted })

      case 'query':
        if (!db || !table) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        const results = DdSQL.queryTable(db, table, filter)
        return NextResponse.json({ data: results })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[DdSQL API] POST error:', error)
    return NextResponse.json({ error: 'Server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
