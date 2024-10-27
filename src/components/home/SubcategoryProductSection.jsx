// components/Home/SubcategoryProductSection.js

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCardCategory from '@/src/components/Products/ProductCardCategory'
import EmblaCarouselProducts from '@/src/components/Products/EmblaCarouselProducts'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const SubcategoryProductSection = ({ subcategoryId, subcategoryName }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProductsBySubcategory = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/products/products/bySubcategory/${subcategoryId}`,
        )
        setProducts(response.data)
      } catch (error) {
        setError('Failed to load products')
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductsBySubcategory()
  }, [subcategoryId])

  if (loading) return <div>Loading products...</div>
  if (error) return <div>{error}</div>
  if (!products.length) return <div>No products found in {subcategoryName}</div>

  return (
    <div className="subcategory-section mb-8">
      <h2 className="text-xl font-semibold mb-4">{subcategoryName}</h2>
      <EmblaCarouselProducts products={products} options={{ loop: true }} />
    </div>
  )
}

export default SubcategoryProductSection
