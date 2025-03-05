// components/Home/SubcategoryProductSection.js

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCardCategory from '@/src/components/Products/ProductCardCategory'
import EmblaCarouselProducts from '@/src/components/Products/EmblaCarouselProducts'
import EmblaCarouselCategories from './EmblaCarouselCategories'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const CategoriesCarousel = ({ subcategoryId, subcategoryName }) => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/categories`)
        const data = await response.json()
        const parentCategories = data.filter(
          (category) => category.parent === null,
        )
        setCategories(parentCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  return (
    <div className=" text-center sm:px-6 lg:px-8">
      {/* Welcome Message Section */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
          Welcome Home—Rediscover the Joy of Yesterday
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto sm:text-xl">
          Step into a world where every product tells a story. From the flavors
          of childhood to the fabrics of tradition, our store is your gateway to
          the memories and comforts of home. Explore a curated collection of
          nostalgic treasures, designed to bring joy and connection to your
          everyday life.
        </p>
      </div>

      {/* Categories Title and Carousel */}
      <div className="mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 sm:text-3xl">
          Categories
        </h2>
        <EmblaCarouselCategories
          categories={categories}
          options={{
            loop: true,
            align: 'start',
            slidesToScroll: 1,
          }}
        />
      </div>
    </div>
  )
}

export default CategoriesCarousel
