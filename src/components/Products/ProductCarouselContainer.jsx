import React, { useEffect, useState } from 'react'
import axios from 'axios'
import EmblaCarouselProducts from '@/src/components/Products/EmblaCarouselProducts'
import '@/src/components/Products/CarouselStyle.css' // Import the CSS file

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const ProductCarouselContainer = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <div>Loading...</div> // Optionally, add a loading spinner here
  }

  return (
    <div>
      <EmblaCarouselProducts products={products} options={{ loop: true }} />
    </div>
  )
}

export default ProductCarouselContainer
