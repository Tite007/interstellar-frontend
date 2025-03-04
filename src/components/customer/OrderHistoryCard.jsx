// @/src/components/customer/OrderHistoryCard.jsx
'use client'
import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const OrderHistoryCard = ({ userOrders, onCardClick }) => {
  const [ordersWithImages, setOrdersWithImages] = useState([])

  useEffect(() => {
    const fetchImagesForOrders = async () => {
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

                // Add the image as productImage to match OrderCard's expectation
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
          return { ...order } // Return unchanged if no image fetched
        }),
      )
      setOrdersWithImages(updatedOrders)
    }

    fetchImagesForOrders()
  }, [userOrders])

  return (
    <div>
      {ordersWithImages.map((order) => (
        <div key={order._id} onClick={() => onCardClick(order)}>
          <OrderCard order={order} />
        </div>
      ))}
    </div>
  )
}

export default OrderHistoryCard
