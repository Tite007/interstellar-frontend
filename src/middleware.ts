import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let token

  try {
    // Check for secure cookie in production environment
    if (
      !req.cookies.get('next-auth.session-token') &&
      req.cookies.get('__Secure-next-auth.session-token')
    ) {
      req.cookies.set(
        'next-auth.session-token',
        req.cookies.get('__Secure-next-auth.session-token'),
      )
    }

    // Attempt to retrieve the token
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    console.log('Decoded token:', token)
  } catch (error) {
    console.error('Error decoding token:', error)
  }

  // Role-based access control logic
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      const notAuthorizedUrl = new URL('/not-authorized', req.nextUrl.origin)
      return NextResponse.redirect(notAuthorizedUrl)
    }
  }

  if (pathname.startsWith('/customer-profile')) {
    if (!token || token.role !== 'user') {
      const loginUrl = new URL('/customer/login', req.nextUrl.origin)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Define matcher configuration to target specific paths
export const config = {
  matcher: ['/admin/:path*', '/customer-profile'],
}
