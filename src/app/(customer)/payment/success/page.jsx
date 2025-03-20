'use client'

import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@heroui/button'
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
  const [discountDetails, setDiscountDetails] = useState(null)

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

        // Handle discount details only if there's a discount
        if (sessionData.total_details?.amount_discount > 0) {
          const promoCodeId = sessionData.discounts?.[0]?.promotion_code
          let promoCodeName = 'Discount'

          if (promoCodeId) {
            try {
              const promoResponse = await fetch(
                `${baseURL}/payment/stripe/promotion_codes/${promoCodeId}`,
              )
              const promoData = await promoResponse.json()
              promoCodeName = promoData.code || promoCodeName
            } catch (promoError) {
              console.warn('Failed to fetch promo code details:', promoError)
            }
          }

          setDiscountDetails({
            amount: sessionData.total_details.amount_discount,
            promoCode: promoCodeName,
          })
        }

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
      return null
    }
  }

  const calculateSubtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + (item.price.unit_amount / 100) * item.quantity,
      0,
    )
  }, [items])

  const calculateTotal = useMemo(() => {
    const shipping = (sessionDetails?.shipping_cost?.amount_subtotal || 0) / 100
    const tax = (sessionDetails?.total_details?.amount_tax || 0) / 100
    const discount = (discountDetails?.amount || 0) / 100
    return calculateSubtotal + shipping + tax - discount
  }, [calculateSubtotal, sessionDetails, discountDetails])

  const handleGoToOrders = () => {
    router.push('/')
  }

  return (
    <div className="container mt-6 rounded-2xl bg-white border p-10 font-sans text-gray-800">
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
            {/* Desktop Table */}
            <div className="hidden sm:block mb-10">
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
                      <td className="px-4 py-2">
                        <Image
                          src={item.productDetails?.images?.[0]}
                          alt={item.description}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
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
              </table>
            </div>

            {/* Mobile List */}
            <div className="block sm:hidden mb-10">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="border p-4 bg-white rounded-2xl border-gray-200 pb-4 mb-4"
                >
                  <div className="flex items-center">
                    <Image
                      src={item.productDetails?.images?.[0]}
                      alt={item.description}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                    <div className="ml-4">
                      <p className="font-medium">{item.description}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Price: ${(item.price.unit_amount / 100).toFixed(2)}</p>
                      <p>
                        Total: $
                        {(
                          (item.price.unit_amount / 100) *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Section */}
            <div className="mt-4 space-y-2 text-right sm:text-right">
              <div className="font-medium">
                Subtotal: ${calculateSubtotal.toFixed(2)}
              </div>
              <div className="font-medium">
                Shipping: $
                {(sessionDetails?.shipping_cost?.amount_subtotal / 100).toFixed(
                  2,
                )}
              </div>
              <div className="font-medium">
                Tax: $
                {(sessionDetails?.total_details?.amount_tax / 100).toFixed(2)}
              </div>
              {discountDetails && (
                <div className="font-medium text-green-600">
                  Discount ({discountDetails.promoCode}): -$
                  {(discountDetails.amount / 100).toFixed(2)}
                </div>
              )}
              <div className="font-bold">
                Total: ${calculateTotal.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
      <Button
        size="sm"
        onPress={handleGoToOrders}
        className="mt-4 bg-redBranding text-white"
      >
        Go to Orders Page
      </Button>
    </div>
  )
}

export default PaymentSuccessPage
