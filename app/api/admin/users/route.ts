import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { DdSQL } from '@/lib/DdSQL'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'change-me-admin-secret'
const DDSQL_DB = 'ecommerce'
const DDSQL_CUSTOMERS = 'customers'
const CUSTOMER_DATA_DIR = path.join(process.cwd(), 'data', 'customers')
const CUSTOMER_FILE = path.join(CUSTOMER_DATA_DIR, 'accounts.json')
const ENCRYPTION_KEY = process.env.DDSQL_KEY || 'dd-shop-default-secure-key-change-in-production-12345'

interface CustomerRecord {
  id: string
  name: string
  email: string
  passwordHash: string
  salt: string
  createdAt: string
  status?: 'active' | 'disabled'
  deletedAt?: string
  updatedAt?: string
  updatedBy?: string
  phone?: string
  address?: string
  city?: string
  country?: string
}

function auth(req: NextRequest) {
  const headerSecret = req.headers.get('x-admin-secret')
  return headerSecret && headerSecret === ADMIN_SECRET
}

function ensureStore() {
  if (!fs.existsSync(CUSTOMER_DATA_DIR)) fs.mkdirSync(CUSTOMER_DATA_DIR, { recursive: true })
  if (!fs.existsSync(CUSTOMER_FILE)) fs.writeFileSync(CUSTOMER_FILE, JSON.stringify({ users: [] }, null, 2), 'utf8')
}

function loadUsers(): CustomerRecord[] {
  try {
    ensureStore()
    const raw = fs.readFileSync(CUSTOMER_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return parsed.users || []
  } catch {
    return []
  }
}

function saveUsers(users: CustomerRecord[]) {
  ensureStore()
  fs.writeFileSync(CUSTOMER_FILE, JSON.stringify({ users }, null, 2), 'utf8')
}

function hashPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex')
}

// Minimal encrypt/decrypt to update DdSQL tables directly
function encrypt(text: string) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32), iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return { iv: iv.toString('hex'), encryptedData: encrypted }
}

function decrypt(data: { iv: string; encryptedData: string }) {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32),
    Buffer.from(data.iv, 'hex')
  )
  let decrypted = decipher.update(data.encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

function upsertDdsqlCustomer(row: Partial<CustomerRecord> & { id: string }) {
  try {
    DdSQL.createDatabase(DDSQL_DB)
    DdSQL.createTable(DDSQL_DB, DDSQL_CUSTOMERS, {
      id: 'string',
      name: 'string',
      email: 'string',
      phone: 'string',
      address: 'string',
      city: 'string',
      country: 'string',
      created_at: 'string',
      status: 'string',
      deleted_at: 'string',
      updated_at: 'string'
    })

    const tableFile = path.join(process.cwd(), 'data', 'DdSQL', DDSQL_DB, `${DDSQL_CUSTOMERS}.table`)
    const encryptedContent = JSON.parse(fs.readFileSync(tableFile, 'utf8'))
    const tableData = JSON.parse(decrypt(encryptedContent))

    const rows = tableData.rows || []
    const idx = rows.findIndex((r: any) => String(r.id) === String(row.id))
    const now = new Date().toISOString()
    const merged = {
      ...(idx >= 0 ? rows[idx] : {}),
      ...row,
      updated_at: row.updatedAt || now,
      deleted_at: row.deletedAt || rows[idx]?.deleted_at || ''
    }
    if (idx >= 0) rows[idx] = merged
    else rows.push(merged)

    tableData.rows = rows
    const newEncrypted = encrypt(JSON.stringify(tableData))
    fs.writeFileSync(tableFile, JSON.stringify(newEncrypted))
    return true
  } catch {
    return false
  }
}

function sanitizeUser(user: CustomerRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    status: user.status || 'active',
    deletedAt: user.deletedAt || '',
    updatedAt: user.updatedAt || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    country: user.country || ''
  }
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').toLowerCase()
  const users = loadUsers()
  const filtered = q
    ? users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    : users
  return NextResponse.json({ users: filtered.map(sanitizeUser) })
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

  const users = loadUsers()
  if (users.some((u) => u.email === email)) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
  }

  const salt = crypto.randomBytes(16).toString('hex')
  const passwordHash = hashPassword(password, salt)
  const id = `cust_${crypto.randomUUID()}`
  const now = new Date().toISOString()

  const record: CustomerRecord = {
    id,
    name,
    email,
    passwordHash,
    salt,
    createdAt: now,
    status: 'active',
    deletedAt: '',
    updatedAt: now,
    updatedBy: 'admin',
    phone,
    address,
    city,
    country
  }

  users.push(record)
  saveUsers(users)
  upsertDdsqlCustomer({
    id,
    name,
    email,
    phone,
    address,
    city,
    country,
    createdAt: now,
    status: record.status,
    deletedAt: '',
    updatedAt: now
  })

  return NextResponse.json({ user: sanitizeUser(record) }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  if (!body?.id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const users = loadUsers()
  const idx = users.findIndex((u) => u.id === body.id)
  if (idx < 0) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const user = users[idx]
  if (body.email) {
    const email = String(body.email).trim().toLowerCase()
    if (users.some((u) => u.email === email && u.id !== user.id)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }
    user.email = email
  }
  if (body.name) user.name = String(body.name).trim()
  if (body.phone !== undefined) user.phone = String(body.phone)
  if (body.address !== undefined) user.address = String(body.address)
  if (body.city !== undefined) user.city = String(body.city)
  if (body.country !== undefined) user.country = String(body.country)
  if (body.status) user.status = body.status === 'disabled' ? 'disabled' : 'active'
  const now = new Date().toISOString()
  if (user.status === 'disabled') user.deletedAt = user.deletedAt || now
  if (user.status === 'active') user.deletedAt = ''
  user.updatedAt = now
  user.updatedBy = 'admin'

  users[idx] = user
  saveUsers(users)

  upsertDdsqlCustomer({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    city: user.city,
    country: user.country,
    status: user.status,
    deletedAt: user.deletedAt || '',
    updatedAt: user.updatedAt || now,
    createdAt: user.createdAt
  })

  return NextResponse.json({ user: sanitizeUser(user) })
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  if (!body?.id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const users = loadUsers()
  const idx = users.findIndex((u) => u.id === body.id)
  if (idx < 0) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  const now = new Date().toISOString()
  users[idx].status = 'disabled'
  users[idx].deletedAt = now
  users[idx].updatedAt = now
  users[idx].updatedBy = 'admin'
  saveUsers(users)

  upsertDdsqlCustomer({
    id: users[idx].id,
    name: users[idx].name,
    email: users[idx].email,
    phone: users[idx].phone,
    address: users[idx].address,
    city: users[idx].city,
    country: users[idx].country,
    status: 'disabled',
    deletedAt: now,
    updatedAt: now,
    createdAt: users[idx].createdAt
  })

  return NextResponse.json({ success: true })
}
