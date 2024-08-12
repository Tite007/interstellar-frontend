import React from 'react'
import ProductAddForm from '@/src/components/Admin/Products/AddProduct'
import Breadcrumbs from '@/src/components/Admin/Products/Breadcrumbs'

export default function AddProduct() {
  return (
    <div>
      <h1 className=" xl:container text-2xl mt-10 font-semibold text-gray-700">
        Add Product
      </h1>
      <Breadcrumbs />
      <ProductAddForm />

      {/* You can add more content here */}
    </div>
  )
}
