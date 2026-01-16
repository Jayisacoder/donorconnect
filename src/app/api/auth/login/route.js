// Authentication API - User Login
import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'
import { createSession } from '@/lib/session'

export async function POST(request) {
  try {
    const body = await request.json()
    const email = body?.email?.trim()
    const password = body?.password

    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ error: 'password is required' }, { status: 400 })
    }

    const user = await login(email, password)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const sessionToken = await createSession(user.id)

    const response = NextResponse.json({ user: { ...user, password: undefined } })
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}