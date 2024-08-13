import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function middleware(req) {
  console.log('Middleware triggered:', req.nextUrl.pathname)
  console.log('NextAuth secret:', process.env.NEXTAUTH_SECRET)

  // Use NextRequest for better compatibility and flexibility
  const request = req instanceof NextRequest ? req : new NextRequest(req)
  console.log('Request object:', request)

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  console.log('Token fetched in middleware:', token)
  const { pathname } = request.nextUrl

  // Protect the admin routes
  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      const notAuthorizedUrl = new URL(
        '/not-authorized',
        request.nextUrl.origin,
      )
      return NextResponse.redirect(notAuthorizedUrl)
    }
  }

  // Protect the customer routes if needed
  if (pathname.startsWith('/customer-profile')) {
    if (!token || token.role !== 'user') {
      const loginUrl = new URL('/customer/login', request.nextUrl.origin) // Customer login page
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Define the routes this middleware should apply to
export const config = {
  matcher: ['/admin/:path*', '/customer-profile'],
}
