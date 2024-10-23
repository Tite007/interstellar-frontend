// components/SimilarProductsCard.js
import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProductRatingCards from '../Product-details/RatingProductCards'
import AddToCartButton from '@/src/components/Products/AddToCartButton'
import { CartContext } from '@/src/context/CartContext'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const SimilarProductsCard = ({ product }) => {
  const { addToCart } = useContext(CartContext)
  const [selectedQuantity, setSelectedQuantity] = useState('1')
  const [isOutOfStock, setIsOutOfStock] = useState(product.currentStock === 0)
  const [categories, setCategories] = useState([])

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

  const handleAddToCart = (event) => {
    event.stopPropagation()
    const cartItem = {
      productId: product._id,
      productImage: product.images[0],
      productName: product.name,
      productPrice: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity: parseInt(selectedQuantity, 10),
      size: product.size,
    }
    addToCart(cartItem)
    alert(`${product.name} (${product.size}) added to cart`)
  }

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

  const { categoryName, subcategoryName } = mapCategoryAndSubcategory(product)

  const productName = product.name
    ? product.name.toLowerCase().replace(/\s+/g, '-')
    : 'default-product'

  const formattedCategoryName = categoryName.toLowerCase().replace(/\s+/g, '-')
  const formattedSubcategoryName = subcategoryName
    .toLowerCase()
    .replace(/\s+/g, '-')

  const productLink = {
    pathname: `/categories/${formattedCategoryName}/${formattedSubcategoryName}/${productName}`,
    query: { productId: product._id },
  }

  return (
    <div className=" bg-F5F5F7 rounded-2xl p-4 text-left xs:w-[300px] mx-auto sm:w-[300px] md:w-[300px] lg:w-[300px] xl:w-[300px] h-[500px] sm:h-[520px] md:h-[500px] lg:h-[500px] flex flex-col justify-between">
      <Link href={productLink}>
        <div className="cursor-pointer">
          <div className="relative w-[220px] sm:w-[250px] md:w-[260px] h-[230px] sm:h-[260px] md:[h-260px] lg:h-[260px] mx-auto ">
            <Image
              src={product.images[0]}
              alt={product.name}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover rounded-t-md"
              width={260}
              height={260}
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </Link>
      <h3 className="text-lg line-clamp-1 font-semibold text-left">
        {product.name}
      </h3>

      <ProductRatingCards productId={product._id} />

      <p className="text-sm line-clamp-1 text-gray-500 text-left">
        {product.technicalData?.tasteNotes || 'No taste notes available'}
      </p>
      <p className=" text-sm text-black text-left">
        {product.category?.name || 'Unknown Category'}
      </p>

      <div className="text-left">
        {product.compareAtPrice && product.compareAtPrice > product.price ? (
          <>
            <p className="text-red-500 font-bold">
              ${product.price.toFixed(2)}{' '}
              <span className="line-through text-gray-500">
                ${product.compareAtPrice.toFixed(2)}
              </span>{' '}
              <span className="text-green-600">
                ({' '}
                {Math.round(
                  ((product.compareAtPrice - product.price) /
                    product.compareAtPrice) *
                    100,
                )}
                % off)
              </span>
            </p>
          </>
        ) : (
          <p className="font-bold text-gray-900">${product.price.toFixed(2)}</p>
        )}
        <p className="text-black text-sm">
          {' '}
          <strong>Size: </strong> {product.size}
        </p>
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
