'use client'
import React, { useState, useEffect } from 'react'
import { Input, Textarea } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { categories } from '@/src/components/Admin/Products/data'
import { Select, SelectItem } from '@nextui-org/select'
import { RadioGroup, Radio } from '@nextui-org/radio'
import { toast } from 'sonner'
import EditProductVariant from '@/src/components/Admin/Products/EditProductVariants'
import Dropzone from '@/src/components/Admin/Products/Dropzone'
import { useRouter } from 'next/navigation'
import { Tabs, Tab } from '@nextui-org/tabs'
import TechnicalDataForm from '@/src/components/Admin/Products/TechnicalDataForm'
import Image from 'next/image'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const ProductEditForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    sku: '',
    price: '',
    stock: '',
    size: '',
    images: [],
    costPrice: '',
    profit: '',
    margin: '',
    inventoryType: '',
    currentStock: '',
    lowStockLevel: '',
    subtitle: '',
    compareAtPrice: 0,
    seoTitle: '',
    roastLevel: '',
    seoDescription: '',
    seoKeywords: '',
  })

  const [inventoryType, setInventoryType] = useState('track')
  const [images, setImages] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchProductData = async (_id) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/products/findProduct/${_id}`,
        )
        if (!response.ok) throw new Error('Failed to fetch product')
        const data = await response.json()
        setProduct(data)

        const imageUrls = data.images.map((image) => ({ url: image }))
        setImages(imageUrls || [])
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    if (typeof window !== 'undefined') {
      const paths = window.location.pathname.split('/')
      const _id = paths[paths.length - 1]
      if (_id) {
        fetchProductData(_id)
      }
    }
  }, [])

  const handleInventoryTypeChange = (value) => {
    setInventoryType(value)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleClear = (fieldName) => {
    setProduct((prev) => ({ ...prev, [fieldName]: '' }))
  }

  const handleCategoryChange = (selectedKey) => {
    setProduct((prevState) => ({
      ...prevState,
      category: selectedKey.currentKey,
    }))
  }

  const handleDeleteImage = async (image) => {
    const imageUrl = typeof image === 'string' ? image : image.url
    if (!imageUrl) {
      console.error('Invalid image:', image)
      return
    }

    const userConfirmed = window.confirm(
      'Are you sure you want to delete this image?',
    )
    if (!userConfirmed) return

    try {
      await fetch(`${API_BASE_URL}/delete-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: [imageUrl], productId: product._id }),
      })

      const updatedImages = images.filter((img) => img.url !== imageUrl)
      setImages(updatedImages)
      setProduct((prevProduct) => ({
        ...prevProduct,
        images: updatedImages.map((img) => img.url),
      }))
      toast('Image deleted successfully!', {})
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const handleSave = async (status) => {
    try {
      console.log('Starting save process')

      // Prepare new images for uploading
      const newImages = images.filter((image) => image.file)
      const formData = new FormData()
      newImages.forEach((image) => {
        formData.append('images', image.file)
      })

      let uploadedImages = []
      if (newImages.length > 0) {
        console.log('Uploading product images')
        const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) throw new Error('Failed to upload images')
        uploadedImages = await uploadRes.json()
        console.log('Uploaded product images:', uploadedImages)
      }

      // Combine existing and newly uploaded images
      const allImages = [
        ...images.filter((image) => !image.file),
        ...uploadedImages.map((image) => ({ url: image.url })),
      ]

      console.log('All images:', allImages)

      // Fetch existing product data
      const existingProductRes = await fetch(
        `${API_BASE_URL}/products/findProduct/${product._id}`,
      )
      if (!existingProductRes.ok)
        throw new Error('Failed to fetch existing product')
      const existingProduct = await existingProductRes.json()

      const existingImages = existingProduct.images || []
      console.log('Existing images:', existingImages)

      // Determine images to delete
      const imagesToDelete = existingImages.filter(
        (existingImage) =>
          !allImages.some((newImage) => newImage.url === existingImage),
      )

      console.log('Images to delete:', imagesToDelete)

      if (imagesToDelete.length > 0) {
        console.log('Deleting old images')
        await fetch(`${API_BASE_URL}/delete-images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            images: imagesToDelete,
            productId: product._id,
          }),
        })
        console.log('Deleted old images:', imagesToDelete)
      }

      const payload = {
        ...product,
        images: allImages.map((image) => image.url),
      }

      console.log('Payload being sent:', JSON.stringify(payload, null, 2))

      const res = await fetch(
        `${API_BASE_URL}/products/updateProduct/${product._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      if (!res.ok) throw new Error('Failed to save product')
      toast('Product updated successfully!', {})
      router.push('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
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
      <h1 className=" col-span-3 text-lg font-semibold text-gray-700">
        Edit Product
      </h1>
      <Tabs aria-label="Product Edit Tabs">
        <Tab key="product" title="Product">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border bg-white pr-4 pl-4 rounded-2xl pt-10 pb-10">
            <Input
              labelPlacement="outside"
              isRequired
              isClearable={true}
              type="text"
              label="Name"
              name="name"
              value={product.name}
              onClear={() => handleClear('name')}
              onChange={handleChange}
            />

            <Input
              labelPlacement="outside"
              isRequired
              value={product.sku}
              isClearable={true}
              bordered
              label="SKU"
              name="sku"
              onChange={handleChange}
            />
            <Input
              labelPlacement="outside"
              clearable
              bordered
              label="Subtitle"
              name="subtitle"
              onChange={handleChange}
            />
            <Input
              labelPlacement="outside"
              clearable
              bordered
              value={product.size}
              label="Size"
              name="size" // Update this to match the state key
              onChange={handleChange}
            />
            <Input
              labelPlacement="outside"
              clearable
              bordered
              value={product.roastLevel}
              label="Roast Level"
              name="roastLevel" // Update this to match the state key
              onChange={handleChange}
            />
            <Select
              labelPlacement="outside"
              onSelectionChange={handleCategoryChange}
              placeholder="Select a category"
              selectedKeys={
                product.category ? new Set([product.category]) : new Set()
              }
            >
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>
            <Textarea
              isRequired
              isClearable={true}
              value={product.description}
              clearable
              bordered
              label="Description"
              name="description"
              onChange={handleChange}
              className="md:col-span-2"
            />
          </div>
          <div className="grid grid-cols-1 mt-5 md:grid-cols-2 gap-6 bg-white pr-4 pl-4 border rounded-2xl pt-5 pb-10">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Upload new product images
              </label>
              <Dropzone images={images} setImages={setImages} />
            </div>
            <div className="files-preview">
              <h4>Uploaded Images</h4>
              <ul>
                {images.map((image, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <Image
                      src={typeof image === 'string' ? image : image.url}
                      alt={`Preview ${index}`}
                      className="w-24 h-24 object-cover mr-2"
                      width={96}
                      height={96}
                    />
                    <Button
                      auto
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteImage(image)}
                      className="ml-2"
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-5 border bg-white pr-4 pl-4 rounded-2xl pt-5 pb-10">
            <h1 className="col-span-1 md:col-span-3 text-lg font-semibold text-gray-700">
              Price
            </h1>
            <Input
              labelPlacement="outside"
              isRequired
              isClearable={true}
              clearable
              value={product.price}
              bordered
              label="Price"
              name="price"
              type="number"
              onChange={handleChange}
            />
            <Input
              labelPlacement="outside"
              isClearable={true}
              bordered
              value={product.costPrice}
              label="Cost Price"
              name="costPrice"
              type="number"
              onChange={handleChange}
            />
            <Input
              labelPlacement="outside"
              isClearable={true}
              bordered
              value={product.compareAtPrice}
              label="Compare At Price"
              name="compareAtPrice"
              type="number"
              onChange={handleChange}
            />
            <Input
              labelPlacement="outside"
              readOnly
              value={product.margin}
              bordered
              label="Margin (%)"
              name="margin"
              type="text"
              onChange={handleChange}
            />
            <Input
              labelPlacement="outside"
              readOnly
              value={product.profit}
              bordered
              label="Profit"
              name="profit"
              type="number"
              onChange={handleChange}
            />
            <RadioGroup>
              <Radio className="mt-4" value="track">
                <p className="text-sm font-light">Charge tax for this item</p>
              </Radio>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border mt-5 bg-white pr-4 pl-4 rounded-2xl pt-5 pb-8">
            <h1 className="col-span-3 text-lg font-semibold text-gray-700">
              Inventory Tracking
            </h1>
            <RadioGroup
              label="Inventory Tracking"
              value={inventoryType}
              onChange={handleInventoryTypeChange}
            >
              <Radio value="track">Track inventory for this product</Radio>
              <Radio value="doNotTrack">
                Do not track inventory for this product
              </Radio>
            </RadioGroup>
            <div className="grid grid-cols-1 gap-6">
              <Input
                value={product.currentStock}
                clearable
                isClearable={true}
                bordered
                label="Current Stock"
                name="currentStock"
                type="number"
                onChange={handleChange}
              />
            </div>
          </div>
        </Tab>

        <Tab key="technicalData" title="Technical Data">
          <TechnicalDataForm productId={product._id} />
        </Tab>
        <Tab key="seo" title="SEO">
          <div className="grid grid-cols-1 gap-6 border bg-white pr-4 pl-4 rounded-2xl pt-5 pb-10">
            <h1 className="text-lg font-semibold text-gray-700">SEO Tags</h1>
            <Input
              clearable
              isClearable={true}
              labelPlacement="outside"
              bordered
              value={product.seoTitle}
              label="SEO Title"
              name="seoTitle"
              onChange={handleChange}
            />
            <Textarea
              clearable
              value={product.seoDescription}
              bordered
              label="SEO Description"
              name="seoDescription"
              onChange={handleChange}
            />
            <Input
              clearable
              bordered
              isClearable={true}
              value={product.seoKeywords}
              label="SEO Keywords"
              name="seoKeywords"
              onChange={handleChange}
            />
          </div>
        </Tab>
        <Tab key="variants" title="Variants">
          <div className="bg-white pr-4 pl-4 rounded-2xl pt-10 pb-10">
            <h1 className="col-span-3 text-lg font-semibold text-gray-700">
              Variants
            </h1>
            <EditProductVariant
              initialVariants={product.variants}
              productId={product._id}
            />
          </div>
        </Tab>
      </Tabs>

      <div className="flex justify-end space-x-4 mb-10 mt-6">
        <Button
          color="secondary"
          size="sm"
          className=" bg-indigo-500 hover:bg-gray-300 text-black"
        >
          Save as Draft
        </Button>
        <Button
          type="submit"
          size="sm"
          color="success"
          className=" hover:bg-green-600 "
        >
          Update Product
        </Button>
      </div>
    </form>
  )
}

export default ProductEditForm
