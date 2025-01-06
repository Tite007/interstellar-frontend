'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card, CardHeader, CardBody } from '@nextui-org/card'
import Image from 'next/image'
import BreadcrumdsSubcategory from '@/src/components/Product-details/BreadcrumbsSubcategory'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const SubcategoryPage = () => {
  const pathname = usePathname()
  const category = pathname.split('/').pop().toLowerCase() // Ensure lowercase category name
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
    return <div>Error: {error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumdsSubcategory category={category} />
      <h1 className="text-3xl font-bold mb-6">
        {category.charAt(0).toUpperCase() + category.slice(1)}{' '}
        {isParentCategory ? 'Subcategories' : 'Products'}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.length > 0 ? (
          data.map((item) => (
            <Link
              href={{
                pathname: `/categories/${category}/${item.name
                  .toLowerCase()
                  .replace(/\s+/g, '-')}`, // Use subcategory name for the URL
                query: { subcategoryId: item._id }, // Pass subcategoryId as a query parameter
              }}
              key={item._id}
            >
              <Card
                shadow="none"
                className="py-4 border hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <h4 className="font-bold text-large">{item.name}</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Image
                    alt={`${item.name} image`}
                    className="object-cover rounded-xl"
                    src={item.image || '/placeholder-image.jpg'}
                    width={270}
                    height={270}
                  />
                </CardBody>
              </Card>
            </Link>
          ))
        ) : (
          <p>No {isParentCategory ? 'subcategories' : 'products'} available.</p>
        )}
      </div>
    </div>
  )
}

export default SubcategoryPage
