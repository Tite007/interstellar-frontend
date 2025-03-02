'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardBody } from '@heroui/card'
import Image from 'next/image'
import BreadcrumdsCategory from '@/src/components/Product-details/BreadcrumbsCategories'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const CategoriesPage = () => {
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <BreadcrumdsCategory />
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
        Product Categories
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            href={`/categories/${category.name.toLowerCase()}`}
            key={category._id}
          >
            <Card
              shadow="none"
              className="py-4 border hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
            >
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                <h4 className="font-bold text-large text-center">
                  {category.name}
                </h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2 flex-1 flex items-center justify-center">
                <div className="relative w-full max-w-[270px] aspect-square">
                  <Image
                    alt={`${category.name} category image`}
                    className="object-cover rounded-xl"
                    src={category.image || '/placeholder-image.jpg'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                  />
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoriesPage
