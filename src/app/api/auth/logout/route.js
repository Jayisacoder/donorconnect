// Authentication API - User Logout
import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/session'

export async function POST(request) {
  try {
    const sessionToken = request.cookies.get('session')?.value

    if (sessionToken) {
      await deleteSession(sessionToken)
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('session', '', { maxAge: 0, path: '/' })
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}