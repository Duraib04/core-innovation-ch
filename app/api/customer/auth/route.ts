import { NextRequest, NextResponse } from 'next/server'
import {
  registerCustomer,
  loginCustomer,
  clearCustomerAuthCookie,
  setCustomerAuthCookie,
  getCustomerSession
} from '@/lib/customerAuth'

export async function GET() {
  try {
    const session = await getCustomerSession()
    if (!session) return NextResponse.json({ authenticated: false }, { status: 200 })
    return NextResponse.json({
      authenticated: true,
      user: { id: session.user, name: session.name, email: session.email }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { action } = body
    if (typeof action !== 'string') {
      return NextResponse.json({ error: 'action is required' }, { status: 400 })
    }

    switch (action) {
      case 'register': {
        const { name, email, password } = body
        const result = await registerCustomer(name, email, password)
        if (!result.success || !result.token) {
          return NextResponse.json({ error: result.message || 'Registration failed' }, { status: 400 })
        }
        await setCustomerAuthCookie(result.token)
        return NextResponse.json({ success: true, user: result.user })
      }

      case 'login': {
        const { email, password } = body
        const result = await loginCustomer(email, password)
        if (!result.success || !result.token) {
          return NextResponse.json({ error: result.message || 'Invalid credentials' }, { status: 401 })
        }
        await setCustomerAuthCookie(result.token)
        return NextResponse.json({ success: true, user: result.user })
      }

      case 'logout': {
        await clearCustomerAuthCookie()
        return NextResponse.json({ success: true })
      }

      case 'session': {
        const session = await getCustomerSession()
        if (!session) return NextResponse.json({ authenticated: false }, { status: 200 })
        return NextResponse.json({ authenticated: true, user: { id: session.user, name: session.name, email: session.email } })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
