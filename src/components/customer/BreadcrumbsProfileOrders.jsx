import React from 'react'
import Link from 'next/link'

export default function BreadcrumbsUserProfileOrders() {
  return (
    <div className="breadcrumbs mx-auto ">
      <div className="mb-6 text-sm  font-light text-1B51CA">
        <Link href="/" className=" pr-2 hover:underline hover:text-blue-600">
          {/* Apply className directly to Link */}
          Home
        </Link>
        🔹
        <Link href="/customer-profile" className="pr-2 pl-2 hover:underline">
          Account Information
        </Link>
        🔹
        <Link href="#" className="pr-2 pl-2 hover:underline">
          Orders History
        </Link>
      </div>
    </div>
  )
}
