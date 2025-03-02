// src/app/(auth)/reset-password/ResetPasswordClient.jsx
'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [newPassword, setNewPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new link.')
    }
  }, [token])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!newPassword) {
      setError('Please enter a new password.')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/recovery/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Failed to reset password')
        return
      }

      setSuccess('Password reset successfully. You can now log in.')
      setNewPassword('')
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Reset password error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute max-w-md p-6 bg-white w-full border shadow-xl rounded-xl flex flex-col justify-between sm:text-base"
    >
      <h2 className="text-3xl text-center font-semibold mb-6">
        Reset Password
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your new password below.
      </p>
      <div className="mb-6">
        <Input
          clearable
          label="New Password"
          placeholder="Enter your new password"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
          disabled={isLoading || !newPassword || !token}
          className="w-1/2 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </div>
      {success && (
        <div className="text-center mt-4">
          <Link
            href="/customer/login"
            className="text-blue-500 hover:underline text-sm"
          >
            Back to Login
          </Link>
        </div>
      )}
    </form>
  )
}
