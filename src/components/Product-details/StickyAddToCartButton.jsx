import React from 'react'
import { Button } from '@nextui-org/button'
import { Select, SelectItem } from '@nextui-org/select'

const StickyAddToCartButton = ({
  product,
  selectedQuantity,
  setSelectedQuantity,
  handleAddToCart,
  isOutOfStock,
}) => {
  const handleQuantityChange = (keys) => {
    setSelectedQuantity(keys.anchorKey)
  }

  return (
    <div className="fixed bottom-0 left-0 w-full md:hidden bg-white shadow-t-2xl border-t-1 text-white flex items-center justify-center p-4 z-50">
      <div className="flex items-center w-full space-x-4">
        <Select
          label="Quantity"
          color="danger"
          size="sm"
          placeholder="Select quantity"
          selectedKeys={
            selectedQuantity ? new Set([selectedQuantity]) : undefined
          }
          onSelectionChange={handleQuantityChange}
          className="max-w-xs w-1/2"
          disabled={isOutOfStock} // Disable select if out of stock
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
          color="danger"
          size="lg"
          className="w-1/2 text-md"
          onClick={handleAddToCart}
          disabled={isOutOfStock || !selectedQuantity} // Disable button if out of stock
        >
          {isOutOfStock
            ? 'Out of Stock'
            : `Add ${selectedQuantity ? selectedQuantity : ''} to Cart`}
        </Button>
      </div>
    </div>
  )
}

export default StickyAddToCartButton
