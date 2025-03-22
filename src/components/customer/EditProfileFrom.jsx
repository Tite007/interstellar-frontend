// /Users/titesanchez/Desktop/interstellar-frontend/src/components/customer/EditProfileFrom.jsx
'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Checkbox } from '@heroui/checkbox'
import { toast } from 'sonner'
import { Mail, Smartphone } from 'lucide-react'
import Link from 'next/link'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CustomerProfilePage({
  isReadOnly = true,
  onSave,
  showSaveCancel = false,
}) {
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
    role: 'user',
  })

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
          })
        } catch (error) {
          console.error('Failed to fetch data:', error)
        }
      }
    }
    fetchData()
  }, [session])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value)
    setUser((prev) => ({ ...prev, phone: formattedPhoneNumber }))
  }

  const handleCheckboxChange = (name, isChecked) => {
    setUser((prev) => ({ ...prev, [name]: isChecked }))
  }

  const formatPhoneNumber = (value) => {
    if (!value) return value
    const phoneNumber = value.replace(/[^\d]/g, '')
    const phoneNumberLength = phoneNumber.length
    if (phoneNumberLength < 4) return phoneNumber
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
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
        toast(`Error: ${field} is required.`, {
          description: `Please fill in the ${field}.`,
        })
        return
      }
    }

    try {
      const url = `${API_BASE_URL}/auth/updateUser/${session.user.id}`
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to submit user data: ${errorText}`)
      }

      toast('User updated successfully!', {
        description: 'Your profile has been successfully updated.',
      })

      if (onSave) onSave() // Call the onSave callback to redirect
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
    <div className="xl:container mb-10">
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
                isClearable={!isReadOnly}
                value={user.name}
                bordered
                labelPlacement="outside"
                label="First Name"
                name="name"
                onChange={handleChange}
                isReadOnly={isReadOnly}
                isRequired
              />
              <Input
                isClearable={!isReadOnly}
                value={user.lastName}
                bordered
                labelPlacement="outside"
                label="Last Name"
                name="lastName"
                onChange={handleChange}
                isReadOnly={isReadOnly}
              />
              <Input
                isClearable={!isReadOnly}
                type="email"
                value={user.email}
                bordered
                labelPlacement="outside"
                label="Email"
                name="email"
                onChange={handleChange}
                isReadOnly={isReadOnly}
                isRequired
                startContent={
                  <Mail
                    size={20}
                    strokeWidth={1.5}
                    className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
                  />
                }
              />
              <Input
                isClearable={!isReadOnly}
                value={user.phone}
                bordered
                labelPlacement="outside"
                label="Phone"
                name="phone"
                onChange={handlePhoneChange}
                isReadOnly={isReadOnly}
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
                className="mt-4"
                isDisabled={isReadOnly}
              >
                <p className="text-sm font-light">Email Subscribed</p>
              </Checkbox>
              <Checkbox
                isSelected={user.smsSubscribed}
                onChange={(e) =>
                  handleCheckboxChange('smsSubscribed', e.target.checked)
                }
                className="mt-4"
                isDisabled={isReadOnly}
              >
                <p className="text-sm font-light">SMS Subscribed</p>
              </Checkbox>
            </div>

            <h1 className="col-span-3 text-lg text-black">Address</h1>
            <div className="grid grid-cols-1 border bg-white pr-4 pl-4 rounded-2xl pt-10 pb-10 md:grid-cols-2 gap-6">
              <Input
                isClearable={!isReadOnly}
                value={user.street}
                bordered
                labelPlacement="outside"
                label="Street Address"
                name="street"
                onChange={handleChange}
                isReadOnly={isReadOnly}
              />
              <Input
                isClearable={!isReadOnly}
                value={user.number}
                bordered
                labelPlacement="outside"
                label="Apartment, suite, etc. (optional)"
                name="number"
                onChange={handleChange}
                isReadOnly={isReadOnly}
              />
              <Input
                isClearable={!isReadOnly}
                value={user.city}
                bordered
                labelPlacement="outside"
                label="City"
                name="city"
                onChange={handleChange}
                isReadOnly={isReadOnly}
              />
              <Input
                isClearable={!isReadOnly}
                value={user.province}
                bordered
                labelPlacement="outside"
                label="Province"
                name="province"
                onChange={handleChange}
                isReadOnly={isReadOnly}
              />
              <Input
                isClearable={!isReadOnly}
                value={user.country}
                bordered
                labelPlacement="outside"
                label="Country"
                name="country"
                onChange={handleChange}
                isReadOnly={isReadOnly}
              />
              <Input
                isClearable={!isReadOnly}
                value={user.postalCode}
                bordered
                labelPlacement="outside"
                label="Postal Code"
                name="postalCode"
                onChange={handleChange}
                isReadOnly={isReadOnly}
              />
            </div>

            {showSaveCancel ? (
              <div className="flex gap-4">
                <Button type="submit" color="primary" className="mt-4">
                  Save Changes
                </Button>
                <Button
                  as={Link}
                  href="/customer-profile"
                  color="default"
                  className="mt-4"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              !isReadOnly && (
                <Button type="submit" color="primary" className="mt-4">
                  Update Profile
                </Button>
              )
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
