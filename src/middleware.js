import { NextResponse } from 'next/server'
import { auth } from './app/api/auth/[...nextauth]/route'

export default auth((req) =>{
const { pathname } = req.nextUrl
const authentication = req.auth.user?.role;

  // Protect the admin routes
  if (pathname.startsWith('/admin')) {
    if (!req.auth || authentication !== 'admin') {
      const notAuthorizedUrl = new URL('/not-authorized', req.nextUrl.origin)
      return NextResponse.redirect(notAuthorizedUrl)
    }
  }

  // Protect the customer routes if needed
  if (pathname.startsWith('/customer-profile')) {
    if (!req.auth || authentication !== 'user') {
      const loginUrl = new URL('/customer/login', req.nextUrl.origin) // Customer login page
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()

})  

export const config = {
  matcher: ['/admin/:path*', '/customer-profile'],
}
