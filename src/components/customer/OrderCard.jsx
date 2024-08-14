import React from 'react'
import Image from 'next/image'
import { Button } from '@nextui-org/button'

const OrderCard = ({ item }) => {
  // Define the placeholder image path
  const placeholderImage = '/placeholder-image.jpg'

  return (
    <div className="grid grid-cols-3 gap-4 p-2 bg-gray-50 border rounded-lg shadow-sm mb-4">
      {/* Image Column */}
      <div className="flex justify-center items-center">
        <Image
          src={item.productImage || placeholderImage}
          alt={item.name}
          width={100}
          height={100}
          className="rounded"
        />
      </div>

      {/* Name and Quantity Column */}
      <div className="flex flex-col justify-center">
        <p className="font-semibold text-sm md:text-md sm:text-md">
          {item.name}
        </p>
        <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
      </div>

      {/* Subtotal Column */}
      <div className="flex items-center justify-end">
        <p className="text-sm font-bold">
          Subtotal: ${item.subtotal.toFixed(2)}
        </p>
      </div>
    </div>
  )
}

export default OrderCard
