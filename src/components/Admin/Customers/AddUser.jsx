'use client'

import React, { useState } from 'react'
import { Input, Textarea } from '@nextui-org/input'
import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { categories, admin } from '@/src/components/Admin/Products/data'
import { Select, SelectItem } from '@nextui-org/select'
import { Checkbox } from '@nextui-org/checkbox'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const UserAddForm = () => {
  const [user, setUser] = useState({
    companyName: '',
    name: '',
    lastName: '',
    email: '',
    admin: false,
    isActive: false,
    street: '',
    number: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
    phone: '',
    password: '',
    emailSubscribed: false,
    smsSubscribed: false,
    role: 'user', // Default role
  })
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleAdminChange = (value) => {
    setUser({ ...user, admin: value === 'true' })
  }

  const handleIsActiveChange = (value) => {
    setUser({ ...user, isActive: value === 'true' })
  }

  const handleCheckboxChange = (name, isChecked) => {
    setUser({ ...user, [name]: isChecked })
  }

  const handleRoleChange = (value) => {
    setUser({ ...user, role: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check required fields
    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      if (!user[field]) {
        console.error(`${field} is required.`)
        toast(`Error: ${field} is required.`, {
          description: `Please fill in the ${field}.`,
          // Add more options for the toast as needed
        })
        return
      }
    }

    // Example: Encrypt the password before sending
    // Note: It's generally safer to encrypt the password on the server-side
    // user.password = await encryptPassword(user.password);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/addUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        const errorText = await response.text() // Use response.json() if server sends a JSON response
        throw new Error(`Failed to submit user data: ${errorText}`)
      }

      const result = await response.json()
      console.log('User added successfully:', result)

      // Show success toast
      toast('User added successfully!', {
        description: 'The user has been successfully added.',
        // Add more options for the toast as needed
        action: {
          label: 'View Users',
          onClick: () => router.push('/admin/customers'),
        },
      })

      router.push('/admin/customers') // Redirect on success
    } catch (error) {
      console.error('Error submitting form:', error)

      // Show error toast
      toast('Failed to add user. Please try again.', {
        description: error.toString(),
        // Add more options for the toast as needed
        action: {
          label: 'Retry',
          onClick: () => {}, // Optionally, provide a retry action
        },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="col-span-3 text-lg font-semibold text-gray-700">
        Add Customer
      </h1>
      <div className="grid grid-cols-1 border bg-white pr-4 pl-4 rounded-2xl pt-10 pb-10 md:grid-cols-2 gap-6">
        <Input
          size="sm"
          clearable
          bordered
          label="Company Name"
          name="companyName"
          onChange={handleChange}
        />
        <Input
          size="sm"
          clearable
          bordered
          label="Name"
          name="name"
          onChange={handleChange}
        />
        <Input
          size="sm"
          clearable
          bordered
          label="Last Name"
          name="lastName"
          onChange={handleChange}
        />
        <Input
          size="sm"
          clearable
          bordered
          label="Email"
          name="email"
          onChange={handleChange}
        />
        <Input
          size="sm"
          clearable
          bordered
          label="Phone"
          name="phone"
          onChange={handleChange}
        />

        <Checkbox
          checked={user.emailSubscribed}
          onChange={(e) =>
            handleCheckboxChange('emailSubscribed', e.target.checked)
          }
          className="mt-4 "
          value="track"
        >
          <p className="text-sm font-light">Email Subscribed</p>
        </Checkbox>

        <Checkbox
          checked={user.smsSubscribed}
          onChange={(e) =>
            handleCheckboxChange('smsSubscribed', e.target.checked)
          }
          className="mt-4 "
          value="track"
        >
          <p className="text-sm font-light">SMS Subscribed</p>
        </Checkbox>
      </div>

      <h1 className="col-span-3 text-lg font-semibold text-gray-700">
        Address
      </h1>
      <div className="grid grid-cols-1 border bg-white pr-4 pl-4 rounded-2xl pt-10 pb-10 md:grid-cols-2 gap-6">
        <Input
          clearable
          bordered
          label="Street Address"
          name="street"
          onChange={handleChange}
        />
        <Input
          clearable
          bordered
          label="apartment, suite, etc. (optional)"
          name="number"
          onChange={handleChange}
        />
        <Input
          clearable
          bordered
          label="City"
          name="city"
          onChange={handleChange}
        />
        <Input
          clearable
          bordered
          label="Province"
          name="province"
          onChange={handleChange}
        />
        <Input
          clearable
          bordered
          label="Country"
          name="country"
          onChange={handleChange}
        />
        <Input
          size="sm"
          clearable
          bordered
          label="Postal Code"
          name="postalCode"
          onChange={handleChange}
        />
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
      <div className="grid grid-cols-1 border bg-white pr-4 pl-4 rounded-2xl pt-10 pb-10 md:grid-cols-2 gap-6">
        <Select
          size="sm"
          clearable
          bordered
          label="Admin"
          onChange={handleAdminChange}
        >
          {admin.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
        <Select
          size="sm"
          clearable
          bordered
          label="Is Active"
          onChange={handleIsActiveChange}
        >
          <SelectItem value="true">Yes</SelectItem>
          <SelectItem value="false">No</SelectItem>
        </Select>
        <Select
          size="sm"
          clearable
          bordered
          label="Role"
          onChange={handleRoleChange}
        >
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </Select>
      </div>
      <Button onChange={handleSubmit} type="submit" color="primary">
        Submit
      </Button>
    </form>
  )
}

export default UserAddForm
