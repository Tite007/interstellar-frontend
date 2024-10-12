import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProductRatingCards from '../Product-details/RatingProductCards'
import AddToCartButton from '@/src/components/Products/AddToCartButton'
import { CartContext } from '@/src/context/CartContext'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const ProductCardCategory = ({ product }) => {
  const { addToCart } = useContext(CartContext)
  const [selectedQuantity, setSelectedQuantity] = useState('1')
  const [isOutOfStock, setIsOutOfStock] = useState(product.currentStock === 0)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/categories`)
        const data = await response.json()
        console.log('Categories:', data) // Log the categories for debugging
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
    }
    addToCart(cartItem)
    alert(`${product.name} added to cart`)
  }

  // Updated mapping logic to handle subcategory separately
  const mapCategoryAndSubcategory = (product) => {
    let categoryName = 'default-category'
    let subcategoryName = 'default-subcategory'

    // Use parentCategory and subcategory fields from the product
    console.log('Product Parent Category:', product.parentCategory)
    console.log('Product Subcategory:', product.subcategory)

    // Find the parent category
    if (product.parentCategory) {
      const category = categories.find(
        (cat) => String(cat._id) === String(product.parentCategory),
      )

      if (category) {
        console.log('Matched Category:', category)
        categoryName = category.name

        // Find the subcategory separately in the categories list
        if (product.subcategory) {
          const subcategory = categories.find(
            (cat) => String(cat._id) === String(product.subcategory),
          )
          if (subcategory) {
            console.log('Matched Subcategory:', subcategory)
            subcategoryName = subcategory.name
          } else {
            console.log(
              'No matching subcategory found for:',
              product.subcategory,
            )
          }
        }
      } else {
        console.log('No matching category found for:', product.parentCategory)
      }
    } else {
      console.log('No parent category ID found for the product.')
    }

    return { categoryName, subcategoryName }
  }

  // Use the mapping function
  const { categoryName, subcategoryName } = mapCategoryAndSubcategory(product)

  const productName = product.name
    ? product.name.toLowerCase().replace(/\s+/g, '-')
    : 'default-product'

  // Ensure the category and subcategory names are lowercase and replace spaces with dashes
  const formattedCategoryName = categoryName.toLowerCase().replace(/\s+/g, '-')
  const formattedSubcategoryName = subcategoryName
    .toLowerCase()
    .replace(/\s+/g, '-')

  const productLink = {
    pathname: `/categories/${formattedCategoryName}/${formattedSubcategoryName}/${productName}`,
    query: { productId: product._id },
  }

  // Log for debugging
  console.log('Category:', formattedCategoryName)
  console.log('Subcategory:', formattedSubcategoryName)
  console.log('Product Name:', productName)

  return (
    <div className="border border-gray-200 rounded-lg p-4 m-1 shadow-md text-left sm:min-w-[220px] h-[430px] md:h-[450px] sm:max-w-[260px] lg:max-w-[285px] md:max-w-[350px] flex flex-col justify-between">
      <Link href={productLink}>
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
        {product.technicalData?.tasteNotes || 'No taste notes available'}
      </p>
      <p className="text-black text-xs md:text-md lg:text-md xl:text-md">
        {product.category?.name || 'Unknown Category'}
      </p>

      <div className="flex flex-col">
        {product.compareAtPrice && product.compareAtPrice > product.price ? (
          <p className="text-sm md:text-md lg:text-md xl:text-md font-bold text-red-500 mt-2">
            ${product.price.toFixed(2)}{' '}
            <span className="line-through text-gray-500">
              ${product.compareAtPrice.toFixed(2)}
            </span>{' '}
            <span className="text-green-600">
              (
              {Math.round(
                ((product.compareAtPrice - product.price) /
                  product.compareAtPrice) *
                  100,
              )}
              % off)
            </span>
          </p>
        ) : (
          <p className="text-sm md:text-md lg:text-md xl:text-md font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
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

export default ProductCardCategory
