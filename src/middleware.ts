import { NextResponse } from 'next/server'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'

export async function middleware(req) {
  const { pathname } = req.nextUrl

  // Parse the cookies
  const cookies = parse(req.headers.get('cookie') || '')
  const sessionToken = cookies['next-auth.session-token']

  let token
  if (sessionToken) {
    try {
      token = jwt.verify(sessionToken, process.env.NEXTAUTH_SECRET)
    } catch (error) {
      console.error('Error verifying token:', error)
    }
  }

  console.log('Token fetched in middleware:', token)

  // Protect the admin routes
  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      const notAuthorizedUrl = new URL('/not-authorized', req.nextUrl.origin)
      return NextResponse.redirect(notAuthorizedUrl)
    }
  }

  // Protect the customer routes if needed
  if (pathname.startsWith('/customer-profile')) {
    if (!token || token.role !== 'user') {
      const loginUrl = new URL('/customer/login', req.nextUrl.origin) // Customer login page
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/customer-profile'],
}
