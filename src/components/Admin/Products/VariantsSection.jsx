// src/components/Admin/Products/VariantsSection.jsx
import React from 'react'
import EditProductVariant from './EditProductVariants'
import { useProduct } from '@/src/context/ProductContext'

const VariantsSection = () => {
  const { product, variants, updateVariants } = useProduct()
  return (
    <div className="bg-white pr-4 pl-4 shadow-md rounded-2xl pt-10 pb-10">
      <h1 className="text-lg font-semibold text-gray-700">Variants</h1>
      <EditProductVariant
        initialVariants={variants}
        productId={product._id} // Pass product._id
        onVariantsChange={updateVariants}
      />
    </div>
  )
}

export default VariantsSection
