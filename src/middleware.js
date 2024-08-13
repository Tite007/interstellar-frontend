import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  // Log the incoming request URL and headers to debug issues with token retrieval
  console.log('Incoming Request URL:', req.url)
  console.log('Request Headers:', JSON.stringify(req.headers))

  // Fetch the token using the NEXTAUTH_SECRET
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl
  const nextAuthUrl = process.env.NEXTAUTH_URL

  console.log('Token fetched in middleware:', token)
  console.log('Request path:', pathname)
  console.log('NextAuth URL:', nextAuthUrl)

  if (!token) {
    console.error('Token is invalid or missing.')
    // Optionally redirect to a login or error page
    const loginUrl = new URL('/login', req.nextUrl.origin)
    return NextResponse.redirect(loginUrl)
  } else {
    console.log('Token role:', token.role)
  }

  // Protect the admin routes
  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      const notAuthorizedUrl = new URL('/not-authorized', req.nextUrl.origin)
      console.log('Redirecting to not authorized:', notAuthorizedUrl.href)
      return NextResponse.redirect(notAuthorizedUrl)
    }
  }

  // Protect the customer routes if needed
  if (pathname.startsWith('/customer-profile')) {
    if (!token || token.role !== 'user') {
      const loginUrl = new URL('/customer/login', req.nextUrl.origin)
      console.log('Redirecting to login:', loginUrl.href)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Continue to the requested page if the token is valid
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/customer-profile'],
}
