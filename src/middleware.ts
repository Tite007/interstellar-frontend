import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  console.log('Middleware triggered:', req.nextUrl.pathname)
  console.log('NextAuth secret:', process.env.NEXTAUTH_SECRET)

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    salt: process.env.NEXTAUTH_SALT, // Add the salt here
  })

  if (!token) {
    console.log('Token is null, redirecting to login')
    const loginUrl = new URL('/customer/login', req.nextUrl.origin)
    return NextResponse.redirect(loginUrl)
  }

  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    if (token.role !== 'admin') {
      const notAuthorizedUrl = new URL('/not-authorized', req.nextUrl.origin)
      return NextResponse.redirect(notAuthorizedUrl)
    }
  }

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
