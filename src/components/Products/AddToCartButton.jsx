// components/Products/AddToCartButton.jsx
import React from 'react'
import { Button } from '@nextui-org/button'
import { Select, SelectItem } from '@nextui-org/select'

const AddToCartButton = ({
  selectedQuantity,
  setSelectedQuantity,
  handleAddToCart,
  isOutOfStock,
}) => {
  const handleQuantityChange = (keys) => {
    // Since no event is passed, just update the selected quantity
    setSelectedQuantity(keys.anchorKey)
  }

  return (
    <div className="flex flex-col mt-2 space-y-2 md:flex-row md:space-y-0 md:space-x-4">
      {/* Stack vertically on mobile, side-by-side on medium and larger screens */}
      <Select
        size="sm"
        placeholder="Select quantity"
        selectedKeys={
          selectedQuantity ? new Set([selectedQuantity]) : undefined
        }
        onSelectionChange={handleQuantityChange}
        className="w-full borderrounded-lg md:max-w-[60px]" // Full width on mobile, fixed width on larger screens
        disabled={isOutOfStock}
      >
        {[1, 2, 3, 4, 5].map((quantity) => (
          <SelectItem
            key={quantity}
            value={String(quantity)}
            textValue={String(quantity)}
          >
            {quantity}
          </SelectItem>
        ))}
      </Select>

      <Button
        color="" // Use the color you defined in tailwind.config.js
        size="sm"
        className="w-full text-white font-medium bg-redBranding text-sm" // Full width on mobile, adjust as needed
        onPress={handleAddToCart}
        isDisabled={isOutOfStock || !selectedQuantity}
      >
        {isOutOfStock
          ? 'Out of Stock'
          : `Add ${selectedQuantity ? selectedQuantity : ''} to Cart`}
      </Button>
    </div>
  )
}

export default AddToCartButton
