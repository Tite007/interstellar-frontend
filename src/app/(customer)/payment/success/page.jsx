'use client'

import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { CartContext } from '@/src/context/CartContext'
import Image from 'next/image'

const PaymentSuccessPage = () => {
  const { clearCart } = useContext(CartContext)
  const pathname = usePathname()
  const router = useRouter()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sessionDetails, setSessionDetails] = useState(null)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const session = query.get('session_id')
    setSessionId(session)

    if (session) {
      fetchSessionDetails(session)
    }
  }, [])

  const fetchSessionDetails = useCallback(
    async (sessionId) => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
        const response = await fetch(
          `${baseURL}/payment/stripe/sessions/${sessionId}`,
        )
        if (!response.ok) {
          throw new Error('Failed to fetch session details')
        }
        const sessionData = await response.json()
        setSessionDetails(sessionData)

        await fetchItems(sessionId)
        clearCart()
      } catch (error) {
        console.error('Fetch error:', error)
        setError(`Error: ${error.message}`)
        setIsLoading(false)
      }
    },
    [clearCart],
  )

  const fetchItems = async (sessionId) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
      const response = await fetch(
        `${baseURL}/payment/stripe/checkout-sessions/${sessionId}/line-items`,
      )
      if (!response.ok) {
        throw new Error('Failed to fetch items')
      }
      const jsonResponse = await response.json()
      const itemsData = await Promise.all(
        jsonResponse.data.map(async (item) => {
          const productDetails = await fetchProductDetails(item.price.product)
          return {
            ...item,
            productDetails,
          }
        }),
      )
      setItems(itemsData)
      setIsLoading(false)
    } catch (error) {
      console.error('Fetch error:', error)
      setError(`Error: ${error.message}`)
      setIsLoading(false)
    }
  }

  const fetchProductDetails = async (productId) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
      const response = await fetch(
        `${baseURL}/payment/stripe/products/${productId}`,
      )
      if (!response.ok) {
        throw new Error(`Product not found: ${response.statusText}`)
      }
      const productData = await response.json()

      if (!productData.active) {
        console.warn(`Product with ID ${productId} is inactive`)
      }

      return productData
    } catch (error) {
      console.error('Fetch product details error:', error)
      return null // or handle error accordingly
    }
  }

  const calculateSubtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + (item.price.unit_amount / 100) * item.quantity,
      0,
    )
  }, [items])

  const calculateTotal = useMemo(() => {
    const shipping = (sessionDetails?.shipping_cost?.amount_total || 0) / 100
    return calculateSubtotal + shipping
  }, [calculateSubtotal, sessionDetails])

  const handleGoToOrders = () => {
    router.push('/')
  }

  return (
    <div className="container p-10 font-sans text-gray-800">
      <h1 className="text-2xl font-bold mb-6">Payment Success</h1>
      {isLoading ? (
        <p>Loading your order details...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div>
          <h2 className="text-lg font-bold mb-4">
            Thank you, {sessionDetails?.customer_details?.name}!
          </h2>
          <p className="mb-6">
            Your payment was successful. A confirmation email has been sent to{' '}
            {sessionDetails?.customer_details?.email}.
          </p>

          <div className="mb-10">
            <h4 className="text-lg font-semibold mb-2">Shipping Address:</h4>
            <p className="mb-1">
              {sessionDetails?.customer_details?.address?.line1},{' '}
              {sessionDetails?.customer_details?.address?.city}
            </p>
            <p className="mb-1">
              {sessionDetails?.customer_details?.address?.state},{' '}
              {sessionDetails?.customer_details?.address?.postal_code}
            </p>
            <p className="mb-6">
              {sessionDetails?.customer_details?.address?.country}
            </p>

            <h4 className="text-lg font-semibold mb-2">Items Ordered:</h4>
            <div className="mb-10">
              <table className="w-full table-auto text-left">
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
                      <td className="px-4 py-">
                        <Image
                          src={item.productDetails?.images?.[0]}
                          alt={item.description}
                          width={50}
                          height={50}
                          className=" rounded-md object-cover"
                        />
                      </td>
                      <td className="px-4 py-2">{item.description}</td>
                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">
                        ${(item.price.unit_amount / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        $
                        {(
                          (item.price.unit_amount / 100) *
                          item.quantity
                        ).toFixed(2)}
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
                      ${calculateSubtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="px-4 py-2 font-medium text-right"
                      colSpan="4"
                    >
                      Shipping (Standard Shipping):
                    </td>
                    <td className="px-4 py-2 text-right">
                      $
                      {(
                        (sessionDetails?.shipping_cost?.amount_total || 0) / 100
                      ).toFixed(2)}
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
                      ${calculateTotal.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
      <Button
        size="sm"
        color="primary"
        onClick={handleGoToOrders}
        className="mt-4"
      >
        Go to Orders Page
      </Button>
    </div>
  )
}

export default PaymentSuccessPage
