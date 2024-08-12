// components/PriceSection.js or pages/products/PriceSection.js
import React, { useState } from 'react'
import { Radio, RadioGroup } from '@nextui-org/radio'
import { Input } from '@nextui-org/input'
import { useEffect } from 'react'

const PriceSection = ({}) => {
  const [profit, setProfit] = useState(0)
  const [margin, setMargin] = useState(0)
  const [product, setProduct] = useState({
    price: '',
    costPrice: '',
    compareAtPrice: '',
    profit: '',
    margin: '',
  })
  // Moved from ProductAddForm
  const handleChange = (e) => {
    const { name, value } = e.target
    let newFields = { [name]: value }

    if (name === 'price' || name === 'costPrice') {
      const updatedPrice = name === 'price' ? value : product.price
      const updatedCostPrice = name === 'costPrice' ? value : product.costPrice
      const newProfit = calculateProfit(updatedPrice, updatedCostPrice)
      const newMargin = calculateMargin(updatedPrice, newProfit)

      // Update profit and margin directly in the product state
      newFields.profit = newProfit.toString() // Converting to string if you want to keep it as string in your schema
      newFields.margin = `${newMargin.toFixed(2)}%` // Formatting as a percentage string

      // Also update the separate state variables for profit and margin
      setProfit(newProfit)
      setMargin(newMargin)
    }

    setProduct((prev) => ({
      ...prev,
      ...newFields,
    }))
  }

  function calculateProfit(price, costPrice) {
    return Number(price) - Number(costPrice)
  }

  function calculateMargin(price, profit) {
    if (price > 0) {
      // Ensures there's a selling price to avoid division by zero
      const marginPercentage = (profit / Number(price)) * 100
      return marginPercentage // Should return 77.78 for price=45 and profit=35
    }
    return 0 // Avoids division by zero if price is 0 or less
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 border bg-white pr-4 pl-4 rounded-2xl pt-5 pb-10">
      <h1 className="col-span-3 text-lg font-semibold text-gray-700">Price</h1>

      <Input
        isRequired
        clearable
        bordered
        label="Price"
        name="price"
        type="number"
        onChange={handleChange}
        className="col-span-1"
      />
      <Input
        clearable
        bordered
        label="Cost Per Item"
        name="costPrice"
        type="number"
        onChange={handleChange}
        className="col-span-1"
      />
      <Input
        clearable
        bordered
        label="Compare At Price"
        name="compareAtPrice"
        type="number"
        onChange={handleChange}
        className="col-span-1"
      />
      <Input
        size="sm"
        readOnly
        bordered
        label="Margin (%)"
        name="margin"
        type="text"
        className="col-span-1"
        value={`${margin.toFixed(2)}%`}
      />
      <Input
        size="sm"
        readOnly
        bordered
        label="Profit"
        name="profit"
        type="number"
        value={profit.toFixed(2)}
        className="col-span-1"
      />
      <RadioGroup>
        <Radio className="mt-4 " value="track">
          <p className="text-sm font-light">Charge tax for this item</p>
        </Radio>
      </RadioGroup>
    </div>
  )
}

export default PriceSection
