'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { AlertTriangle } from 'lucide-react'

export default function AdminLoginPage() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    const email = event.target.email.value
    const password = event.target.password.value

    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const errorMessage = await res.json()
        console.log('Login error:', errorMessage)
        setError(errorMessage.message || 'Login failed')
        return
      }

      const user = await res.json()
      console.log('User from admin-login API:', user)

      const result = await signIn('admin-login', {
        redirect: false, // Prevent automatic redirection
        email: user.email,
        password,
      })

      console.log('Sign in result:', result)

      if (result.error) {
        setError(result.error)
      } else {
        const sessionRes = await fetch('/api/auth/session')
        if (!sessionRes.ok) {
          const errorMessage = await sessionRes.json()
          throw new Error(
            `Login failed with status ${sessionRes.status}: ${errorMessage.message}`,
          )
        }

        const session = await sessionRes.json()
        console.log('Session:', session)
        if (session.user.role === 'admin') {
          window.location.href = '/admin/dashboard'
        } else {
          setError('You are not authorized to access this page.')
        }
      }
    } catch (error) {
      setError(
        error.message || 'An unexpected error occurred. Please try again.',
      )
      console.error('Sign-in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const backgroundStyle = {
    backgroundImage: `url('/LoginBackground.jpg')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',
  }

  return (
    <div
      style={backgroundStyle}
      className="min-h-screen flex items-center justify-center"
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-md p-6 bg-white w-full border shadow-xl rounded-xl flex flex-col justify-between"
      >
        <h2 className="text-3xl text-center font-semibold mb-6">Admin Login</h2>
        <div className="mb-4">
          <Input
            clearable
            label="Email"
            placeholder="Enter your email"
            name="email"
            type="email"
            required
            fullWidth
          />
        </div>
        <div className="mb-6">
          <Input
            clearable
            label="Password"
            placeholder="Type your password"
            name="password"
            type="password"
            required
            fullWidth
          />
        </div>
        {error && (
          <div className="flex items-center bg-red-100 p-2 rounded-lg mb-4">
            <AlertTriangle strokeWidth={1.5} className="text-red-500 mr-2" />
            <p className="text-red-500">{error}</p>
          </div>
        )}
        <div className="flex items-center justify-center mt-6">
          <Button
            type="submit"
            color="primary"
            auto
            loading={isLoading}
            disabled={isLoading}
            className="w-1/2 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </Button>
        </div>
      </form>
    </div>
  )
}
