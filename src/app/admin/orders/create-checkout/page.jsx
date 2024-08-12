'use client'

import React, { Suspense, useState, useEffect } from 'react'
import NewOrder from '@/src/components/Admin/Orders/NewOrder'
import ContactInfoCard from '@/src/components/Admin/Customers/ContactInfoCard'
import SearchProducts from '@/src/components/Admin/Orders/SearchProducts'
import Payment from '@/src/components/Admin/Orders/Payment'
import { Button } from '@nextui-org/button'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CheckoutPage() {
  const [user, setUser] = useState({
    stripeCustomerId: '', // Assuming this is part of the user data fetched from your backend
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
  const [taxInfo, setTaxInfo] = useState({
    taxName: '',
    taxPercentage: 0,
  })
  const [orderTotal, setOrderTotal] = useState(0)

  //function hanlde the checkout session
  const handleSubmitStripePayment = async () => {
    const stripe = await stripePromise // Initialize Stripe

    try {
      // Send the necessary data to your backend to create a checkout session
      const response = await fetch(`${API_BASE_URL}/payment/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email, // Email is expected by the backend
          name: `${user.name} ${user.lastName}`, // Full name
          items: selectedProducts.map((product) => {
            const variant =
              product.variants && product.variants.length > 0
                ? product.variants[0] // Assuming you want to handle the first variant
                : null

            return {
              productId: product._id, // Ensure this is included and correctly referenced
              name: variant
                ? `${product.name} - ${variant.value}`
                : product.name,
              price: variant ? variant.price : product.price,
              quantity: product.quantity,
              variantId: variant ? variant._id : null, // Include variant ID if exists
            }
          }),
          YOUR_DOMAIN: window.location.origin, // Send the current domain
        }),
      })

      // Handle the response from the backend
      if (response.ok) {
        const session = await response.json()

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        })

        if (result.error) {
          // Handle any errors that occur during redirection
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

  if (!user) {
    return <div>Loading user data...</div>
  }

  return (
    <div className="xl:container">
      <Suspense>
        <div>
          <h1 className="mt-7 font-semibold text-2xl">Create a New Order</h1>
        </div>
      </Suspense>
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="flex-1">
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
          <Button
            size="sm"
            className="mt-4 ml-4"
            onClick={handleSubmitStripePayment}
          >
            Submit Order
          </Button>
        </div>
        <Suspense>
          <div>
            <ContactInfoCard user={user} />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
