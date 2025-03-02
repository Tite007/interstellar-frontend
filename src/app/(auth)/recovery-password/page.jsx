// src/app/(auth)/recovery-password/page.jsx
'use client'

import React, { useState } from 'react'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function RecoveryPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/recovery', {
        // Updated endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Failed to send recovery email')
        return
      }

      setSuccess('A recovery email has been sent. Please check your inbox.')
      setEmail('')
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Recovery error:', error)
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
        className="absolute max-w-md p-6 bg-white w-full border shadow-xl rounded-xl flex flex-col justify-between sm:text-base"
      >
        <h2 className="text-3xl text-center font-semibold mb-6">
          Recover Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email to receive a password reset link.
        </p>
        <div className="mb-6">
          <Input
            clearable
            label="Email"
            placeholder="Enter your email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            style={{ fontSize: '16px' }}
          />
        </div>
        {error && (
          <div className="flex items-center bg-red-100 p-2 rounded-lg mb-4">
            <AlertTriangle strokeWidth={1.5} className="text-red-500 mr-2" />
            <p className="text-red-500">{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-center bg-green-100 p-2 rounded-lg mb-4">
            <CheckCircle strokeWidth={1.5} className="text-green-500 mr-2" />
            <p className="text-green-500">{success}</p>
          </div>
        )}
        <div className="flex items-center justify-center mt-6">
          <Button
            type="submit"
            color="primary"
            auto
            loading={isLoading}
            disabled={isLoading || !email}
            className="w-1/2 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? 'Sending...' : 'Send Recovery Email'}
          </Button>
        </div>
        <div className="text-center mt-4">
          <Link
            href="/customer/login"
            className="text-blue-500 hover:underline text-sm"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  )
}
