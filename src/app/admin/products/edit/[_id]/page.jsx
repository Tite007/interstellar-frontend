import BreadcrumbsEdit from '@/src/components/Admin/Products/BreadcrumbsEdit'
import ProductEditForm from '@/src/components/Admin/Products/EditProduct'
import React from 'react'

export default function Dashboard() {
  return (
    <div>
      <h1 className=" xl:container text-2xl mt-10 font-semibold text-gray-700">
        Edit Product
      </h1>
      <BreadcrumbsEdit />
      <ProductEditForm />
      {/* You can add more content here */}
    </div>
  )
}
