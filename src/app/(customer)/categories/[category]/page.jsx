'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card, CardHeader, CardBody } from '@heroui/card'
import Image from 'next/image'
import BreadcrumdsSubcategory from '@/src/components/Product-details/BreadcrumbsSubcategory'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const SubcategoryPage = () => {
  const pathname = usePathname()
  const category = pathname.split('/').pop().toLowerCase()
  const [data, setData] = useState([])
  const [isParentCategory, setIsParentCategory] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (category) {
      const fetchCategoryData = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/categories/categories/${category}`,
          )

          if (!response.ok) {
            throw new Error(
              `HTTP error! status: ${response.status}. The category '${category}' might not exist.`,
            )
          }

          const data = await response.json()

          if (data.subcategories && data.subcategories.length > 0) {
            setIsParentCategory(true)
            setData(data.subcategories)
          } else {
            setIsParentCategory(false)
            setData(data.products || [])
          }
        } catch (error) {
          setError(error.message)
          console.error('Error fetching category data:', error)
        }
      }

      fetchCategoryData()
    }
  }, [category])

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <BreadcrumdsSubcategory category={category} />
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left capitalize">
        {category} {isParentCategory ? 'Subcategories' : 'Products'}
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.length > 0 ? (
          data.map((item) => (
            <Link
              href={{
                pathname: `/categories/${category}/${item.name
                  .toLowerCase()
                  .replace(/\s+/g, '-')}`,
                query: { subcategoryId: item._id },
              }}
              key={item._id}
            >
              <Card
                shadow="none"
                className="border hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                <CardHeader className="p-4 flex flex-col items-center">
                  <h4 className="font-bold text-lg text-center">{item.name}</h4>
                </CardHeader>
                <CardBody className="p-4 flex-1 flex items-center justify-center">
                  <div className="relative w-full aspect-square max-w-[270px]">
                    <Image
                      alt={`${item.name} image`}
                      className="object-cover rounded-xl"
                      src={item.image || '/placeholder-image.jpg'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority={false}
                    />
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center py-4 text-gray-500">
            No {isParentCategory ? 'subcategories' : 'products'} available.
          </p>
        )}
      </div>
    </div>
  )
}

export default SubcategoryPage
