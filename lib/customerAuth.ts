import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { DdSQL } from './DdSQL'

const JWT_SECRET = process.env.JWT_SECRET || 'dd-shop-jwt-secret-key-change-in-production'
const CUSTOMER_DATA_DIR = path.join(process.cwd(), 'data', 'customers')
const CUSTOMER_FILE = path.join(CUSTOMER_DATA_DIR, 'accounts.json')
const DDSQL_DB = 'ecommerce'
const DDSQL_CUSTOMERS = 'customers'

interface CustomerRecord {
  id: string
  name: string
  email: string
  passwordHash: string
  salt: string
  createdAt: string
}

interface CustomerTokenPayload {
  user: string
  role: 'customer'
  email: string
  name: string
  iat: number
}

function ensureStore() {
  if (!fs.existsSync(CUSTOMER_DATA_DIR)) {
    fs.mkdirSync(CUSTOMER_DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(CUSTOMER_FILE)) {
    fs.writeFileSync(CUSTOMER_FILE, JSON.stringify({ users: [] }, null, 2), 'utf8')
  }
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

function ensureDdsqlCustomerTable() {
  // Best-effort table creation for syncing web customers into DdSQL
  DdSQL.createDatabase(DDSQL_DB)
  DdSQL.createTable(DDSQL_DB, DDSQL_CUSTOMERS, {
    id: 'string',
    name: 'string',
    email: 'string',
    phone: 'string',
    address: 'string',
    city: 'string',
    country: 'string',
    created_at: 'string'
  })
}

function hashPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex')
}

export async function registerCustomer(name: string, email: string, password: string) {
  const trimmedEmail = email.trim().toLowerCase()
  const trimmedName = name.trim()
  if (!trimmedName || !trimmedEmail || !password) {
    return { success: false, message: 'Name, email, and password are required.' }
  }
  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters.' }
  }

  const users = loadUsers()
  const existing = users.find((u) => u.email === trimmedEmail)
  if (existing) {
    return { success: false, message: 'Email already registered.' }
  }

  const salt = crypto.randomBytes(16).toString('hex')
  const passwordHash = hashPassword(password, salt)
  const id = `cust_${crypto.randomUUID()}`
  const record: CustomerRecord = {
    id,
    name: trimmedName,
    email: trimmedEmail,
    passwordHash,
    salt,
    createdAt: new Date().toISOString()
  }
  users.push(record)
  saveUsers(users)

   // Sync into DdSQL ecommerce.customers table (if not already there)
  try {
    ensureDdsqlCustomerTable()
    const existing = (DdSQL.queryTable(DDSQL_DB, DDSQL_CUSTOMERS, { email: trimmedEmail }) as any[])[0]
    if (!existing) {
      DdSQL.insertRow(DDSQL_DB, DDSQL_CUSTOMERS, {
        id,
        name: trimmedName,
        email: trimmedEmail,
        phone: '',
        address: '',
        city: '',
        country: '',
        created_at: record.createdAt
      })
    }
  } catch {
    // best effort; ignore sync failures
  }

  const token = jwt.sign(
    { user: record.id, role: 'customer', email: record.email, name: record.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  ) as string

  return { success: true, token, role: 'customer', user: { id: record.id, name: record.name, email: record.email } }
}

export async function loginCustomer(email: string, password: string) {
  const trimmedEmail = email.trim().toLowerCase()
  const users = loadUsers()
  const user = users.find((u) => u.email === trimmedEmail)
  if (!user) {
    return { success: false, message: 'Invalid email or password.' }
  }

  const passwordHash = hashPassword(password, user.salt)
  if (passwordHash !== user.passwordHash) {
    return { success: false, message: 'Invalid email or password.' }
  }

  const token = jwt.sign(
    { user: user.id, role: 'customer', email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  ) as string

  return { success: true, token, role: 'customer', user: { id: user.id, name: user.name, email: user.email } }
}

export async function getCustomerSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('dd_customer_token')?.value
    if (!token) return null
    const payload = jwt.verify(token, JWT_SECRET) as CustomerTokenPayload
    if (payload.role !== 'customer') return null
    return payload
  } catch {
    return null
  }
}

export async function setCustomerAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('dd_customer_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60
  })
}

export async function clearCustomerAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('dd_customer_token')
}
