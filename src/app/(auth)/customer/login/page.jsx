'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@nextui-org/button'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@nextui-org/input'
import { AlertTriangle } from 'lucide-react'

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
      console.log('User from custom-login API:', user) // Log user object

      const result = await signIn('user-login', {
        redirect: false, // Prevent automatic redirection
        email: user.email, // Ensure email is correctly passed
        password, // Pass the password as well
      })

      console.log('Sign in result:', result)

      if (result.error) {
        setError(result.error)
      } else {
        // Manually handle redirection
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
        className="max-w-lg p-4 bg-white w-full shadow-md rounded-md"
      >
        <h2 className="text-2xl text-center font-semibold mb-4">Log in</h2>
        <div className="mb-4">
          <Input
            size="sm"
            className="text-base md:text-lg"
            label="Email"
            name="email"
            type="email"
            required
          />
        </div>
        <div className="mb-4 relative">
          <Input
            name="password"
            className="text-base md:text-lg"
            type={showPassword ? 'text' : 'password'}
            required
            label="Password"
            size="sm"
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
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
          <p>Don&apos;t have an account?</p>
          <Link href="/user/sign-up">
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
