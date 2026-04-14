import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { listCustomerAccounts, saveCustomerAccounts, type CustomerAccountRecord } from '@/lib/customerAccountsStore'
import { DdSQL } from '@/lib/DdSQL'
import { readEnv } from '@/lib/env'

const ADMIN_SECRET = readEnv('ADMIN_SECRET') || 'change-me-admin-secret'
const DDSQL_DB = 'ecommerce'
const DDSQL_CUSTOMERS = 'customers'

function auth(req: NextRequest) {
  const headerSecret = req.headers.get('x-admin-secret')
  return headerSecret && headerSecret === ADMIN_SECRET
}

async function ensureSchema() {
  return
}

function hashPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex')
}

async function upsertDdsqlCustomer(row: Partial<CustomerRow> & { id: string }) {
  try {
    await DdSQL.insertRow(DDSQL_DB, DDSQL_CUSTOMERS, {
      id: row.id,
      name: row.name || '',
      email: row.email || '',
      phone: row.phone || '',
      address: row.address || '',
      city: row.city || '',
      country: row.country || '',
      created_at: row.created_at || '',
      status: row.status || 'active',
      deleted_at: row.deleted_at || '',
      updated_at: row.updated_at || ''
    })
  } catch { /* best effort */ }
}

type CustomerRow = CustomerAccountRecord

function sanitizeUser(user: CustomerRow) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    status: user.status || 'active',
    deletedAt: user.deleted_at || '',
    updatedAt: user.updated_at || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    country: user.country || ''
  }
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureSchema()
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').toLowerCase()
  const rows = await listCustomerAccounts()
  const users = rows
    .filter((user) => !q || user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q))
    .sort((left, right) => right.created_at.localeCompare(left.created_at))

  return NextResponse.json({ users: users.map(sanitizeUser) })
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  if (!body?.name || !body?.email || !body?.password) {
    return NextResponse.json({ error: 'name, email, and password are required' }, { status: 400 })
  }

  const name = String(body.name).trim()
  const email = String(body.email).trim().toLowerCase()
  const password = String(body.password)
  const phone = String(body.phone || '')
  const address = String(body.address || '')
  const city = String(body.city || '')
  const country = String(body.country || '')

  await ensureSchema()

  const salt = crypto.randomBytes(16).toString('hex')
  const passwordHash = hashPassword(password, salt)
  const id = `cust_${crypto.randomUUID()}`
  const now = new Date().toISOString()

  const accounts = await listCustomerAccounts()
  if (accounts.some((account) => account.email === email)) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
  }

  accounts.push({
    id,
    name,
    email,
    password_hash: passwordHash,
    salt,
    created_at: now,
    status: 'active',
    deleted_at: '',
    updated_at: now,
    updated_by: 'admin',
    phone,
    address,
    city,
    country
  })
  await saveCustomerAccounts(accounts)

  await upsertDdsqlCustomer({ id, name, email, phone, address, city, country, created_at: now, status: 'active', deleted_at: '', updated_at: now })

  const record: CustomerRow = { id, name, email, password_hash: passwordHash, salt, created_at: now, status: 'active', deleted_at: '', updated_at: now, updated_by: 'admin', phone, address, city, country }
  return NextResponse.json({ user: sanitizeUser(record) }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  if (!body?.id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  await ensureSchema()
  let user: CustomerRow | undefined
  let accounts: CustomerRow[] = []

  accounts = await listCustomerAccounts()
  user = accounts.find((entry) => entry.id === String(body.id))
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  user = { ...user }

  if (body.email) {
    const newEmail = String(body.email).trim().toLowerCase()
    if (accounts.some((entry) => entry.email === newEmail && entry.id !== user.id)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }
    user.email = newEmail
  }
  if (body.name) user.name = String(body.name).trim()
  if (body.phone !== undefined) user.phone = String(body.phone)
  if (body.address !== undefined) user.address = String(body.address)
  if (body.city !== undefined) user.city = String(body.city)
  if (body.country !== undefined) user.country = String(body.country)
  if (body.status) user.status = body.status === 'disabled' ? 'disabled' : 'active'
  const now = new Date().toISOString()
  if (user.status === 'disabled') user.deleted_at = user.deleted_at || now
  if (user.status === 'active') user.deleted_at = ''
  user.updated_at = now
  user.updated_by = 'admin'

  const nextAccounts = accounts.map((entry) => (entry.id === user.id ? user! : entry))
  await saveCustomerAccounts(nextAccounts)

  await upsertDdsqlCustomer({ id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, city: user.city, country: user.country, status: user.status, deleted_at: user.deleted_at || '', updated_at: user.updated_at, created_at: user.created_at })

  return NextResponse.json({ user: sanitizeUser(user) })
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  if (!body?.id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  await ensureSchema()
  let user: CustomerRow | undefined
  let accounts: CustomerRow[] = []
  accounts = await listCustomerAccounts()
  user = accounts.find((entry) => entry.id === String(body.id))
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const now = new Date().toISOString()

  const nextAccounts: CustomerRow[] = accounts.map((entry) =>
    entry.id === String(body.id)
      ? { ...entry, status: 'disabled' as const, deleted_at: now, updated_at: now, updated_by: 'admin' }
      : entry
  )
  await saveCustomerAccounts(nextAccounts)

  await upsertDdsqlCustomer({ id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, city: user.city, country: user.country, status: 'disabled', deleted_at: now, updated_at: now, created_at: user.created_at })

  return NextResponse.json({ success: true })
}
