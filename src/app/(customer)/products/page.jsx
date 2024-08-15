// client/src/app/(customer)/products/page.jsx
'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '@/src/components/Products/Sidebar'
import ProductCard from '@/src/components/Products/ProductCard'
import FilterSheet from '@/src/components/Products/FilterSheet'
import SkeletonProductCard from '@/src/components/Products/SkeletonProductCard'
import SkeletonSidebar from '@/src/components/Products/SkeletonSidebar'
import Link from 'next/link'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedRoastLevel, setSelectedRoastLevel] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/products/getAllProducts`,
        )
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleSelectCategory = (type, value) => {
    if (type === 'category') {
      setSelectedCategory(value)
    } else if (type === 'roastLevel') {
      setSelectedRoastLevel(value)
    } else if (type === 'country') {
      setSelectedCountry(value)
    }
  }

  const clearFilter = (type) => {
    if (type === 'category') {
      setSelectedCategory(null)
    } else if (type === 'roastLevel') {
      setSelectedRoastLevel(null)
    } else if (type === 'country') {
      setSelectedCountry(null)
    }
  }

  const filteredProducts = products.filter((product) => {
    return (
      (!selectedCategory || product.category === selectedCategory) &&
      (!selectedRoastLevel || product.roastLevel === selectedRoastLevel) &&
      (!selectedCountry || product.technicalData?.country === selectedCountry)
    )
  })

  const categories = [...new Set(products.map((product) => product.category))]
  const roastLevels = [
    ...new Set(
      products
        .map((product) => product.roastLevel?.trim())
        .filter((level) => level),
    ),
  ]
  const countries = [
    ...new Set(
      products
        .map((product) => product.technicalData?.country?.trim() || '')
        .filter(Boolean),
    ),
  ]

  return (
    <div className="flex flex-col md:flex-row">
      {loading ? (
        // Render skeletons for the whole page
        <>
          <div className="hidden md:block sm:bl">
            <SkeletonSidebar />
          </div>

          <div className="flex flex-wrap justify-center p-4 w-full">
            {Array.from({ length: 9 }).map((_, index) => (
              <SkeletonProductCard key={index} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="hidden md:block">
            <Sidebar
              categories={categories}
              roastLevels={roastLevels}
              countries={countries}
              onSelectCategory={handleSelectCategory}
              onClearFilter={clearFilter}
              selectedCategory={selectedCategory}
              selectedRoastLevel={selectedRoastLevel}
              selectedCountry={selectedCountry}
            />
          </div>
          <div className="p-4 w-full flex justify-end md:hidden">
            <FilterSheet
              categories={categories}
              roastLevels={roastLevels}
              countries={countries}
              onSelectCategory={handleSelectCategory}
              onClearFilter={clearFilter}
              selectedCategory={selectedCategory}
              selectedRoastLevel={selectedRoastLevel}
              selectedCountry={selectedCountry}
            />
          </div>
          <div className=" xl:container lg:container md:container sm:container mb-5 sm:mt-5 md:mt-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ">
            {filteredProducts.map((product) => (
              <Link key={product._id} href={`/products/${product._id}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ProductsPage
