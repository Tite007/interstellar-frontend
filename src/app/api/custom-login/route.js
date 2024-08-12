import { NextResponse } from 'next/server'

export async function POST(request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and/or password is missing.' },
      { status: 400 },
    )
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.log('Login failed:', errorData)
      return NextResponse.json(
        { message: errorData.message || 'Invalid credentials.' },
        { status: 401 },
      )
    }

    const data = await response.json()
    console.log('Login successful:', data)
    return NextResponse.json(
      {
        userId: data.userId,
        email: data.email,
        name: data.name,
        token: data.token,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 },
    )
  }
}
