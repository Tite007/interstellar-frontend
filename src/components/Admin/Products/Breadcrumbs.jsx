import React from 'react'
import Link from 'next/link'

export default function Breadcrumbs({ report }) {
  return (
    <div className="breadcrumbs xl:container mx-auto mt-4 mb-5">
      <div className="mb-6 text-sm  font-light text-1B51CA">
        <Link
          href="/admin/dashboard"
          className=" pr-2 hover:underline hover:text-blue-600"
        >
          {/* Apply className directly to Link */}
          Dasboard
        </Link>
        🔹
        <Link
          href="/admin/products"
          className="pr-2 pl-2 hover:underline hover:text-blue-600"
        >
          Products
        </Link>
        🔹
        <Link href="#" className="pr-2 pl-2 hover:underline">
          Add
        </Link>
      </div>
    </div>
  )
}
