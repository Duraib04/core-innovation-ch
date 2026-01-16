import { NextRequest, NextResponse } from 'next/server'
import { authenticate, setAuthCookie, clearAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, username, password } = body

    if (action === 'login') {
      const result = await authenticate(username, password)
      if (result.success) {
        await setAuthCookie(result.token!)
        return NextResponse.json({ success: true, message: 'Logged in successfully' })
      }
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    if (action === 'logout') {
      await clearAuthCookie()
      return NextResponse.json({ success: true, message: 'Logged out successfully' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
