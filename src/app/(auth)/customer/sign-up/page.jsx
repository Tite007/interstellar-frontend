// pages/SignUpPage.jsx

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // Import useRouter from next/navigation
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'
import { toast } from 'sonner'
import { Button } from '@nextui-org/button'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { months, days } from '@/src/components/customer/data' // Import the months and days data

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const SignUpPage = () => {
  const router = useRouter() // Initialize useRouter

  const [user, setUser] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    birthMonth: '',
    birthDay: '',
  })

  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    console.log('Updated user state:', user)
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleSelectChange = (name) => (selectedKeys) => {
    const value = Array.from(selectedKeys)[0]
    console.log(`Selected ${name}: ${value}`) // Log the selected value
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('User data on submit:', user) // Log the user data on submit

    const requiredFields = [
      'name',
      'lastName',
      'email',
      'password',
      'birthMonth',
      'birthDay',
    ]
    for (const field of requiredFields) {
      if (!user[field]) {
        toast(`Error: ${field} is required.`, {
          description: `Please fill in the ${field}.`,
        })
        return
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to submit user data: ${errorText}`)
      }

      const result = await response.json()
      toast('User signed up successfully!', {
        description: 'You have successfully signed up.',
        action: {
          label: 'Go to Login',
          onClick: () => {},
        },
      })

      router.push('/customer-profile') // Redirect to /customer-profile
    } catch (error) {
      toast('Failed to sign up. Please try again.', {
        description: error.toString(),
        action: {
          label: 'Retry',
          onClick: () => {},
        },
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="max-w-lg w-full space-y-8 p-10 bg-white rounded-lg shadow-md">
        <h1 className="text-lg font-semibold text-gray-700">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              size="sm"
              clearable
              bordered
              label="First Name"
              name="name"
              onChange={handleChange}
              style={{ fontSize: '16px' }}
            />
            <Input
              size="sm"
              clearable
              bordered
              label="Last Name"
              name="lastName"
              onChange={handleChange}
              style={{ fontSize: '16px' }} // Inline style to ensure 16px on all screen sizes
            />
          </div>
          <Input
            size="sm"
            clearable
            bordered
            label="Email"
            name="email"
            onChange={handleChange}
            style={{ fontSize: '16px' }} // Inline style to ensure 16px on all screen sizes
          />

          <div className="relative">
            <Input
              size="sm"
              clearable
              bordered
              label="Create Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              onChange={handleChange}
              style={{ fontSize: '16px' }} // Inline style to ensure 16px on all screen sizes
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          <h1 className="text-lg font-semibold text-gray-700">Birthday</h1>
          <p className="text-sm">
            Enter your birthday to receive a free gift every year.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              size="sm"
              clearable
              bordered
              label="Select Month"
              onSelectionChange={handleSelectChange('birthMonth')}
              selectedKeys={
                user.birthMonth ? new Set([user.birthMonth]) : new Set()
              }
            >
              {months.map((month) => (
                <SelectItem key={month.key} value={month.key}>
                  {month.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              size="sm"
              clearable
              bordered
              label="Select Day"
              onSelectionChange={handleSelectChange('birthDay')}
              selectedKeys={
                user.birthDay ? new Set([user.birthDay]) : new Set()
              }
            >
              {days.map((day) => (
                <SelectItem key={day.key} value={day.key}>
                  {day.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex justify-center">
            <Button className="w-full mt-2" color="primary" type="submit">
              Submit
            </Button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p>Already have an account?</p>
          <Link href="/customer/login">
            <Button color="default">Go to Login</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
