// /Users/titesanchez/Desktop/interstellar-frontend/src/app/(customer)/customer-profile/page.jsx
import React from 'react'
import BreadcrumbsUserProfile from '@/src/components/customer/BreadcrumbsProfile'
import CustomerProfilePage from '@/src/components/customer/EditProfileFrom'
import Link from 'next/link'
import { Button } from '@heroui/button'

export default function CustomerPage() {
  return (
    <div className="xl:container">
      <BreadcrumbsUserProfile />
      <h1 className="xl:container text-xl mt-5 font-semibold">My Profile</h1>
      <CustomerProfilePage isReadOnly={true} /> {/* Pass isReadOnly prop */}
      <Button as={Link} href="/customer-profile/edit" color="primary">
        Edit Profile
      </Button>
    </div>
  )
}
