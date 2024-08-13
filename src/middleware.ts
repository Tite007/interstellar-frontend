import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  console.log('Middleware triggered:', req.nextUrl.pathname)
  console.log('NextAuth secret:', process.env.NEXTAUTH_SECRET)
  console.log('Request Cookies:', req.cookies)
  console.log('Request Headers:', req.headers)

  let token
  try {
    // Cast to an appropriate type that excludes the salt requirement
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    } as any) // Casting to 'any' to bypass TypeScript error
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

  if (pathname.startsWith('/admin') && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/not-authorized', req.nextUrl.origin))
  }

  if (pathname.startsWith('/customer-profile') && token.role !== 'user') {
    return NextResponse.redirect(new URL('/customer/login', req.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/customer-profile'],
}
