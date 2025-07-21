// src/contexts/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  parseToCalendarDate,
  formatDateForBackend,
} from '@/src/utils/dateUtils'

const ProductContext = createContext()

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const ProductProvider = ({ productId, children }) => {
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
      try {
        const response = await fetch(`${API_BASE_URL}/categories/categories`)
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setState((prev) => ({ ...prev, categories: data }))
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch product data for editing
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return // Skip if adding a new product
      try {
        console.log('Fetching product data for productId:', productId)
        const response = await fetch(
          `${API_BASE_URL}/products/findProduct/${productId}`,
        )
        if (!response.ok) throw new Error('Failed to fetch product data')
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
        console.error('Error fetching product data:', error)
      }
    }
    fetchProductData()
  }, [productId, initialProductState.technicalData])

  // Reset state for adding a new product
  const resetProduct = () => {
    setState((prev) => ({
      ...prev,
      product: initialProductState,
      images: [],
      variants: [],
      subcategories: [],
      selectedTaxCode: '',
    }))
  }

  const updateProduct = (updates) => {
    setState((prev) => ({
      ...prev,
      product: { ...prev.product, ...updates },
    }))
  }

  const updateImages = (images) => {
    setState((prev) => ({ ...prev, images }))
  }

  const updateSubcategories = (subcategories) => {
    setState((prev) => ({ ...prev, subcategories }))
  }

  const updateVariants = (variants) => {
    setState((prev) => ({ ...prev, variants }))
  }

  const updateSelectedTaxCode = (taxCode) => {
    setState((prev) => ({
      ...prev,
      product: { ...prev.product, taxCode: taxCode.stripeTaxCode },
      selectedTaxCode: `${taxCode.type} - ${taxCode.name}`,
    }))
  }

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
