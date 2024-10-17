// /Users/fundamentalresearch/Desktop/interstellar-frontend/src/app/admin/products-expiration/page.jsx

import React from 'react'
import ExpirationTable from '@/src/components/Admin/Products/ProductExpirationTable'

export default function ProductsExpirationPage() {
  return (
    <div>
      <h1 className="xl:container text-2xl font-bold mb-4 mt-6">
        Products Expiration Tracking
      </h1>
      {/* Render the ExpirationTable component */}
      <ExpirationTable />
    </div>
  )
}
