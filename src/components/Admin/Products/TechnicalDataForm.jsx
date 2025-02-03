import React, { useState, useEffect } from 'react'
import { Input, Textarea } from "@heroui/input"
import { Button } from "@heroui/button"
import { toast } from 'sonner'

const TechnicalDataForm = ({ productId }) => {
  const [technicalData, setTechnicalData] = useState({
    country: '',
    region: '',
    producer: '',
    elevationRange: '',
    dryingMethod: '',
    processingMethod: '',
    tasteNotes: '',
  })

  useEffect(() => {
    const fetchTechnicalData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/getTechnicalData/${productId}`,
        )
        if (!response.ok) throw new Error('Failed to fetch technical data')
        const data = await response.json()
        setTechnicalData(data.technicalData || {})
      } catch (error) {
        console.error('Error fetching technical data:', error)
      }
    }

    if (productId) {
      fetchTechnicalData()
    }
  }, [productId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setTechnicalData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/updateTechnicalData/${productId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(technicalData),
        },
      )
      if (!response.ok) throw new Error('Failed to update technical data')
      toast('Technical data updated successfully!', {})
    } catch (error) {
      console.error('Error updating technical data:', error)
      toast('Failed to update technical data', { type: 'error' })
    }
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
        value={technicalData.country}
        onChange={handleChange}
      />
      <Input
        labelPlacement="outside"
        isRequired
        isClearable={true}
        type="text"
        label="Region"
        name="region"
        value={technicalData.region}
        onChange={handleChange}
      />
      <Input
        labelPlacement="outside"
        isRequired
        isClearable={true}
        type="text"
        label="Producer"
        name="producer"
        value={technicalData.producer}
        onChange={handleChange}
      />
      <Input
        labelPlacement="outside"
        isRequired
        isClearable={true}
        type="text"
        label="Elevation Range"
        name="elevationRange"
        value={technicalData.elevationRange}
        onChange={handleChange}
      />
      <Input
        labelPlacement="outside"
        isRequired
        isClearable={true}
        type="text"
        label="Drying Method"
        name="dryingMethod"
        value={technicalData.dryingMethod}
        onChange={handleChange}
      />
      <Input
        labelPlacement="outside"
        isRequired
        isClearable={true}
        type="text"
        label="Processing Method"
        name="processingMethod"
        value={technicalData.processingMethod}
        onChange={handleChange}
      />
      <Textarea
        labelPlacement="outside"
        isRequired
        isClearable={true}
        value={technicalData.tasteNotes}
        clearable
        bordered
        label="Taste Notes"
        name="tasteNotes"
        onChange={handleChange}
        className="md:col-span-2"
      />
      <Button onClick={handleSave} className=" w-52" size="sm" color="success">
        Save Technical Data
      </Button>
    </div>
  )
}

export default TechnicalDataForm
