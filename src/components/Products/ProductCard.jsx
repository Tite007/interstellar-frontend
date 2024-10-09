import Image from 'next/image'
import React, { useState, useContext } from 'react'
import ProductRatingCards from '../Product-details/RatingProductCards'
import AddToCartButton from '@/src/components/Products/AddToCartButton'
import { CartContext } from '@/src/context/CartContext'
import Link from 'next/link'

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext)
  const [selectedQuantity, setSelectedQuantity] = useState('1')
  const [isOutOfStock, setIsOutOfStock] = useState(product.currentStock === 0)

  const handleAddToCart = (event) => {
    // Prevent the event from triggering navigation
    event.stopPropagation()

    const cartItem = {
      productId: product._id,
      productImage: product.images[0],
      productName: product.name,
      productPrice: product.price,
      quantity: parseInt(selectedQuantity, 10),
    }

    addToCart(cartItem)
    alert(`${product.name} added to cart`)
  }

  // Calculate discount percentage if there's a compareAtPrice
  const discountPercentage =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : null

  return (
    <div className="border border-gray-200 rounded-lg p-4 m-1 shadow-md text-left sm:min-w-[220px] h-[430px] md:h-[450px] sm:max-w-[260px] lg:max-w-[285px] md:max-w-[350px] flex flex-col justify-between">
      {/* Only wrap image and name in the Link */}
      <Link href={`/products/${product._id}`}>
        <div className="cursor-pointer">
          <div className="relative w-full h-[200px] md:h-[250px] lg:h-[250px] mb-1">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover rounded-t-md"
              priority
            />
          </div>

          <h3 className="text-md line-clamp-1 font-semibold sm:text-md md:text-lg">
            {product.name}
          </h3>
        </div>
      </Link>

      <ProductRatingCards productId={product._id} />
      <p className="text-xs md:text-md line-clamp-1 lg:text-md xl:text-md text-gray-500">
        {product.technicalData?.tasteNotes}
      </p>
      <p className="text-black text-xs md:text-md lg:text-md xl:text-md">
        {product.category}
      </p>

      {/* Show prices: regular price and compareAtPrice (if on sale) */}
      <div className="flex flex-col ">
        {product.compareAtPrice && product.compareAtPrice > product.price ? (
          <>
            <p className="text-sm md:text-md lg:text-md xl:text-md font-bold text-red-500 mt-2">
              ${product.price.toFixed(2)}{' '}
              <span className="line-through text-gray-500">
                ${product.compareAtPrice.toFixed(2)}
              </span>{' '}
              <span className="text-green-600">
                ({discountPercentage}% off)
              </span>
            </p>
          </>
        ) : (
          <p className="text-sm md:text-md lg:text-md xl:text-md font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
        )}
      </div>

      {/* Add To Cart Button */}
      <AddToCartButton
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        handleAddToCart={handleAddToCart}
        isOutOfStock={isOutOfStock}
      />
    </div>
  )
}

export default ProductCard
