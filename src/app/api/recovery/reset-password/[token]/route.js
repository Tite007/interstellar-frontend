// src/app/api/recovery/reset-password/[token]/route.js
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  const { token } = params // Extract token from the dynamic route
  try {
    const body = await request.json()
    console.log('Frontend request body:', body, 'Token:', token)

    // Use NEXT_PUBLIC_API_BASE_URL from .env, fallback to localhost:3001 for local dev
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
    const res = await fetch(`${backendUrl}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    console.log('Backend response:', data, 'Status:', res.status)

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message },
        { status: res.status },
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    )
  }
}
