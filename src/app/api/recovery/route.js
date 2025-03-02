// src/app/api/recovery/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Frontend request body:', body)

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
    console.log('Fetching backend at:', backendUrl)

    const res = await fetch(`${backendUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const text = await res.text()
    console.log('Backend raw response:', text, 'Status:', res.status)
    const data = JSON.parse(text)

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message },
        { status: res.status },
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('API error details:', error.message, error.stack)
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 },
    )
  }
}
