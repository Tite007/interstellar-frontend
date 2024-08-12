import React from 'react'
import Link from 'next/link'

export default function BreadcrumbsNewContent() {
  return (
    <div className="breadcrumbs mx-auto mt-4 mb-5">
      <div className="mb-6 text-sm  font-light text-1B51CA">
        <Link
          href="/admin/content"
          className=" pr-2 hover:underline hover:text-blue-600"
        >
          {/* Apply className directly to Link */}
          Content
        </Link>
        🔹
        <Link
          href="#"
          className="pr-2 pl-2 hover:underline hover:text-blue-600"
        >
          New Content
        </Link>
      </div>
    </div>
  )
}
