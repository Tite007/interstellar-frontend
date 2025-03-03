// src/components/Admin/Products/ProductAddForm.jsx
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
import SEOForm from './SEOForm'
import VariantsSection from './VariantsSection'
import TechnicalDataFormAdd from './TechnicalDataFormAdd'
import { useEffect } from 'react'

const ProductAddFormContent = () => {
  const {
    product,
    images,
    variants,
    updateProduct,
    updateImages,
    updateVariants,
    resetProduct,
  } = useProduct()
  const router = useRouter()

  useEffect(() => {
    resetProduct()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()

    try {
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
        if (!uploadRes.ok) throw new Error('Failed to upload images')
        uploadedImages = await uploadRes.json()
      }

      const allImages = [
        ...images.filter((image) => !image.file),
        ...uploadedImages.map((image) => ({ url: image.url })),
      ]
      const payload = {
        ...product,
        price: Number(product.price) || 0,
        costPrice: Number(product.costPrice) || 0,
        compareAtPrice: Number(product.compareAtPrice) || 0,
        profit: Number(product.profit) || 0,
        currentStock: Number(product.currentStock) || 0,
        images: allImages.map((image) => image.url),
        variants: variants.length > 0 ? variants : null,
        expirationDate: product.expirationDate
          ? formatDateForBackend(product.expirationDate)
          : null,
        // Only include taxCode if it's a valid value (not empty string)
        ...(product.taxCode && product.taxCode !== ''
          ? { taxCode: product.taxCode }
          : {}),
      }

      console.log('Payload being sent to /products/addProduct:', payload)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/addProduct`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )

      if (!res.ok) {
        const errorData = await res.json()
        console.error('Server response:', errorData)
        throw new Error(
          `Failed to save product: ${errorData.message || res.statusText}`,
        )
      }

      toast('Product created successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error(error.message || 'Failed to save product!')
    }
  }

  return (
    <form onSubmit={handleSave} className="xl:container space-y-5">
      <Tabs className="overflow-x-auto w-full" aria-label="Product Add Tabs">
        <Tab key="product" title="Product">
          <ProductDetailsForm />
          <ImageManager />
        </Tab>
        <Tab key="technical" title="Technical Data">
          <TechnicalDataFormAdd />
        </Tab>
        <Tab key="price" title="Price & Inventory">
          <PriceAndInventoryForm />
        </Tab>
        <Tab key="seo" title="SEO">
          <SEOForm />
        </Tab>
        <Tab key="variants" title="Variants">
          <VariantsSection />
        </Tab>
      </Tabs>
      <div className="flex justify-end space-x-4 mt-6">
        <Button
          size="sm"
          color="secondary"
          className="bg-gray-200 hover:bg-gray-300 shadow-md text-black"
        >
          Save as Draft
        </Button>
        <Button
          size="sm"
          type="submit"
          color="primary"
          className="bg-green-500 shadow-md hover:bg-green-600 text-black"
        >
          Create Product
        </Button>
      </div>
    </form>
  )
}

const ProductAddForm = () => {
  return (
    <ProductProvider productId={null}>
      <ProductAddFormContent />
    </ProductProvider>
  )
}

export default ProductAddForm
