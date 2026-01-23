// Debug endpoint to test login flow - REMOVE IN PRODUCTION
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/password'
import { createSession } from '@/lib/session'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email') || 'admin@hopefoundation.org'
  const password = searchParams.get('password') || 'password123'
  const testSession = searchParams.get('session') === 'true'
  
  return handleDebug(email, password, testSession)
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body
    return handleDebug(email, password, false)
  } catch (error) {
    return NextResponse.json({ error: error.message })
  }
}

async function handleDebug(email, password, testSession) {
  try {
    const result = {
      step: 'start',
      emailProvided: !!email,
      passwordProvided: !!password,
      userFound: false,
      passwordValid: false,
      sessionCreated: false,
      error: null,
    }

    // Step 1: Find user
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: { id: true, email: true, password: true, firstName: true }
    })
    
    result.step = 'user_lookup'
    result.userFound = !!user

    if (!user) {
      return NextResponse.json(result)
    }

    // Step 2: Verify password
    const isValid = await verifyPassword(password, user.password)
    result.step = 'password_check'
    result.passwordValid = isValid
    result.userEmail = user.email
    result.userName = user.firstName

    // Step 3: Test session creation if requested
    if (testSession && isValid) {
      const sessionToken = await createSession(user.id)
      result.sessionCreated = !!sessionToken
      result.sessionTokenLength = sessionToken?.length
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message, stack: error.stack })
  }
}
