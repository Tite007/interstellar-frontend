'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import BreadcrumbsUserProfileOrdersDetails from '@/src/components/customer/BreadcrumbsProfileOrdersDetails'
import Image from 'next/image'
import { Button } from '@heroui/button'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const OrderDetailsPage = () => {
  const pathname = usePathname()
  const orderId = pathname.split('/').pop()

  const [orderDetails, setOrderDetails] = useState(null)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId)
      fetchCategories()
    }
  }, [orderId])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/categories`)
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchOrderDetails = async (orderId) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
      const response = await fetch(`${baseURL}/orders/findOrder/${orderId}`)
      if (!response.ok) throw new Error('Failed to fetch order details')

      const orderData = await response.json()
      const itemsWithImages = await Promise.all(
        orderData.items.map(async (item) => {
          try {
            const productResponse = await fetch(
              `${baseURL}/products/findProduct/${item.productId}`,
            )
            if (!productResponse.ok) return { ...item, image: null }
            const productData = await productResponse.json()

            let variantImage = null
            if (item.variantId) {
              const variantResponse = await fetch(
                `${baseURL}/products/findVariant/${item.variantId}`,
              )
              if (variantResponse.ok) {
                const variantData = await variantResponse.json()
                variantImage = variantData.images?.[0] || null
              }
            }

            return {
              ...item,
              image: variantImage || productData.images?.[0] || null,
              parentCategory: productData.parentCategory,
              subcategory: productData.subcategory,
              productName: productData.name,
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

  const calculateSubtotal = () =>
    items.reduce((total, item) => total + item.price * item.quantity, 0)

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shipping = orderDetails?.shippingInfo?.shippingCost || 0
    const discount = orderDetails?.discountInfo?.amount || 0
    return subtotal + shipping - discount
  }

  const generateTrackingUrl = (carrier, trackingNumber) => {
    switch (carrier?.toLowerCase()) {
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

  const handlePlaceOrderAgain = async () => {
    const stripe = await stripePromise
    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity,
          productPrice: item.price,
          productImage: item.image || 'https://via.placeholder.com/150',
        })),
        success_url: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cancel`,
      }

      const response = await fetch(`${API_BASE_URL}/payment/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const session = await response.json()
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        })
        if (result.error)
          console.log('Stripe redirect error:', result.error.message)
      } else {
        console.error('Failed to create checkout session', response.status)
      }
    } catch (error) {
      console.error('Error redirecting to Stripe Checkout:', error)
    }
  }

  const generateProductLink = (item) => {
    let categoryName = 'default-category'
    let subcategoryName = 'default-subcategory'
    const productName =
      item.productName?.toLowerCase().replace(/\s+/g, '-') || 'default-product'

    if (item.parentCategory) {
      const category = categories.find(
        (cat) => String(cat._id) === String(item.parentCategory),
      )
      if (category) categoryName = category.name

      if (item.subcategory) {
        const subcategory = categories.find(
          (cat) => String(cat._id) === String(item.subcategory),
        )
        if (subcategory) subcategoryName = subcategory.name
      }
    }

    const formattedCategoryName = categoryName
      .toLowerCase()
      .replace(/\s+/g, '-')
    const formattedSubcategoryName = subcategoryName
      .toLowerCase()
      .replace(/\s+/g, '-')

    return {
      pathname: `/categories/${formattedCategoryName}/${formattedSubcategoryName}/${productName}`,
      query: { productId: item.productId },
    }
  }

  if (!orderDetails) return <div>Loading order details...</div>

  return (
    <>
      <BreadcrumbsUserProfileOrdersDetails />
      <div className="xl:container bg-white border rounded-2xl p-6 font-sans text-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-semibold">Order Details</h1>
          <Button
            onPress={handlePlaceOrderAgain}
            className="bg-redBranding text-white hover:bg-sofRed px-4 py-2 w-full sm:w-auto"
          >
            Place Order Again
          </Button>
        </div>

        {isLoading ? (
          <p>Loading your order details...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row justify-between mb-6 md:mb-10 gap-6">
              <div className="md:w-1/2 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-md mb-3 font-semibold">
                  Order Information
                </h2>
                <p className="mb-2">
                  <span className="font-medium">Order Number:</span>{' '}
                  {orderDetails?.orderNumber}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Order Date:</span>{' '}
                  {new Date(orderDetails?.createdAt).toLocaleDateString()}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Status:</span>{' '}
                  {orderDetails.fulfillmentStatus || 'Pending'}
                </p>
              </div>
              <div className="md:w-1/2 bg-gray-50 p-4 rounded-lg">
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
            <div className="mb-6 md:mb-10">
              {/* Desktop table view - hidden on mobile */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full table-auto text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-2 font-medium">Image</th>
                      <th className="px-4 py-2 font-medium">Description</th>
                      <th className="px-4 py-2 font-medium text-right">Qty</th>
                      <th className="px-4 py-2 font-medium text-right">
                        Unit Price
                      </th>
                      <th className="px-4 py-2 font-medium text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-4 py-2">
                          {item.image && (
                            <Link href={generateProductLink(item)}>
                              <Image
                                src={item.image || '/placeholder.svg'}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="object-cover cursor-pointer"
                              />
                            </Link>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <Link
                            href={generateProductLink(item)}
                            className="text-blue-500 hover:underline"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2 text-right">
                          {item.quantity}
                        </td>
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
                        {(
                          orderDetails?.shippingInfo?.shippingCost || 0
                        ).toFixed(2)}
                      </td>
                    </tr>
                    {orderDetails?.discountInfo?.amount > 0 && (
                      <tr>
                        <td
                          className="px-4 py-2 font-medium text-right text-green-600"
                          colSpan="4"
                        >
                          Discount:
                        </td>
                        <td className="px-4 py-2 text-right text-green-600">
                          -${orderDetails.discountInfo.amount.toFixed(2)}
                        </td>
                      </tr>
                    )}
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

              {/* Mobile card view - visible only on mobile */}
              <div className="md:hidden space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      {item.image && (
                        <Link href={generateProductLink(item)}>
                          <Image
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-cover cursor-pointer rounded-md"
                          />
                        </Link>
                      )}
                      <div className="flex-1">
                        <Link
                          href={generateProductLink(item)}
                          className="text-blue-500 hover:underline font-medium"
                        >
                          {item.name}
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Quantity:</span>
                      </div>
                      <div className="text-right">{item.quantity}</div>

                      <div>
                        <span className="text-gray-500">Unit Price:</span>
                      </div>
                      <div className="text-right">${item.price.toFixed(2)}</div>

                      <div>
                        <span className="text-gray-500">Amount:</span>
                      </div>
                      <div className="text-right font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Mobile order summary */}
                <div className="border rounded-lg p-4 mt-4 bg-gray-50">
                  <h3 className="font-medium mb-3">Order Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Subtotal:</div>
                    <div className="text-right">
                      ${calculateSubtotal().toFixed(2)}
                    </div>

                    <div>Shipping:</div>
                    <div className="text-right">
                      $
                      {(orderDetails?.shippingInfo?.shippingCost || 0).toFixed(
                        2,
                      )}
                    </div>

                    {orderDetails?.discountInfo?.amount > 0 && (
                      <>
                        <div className="text-green-600">Discount:</div>
                        <div className="text-right text-green-600">
                          -${orderDetails.discountInfo.amount.toFixed(2)}
                        </div>
                      </>
                    )}

                    <div className="font-medium text-base pt-2 border-t">
                      Total:
                    </div>
                    <div className="text-right font-medium text-base pt-2 border-t">
                      ${calculateTotal().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 border p-4 rounded-xl bg-gray-50">
              <h2 className="font-semibold mb-3 text-lg">
                Tracking Information
              </h2>
              {orderDetails.trackingNumber && orderDetails.carrier ? (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    <p className="text-md">
                      <span className="font-medium">Carrier:</span>{' '}
                      {orderDetails.carrier}
                    </p>
                    <p className="text-md">
                      <span className="font-medium">Tracking Number:</span>{' '}
                      {orderDetails.trackingNumber}
                    </p>
                  </div>
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
                    className="mt-2 px-4 py-2 bg-redBranding text-white hover:bg-sofRed w-full sm:w-auto"
                  >
                    Track Your Package
                  </Button>
                </div>
              ) : (
                <p>No tracking information available yet.</p>
              )}
            </div>

            {/* Optional: Add Fulfillment Status if you want to keep it */}
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
