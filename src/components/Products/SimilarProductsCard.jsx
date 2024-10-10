// components/SimilarProductsCard.js
import Image from 'next/image'
import React, { useState, useContext } from 'react'
import ProductRatingCards from '../Product-details/RatingProductCards'
import AddToCartButton from '@/src/components/Products/AddToCartButton'
import { CartContext } from '@/src/context/CartContext'
import Link from 'next/link'

const SimilarProductsCard = ({ product }) => {
  const { addToCart } = useContext(CartContext)
  const [selectedQuantity, setSelectedQuantity] = useState('1')
  const [isOutOfStock, setIsOutOfStock] = useState(product.currentStock === 0)

  const handleAddToCart = (event) => {
    event.stopPropagation()

    const cartItem = {
      productId: product._id,
      productImage: product.images[0],
      productName: product.name,
      productPrice: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity: selectedQuantity,
    }

    addToCart(cartItem)
    alert(`${product.name} added to cart`)
  }

  const discountPercentage =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : null

  const savingsAmount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? (product.compareAtPrice - product.price).toFixed(2)
      : null

  return (
    <div className="border border-gray-200 rounded-xl p-4 m-4 shadow-md text-left w-[300px] h-[550px] sm:h-[520px] md:h-[500px] lg:h-[500px] flex flex-col justify-between">
      <Link href={`/products/${product._id}`}>
        <div className="cursor-pointer">
          <div className="relative w-[260px] h-[260px] mx-auto mb-4">
            <Image
              src={product.images[0]}
              alt={product.name}
              className="object-cover rounded-t-md"
              width={260}
              height={260}
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
          <h3 className="text-lg font-semibold text-left">{product.name}</h3>
        </div>
      </Link>

      <ProductRatingCards productId={product._id} />

      <p className="text-sm text-gray-500 text-left">
        {product.technicalData?.tasteNotes}
      </p>
      <p className="text-black text-left">{product.category}</p>

      <div className="text-left">
        {discountPercentage ? (
          <>
            <p className="text-red-500 font-bold">
              ${product.price.toFixed(2)}{' '}
              <span className="line-through text-gray-500">
                ${product.compareAtPrice.toFixed(2)}
              </span>{' '}
              <span className="text-green-600">
                ( {discountPercentage}% off)
              </span>
            </p>
          </>
        ) : (
          <p className="font-bold text-gray-900">${product.price.toFixed(2)}</p>
        )}
      </div>

      <AddToCartButton
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        handleAddToCart={handleAddToCart}
        isOutOfStock={isOutOfStock}
      />
    </div>
  )
}

export default SimilarProductsCard
