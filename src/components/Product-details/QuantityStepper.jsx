import React from 'react'
import { Minus, Plus } from 'lucide-react'

const QuantityStepper = ({ item, onQuantityChange }) => {
  const handleInputChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10)
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      onQuantityChange(item, newQuantity)
    }
  }

  const handleIncrement = () => {
    const newQuantity = item.quantity + 1
    onQuantityChange(item, newQuantity)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1
      onQuantityChange(item, newQuantity)
    }
  }

  return (
    <div className="flex items-center">
      <button
        onClick={handleDecrement}
        className="px-2 py-1 border rounded-l-lg bg-gray-200 hover:bg-gray-300"
      >
        <Minus size={19} strokeWidth={1.5} />
      </button>
      <input
        value={item.quantity}
        onChange={handleInputChange}
        className="w-12 text-center border-t border-b h-7"
        min="1"
      />
      <button
        onClick={handleIncrement}
        className="px-2 py-1 border rounded-r-lg bg-gray-200 hover:bg-gray-300"
      >
        <Plus size={19} strokeWidth={1.5} />
      </button>
    </div>
  )
}

export default QuantityStepper
