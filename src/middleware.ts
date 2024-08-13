import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('Middleware triggered:', req.nextUrl.pathname)
  console.log('NextAuth secret:', process.env.NEXTAUTH_SECRET)

  // Log all cookies to debug the issue
  const cookies = req.cookies.getAll()
  console.log('Cookies received:', cookies)

  const sessionCookie =
    req.cookies.get('__Secure-authjs.session-token') ||
    req.cookies.get('authjs.session-token')
  console.log('Session Cookie:', sessionCookie)

  // Attempt to fetch the token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // salt: salt, // Use this only if required by your setup
  })

  console.log('Token fetched in middleware:', token)

  const { pathname } = req.nextUrl

  // Protect the admin routes
  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      console.log('Redirecting to not-authorized for admin route')
      const notAuthorizedUrl = new URL('/not-authorized', req.nextUrl.origin)
      return NextResponse.redirect(notAuthorizedUrl)
    }
  }

  // Protect the customer routes if needed
  if (pathname.startsWith('/customer-profile')) {
    if (!token || token.role !== 'user') {
      console.log('Redirecting to customer login')
      const loginUrl = new URL('/customer/login', req.nextUrl.origin)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/customer-profile'],
}
