import React from 'react'
import Link from 'next/link'

export default function BreadcrumbsUserProfileOrdersDetails() {
  return (
    <div className="breadcrumbs mx-auto ">
      <div className="mb-6 text-sm  ">
        <Link href="/" className="  pr-2 hover:underline hover:text-blue-600">
          {/* Apply className directly to Link */}
          Home
        </Link>
        🔹
        <Link
          href="/customer-profile/orders"
          className="pr-2 pl-2 hover:underline"
        >
          Orders History
        </Link>
        🔹
        <Link href="#" className="pr-2 font-semibold  pl-2 ">
          Order Details
        </Link>
      </div>
    </div>
  )
}
