import dynamic from 'next/dynamic'
import React from 'react'

// Dynamically import the ProductsTable component with SSR disabled
const ProductsTable = dynamic(
  () => import('@/src/components/Admin/Products/ProductsTable'),
  {
    ssr: false,
  },
)

export default function ProductTable() {
  return (
    <div>
      <h1 className=" xl:container text-2xl mt-10 font-semibold text-gray-700">
        Products
      </h1>
      <ProductsTable />
    </div>
  )
}
