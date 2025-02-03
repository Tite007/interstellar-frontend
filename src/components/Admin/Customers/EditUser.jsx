'use client'

import React, { useState, useEffect } from 'react'
import { Input } from "@heroui/input"
import { useRouter } from 'next/navigation'
import { Button } from "@heroui/button"
import { admin } from '@/src/components/Admin/Products/data'
import { Select, SelectItem } from "@heroui/select"
import { Checkbox } from "@heroui/checkbox"
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'

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
    password: '',
    emailSubscribed: false,
    smsSubscribed: false,
    role: 'user', // Default role
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleAdminChange = (selectedKey) => {
    const isAdmin = selectedKey.currentKey === 'true'
    setUser((prevUser) => ({ ...prevUser, admin: isAdmin }))
  }

  const handleIsActiveChange = (selectedKey) => {
    const isActive = selectedKey.currentKey === 'true'
    setUser((prevUser) => ({ ...prevUser, isActive: isActive }))
  }

  const handleCheckboxChange = (name, isChecked) => {
    setUser({ ...user, [name]: isChecked })
  }

  const handleRoleChange = (selectedKey) => {
    setUser((prevUser) => ({ ...prevUser, role: selectedKey.currentKey }))
  }

  useEffect(() => {
    const fetchData = async () => {
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
          password: data.password || '',
          emailSubscribed: data.emailSubscribed || false,
          smsSubscribed: data.smsSubscribed || false,
          role: data.role || 'user', // Initialize role
        })
      } catch (error) {
        console.error('Failed to fetch User:', error)
      }
    }

    if (id) fetchData()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      if (!user[field]) {
        console.error(`${field} is required.`)
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

      const response = await fetch(url, {
        method,
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
      console.log('User added/updated successfully:', result)

      toast('User added/updated successfully!', {
        description: 'The user has been successfully added/updated.',
        action: {
          label: 'View Users',
          onClick: () => router.push('/customers'),
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
          clearable
          bordered
          label="Name"
          name="name"
          onChange={handleChange}
          style={{ fontSize: '16px' }}
        />
        <Input
          isClearable={true}
          value={user.lastName}
          clearable
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
          clearable
          bordered
          label="Password"
          name="password"
          onChange={handleChange}
          type="password"
          value={user.password}
          style={{ fontSize: '16px' }}
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
      <Button onClick={handleSubmit} type="submit" color="primary">
        Submit
      </Button>
    </form>
  )
}

export default EditUserForm
