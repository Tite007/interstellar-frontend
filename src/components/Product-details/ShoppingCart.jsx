import React, { useContext } from 'react'
import { CartContext } from '@/src/context/CartContext' // Adjust path as needed
import { Button } from '@nextui-org/button'
import Image from 'next/image'
import QuantityStepper from '@/src/components/Product-details/QuantityStepper' // Adjust path as needed
import FreeShippingProgress from '@/src/components/Product-details/FreeShippingProgress' // Import the new component
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const ShoppingCart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext)
  const router = useRouter()

  const handleQuantityChange = (item, newQuantity) => {
    updateQuantity(item.productName, item.productVariant, newQuantity)
  }

  const handleSubmitStripePayment = async () => {
    const stripe = await stripePromise

    try {
      const response = await fetch(`${API_BASE_URL}/payment/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            productPrice: item.productPrice,
            productImage: item.productImage,
          })),
          YOUR_DOMAIN: window.location.origin,
        }),
      })

      if (response.ok) {
        const session = await response.json()
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        })

        if (result.error) {
          console.log(result.error.message)
        }
      } else {
        console.error('Failed to create checkout session', response.status)
        const errorDetail = await response.text()
        console.error('Error details:', errorDetail)
      }
    } catch (error) {
      console.error('Error redirecting to Stripe Checkout:', error)
    }
  }

  // Calculate cart total, discount, and final subtotal
  const cartSummary = cart.reduce(
    (acc, item) => {
      const itemSubtotal = item.productPrice * item.quantity
      const itemDiscount =
        item.compareAtPrice && item.compareAtPrice > item.productPrice
          ? (item.compareAtPrice - item.productPrice) * item.quantity
          : 0

      return {
        total: acc.total + itemSubtotal,
        discount: acc.discount + itemDiscount,
      }
    },
    { total: 0, discount: 0 },
  )

  const finalSubtotal = cartSummary.total

  return (
    <div className="mt-7">
      {cart.length > 0 && (
        <div className="mb-5">
          <FreeShippingProgress cartTotal={finalSubtotal} />
        </div>
      )}

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item, index) => {
            const itemSubtotal = item.productPrice * item.quantity
            const itemDiscount =
              item.compareAtPrice && item.compareAtPrice > item.productPrice
                ? (item.compareAtPrice - item.productPrice) * item.quantity
                : 0

            return (
              <li key={index} className="mb-4 bg-gray-50">
                <div className="grid grid-cols-1 gap-4 border rounded-lg p-4 shadow-sm">
                  <div className="flex">
                    <div className="mr-4">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        width={100}
                        height={100}
                        className="rounded"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        {item.productName}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Size: {item.productVariant || item.size || 'N/A'}
                      </p>
                      {/* Conditionally render Grind Type if it exists */}
                      {item.grindType && (
                        <p className="text-gray-500 text-sm mb-2">
                          Grind Type: {item.grindType}
                        </p>
                      )}
                      <p className="text-sm font-bold">
                        ${item.productPrice.toFixed(2)}
                      </p>
                      <p className="text-sm font-bold text-black">
                        Subtotal: ${itemSubtotal.toFixed(2)}
                      </p>
                      {itemDiscount > 0 && (
                        <p className="text-sm text-green-600">
                          You save: ${itemDiscount.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <QuantityStepper
                        item={item}
                        onQuantityChange={handleQuantityChange}
                      />
                    </div>
                    <div>
                      <Button
                        variant="flat"
                        color="danger"
                        size="sm"
                        onClick={() =>
                          removeFromCart(item.productName, item.productVariant)
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {cart.length > 0 && (
        <>
          <div className="mt-6 text-right">
            {cartSummary.discount > 0 && (
              <p className="text-lg mb-2 font-bold text-green-600">
                Total Savings: ${cartSummary.discount.toFixed(2)}
              </p>
            )}
            <p className="text-lg font-bold">
              Subtotal: ${finalSubtotal.toFixed(2)}
            </p>
          </div>
          <Button
            onClick={handleSubmitStripePayment}
            variant="solid"
            color="success"
            className="mt-6 w-full"
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </div>
  )
}

export default ShoppingCart
