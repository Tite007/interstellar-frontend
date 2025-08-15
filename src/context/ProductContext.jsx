// src/contexts/ProductContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import {
  parseToCalendarDate,
  formatDateForBackend,
} from '@/src/utils/dateUtils'

const ProductContext = createContext()

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Debug API configuration
if (typeof window !== 'undefined') {
  console.log('ProductContext - API_BASE_URL:', API_BASE_URL)
  if (!API_BASE_URL) {
    console.error('NEXT_PUBLIC_API_BASE_URL is not defined!')
  }
}

// Move initialProductState outside the component to prevent recreation
const initialProductState = {
  name: '',
  description: '',
  parentCategory: '',
  subcategory: '',
  sku: '',
  price: '',
  costPrice: '',
  compareAtPrice: 0,
  profit: '',
  margin: '',
  stock: '',
  size: '',
  images: [],
  inventoryType: 'track',
  currentStock: '',
  lowStockLevel: '',
  subtitle: '',
  seoTitle: '',
  roastLevel: '',
  seoDescription: '',
  seoKeywords: '',
  brand: '',
  taxCode: '',
  expirationDate: null,
  technicalData: {
    country: '',
    region: '',
    producer: '',
    elevationRange: '',
    dryingMethod: '',
    processingMethod: '',
    tasteNotes: '',
  },
}

export const ProductProvider = ({ productId, children }) => {
  const [state, setState] = useState({
    product: initialProductState,
    categories: [],
    subcategories: [],
    images: [],
    selectedTaxCode: '',
    variants: [],
  })

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const controller = new AbortController()
      let timeoutId

      try {
        timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        console.log(
          'Fetching categories from:',
          `${API_BASE_URL}/categories/categories`,
        )

        const response = await fetch(`${API_BASE_URL}/categories/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Fetched categories:', data.length, 'categories')
        setState((prev) => ({ ...prev, categories: data }))
      } catch (error) {
        if (timeoutId) clearTimeout(timeoutId)
        console.error('Error fetching categories:', error)
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)

        if (error.name === 'AbortError') {
          console.error('Categories request was aborted due to timeout')
        } else if (
          error.name === 'TypeError' &&
          error.message === 'Failed to fetch'
        ) {
          console.error(
            'Network error fetching categories - possibly CORS or server unavailable',
          )
          console.error('Check if API server is running on:', API_BASE_URL)
        }
      }
    }
    fetchCategories()
  }, [])

  // Fetch product data for editing
  useEffect(() => {
    const fetchProductData = async (retryCount = 0) => {
      if (!productId) return // Skip if adding a new product

      const maxRetries = 3
      const controller = new AbortController()
      let timeoutId

      try {
        timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        console.log(
          `Fetching product data for productId: ${productId} (attempt ${retryCount + 1}/${maxRetries + 1})`,
        )
        console.log('API_BASE_URL:', API_BASE_URL)
        console.log(
          'Full URL:',
          `${API_BASE_URL}/products/findProduct/${productId}`,
        )

        const response = await fetch(
          `${API_BASE_URL}/products/findProduct/${productId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          },
        )

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Fetched product data:', data)

        const imageUrls = Array.isArray(data.images)
          ? data.images.map((image) => ({ url: image }))
          : []

        const technicalData =
          data.technicalData || initialProductState.technicalData

        setState((prev) => ({
          ...prev,
          product: {
            ...data,
            expirationDate: parseToCalendarDate(data.expirationDate),
            technicalData,
          },
          images: imageUrls,
          variants: data.variants || [],
        }))

        if (data.parentCategory) {
          const subcategoryResponse = await fetch(
            `${API_BASE_URL}/categories/categories?parent=${data.parentCategory}`,
          )
          if (!subcategoryResponse.ok)
            throw new Error('Failed to fetch subcategories')
          const subcategoryData = await subcategoryResponse.json()
          setState((prev) => ({ ...prev, subcategories: subcategoryData }))
        }
      } catch (error) {
        if (timeoutId) clearTimeout(timeoutId)
        console.error(
          `Error fetching product data (attempt ${retryCount + 1}):`,
          error,
        )
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)

        // Add specific error handling for different types of errors
        if (error.name === 'AbortError') {
          console.error('Request was aborted due to timeout')
        } else if (
          error.name === 'TypeError' &&
          error.message === 'Failed to fetch'
        ) {
          console.error('Network error - possibly CORS or server unavailable')
          console.error('Check if API server is running on:', API_BASE_URL)
        }

        // Retry logic for network errors
        if (
          retryCount < maxRetries &&
          (error.name === 'TypeError' || error.name === 'AbortError')
        ) {
          console.log(`Retrying in ${(retryCount + 1) * 1000}ms...`)
          setTimeout(
            () => {
              fetchProductData(retryCount + 1)
            },
            (retryCount + 1) * 1000,
          ) // Exponential backoff: 1s, 2s, 3s
        } else {
          console.error(
            'Max retries reached or non-recoverable error. Giving up.',
          )
        }
      }
    }
    fetchProductData()
  }, [productId]) // Remove initialProductState.technicalData dependency

  // Reset state for adding a new product
  const resetProduct = useCallback(() => {
    setState((prev) => ({
      ...prev,
      product: initialProductState,
      images: [],
      variants: [],
      subcategories: [],
      selectedTaxCode: '',
    }))
  }, [])

  const updateProduct = useCallback((updates) => {
    setState((prev) => ({
      ...prev,
      product: { ...prev.product, ...updates },
    }))
  }, [])

  const updateImages = useCallback((images) => {
    setState((prev) => ({ ...prev, images }))
  }, [])

  const updateSubcategories = useCallback((subcategories) => {
    setState((prev) => ({ ...prev, subcategories }))
  }, [])

  const updateVariants = useCallback((variants) => {
    setState((prev) => ({ ...prev, variants }))
  }, [])

  const updateSelectedTaxCode = useCallback((taxCode) => {
    setState((prev) => ({
      ...prev,
      product: { ...prev.product, taxCode: taxCode.stripeTaxCode },
      selectedTaxCode: `${taxCode.type} - ${taxCode.name}`,
    }))
  }, [])

  return (
    <ProductContext.Provider
      value={{
        ...state,
        updateProduct,
        updateImages,
        updateSubcategories,
        updateVariants,
        updateSelectedTaxCode,
        resetProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProduct = () => useContext(ProductContext)
