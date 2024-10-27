import React, { useEffect, useState } from 'react'
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/breadcrumbs'
import Link from 'next/link'
import { mapCategoryAndSubcategory } from '@/src/utils/categoryMapping'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function BreadcrumbsProduct({ product }) {
  const [categories, setCategories] = useState([])
  const [categoryData, setCategoryData] = useState({
    categoryName: 'default-category',
    subcategoryName: 'default-subcategory',
    subcategoryId: '', // Store the subcategory ID for query parameter
  })

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

  useEffect(() => {
    if (categories.length > 0) {
      const { categoryName, subcategoryName } = mapCategoryAndSubcategory(
        product,
        categories,
      )
      const subcategoryId = product.subcategory // Assuming `subcategoryId` is available on product
      setCategoryData({ categoryName, subcategoryName, subcategoryId })
    }
  }, [product, categories])

  const { categoryName, subcategoryName, subcategoryId } = categoryData

  const formattedCategoryName = categoryName.toLowerCase().replace(/\s+/g, '-')
  const formattedSubcategoryName = subcategoryName
    .toLowerCase()
    .replace(/\s+/g, '-')
  const formattedProductName = product.name.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="mb-2">
      <Breadcrumbs color="primary">
        <BreadcrumbItem>
          <Link href="/">Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/products">Products</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href={`/categories/${formattedCategoryName}`}>
            {categoryName}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link
            href={{
              pathname: `/categories/${formattedCategoryName}/${formattedSubcategoryName}`,
              query: { subcategoryId },
            }}
          >
            {subcategoryName}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          {product.name} {/* Display product name without hyperlink */}
        </BreadcrumbItem>
      </Breadcrumbs>
    </div>
  )
}
