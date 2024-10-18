import React from 'react'
import Image from 'next/image'

const OrderCard = ({ order }) => {
  // Define the placeholder image path
  const placeholderImage = '/placeholder-image.jpg'

  // Calculate the total quantity of items in the order
  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-white  border rounded-2xl shadow-md mb-3 hover:shadow-md transition-shadow cursor-pointer">
      {/* Image Column */}
      <div className="flex justify-center items-center">
        <Image
          src={order.items[0]?.productImage || placeholderImage}
          alt={order.items[0]?.name || 'Product Image'}
          width={100}
          height={100}
          className="rounded"
        />
      </div>

      {/* Order Info Column */}
      <div className="flex flex-col justify-center col-span-2">
        <h3 className="font-semibold text-md md:text-lg lg:text-lg">
          Order #{order.orderNumber}
        </h3>
        <p className="text-gray-500 text-sm md:text-sm lg:text-md">
          Order Date: {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-500 text-sm md:text-sm lg:text-md">
          Total Items: {totalItems}
        </p>
      </div>

      {/* Total Price Column */}
      <div className="flex flex-col justify-center items-end">
        <p className="text-md md:text-md lg:text-md font-bold">
          Total: ${order.totalPrice.toFixed(2)}
        </p>
      </div>
    </div>
  )
}

export default OrderCard
