import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dd-shop-jwt-secret-key-change-in-production'

// Hardcoded root credentials (change in production to use environment variables)
const ROOT_USER = process.env.DDSQL_USER || 'root'
const ROOT_PASS = process.env.DDSQL_PASS || '12345'

export interface TokenPayload {
  user: string
  role: 'root' | 'user' | 'customer'
  email?: string
  name?: string
  iat: number
}

export function generateToken(user: string, role: 'root' | 'user' | 'customer' = 'user', extra: Partial<Pick<TokenPayload, 'email' | 'name'>> = {}): string {
  return jwt.sign({ user, role, ...extra }, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload
    return payload
  } catch {
    return null
  }
}

export async function authenticate(username: string, password: string) {
  // For now, only root user exists
  if (username === ROOT_USER && password === ROOT_PASS) {
    return { success: true, token: generateToken(username, 'root'), role: 'root' }
  }
  return { success: false, token: null, role: null }
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('dd_auth_token')?.value
    if (!token) return null
    return verifyToken(token)
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('dd_auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 // 24 hours
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('dd_auth_token')
}
