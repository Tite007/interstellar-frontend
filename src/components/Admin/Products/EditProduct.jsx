// src/components/Admin/Products/ProductEditForm.jsx
'use client'
import { Tabs, Tab } from '@heroui/tabs'
import { Button } from '@heroui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ProductProvider, useProduct } from '@/src/context/ProductContext'
import { formatDateForBackend } from '@/src/utils/dateUtils'
import ProductDetailsForm from './ProductDetailsForm'
import ImageManager from './ImageManager'
import PriceAndInventoryForm from './PriceAndInventoryForm'
import SEOForm from '@/src/components/Admin/Products/SEOForm'
import VariantsSection from './VariantsSection'
import TechnicalDataForm from '@/src/components/Admin/Products/TechnicalDataForm'
import { useState, useEffect } from 'react'

const ProductEditFormContent = () => {
  const { product, images, updateProduct } = useProduct()
  const router = useRouter()

  const handleSave = async (status) => {
    const newImages = images.filter((image) => image.file)
    const formImageData = new FormData()
    newImages.forEach((image) => formImageData.append('images', image.file))

    let uploadedImages = []
    if (newImages.length > 0) {
      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`,
        {
          method: 'POST',
          body: formImageData,
        },
      )
      uploadedImages = await uploadRes.json()
    }

    const allImages = [
      ...images.filter((image) => !image.file),
      ...uploadedImages.map((image) => ({ url: image.url })),
    ]
    const payload = {
      ...product,
      images: allImages.map((image) => image.url),
      expirationDate: formatDateForBackend(product.expirationDate),
      taxCode: product.taxCode || null,
      technicalData: product.technicalData,
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/updateProduct/${product._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )

      if (!res.ok) throw new Error('Failed to update product')
      toast('Product updated successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Failed to update product!')
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSave('published')
      }}
      className="space-y-6 xl:container"
    >
      <Tabs aria-label="Product Edit Tabs">
        <Tab key="product" title="Product">
          <ProductDetailsForm />
          <ImageManager />
          <PriceAndInventoryForm />
        </Tab>
        <Tab key="technicalData" title="Technical Data">
          <TechnicalDataForm />
        </Tab>
        <Tab key="seo" title="SEO">
          <SEOForm />
        </Tab>
        <Tab key="variants" title="Variants">
          <VariantsSection />
        </Tab>
      </Tabs>
      <div className="flex justify-end space-x-4 mb-10 mt-6">
        <Button color="secondary" size="sm" onPress={() => handleSave('draft')}>
          Save as Draft
        </Button>
        <Button type="submit" size="sm" color="success">
          Update Product
        </Button>
      </div>
    </form>
  )
}

const ProductEditForm = () => {
  const router = useRouter()
  const [productId, setProductId] = useState(null)

  useEffect(() => {
    // Use window.location.pathname as fallback on initial render
    const initialId =
      typeof window !== 'undefined'
        ? window.location.pathname.split('/').pop()
        : null
    setProductId(initialId)

    // Update productId on client-side navigation
    if (router.isReady) {
      const idFromRouter = router.asPath.split('/').pop()
      console.log('Router is ready. Product ID from router:', idFromRouter)
      console.log('Current path:', router.asPath)
      if (idFromRouter !== productId) {
        setProductId(idFromRouter)
      }
    }
  }, [router.isReady, router.asPath, productId])

  console.log('Product ID:', productId)

  return (
    <ProductProvider productId={productId}>
      <ProductEditFormContent />
    </ProductProvider>
  )
}

export default ProductEditForm
