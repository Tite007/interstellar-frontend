import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '@/src/context/CartContext'
import { Button } from '@heroui/button'
import Image from 'next/image'
import Link from 'next/link'
import QuantityStepper from '@/src/components/Product-details/QuantityStepper'
import FreeShippingProgress from '@/src/components/Product-details/FreeShippingProgress'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const ShoppingCart = ({ closeSheet }) => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext)
  const router = useRouter()
  const [categories, setCategories] = useState([])

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/categories`)
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }

    fetchCategories()
  }, [])

  const handleQuantityChange = (item, newQuantity) => {
    updateQuantity(item.productName, item.productVariant, newQuantity)
  }

  const handleSubmitStripePayment = async () => {
    const stripe = await stripePromise

    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity,
          productPrice: item.productPrice,
          productImage: item.productImage || 'https://via.placeholder.com/150',
        })),
        success_url: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cancel`,
      }
      console.log(
        'Checkout payload being sent:',
        JSON.stringify(payload, null, 2),
      )

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
        if (result.error) {
          console.log('Stripe redirect error:', result.error.message)
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

  // Function to map category and subcategory for a product
  const mapCategoryAndSubcategory = (product) => {
    let categoryName = 'default-category'
    let subcategoryName = 'default-subcategory'

    if (product.parentCategory) {
      const category = categories.find(
        (cat) => String(cat._id) === String(product.parentCategory),
      )

      if (category) {
        categoryName = category.name

        if (product.subcategory) {
          const subcategory = categories.find(
            (cat) => String(cat._id) === String(product.subcategory),
          )
          if (subcategory) {
            subcategoryName = subcategory.name
          }
        }
      }
    }

    return { categoryName, subcategoryName }
  }

  // Function to generate the product link
  const generateProductLink = (item) => {
    const { categoryName, subcategoryName } = mapCategoryAndSubcategory(item)
    const formattedCategoryName = categoryName
      .toLowerCase()
      .replace(/\s+/g, '-')
    const formattedSubcategoryName = subcategoryName
      .toLowerCase()
      .replace(/\s+/g, '-')
    const productName =
      item.productName?.toLowerCase().replace(/\s+/g, '-') || 'default-product'

    return {
      pathname: `/categories/${formattedCategoryName}/${formattedSubcategoryName}/${productName}`,
      query: { productId: item.productId },
    }
  }

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

            const productLink = generateProductLink(item)

            return (
              <li key={index} className="mb-4 bg-gray-50">
                <div className="grid grid-cols-1 gap-4 border rounded-lg p-4 shadow-sm">
                  <div className="flex">
                    <div className="mr-4">
                      <Link href={productLink} onClick={closeSheet}>
                        <div className="cursor-pointer">
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            width={100}
                            height={100}
                            className="rounded"
                          />
                        </div>
                      </Link>
                    </div>
                    <div>
                      <Link href={productLink} onClick={closeSheet}>
                        <p className="font-semibold text-lg cursor-pointer hover:underline">
                          {item.productName}
                        </p>
                      </Link>
                      <p className="text-gray-500 text-sm">
                        Size: {item.productVariant || item.size || 'N/A'}
                      </p>
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
                        <p className="text-sm text-redBranding font-bold">
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
                        className=" bg-redBranding text-white"
                        size="sm"
                        onPress={() =>
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
              <p className="text-lg mb-2 font-bold text-redBranding ">
                Total Savings: ${cartSummary.discount.toFixed(2)}
              </p>
            )}
            <p className="text-lg font-bold">
              Subtotal: ${finalSubtotal.toFixed(2)}
            </p>
          </div>
          <Button
            onPress={handleSubmitStripePayment}
            variant="solid"
            className="mt-6 w-full bg-redBranding text-white font-medium"
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </div>
  )
}

export default ShoppingCart
