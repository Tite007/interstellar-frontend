'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation' // To get query parameters
import axios from 'axios'
import Sidebar from '@/src/components/Products/Sidebar'
import ProductCardCategory from '@/src/components/Products/ProductCardCategory'
import FilterSheet from '@/src/components/Products/FilterSheet'
import SkeletonProductCard from '@/src/components/Products/SkeletonProductCard'
import SkeletonSidebar from '@/src/components/Products/SkeletonSidebar'
import ProductCard from '@/src/components/Products/ProductCard'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const SubcategoryProductsPage = () => {
  const searchParams = useSearchParams()
  const subcategoryId = searchParams.get('subcategoryId') // Extract subcategoryId from query parameters

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedRoastLevel, setSelectedRoastLevel] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [error, setError] = useState(null)

  // Fetch products by subcategory ID
  useEffect(() => {
    if (subcategoryId) {
      const fetchProductsBySubcategory = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/products/products/bySubcategory/${subcategoryId}`,
          )

          if (!response.data || response.data.length === 0) {
            setError('No products found for this subcategory')
            return
          }

          setProducts(response.data) // Set products fetched for the subcategory
        } catch (err) {
          setError('Failed to fetch products')
          console.error('Error fetching products:', err)
        } finally {
          setLoading(false)
        }
      }

      fetchProductsBySubcategory()
    } else {
      setError('Subcategory ID not found')
    }
  }, [subcategoryId])

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    return (
      (!selectedCategory || product.category === selectedCategory) &&
      (!selectedRoastLevel || product.roastLevel === selectedRoastLevel) &&
      (!selectedCountry || product.technicalData?.country === selectedCountry)
    )
  })

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

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="flex flex-col md:flex-row">
      {loading ? (
        <>
          <div className="hidden md:block">
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
              <ProductCardCategory key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SubcategoryProductsPage
