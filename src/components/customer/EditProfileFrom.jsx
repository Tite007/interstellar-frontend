'use client'
import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Checkbox } from '@nextui-org/checkbox'
import { toast } from 'sonner'
import { Mail, Smartphone } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CustomerProfilePage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState({
    name: '',
    lastName: '',
    email: '',
    street: '',
    number: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
    phone: '',
    emailSubscribed: false,
    smsSubscribed: false,
    role: 'user', // Default role
    password: '', // Added to handle password
  })

  const [initialPassword, setInitialPassword] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        try {
          const userResponse = await fetch(
            `${API_BASE_URL}/auth/findUser/${session.user.id}`,
          )
          if (!userResponse.ok) {
            throw new Error('Network response was not ok')
          }
          const userData = await userResponse.json()
          setUser({
            ...userData,
            name: userData.name || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            street: userData.street || '',
            number: userData.number || '',
            city: userData.city || '',
            province: userData.province || '',
            postalCode: userData.postalCode || '',
            country: userData.country || '',
            phone: userData.phone || '',
            emailSubscribed: userData.emailSubscribed || false,
            smsSubscribed: userData.smsSubscribed || false,
            role: userData.role || 'user',
            password: '', // Initialize password as an empty string
          })

          setInitialPassword('') // Set the initial password to empty
        } catch (error) {
          console.error('Failed to fetch data:', error)
        }
      }
    }

    fetchData()
  }, [session])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handlePhoneChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value)
    setUser({ ...user, phone: formattedPhoneNumber })
  }

  const handleCheckboxChange = (name, isChecked) => {
    setUser({ ...user, [name]: isChecked })
  }

  const formatPhoneNumber = (value) => {
    if (!value) return value
    const phoneNumber = value.replace(/[^\d]/g, '')
    const phoneNumberLength = phoneNumber.length

    if (phoneNumberLength < 4) return phoneNumber
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6,
    )}-${phoneNumber.slice(6, 10)}`
  }

  const calculateDurationInDays = (time) => {
    const startDate = new Date(time)
    const currentDate = new Date()
    const differenceInTime = currentDate.getTime() - startDate.getTime()
    const days = Math.floor(differenceInTime / (1000 * 3600 * 24))
    return `${days} days`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const requiredFields = ['name', 'email']
    for (const field of requiredFields) {
      if (!user[field]) {
        console.error(`${field} is required.`)
        toast(`Error: ${field} is required.`, {
          description: `Please fill in the ${field}.`,
        })
        return
      }
    }

    const userData = { ...user }

    // Remove password from the user object if it hasn't been changed
    if (userData.password === initialPassword) {
      delete userData.password
    }

    try {
      const url = `${API_BASE_URL}/auth/updateUser/${session.user.id}`
      const method = 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to submit user data: ${errorText}`)
      }

      const result = await response.json()
      console.log('User updated successfully:', result)

      toast('User updated successfully!', {
        description: 'Your profile has been successfully updated.',
      })
    } catch (error) {
      console.error('Error submitting form:', error)

      toast('Failed to update profile. Please try again.', {
        description: error.toString(),
      })
    }
  }

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'unauthenticated' || session?.user.role !== 'user') {
    return <p>Access Denied</p>
  }

  return (
    <div className="mb-10">
      <div>
        <h1 className="mt-2 font-semibold mb-2 text-2xl">
          {user.name} {user.lastName}
        </h1>
        <p className="mt-1 font-light text-sm mb-5">
          {user.city}, {user.province}, {user.country} 🔹 Customer for:{' '}
          {calculateDurationInDays(user.time)}
        </p>
      </div>
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 border bg-white pr-4 pl-4 rounded-2xl pt-10 pb-10 md:grid-cols-2 gap-6">
              <Input
                isClearable={true}
                value={user.name}
                bordered
                label="First Name"
                name="name"
                onChange={handleChange}
                onClear={() => console.log('input cleared')}
              />
              <Input
                isClearable={true}
                value={user.lastName}
                bordered
                label="Last Name"
                name="lastName"
                onChange={handleChange}
              />
              <Input
                isClearable={true}
                type="email"
                value={user.email}
                bordered
                label="Email"
                name="email"
                onChange={handleChange}
                startContent={
                  <Mail
                    size={20}
                    strokeWidth={1.5}
                    className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
                  />
                }
              />
              <Input
                isClearable={true}
                value={user.phone}
                bordered
                label="Phone"
                name="phone"
                onChange={handlePhoneChange}
                startContent={
                  <Smartphone
                    size={20}
                    strokeWidth={1.5}
                    className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
                  />
                }
              />

              <Checkbox
                isSelected={user.emailSubscribed}
                onChange={(e) =>
                  handleCheckboxChange('emailSubscribed', e.target.checked)
                }
                className="mt-4 "
              >
                <p className="text-sm font-light">Email Subscribed</p>
              </Checkbox>

              <Checkbox
                isSelected={user.smsSubscribed}
                onChange={(e) =>
                  handleCheckboxChange('smsSubscribed', e.target.checked)
                }
                className="mt-4 "
              >
                <p className="text-sm font-light">SMS Subscribed</p>
              </Checkbox>
            </div>

            <h1 className="col-span-3 text-lg font-semibold text-gray-700">
              Address
            </h1>
            <div className="grid grid-cols-1 border bg-white pr-4 pl-4 rounded-2xl pt-10 pb-10 md:grid-cols-2 gap-6">
              <Input
                isClearable={true}
                value={user.street}
                bordered
                label="Street Address"
                name="street"
                onChange={handleChange}
              />
              <Input
                isClearable={true}
                value={user.number}
                bordered
                label="Apartment, suite, etc. (optional)"
                name="number"
                onChange={handleChange}
              />
              <Input
                isClearable={true}
                value={user.city}
                bordered
                label="City"
                name="city"
                onChange={handleChange}
              />
              <Input
                isClearable={true}
                value={user.province}
                bordered
                label="Province"
                name="province"
                onChange={handleChange}
              />
              <Input
                isClearable={true}
                value={user.country}
                bordered
                label="Country"
                name="country"
                onChange={handleChange}
              />
              <Input
                isClearable={true}
                value={user.postalCode}
                bordered
                label="Postal Code"
                name="postalCode"
                onChange={handleChange}
              />
            </div>
            <div>
              <h1 className="col-span-3 text-lg font-semibold text-gray-700">
                Change Password
              </h1>
            </div>
            <div className="grid grid-cols-1 border bg-white pr-4 pl-4 rounded-2xl pt-10 pb-10 md:grid-cols-2 gap-6">
              <Input
                clearable
                bordered
                label="Password"
                name="password"
                onChange={handleChange}
                type="password"
              />
            </div>

            <Button onClick={handleSubmit} type="submit" color="primary">
              Update Profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
