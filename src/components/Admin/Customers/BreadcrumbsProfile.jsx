import React from 'react'
import Link from 'next/link'

export default function BreadcrumbsCustomerProfile() {
  return (
    <div className="breadcrumbs mx-auto mt-4">
      <div className="mb-6 text-sm  font-light text-1B51CA">
        <Link
          href="/dashboard"
          className=" pr-2 hover:underline hover:text-blue-600"
        >
          {/* Apply className directly to Link */}
          Dasboard
        </Link>
        🔹
        <Link
          href="/customers"
          className="pr-2 pl-2 hover:underline hover:text-blue-600"
        >
          Customers
        </Link>
        🔹
        <Link href="#" className="pr-2 pl-2 hover:underline">
          Customer Profile
        </Link>
      </div>
    </div>
  )
}
