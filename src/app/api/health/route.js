/**
 * Health Check API Endpoint
 * Used to verify the server is running correctly
 */

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    status: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
  })
}
