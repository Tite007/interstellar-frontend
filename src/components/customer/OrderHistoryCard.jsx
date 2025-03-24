// @/src/components/customer/OrderHistoryCard.jsx
'use client'
import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard'
import OrderCardSkeleton from './OrderCardSkeleton'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const OrderHistoryCard = ({ userOrders, onCardClick }) => {
  const [ordersWithImages, setOrdersWithImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchImagesForOrders = async () => {
      setIsLoading(true)
      const updatedOrders = await Promise.all(
        userOrders.map(async (order) => {
          if (order.items && order.items.length > 0) {
            const firstItem = order.items[0]
            try {
              const productResponse = await fetch(
                `${API_BASE_URL}/products/findProduct/${firstItem.productId}`,
              )
              if (productResponse.ok) {
                const productData = await productResponse.json()
                let image = productData.images?.[0] || null

                if (firstItem.variantId) {
                  const variantResponse = await fetch(
                    `${API_BASE_URL}/products/findVariant/${firstItem.variantId}`,
                  )
                  if (variantResponse.ok) {
                    const variantData = await variantResponse.json()
                    image = variantData.images?.[0] || image
                  }
                }

                const updatedItems = [...order.items]
                updatedItems[0] = { ...updatedItems[0], productImage: image }
                return { ...order, items: updatedItems }
              }
            } catch (err) {
              console.error(
                `Error fetching image for product ${firstItem.productId}:`,
                err,
              )
            }
          }
          return { ...order }
        }),
      )
      setOrdersWithImages(updatedOrders)
      setIsLoading(false)
    }

    fetchImagesForOrders()
  }, [userOrders])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {userOrders.map((order) => (
          <OrderCardSkeleton key={order._id} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {ordersWithImages.map((order) => (
        <div key={order._id} onClick={() => onCardClick(order)}>
          <OrderCard order={order} />
        </div>
      ))}
    </div>
  )
}

export default OrderHistoryCard
