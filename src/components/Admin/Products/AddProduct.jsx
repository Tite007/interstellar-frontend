'use client'
import React, { useState, useEffect } from 'react'
import { Input, Textarea } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Select, SelectItem } from '@nextui-org/select'
import { RadioGroup, Radio } from '@nextui-org/radio'
import { toast } from 'sonner'
import EditProductVariant from '@/src/components/Admin/Products/EditProductVariants'
import Dropzone from '@/src/components/Admin/Products/Dropzone'
import { useRouter } from 'next/navigation'
import { Tabs, Tab } from '@nextui-org/tabs'
import TechnicalDataFormAdd from './TechnicalDataFormAdd'
import Image from 'next/image'
import { DatePicker } from '@nextui-org/date-picker'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const ProductAddForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    parentCategory: '', // Parent category
    subcategory: '', // Subcategory
    sku: '',
    price: '',
    stock: '',
    size: '',
    images: [],
    costPrice: '',
    profit: '',
    margin: '',
    inventoryType: 'track',
    currentStock: '',
    lowStockLevel: '',
    subtitle: '',
    compareAtPrice: 0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    roastLevel: '',
    technicalData: {
      country: '',
      region: '',
      producer: '',
      elevationRange: '',
      dryingMethod: '',
      processingMethod: '',
      tasteNotes: '',
    },
    brand: '', // New state field for brand
    expirationDate: null, // New state field for expiration date (CalendarDate)
  })

  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [inventoryType, setInventoryType] = useState('track')
  const [images, setImages] = useState([])
  const [variants, setVariants] = useState([])

  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/categories`)
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleInventoryTypeChange = (value) => {
    setInventoryType(value)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let newFields = { [name]: value }

    if (name === 'price' || name === 'costPrice') {
      const updatedPrice = name === 'price' ? value : product.price
      const updatedCostPrice = name === 'costPrice' ? value : product.costPrice
      const newProfit = calculateProfit(updatedPrice, updatedCostPrice)
      const newMargin = calculateMargin(updatedPrice, newProfit)

      newFields.profit = newProfit.toString()
      newFields.margin = `${newMargin.toFixed(2)}%`
    }

    setProduct((prev) => ({
      ...prev,
      ...newFields,
    }))
  }

  const handleTechnicalDataChange = (name, value) => {
    setProduct((prev) => ({
      ...prev,
      technicalData: {
        ...prev.technicalData,
        [name]: value,
      },
    }))
  }

  const handleParentCategoryChange = async (selectedKey) => {
    setProduct((prevState) => ({
      ...prevState,
      parentCategory: selectedKey.currentKey,
      subcategory: '',
    }))

    try {
      const response = await fetch(
        `${API_BASE_URL}/categories/categories?parent=${selectedKey.currentKey}`,
      )
      const data = await response.json()
      setSubcategories(data)
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }

  const handleSubcategoryChange = (selectedKey) => {
    setProduct((prevState) => ({
      ...prevState,
      subcategory: selectedKey.currentKey,
    }))
  }

  const handleVariantsChange = (newVariants) => {
    setVariants(newVariants)
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

  const calculateProfit = (price, costPrice) => {
    return Number(price) - Number(costPrice)
  }

  const calculateMargin = (price, profit) => {
    if (price > 0) {
      const marginPercentage = (profit / Number(price)) * 100
      return marginPercentage
    }
    return 0
  }

  const handleDateChange = (date) => {
    setProduct((prev) => ({
      ...prev,
      expirationDate: date,
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()

    try {
      const newImages = images.filter((image) => image.file)
      const formImageData = new FormData()
      newImages.forEach((image) => {
        formImageData.append('images', image.file)
      })

      let uploadedImages = []
      if (newImages.length > 0) {
        const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: formImageData,
        })

        if (!uploadRes.ok) throw new Error('Failed to upload images')
        uploadedImages = await uploadRes.json()
      }

      const allImages = [
        ...images.filter((image) => !image.file),
        ...uploadedImages.map((image) => ({ url: image.url })),
      ]

      const formData = {
        ...product,
        images: allImages.map((image) => image.url),
        variants,
        expirationDate: product.expirationDate
          ? product.expirationDate.toString() // Convert to string for backend
          : null,
      }

      const res = await fetch(`${API_BASE_URL}/products/addProduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to save product')
      toast('Product created successfully!', {})
      router.push('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  return (
    <form onSubmit={handleSave} className=" xl:container space-y-5">
      <Tabs className="overflow-x-auto w-full" aria-label="Product Add Tabs">
        <Tab key="product" title="Product">
          <div className="grid grid-cols-1 md:grid-cols-2 shadow-md gap-6 border bg-white pr-4 pl-4 rounded-2xl pt-10 pb-10">
            <Input
              isRequired
              labelPlacement="outside"
              clearable
              bordered
              label="Name"
              name="name"
              onChange={handleChange}
              value={product.name}
              style={{ fontSize: '16px' }}
            />
            <Input
              labelPlacement="outside"
              isRequired
              clearable
              bordered
              label="SKU"
              name="sku"
              onChange={handleChange}
              value={product.sku}
              style={{ fontSize: '16px' }}
            />
            <Input
              labelPlacement="outside"
              clearable
              bordered
              label="Subtitle"
              name="subtitle"
              onChange={handleChange}
              value={product.subtitle}
              style={{ fontSize: '16px' }}
            />
            <Input
              labelPlacement="outside"
              clearable
              bordered
              label="Size"
              name="size"
              onChange={handleChange}
              className="col-span-1"
              value={product.size}
              style={{ fontSize: '16px' }}
            />
            <Input
              labelPlacement="outside"
              clearable
              bordered
              label="Roast Level"
              name="roastLevel"
              onChange={handleChange}
              className="col-span-1"
              value={product.roastLevel}
              style={{ fontSize: '16px' }}
            />
            <Input
              labelPlacement="outside"
              clearable
              bordered
              label="Brand"
              name="brand"
              onChange={handleChange}
              className="col-span-1"
              value={product.brand}
              style={{ fontSize: '16px' }}
            />
            <Select
              labelPlacement="outside"
              onSelectionChange={handleParentCategoryChange}
              placeholder="Select a category"
              selectedKeys={
                product.parentCategory
                  ? new Set([product.parentCategory])
                  : new Set()
              }
            >
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              labelPlacement="outside"
              onSelectionChange={handleSubcategoryChange}
              placeholder="Select a subcategory"
              selectedKeys={
                product.subcategory ? new Set([product.subcategory]) : new Set()
              }
              isDisabled={!product.parentCategory}
            >
              {subcategories.map((subcategory) => (
                <SelectItem key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </Select>
            <DatePicker
              label="Expiration Date"
              className="max-w-[284px]"
              value={product.expirationDate}
              onChange={handleDateChange}
              placeholder="Select expiration date"
            />
            <Textarea
              isRequired
              clearable
              bordered
              label="Description"
              name="description"
              onChange={handleChange}
              className="col-span-1"
              value={product.description}
              style={{ fontSize: '16px' }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white pr-4 pl-4 mt-4 border shadow-md rounded-2xl pt-5 pb-10">
            <div className="col-span-1">
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
                      width={100}
                      height={100}
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
        </Tab>
        <Tab key="technical" title="Technical Data">
          <TechnicalDataFormAdd
            technicalData={product.technicalData}
            handleTechnicalDataChange={handleTechnicalDataChange}
          />
        </Tab>
        <Tab key="price" title="Price">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border bg-white pr-4 pl-4 shadow-md rounded-2xl pt-5 pb-10">
            <h1 className="col-span-2 text-lg font-semibold text-gray-700">
              Price
            </h1>
            <Input
              labelPlacement="outside"
              isRequired
              clearable
              bordered
              label="Price"
              name="price"
              placeholder="0.00"
              type="number"
              onChange={handleChange}
              value={product.price}
              style={{ fontSize: '16px' }}
            />
            <Input
              clearable
              bordered
              labelPlacement="outside"
              placeholder="0.00"
              label="Cost Per Item"
              name="costPrice"
              type="number"
              onChange={handleChange}
              value={product.costPrice}
              style={{ fontSize: '16px' }}
            />
            <Input
              labelPlacement="outside"
              clearable
              bordered
              label="Compare At Price"
              name="compareAtPrice"
              type="number"
              onChange={handleChange}
              className="col-span-1"
              value={product.compareAtPrice}
              style={{ fontSize: '16px' }}
            />
            <Input
              labelPlacement="outside"
              readOnly
              bordered
              label="Margin (%)"
              name="margin"
              type="text"
              value={product.margin}
              className="col-span-1"
              style={{ fontSize: '16px' }}
            />
            <Input
              labelPlacement="outside"
              readOnly
              bordered
              label="Profit"
              name="profit"
              type="number"
              value={product.profit}
              className="col-span-1"
              style={{ fontSize: '16px' }}
            />
            <RadioGroup>
              <Radio className="mt-4" value="track">
                <p className="text-sm font-light">Charge tax for this item</p>
              </Radio>
            </RadioGroup>
          </div>
        </Tab>
        <Tab key="inventory" title="Inventory">
          <div className="grid grid-cols-2 gap-6 border bg-white pr-4 pl-4 rounded-2xl pt-5 pb-10">
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
              <Radio value="trackByOptions">Track inventory by options</Radio>
            </RadioGroup>
            <div className="grid grid-cols-1 gap-6">
              <Input
                clearable
                isRequired
                labelPlacement="outside"
                bordered
                label="Current Stock"
                name="currentStock"
                type="number"
                onChange={handleChange}
                className="col-span-1"
                value={product.currentStock}
              />
            </div>
          </div>
        </Tab>

        <Tab key="seo" title="SEO">
          <div className="grid grid-cols-1 gap-6 border shadow-md bg-white pr-4 pl-4 rounded-2xl pt-5 pb-10">
            <h1 className="text-lg font-semibold text-gray-700">SEO Tags</h1>
            <Input
              clearable
              labelPlacement="outside"
              bordered
              label="SEO Title"
              name="seoTitle"
              onChange={handleChange}
              value={product.seoTitle}
              style={{ fontSize: '16px' }}
            />
            <Textarea
              clearable
              bordered
              label="SEO Description"
              name="seoDescription"
              onChange={handleChange}
              value={product.seoDescription}
              style={{ fontSize: '16px' }}
            />
            <Input
              clearable
              bordered
              labelPlacement="outside"
              label="SEO Keywords"
              name="seoKeywords"
              onChange={handleChange}
              value={product.seoKeywords}
              style={{ fontSize: '16px' }}
            />
          </div>
        </Tab>
        <Tab key="variants" title="Variants">
          <div className="bg-white pr-4 pl-4 rounded-2xl shadow-md pt-10 pb-10">
            <h1 className="col-span-3 text-lg font-semibold text-gray-700">
              Variants
            </h1>
            <EditProductVariant
              initialVariants={variants}
              productId={product._id}
              onVariantsChange={handleVariantsChange}
            />
          </div>
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

export default ProductAddForm
