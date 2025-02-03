'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import BreadcrumbsUserProfileOrdersDetails from '@/src/components/customer/BreadcrumbsProfileOrdersDetails'
import Image from 'next/image'
import { Button } from "@heroui/button"
const OrderDetailsPage = () => {
  const pathname = usePathname()
  const orderId = pathname.split('/').pop() // Gets the last segment of the path

  const [orderDetails, setOrderDetails] = useState(null)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId)
    }
  }, [orderId])

  const fetchOrderDetails = async (orderId) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
      const response = await fetch(`${baseURL}/orders/findOrder/${orderId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch order details')
      }

      const orderData = await response.json()

      // Fetch product and variant images
      const itemsWithImages = await Promise.all(
        orderData.items.map(async (item) => {
          try {
            // Fetch the product data
            const productResponse = await fetch(
              `${baseURL}/products/findProduct/${item.productId}`,
            )
            if (!productResponse.ok) {
              console.warn(`Product not found for productId: ${item.productId}`)
              return { ...item, image: null }
            }

            const productData = await productResponse.json()

            let variantImage = null
            if (item.variantId) {
              // Fetch the variant data using the new findVariant API
              const variantResponse = await fetch(
                `${baseURL}/products/findVariant/${item.variantId}`,
              )
              if (variantResponse.ok) {
                const variantData = await variantResponse.json()
                // Use the first image from the variant's images array
                variantImage = variantData.images?.[0] || null
              } else {
                console.warn(
                  `Variant not found for variantId: ${item.variantId}`,
                )
              }
            }

            // Use the first image from the product's images array if variant image is not available
            return {
              ...item,
              image: variantImage || productData.images?.[0] || null,
            }
          } catch (err) {
            console.error('Error fetching product or variant:', err)
            return { ...item, image: null }
          }
        }),
      )

      setOrderDetails(orderData)
      setItems(itemsWithImages || [])
      setIsLoading(false)
    } catch (error) {
      console.error('Fetch error:', error)
      setError(`Error: ${error.message}`)
      setIsLoading(false)
    }
  }

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shipping = orderDetails?.shippingInfo?.shippingCost || 0
    const tax = (orderDetails?.taxInfo?.taxPercentage / 100) * subtotal || 0
    return subtotal + shipping + tax
  }

  // Helper function to generate tracking URL
  const generateTrackingUrl = (carrier, trackingNumber) => {
    switch (carrier.toLowerCase()) {
      case 'ups':
        return `https://www.ups.com/track?loc=en_CA&tracknum=${trackingNumber}`
      case 'fedex':
        return `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`
      case 'dhl':
        return `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`
      default:
        return '#'
    }
  }

  if (!orderDetails) {
    return <div>Loading order details...</div>
  }

  return (
    <>
      <BreadcrumbsUserProfileOrdersDetails />
      <div className="xl:container bg-white border rounded-2xl p-6 font-sans text-gray-800">
        <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
          Order Details
        </h1>
        {isLoading ? (
          <p>Loading your order details...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row justify-between mb-6 md:mb-10">
              <div className="md:w-1/2">
                <h2 className="text-md  mb-4">
                  <strong>Order Number:</strong> {orderDetails?.orderNumber}
                </h2>
                <p className="mb-2 md:mb-4">
                  <strong>Order Date:</strong>{' '}
                  {new Date(orderDetails?.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="md:w-1/2 md:pl-8">
                <h4 className="text-md font-semibold mb-2">
                  Shipping Address:
                </h4>
                <p>{orderDetails?.shippingInfo?.address?.line1}</p>
                {orderDetails?.shippingInfo?.address?.line2 && (
                  <p>{orderDetails?.shippingInfo?.address?.line2}</p>
                )}
                <p>
                  {orderDetails?.shippingInfo?.address?.city},{' '}
                  {orderDetails?.shippingInfo?.address?.postal_code}
                </p>
                <p>
                  {orderDetails?.shippingInfo?.address?.state},{' '}
                  {orderDetails?.shippingInfo?.address?.country}
                </p>
              </div>
            </div>

            <h4 className="text-lg font-semibold mb-2">Items Ordered:</h4>
            <div className="mb-6 md:mb-10 overflow-x-auto">
              <table className="min-w-full table-auto text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-4 py-2 font-medium">Image</th>
                    <th className="px-4 py-2 font-medium">Description</th>
                    <th className="px-4 py-2 font-medium text-right">Qty</th>
                    <th className="px-4 py-2 font-medium text-right">
                      Unit Price
                    </th>
                    <th className="px-4 py-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-2">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      className="px-4 py-2 font-medium text-right"
                      colSpan="4"
                    >
                      Subtotal:
                    </td>
                    <td className="px-4 py-2 text-right">
                      ${calculateSubtotal().toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="px-4 py-2 font-medium text-right"
                      colSpan="4"
                    >
                      Shipping:
                    </td>
                    <td className="px-4 py-2 text-right">
                      $
                      {(orderDetails?.shippingInfo?.shippingCost || 0).toFixed(
                        2,
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="px-4 py-2 font-medium text-right"
                      colSpan="4"
                    >
                      Total:
                    </td>
                    <td className="px-4 py-2 text-right">
                      ${calculateTotal().toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {/* Tracking Information */}
            <div className="mb-4 border p-4 rounded-xl">
              <h2 className="font-semibold mb-2 text-lg">
                Tracking Information
              </h2>
              {orderDetails.trackingNumber && orderDetails.carrier ? (
                <div>
                  <p className="text-md">
                    <strong>Carrier:</strong> {orderDetails.carrier}
                  </p>
                  <p className="text-md">
                    <strong>Tracking Number:</strong>{' '}
                    {orderDetails.trackingNumber}
                  </p>
                  {/* <p>
                    <a
                      href={generateTrackingUrl(
                        orderDetails.carrier,
                        orderDetails.trackingNumber,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Track Package
                    </a>
                  </p>
                  {/* Tracking Button */}
                  <Button
                    onPress={() =>
                      window.open(
                        generateTrackingUrl(
                          orderDetails.carrier,
                          orderDetails.trackingNumber,
                        ),
                        '_blank',
                      )
                    }
                    className="mt-2 px-4 py-2 bg-redBranding text-white  hover:bg-sofRed"
                  >
                    Track Your Package
                  </Button>
                </div>
              ) : (
                <p>No tracking information available yet.</p>
              )}
            </div>

            {/* Fulfillment Status */}
            <div className="mb-4">
              <h2 className="font-semibold text-lg">Fulfillment Status</h2>
              <p>{orderDetails.fulfillmentStatus || 'Pending'}</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default OrderDetailsPage
