// src/app/(auth)/customer-login/page.jsx (or wherever your UserLoginPage is)
'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@heroui/button'
import { Eye, EyeOff, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@heroui/input'

export default function UserLoginPage() {
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    const password = event.target.password.value

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/custom-login', {
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
      console.log('User from custom-login API:', user)

      const result = await signIn('user-login', {
        redirect: false,
        email: user.email,
        password,
      })

      console.log('Sign in result:', result)

      if (result.error) {
        setError(result.error)
      } else {
        window.location.href = '/customer-profile'
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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="text-base max-w-lg p-4 bg-white w-full shadow-md rounded-xl"
      >
        <h2 className="text-2xl text-center font-semibold mb-4">Log in</h2>
        <div className="mb-4">
          <Input
            size="sm"
            className="text-[17px]"
            label="Email"
            name="email"
            type="email"
            required
            style={{ fontSize: '16px' }}
          />
        </div>
        <div className="mb-4 relative">
          <Input
            name="password"
            className="text-[17px]"
            type={showPassword ? 'text' : 'password'}
            required
            label="Password"
            size="sm"
            style={{ fontSize: '16px' }}
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>
        <div className="mb-4 text-right">
          <Link
            href="/recovery-password"
            className="text-blue-500 hover:underline text-sm"
          >
            Forgot Password?
          </Link>
        </div>
        {error && (
          <div className="flex items-center bg-red-100 p-2 rounded-lg mb-4">
            <AlertTriangle strokeWidth={1.5} className="text-red-500 mr-2" />
            <p className="text-red-500">{error}</p>
          </div>
        )}
        <Button
          type="submit"
          color="primary"
          className="text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Log in'}
        </Button>
        <div className="text-center mt-4">
          <p>Don&lsquo;t have an account?</p>
          <Link href="/customer/sign-up">
            <Button
              color="default"
              className="mt-2 w-full text-black py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Go to Sign Up
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
