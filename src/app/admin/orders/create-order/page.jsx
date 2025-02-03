'use client'

import React, { Suspense, useEffect, useState } from 'react'
import NewOrder from '@/src/components/Admin/Orders/NewOrder'
import ContactInfoCard from '@/src/components/Admin/Customers/ContactInfoCard'
import { useSearchParams } from 'next/navigation'
import SearchProducts from '@/src/components/Admin/Orders/SearchProducts'
import Payment from '@/src/components/Admin/Orders/Payment'
import { Button } from "@heroui/button"
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function OrdersPage() {
  const [user, setUser] = useState({
    companyName: '',
    name: '',
    lastName: '',
    email: '',
    admin: false,
    isActive: false,
    street: '',
    number: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
    phone: '',
    password: '',
    emailSubscribed: false,
    smsSubscribed: false,
    time: '', // Assuming the API returns this
  })
  const [selectedProducts, setSelectedProducts] = useState([])
  const router = useRouter()
  const [shippingInfo, setShippingInfo] = useState({
    carrierName: '',
    shippingCost: 0,
  })

  // Similarly for taxInfo
  const [taxInfo, setTaxInfo] = useState({
    taxName: '',
    taxPercentage: 0,
  })
  const [orderTotal, setOrderTotal] = useState(0) // This state will now be updated directly from Payment component

  useEffect(() => {
    // This will now run only on the client side
    const searchParams = new URLSearchParams(window.location.search)
    const id = searchParams.get('id')

    // Define the fetchData function inside the useEffect
    const fetchData = async () => {
      if (!id) return // Exit if no ID is found

      try {
        const response = await fetch(`${API_BASE_URL}/auth/findUser/${id}`)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        setUser(data) // Update user state with fetched data
      } catch (error) {
        console.error('Failed to fetch User:', error)
      }
    }

    fetchData()
  }, [])

  const handleSubmitStripePayment = async (orderId) => {
    const stripe = await stripePromise
    try {
      const response = await fetch(
        `${API_BASE_URL}/payment/create-checkout-session`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: selectedProducts.map((product) => ({
              name: product.name,
              price: product.price,
              quantity: product.quantity,
            })),
            userInfo: {
              userId: user._id,
              email: user.email,
              name: user.name,
              lastName: user.lastName,
            },
            orderId, // Pass the order ID here
            YOUR_DOMAIN: window.location.origin,
          }),
        },
      )

      if (response.ok) {
        const session = await response.json()
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        })
        if (result.error) {
          console.log(result.error.message)
        }
      } else {
        console.error(
          'Failed to create checkout session, response status:',
          response.status,
        )
        const errorDetail = await response.text()
        console.error('Error details:', errorDetail)
      }
    } catch (error) {
      console.error('Error redirecting to Stripe Checkout:', error)
    }
  }

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      console.error('No products selected.')
      return
    }

    const orderData = {
      user: user._id,
      items: selectedProducts.map((product) => ({
        product: product._id,
        name: product.name,
        variant: product.variantId || product._id,
        variantName: product.optionValue || product.name,
        quantity: product.quantity,
        price: product.price,
        total: product.quantity * product.price, // Always calculate total here
      })),
      subtotal: selectedProducts.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0,
      ),
      shippingInfo: {
        carrierName: shippingInfo.carrierName,
        shippingCost: shippingInfo.shippingCost,
      },
      taxInfo: {
        taxName: taxInfo.taxName,
        taxPercentage: taxInfo.taxPercentage,
      },
      totalPrice: orderTotal, // Use the total from Payment component
    }

    console.log('Submitting orderData:', orderData)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/create-order?id=${user._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        },
      )

      if (!response.ok) {
        const error = await response.json()
        console.error(`Failed to create order: ${error.message}`)
        throw new Error(`Failed to create order: ${error.message}`)
      }

      const result = await response.json()
      console.log('Order created successfully:', result)

      await handleSubmitStripePayment(result._id) // Pass the order ID to the Stripe payment function

      // Redirect to the /orders page after successful order creation
      router.push('/admin/orders')
    } catch (error) {
      console.error('Order creation error:', error)
      // Handle the error appropriately
    }
  }

  // Add this function to handle updates from the SearchProducts component
  const handleSelectedProductsChange = (selectedProductsFromChild) => {
    setSelectedProducts(selectedProductsFromChild)
  }
  // Add this function to handle updates from the Payment component
  const handleUpdateTotalFromPayment = (newTotal) => {
    setOrderTotal(newTotal)
  }
  // Update subtotal calculation to include shipping and taxes
  useEffect(() => {
    const subtotal = selectedProducts.reduce(
      (acc, current) => acc + current.price * current.quantity,
      0,
    )
    const shippingCost = parseFloat(shippingInfo.shippingCost)
    const taxAmount = subtotal * (parseFloat(taxInfo.taxPercentage) / 100)
    const total = subtotal + shippingCost + taxAmount
    setOrderTotal(total)
  }, [selectedProducts, shippingInfo, taxInfo])

  // Calculate subtotal in the parent component
  const subtotal = selectedProducts.reduce(
    (acc, current) => acc + current.price * current.quantity,
    0,
  )

  if (!user) {
    return <div>Loading user data...</div>
  }

  return (
    <div className="xl:container">
      <Suspense>
        <div>
          <h1 className="mt-7 font-semibold text-2xl">
            Create order for {user.name} {user.lastName}
          </h1>
          <p className="mt-1 font-light text-sm">
            {user.city}, {user.province}, {user.country}
          </p>
        </div>
      </Suspense>
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="flex-1 ">
          <SearchProducts
            user={user}
            onSelectedProductsChange={handleSelectedProductsChange}
          />

          <Payment
            subtotal={selectedProducts.reduce(
              (acc, current) => acc + current.price * current.quantity,
              0,
            )}
            onShippingInfoChange={setShippingInfo}
            onTaxInfoChange={setTaxInfo}
            onUpdateTotal={handleUpdateTotalFromPayment} // Pass the new prop to Payment
          />

          <Button size="sm" onClick={handleSubmitStripePayment}>
            Add Payment Method
          </Button>

          <Button size="sm" className="mt-4 ml-4" onClick={handleSubmit}>
            Submit Order
          </Button>
        </div>
        <Suspense>
          <div className="">
            <ContactInfoCard user={user} />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
