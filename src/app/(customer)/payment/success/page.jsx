'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@nextui-org/button'

const PaymentSuccessPage = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sessionDetails, setSessionDetails] = useState(null)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    // Extract the session_id from the URL query
    const query = new URLSearchParams(window.location.search)
    const session = query.get('session_id')
    setSessionId(session)

    if (session) {
      fetchSessionDetails(session)
    }
  }, [])

  const fetchSessionDetails = async (sessionId) => {
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

      // After fetching session details, fetch the line items
      fetchItems(sessionId)
    } catch (error) {
      console.error('Fetch error:', error)
      setError(`Error: ${error.message}`)
      setIsLoading(false)
    }
  }

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
      const itemsData = jsonResponse.data
      if (!Array.isArray(itemsData)) {
        throw new Error('Data fetched is not an array')
      }
      setItems(itemsData)
      setIsLoading(false)
    } catch (error) {
      console.error('Fetch error:', error)
      setError(`Error: ${error.message}`)
      setIsLoading(false)
    }
  }
  const calculateSubtotal = () => {
    return items.reduce(
      (total, item) => total + (item.price.unit_amount / 100) * item.quantity,
      0,
    )
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shipping = (sessionDetails?.shipping_cost?.amount_total || 0) / 100
    return subtotal + shipping
  }

  const handleGoToOrders = () => {
    router.push('/admin/orders')
  }

  return (
    <div className="container  p-10 font-sans text-gray-800">
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
                      colSpan="3"
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
                      colSpan="3"
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
                      colSpan="3"
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
