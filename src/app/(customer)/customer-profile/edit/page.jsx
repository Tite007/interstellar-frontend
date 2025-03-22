// /Users/titesanchez/Desktop/interstellar-frontend/src/app/(customer)/customer-profile/edit/page.jsx
'use client'
import React from 'react'
import BreadcrumbsUserProfile from '@/src/components/customer/BreadcrumbsProfile'
import CustomerProfilePage from '@/src/components/customer/EditProfileFrom'
import { Button } from '@heroui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function EditCustomerPage() {
  const router = useRouter()

  const handleSave = () => {
    // After saving, redirect back to the profile page
    router.push('/customer-profile')
  }

  return (
    <div className="xl:container">
      <BreadcrumbsUserProfile />
      <h1 className="xl:container text-xl mt-5 font-semibold">
        Edit My Profile
      </h1>
      <CustomerProfilePage
        isReadOnly={false}
        onSave={handleSave}
        showSaveCancel={true}
      />
    </div>
  )
}
