// EditUserForm.jsx
'use client'
import React, { useState, useEffect } from 'react'
import { Input } from '@heroui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Select, SelectItem } from '@heroui/select'
import { Checkbox } from '@heroui/checkbox'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const EditUserForm = () => {
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
    password: '', // Leave empty by default
    emailSubscribed: false,
    smsSubscribed: false,
    role: 'user',
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleAdminChange = (selectedKey) => {
    const isAdmin = selectedKey.currentKey === 'true'
    setUser((prev) => ({ ...prev, admin: isAdmin }))
  }

  const handleIsActiveChange = (selectedKey) => {
    const isActive = selectedKey.currentKey === 'true'
    setUser((prev) => ({ ...prev, isActive: isActive }))
  }

  const handleCheckboxChange = (name, isChecked) => {
    setUser((prev) => ({ ...prev, [name]: isChecked }))
  }

  const handleRoleChange = (selectedKey) => {
    setUser((prev) => ({ ...prev, role: selectedKey.currentKey }))
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      try {
        const response = await fetch(`${API_BASE_URL}/auth/findUser/${id}`)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        console.log('USER DATA', data)
        setUser({
          ...data,
          companyName: data.companyName || '',
          name: data.name || '',
          lastName: data.lastName || '',
          email: data.email || '',
          admin: data.admin || false,
          isActive: data.isActive || false,
          street: data.street || '',
          number: data.number || '',
          city: data.city || '',
          province: data.province || '',
          postalCode: data.postalCode || '',
          country: data.country || '',
          phone: data.phone || '',
          password: '', // Don’t pre-fill with hashed password
          emailSubscribed: data.emailSubscribed || false,
          smsSubscribed: data.smsSubscribed || false,
          role: data.role || 'user',
        })
      } catch (error) {
        console.error('Failed to fetch User:', error)
      }
    }

    if (id) fetchData()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const requiredFields = ['name', 'email']
    const isNewUser = !id
    if (isNewUser) requiredFields.push('password') // Password required only for new users

    for (const field of requiredFields) {
      if (!user[field]) {
        toast(`Error: ${field} is required.`, {
          description: `Please fill in the ${field}.`,
        })
        return
      }
    }

    try {
      const url = id
        ? `${API_BASE_URL}/auth/updateUser/${id}`
        : `${API_BASE_URL}/auth/addUser`
      const method = id ? 'PUT' : 'POST'

      // For updates, only include password if it’s changed (non-empty)
      const payload = { ...user }
      if (id && !payload.password) {
        delete payload.password // Remove password if empty for updates
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to submit user data: ${errorText}`)
      }

      const result = await response.json()
      console.log('User added/updated successfully:', result)

      toast('User added/updated successfully!', {
        description: 'The user has been successfully added/updated.',
        action: {
          label: 'View Users',
          onClick: () => router.push('/admin/customers'),
        },
      })

      router.push('/admin/customers')
    } catch (error) {
      console.error('Error submitting form:', error)
      toast('Failed to add/update user. Please try again.', {
        description: error.toString(),
        action: {
          label: 'Retry',
          onClick: () => {},
        },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="col-span-3 text-lg font-semibold text-gray-700">
        {id ? 'Edit User' : 'Add User'}
      </h1>
      <div className="grid grid-cols-1 border bg-white pr-4 pl-4 shadow-md rounded-2xl pt-10 pb-10 md:grid-cols-2 gap-6">
        <Input
          size="sm"
          isClearable={true}
          bordered
          type="text"
          value={user.companyName}
          label="Company Name"
          name="companyName"
          onChange={handleChange}
          style={{ fontSize: '16px' }}
        />
        <Input
          isClearable={true}
          value={user.name}
          bordered
          label="Name"
          name="name"
          onChange={handleChange}
          style={{ fontSize: '16px' }}
        />
        <Input
          isClearable={true}
          value={user.lastName}
          bordered
          label="Last Name"
          name="lastName"
          onChange={handleChange}
          style={{ fontSize: '16px' }}
        />
        <Input
          isClearable={true}
          value={user.email}
          bordered
          label="Email"
          name="email"
          onChange={handleChange}
          style={{ fontSize: '16px' }}
        />
        <Input
          isClearable={true}
          value={user.phone}
          bordered
          label="Phone"
          name="phone"
          onChange={handleChange}
          style={{ fontSize: '16px' }}
        />
        <Checkbox
          isSelected={user.emailSubscribed}
          onChange={(e) =>
            handleCheckboxChange('emailSubscribed', e.target.checked)
          }
          className="mt-4"
        >
          <p className="text-sm font-light">Email Subscribed</p>
        </Checkbox>
        <Checkbox
          isSelected={user.smsSubscribed}
          onChange={(e) =>
            handleCheckboxChange('smsSubscribed', e.target.checked)
          }
          className="mt-4"
        >
          <p className="text-sm font-light">SMS Subscribed</p>
        </Checkbox>
      </div>

      <h1 className="col-span-3 text-lg font-semibold text-gray-700">
        Address
      </h1>
      <div className="grid grid-cols-1 border bg-white pr-4 pl-4 shadow-md rounded-2xl pt-10 pb-10 md:grid-cols-2 gap-6">
        <Input
          isClearable={true}
          value={user.street}
          bordered
          label="Street Address"
          name="street"
          onChange={handleChange}
          style={{ fontSize: '16px' }}
        />
        <Input
          isClearable={true}
          value={user.number}
          bordered
          label="Apartment, suite, etc. (optional)"
          name="number"
          onChange={handleChange}
          style={{ fontSize: '16px' }}
        />
        <Input
          isClearable={true}
          value={user.city}
          bordered
          label="City"
          name="city"
          onChange={handleChange}
          style={{ fontSize: '16px' }}
        />
        <Input
          isClearable={true}
          value={user.province}
          bordered
          label="Province"
          name="province"
          onChange={handleChange}
          style={{ fontSize: '16px' }}
        />
        <Input
          isClearable={true}
          value={user.country}
          bordered
          label="Country"
          name="country"
          onChange={handleChange}
          style={{ fontSize: '16px' }}
        />
        <Input
          isClearable={true}
          value={user.postalCode}
          bordered
          label="Postal Code"
          name="postalCode"
          onChange={handleChange}
          style={{ fontSize: '16px' }}
        />
      </div>

      <div className="grid grid-cols-1 border bg-white shadow-md pr-4 pl-4 rounded-2xl pt-10 pb-10 md:grid-cols-2 gap-6">
        <Input
          isClearable={true}
          bordered
          label="Password"
          name="password"
          onChange={handleChange}
          type="password"
          value={user.password}
          style={{ fontSize: '16px' }}
          placeholder={id ? 'Enter new password (optional)' : 'Enter password'}
        />
      </div>

      <div className="grid grid-cols-1 border bg-white pr-4 pl-4 shadow-md rounded-2xl pt-10 pb-10 md:grid-cols-2 gap-6">
        <Select
          size="sm"
          clearable
          bordered
          label="Admin"
          onSelectionChange={(selected) => handleAdminChange(selected)}
          selectedKeys={user.admin ? new Set(['true']) : new Set(['false'])}
        >
          <SelectItem key="true" value="true">
            Yes
          </SelectItem>
          <SelectItem key="false" value="false">
            No
          </SelectItem>
        </Select>
        <Select
          size="sm"
          clearable
          bordered
          label="Is Active"
          onSelectionChange={(selected) => handleIsActiveChange(selected)}
          selectedKeys={user.isActive ? new Set(['true']) : new Set(['false'])}
        >
          <SelectItem key="true" value="true">
            Yes
          </SelectItem>
          <SelectItem key="false" value="false">
            No
          </SelectItem>
        </Select>
        <Select
          size="sm"
          clearable
          bordered
          label="Role"
          onSelectionChange={(selected) => handleRoleChange(selected)}
          selectedKeys={new Set([user.role])}
        >
          <SelectItem key="user" value="user">
            User
          </SelectItem>
          <SelectItem key="admin" value="admin">
            Admin
          </SelectItem>
        </Select>
      </div>

      <Button type="submit" color="primary">
        Submit
      </Button>
    </form>
  )
}

export default EditUserForm
