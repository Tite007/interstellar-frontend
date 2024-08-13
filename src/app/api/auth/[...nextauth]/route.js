import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: 'user-login',
      name: 'User Account',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        console.log('Starting user authorization process...')
        console.log('Credentials received:', credentials)

        try {
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          console.log('Response from login API:', res.status)

          const user = await res.json()
          console.log('User data received:', user)

          if (user.token) {
            return {
              id: user.userId,
              email: credentials.email,
              token: user.token,
              name: user.name,
              lastName: user.lastName,
              role: user.role,
            }
          } else {
            return null
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return { error: 'Authorization error' }
        }
      },
    }),
    CredentialsProvider({
      id: 'admin-login',
      name: 'Admin Account',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        console.log('Starting admin authorization process...')
        console.log('Credentials received:', credentials)

        try {
          const res = await fetch(`${apiUrl}/auth/admin-login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          console.log('Response from admin-login API:', res.status)

          if (!res.ok) {
            const errorMessage = await res.json()
            console.error(
              `Login failed with status ${res.status}: ${errorMessage.message}`,
            )
            return { error: 'Invalid credentials' }
          }

          const admin = await res.json()
          console.log('Admin data received:', admin)

          if (admin.token && admin.role === 'admin') {
            return {
              id: admin.userId,
              email: credentials.email,
              token: admin.token,
              name: admin.name,
              lastName: admin.lastName,
              role: admin.role,
            }
          } else {
            console.error('Unauthorized access attempt:', credentials.email)
            return null
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return { error: 'Authorization error' }
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        lastName: token.lastName,
        role: token.role,
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.lastName = user.lastName
        token.role = user.role
      }
      return token
    },

    authorized: async ({ auth }) => {
      return !!auth
    },
  },
})
