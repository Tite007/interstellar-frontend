// customer-profile/orders/page.jsx
import React from 'react'
import { Suspense } from 'react'
import CustomerOrdersContent from './CustomerOrdersContent'
import { unstable_noStore as noStore } from 'next/cache'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

export default function CustomerOrdersPage() {
  noStore() // Prevent caching

  return (
    <Suspense fallback={<p>Loading orders...</p>}>
      <CustomerOrdersContent />
    </Suspense>
  )
}
