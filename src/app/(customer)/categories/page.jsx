'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardBody } from '@nextui-org/card'
import Image from 'next/image'
import BreadcrumdsCategory from '@/src/components/Product-details/BreadcrumbsCategories'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const CategoriesPage = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Corrected API path
        const response = await fetch(`${API_BASE_URL}/categories/categories`)
        const data = await response.json()

        // Filter to only include parent categories
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
    <div className="container mx-auto px-4 py-8">
      <BreadcrumdsCategory />
      <h1 className="text-3xl font-bold mb-6">Product Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            href={`/categories/${category.name.toLowerCase()}`}
            key={category._id}
          >
            <Card
              shadow="none"
              className="py-4 border hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">{category.name}</h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Image
                  alt={`${category.name} category image`}
                  className="object-cover rounded-xl"
                  src={category.image || '/placeholder-image.jpg'}
                  width={270}
                  height={270}
                />
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoriesPage
