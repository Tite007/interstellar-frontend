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
    <div>
      <EmblaCarouselCategories
        categories={categories}
        options={{
          loop: true,
          align: 'start',
          slidesToScroll: 1,
        }}
      />
    </div>
  )
}

export default CategoriesCarousel
