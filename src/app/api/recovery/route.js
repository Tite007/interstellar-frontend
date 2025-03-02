// src/app/api/recovery/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Frontend request body:', body) // Log incoming request

    // Adjust this URL based on where your backend is running
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
    const res = await fetch(`${backendUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    console.log('Backend response:', data, 'Status:', res.status) // Log backend response

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
