import crypto from 'crypto'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { listCustomerAccounts, saveCustomerAccounts, type CustomerAccountRecord } from './customerAccountsStore'
import { DdSQL } from './DdSQL'
import { readEnv } from './env'

const JWT_SECRET = readEnv('JWT_SECRET') || 'dd-shop-jwt-secret-key-change-in-production'
const DDSQL_DB = 'ecommerce'
const DDSQL_CUSTOMERS = 'customers'

interface CustomerTokenPayload {
  user: string
  role: 'customer'
  email: string
  name: string
  iat: number
}

function hashPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex')
}

export async function registerCustomer(name: unknown, email: unknown, password: unknown) {
  const trimmedName = typeof name === 'string' ? name.trim() : ''
  const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
  const rawPassword = typeof password === 'string' ? password : ''

  if (!trimmedName || !trimmedEmail || !rawPassword) {
    return { success: false, message: 'Name, email, and password are required.' }
  }
  if (rawPassword.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters.' }
  }

  const salt = crypto.randomBytes(16).toString('hex')
  const passwordHash = hashPassword(rawPassword, salt)
  const id = `cust_${crypto.randomUUID()}`
  const now = new Date().toISOString()

  const accounts = await listCustomerAccounts()
  const existing = accounts.find((account) => account.email === trimmedEmail)
  if (existing) {
    return { success: false, message: 'Email already registered.' }
  }

  accounts.push({
    id,
    name: trimmedName,
    email: trimmedEmail,
    password_hash: passwordHash,
    salt,
    created_at: now,
    status: 'active',
    deleted_at: '',
    updated_at: '',
    updated_by: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  })
  await saveCustomerAccounts(accounts)

  // Sync into DdSQL ecommerce.customers table (best-effort)
  try {
    const existingInDdSQL = (await DdSQL.queryTable(DDSQL_DB, DDSQL_CUSTOMERS, { email: trimmedEmail }))[0]
    if (!existingInDdSQL) {
      await DdSQL.insertRow(DDSQL_DB, DDSQL_CUSTOMERS, {
        id,
        name: trimmedName,
        email: trimmedEmail,
        phone: '',
        address: '',
        city: '',
        country: '',
        created_at: now,
        status: 'active',
        deleted_at: '',
        updated_at: now
      })
    }
  } catch { /* best effort */ }

  const token = jwt.sign(
    { user: id, role: 'customer', email: trimmedEmail, name: trimmedName },
    JWT_SECRET,
    { expiresIn: '24h' }
  ) as string

  return { success: true, token, role: 'customer', user: { id, name: trimmedName, email: trimmedEmail } }
}

export async function loginCustomer(email: unknown, password: unknown) {
  const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
  const rawPassword = typeof password === 'string' ? password : ''

  if (!trimmedEmail || !rawPassword) {
    return { success: false, message: 'Email and password are required.' }
  }

  let user: CustomerAccountRecord | undefined

  const accounts = await listCustomerAccounts()
  user = accounts.find((account) => account.email === trimmedEmail)

  if (!user) {
    return { success: false, message: 'Invalid email or password.' }
  }

  if (user.status === 'disabled' || user.deleted_at) {
    return { success: false, message: 'Account is disabled. Please contact support.' }
  }

  const passwordHash = hashPassword(rawPassword, user.salt)
  if (passwordHash !== user.password_hash) {
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
