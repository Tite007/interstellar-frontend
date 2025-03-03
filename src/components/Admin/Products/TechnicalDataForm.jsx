// src/components/Admin/Products/TechnicalDataForm.jsx
import React, { useEffect } from 'react'
import { Input, Textarea } from '@heroui/input'
import { useProduct } from '@/src/context/ProductContext'

const TechnicalDataForm = () => {
  const { product, updateProduct } = useProduct()

  // Log to confirm data is received
  useEffect(() => {
    console.log('TechnicalDataForm Mounted')
    console.log('Product from Context:', product)
    console.log('Technical Data:', product.technicalData)
  }, [product])

  const technicalData = product.technicalData || {
    country: '',
    region: '',
    producer: '',
    elevationRange: '',
    dryingMethod: '',
    processingMethod: '',
    tasteNotes: '',
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log(`Updating ${name} to:`, value) // Log changes for debugging
    updateProduct({
      technicalData: {
        ...technicalData,
        [name]: value,
      },
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border bg-white pr-4 pl-4 shadow-md rounded-2xl pt-10 pb-10">
      <h1 className="col-span-full text-lg font-semibold text-gray-700">
        Technical Data
      </h1>
      <Input
        labelPlacement="outside"
        isRequired
        isClearable={true}
        type="text"
        label="Country"
        name="country"
        value={technicalData.country || ''}
        onChange={handleChange}
      />
      <Input
        labelPlacement="outside"
        isRequired
        isClearable={true}
        type="text"
        label="Region"
        name="region"
        value={technicalData.region || ''}
        onChange={handleChange}
      />
      <Input
        labelPlacement="outside"
        isRequired
        isClearable={true}
        type="text"
        label="Producer"
        name="producer"
        value={technicalData.producer || ''}
        onChange={handleChange}
      />
      <Input
        labelPlacement="outside"
        isRequired
        isClearable={true}
        type="text"
        label="Elevation Range"
        name="elevationRange"
        value={technicalData.elevationRange || ''}
        onChange={handleChange}
      />
      <Input
        labelPlacement="outside"
        isRequired
        isClearable={true}
        type="text"
        label="Drying Method"
        name="dryingMethod"
        value={technicalData.dryingMethod || ''}
        onChange={handleChange}
      />
      <Input
        labelPlacement="outside"
        isRequired
        isClearable={true}
        type="text"
        label="Processing Method"
        name="processingMethod"
        value={technicalData.processingMethod || ''}
        onChange={handleChange}
      />
      <Textarea
        labelPlacement="outside"
        isRequired
        isClearable={true}
        value={technicalData.tasteNotes || ''}
        bordered
        label="Taste Notes"
        name="tasteNotes"
        onChange={handleChange}
        className="md:col-span-2"
      />
      {/* Removed Save button; handled by ProductEditForm */}
    </div>
  )
}

export default TechnicalDataForm
