import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  console.log('Middleware triggered:', req.nextUrl.pathname)
  console.log('NextAuth secret:', process.env.NEXTAUTH_SECRET)
  console.log('Request Cookies:', req.cookies)
  console.log('Request Headers:', req.headers)

  let token
  try {
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      encryption: true, // Ensure the token is encrypted correctly
    })
    console.log('Decoded token:', token)
  } catch (error) {
    console.error('Error decoding token:', error)
  }

  if (!token) {
    console.log('Token is null or invalid:', { token, cookies: req.cookies })
    const loginUrl = new URL('/customer/login', req.nextUrl.origin)
    return NextResponse.redirect(loginUrl)
  }

  const { pathname } = req.nextUrl

  // Check role for admin routes
  if (pathname.startsWith('/admin')) {
    if (token.role !== 'admin') {
      const notAuthorizedUrl = new URL('/not-authorized', req.nextUrl.origin)
      return NextResponse.redirect(notAuthorizedUrl)
    }
  }

  // Check role for customer profile routes
  if (pathname.startsWith('/customer-profile')) {
    if (token.role !== 'user') {
      const loginUrl = new URL('/customer/login', req.nextUrl.origin)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/customer-profile'],
}
