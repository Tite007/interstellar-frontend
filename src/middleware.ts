import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let token

  try {
    // Attempt to fetch and decode the token using cookies
    const tokenFromCookie = req.cookies.get('authToken')

    if (tokenFromCookie) {
      // If token exists in cookies, use it
      token = JSON.parse(tokenFromCookie)
      console.log('Token retrieved from cookie:', token)
    } else {
      // Otherwise, use next-auth's getToken function to fetch and decode the token
      token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      })

      if (token) {
        // Store the token in cookies for future requests
        const response = NextResponse.next()
        response.cookies.set('authToken', JSON.stringify(token), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        })

        console.log('Decoded token stored in cookie:', token)
        return response
      }
    }
  } catch (error) {
    console.error('Error decoding or storing token:', error)
  }

  // Add your role-based access control logic here
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
