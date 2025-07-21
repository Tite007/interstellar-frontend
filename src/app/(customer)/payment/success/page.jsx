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
import Link from 'next/link'

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

  const fetchProductDetails = useCallback(async (productId) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
      const response = await fetch(
        `${baseURL}/payment/stripe/products/${productId}`,
      )
      if (!response.ok) {
        throw new Error(`Product not found: ${response.statusText}`)
      }
      const productData = await response.json()
      return productData
    } catch (error) {
      console.error('Fetch product details error:', error)
      return null
    }
  }, [])

  const fetchItems = useCallback(
    async (sessionId) => {
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
    },
    [fetchProductDetails],
  )

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
    [clearCart, fetchItems],
  )

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const session = query.get('session_id')
    setSessionId(session)

    if (session) {
      fetchSessionDetails(session)
    }
  }, [fetchSessionDetails])

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

  const handleGoToHome = () => {
    router.push('/') // Adjust this route as needed
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

          <div className="mb-10 ">
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
            {/* Desktop table view */}
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
                    <th className="px-4 py-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-2">
                        {item.productDetails?.images?.[0] && (
                          <Image
                            src={
                              item.productDetails.images[0] ||
                              '/placeholder.svg'
                            }
                            alt={item.description}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        )}
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
                      Shipping:
                    </td>
                    <td className="px-4 py-2 text-right">
                      $
                      {(
                        sessionDetails?.shipping_cost?.amount_subtotal / 100 ||
                        0
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="px-4 py-2 font-medium text-right"
                      colSpan="4"
                    >
                      Tax:
                    </td>
                    <td className="px-4 py-2 text-right">
                      $
                      {(
                        sessionDetails?.total_details?.amount_tax / 100 || 0
                      ).toFixed(2)}
                    </td>
                  </tr>
                  {discountDetails && (
                    <tr>
                      <td
                        className="px-4 py-2 font-medium text-right text-green-600"
                        colSpan="4"
                      >
                        Discount :
                      </td>
                      <td className="px-4 py-2 text-right text-green-600">
                        -${(discountDetails.amount / 100).toFixed(2)}
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
                      ${calculateTotal.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="md:hidden space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    {item.productDetails?.images?.[0] && (
                      <Image
                        src={
                          item.productDetails.images[0] || '/placeholder.svg'
                        }
                        alt={item.description}
                        width={64}
                        height={64}
                        className="object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.description}</p>
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
                    <div className="text-right">
                      ${(item.price.unit_amount / 100).toFixed(2)}
                    </div>
                    <div>
                      <span className="text-gray-500">Amount:</span>
                    </div>
                    <div className="text-right font-medium">
                      $
                      {((item.price.unit_amount / 100) * item.quantity).toFixed(
                        2,
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="border rounded-lg p-4 mt-4 bg-gray-50">
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Subtotal:</div>
                  <div className="text-right">
                    ${calculateSubtotal.toFixed(2)}
                  </div>
                  <div>Shipping:</div>
                  <div className="text-right">
                    $
                    {(
                      sessionDetails?.shipping_cost?.amount_subtotal / 100 || 0
                    ).toFixed(2)}
                  </div>
                  <div>Tax:</div>
                  <div className="text-right">
                    $
                    {(
                      sessionDetails?.total_details?.amount_tax / 100 || 0
                    ).toFixed(2)}
                  </div>
                  {discountDetails && (
                    <>
                      <div className="text-green-600">Discount :</div>
                      <div className="text-right text-green-600">
                        -${(discountDetails.amount / 100).toFixed(2)}
                      </div>
                    </>
                  )}
                  <div className="font-medium text-base pt-2 border-t">
                    Total:
                  </div>
                  <div className="text-right font-medium text-base pt-2 border-t">
                    ${calculateTotal.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            size="sm"
            onPress={handleGoToHome}
            className="mt-4 bg-redBranding text-white"
          >
            Go to Home Page
          </Button>
        </div>
      )}
    </div>
  )
}

export default PaymentSuccessPage
