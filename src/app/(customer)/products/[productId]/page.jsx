'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import EmblaCarousel from '@/src/components/Product-details/EmblaCarousel'
import EmblaCarouselDesktop from '@/src/components/Product-details/EmblaCarouselDesktop'
import DeliveryCheckbox from '@/src/components/Product-details/DeliveryCheckbox'
import CustomPackageCheckbox from '@/src/components/Product-details/CustomPackageCheckbox'
import StickyAddToCartButton from '@/src/components/Product-details/StickyAddToCartButton'
import AboutModal from '@/src/components/Product-details/AboutModal'
import TechnicalDataModal from '@/src/components/Product-details/TechnicalDataModal'
import HowToBrewModal from '@/src/components/Product-details/HowToBrewModal'
import BeanTypeModal from '@/src/components/Product-details/BeanTypeModal'
import ImageCollage from '@/src/components/Product-details/Collage'
import GrindTypeSelect from '@/src/components/Product-details/GridTypeSelect'
import { Select, SelectItem } from '@nextui-org/select'
import './embla.css' // Import the Embla Carousel CSS
import { Button } from '@nextui-org/button'
import { CartContext } from '@/src/context/CartContext'
import ProductDetailsSkeleton from '@/src/components/Product-details/ProductDetailsSkeleton'
import { getGrindLabel } from '@/src/utils/grindUtils' // Import the helper function
import { Toaster, toast } from 'sonner' // Import Sonner
import BreadcrumdsProduct from '@/src/components/Product-details/Breadcrumbs'
import ProductCarouselContainer from '@/src/components/Products/ProductCarouselContainer'
import { ReviewProvider } from '@/src/context/ReviewContext' // Import ReviewProvider
import ReviewSection from '@/src/components/Product-details/ReviewSection' // Import ReviewSection
import ProductRating from '@/src/components/Product-details/ProductRating'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ProductDetails({ params, products }) {
  const { productId } = params
  const [product, setProduct] = useState(null)
  const [selectedQuantity, setSelectedQuantity] = useState('1')
  const [selectedGrind, setSelectedGrind] = useState('whole_bean')
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedDelivery, setSelectedDelivery] = useState('')
  const [price, setPrice] = useState(null) // Define price state
  const { addToCart } = useContext(CartContext) // Get addToCart from context
  const [selectedImages, setSelectedImages] = useState([]) // New state for images
  const [isOutOfStock, setIsOutOfStock] = useState(false) // State to track out of stock status

  // Fetch product details
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/products/findProduct/${productId}`,
          )
          const productData = response.data
          setProduct(productData)

          // Set defaults to the main product
          setSelectedPackage(productData.size)
          setPrice(productData.price)
          setSelectedImages(productData.images) // Set initial images to main product images

          // Check if the parent product is out of stock
          if (productData.currentStock === 0) {
            setIsOutOfStock(true)
          }
        } catch (error) {
          console.error('Error fetching product details:', error)
        }
      }

      fetchProduct()
    }
  }, [productId])

  // Handle package change
  const handlePackageChange = (value) => {
    setSelectedPackage(value)

    const selectedVariant = product.variants.find((variant) =>
      variant.optionValues.some((option) => option.value === value),
    )

    if (selectedVariant) {
      const variantOption = selectedVariant.optionValues.find(
        (option) => option.value === value,
      )
      setPrice(variantOption.price)
      setSelectedImages(selectedVariant.images) // Update images based on the selected variant

      // Check if the selected variant is out of stock
      if (variantOption.quantity === 0) {
        setIsOutOfStock(true)
      } else {
        setIsOutOfStock(false)
      }
    } else {
      setPrice(product.price)
      setSelectedImages(product.images) // Revert to main product images if no variant selected

      // Check if the parent product is out of stock
      if (product.currentStock === 0) {
        setIsOutOfStock(true)
      } else {
        setIsOutOfStock(false)
      }
    }
  }

  // Handle quantity change
  const handleQuantityChange = (keys) => {
    setSelectedQuantity(keys.anchorKey)
  }

  // Handle grind change
  const handleGrindChange = (keys) => {
    setSelectedGrind(keys.anchorKey)
  }

  if (!product) {
    return (
      <div>
        <ProductDetailsSkeleton />
      </div>
    )
  }

  const handleAddToCart = () => {
    const selectedVariant = product.variants.find((variant) =>
      variant.optionValues.some((option) => option.value === selectedPackage),
    )

    const variantOption = selectedVariant?.optionValues.find(
      (option) => option.value === selectedPackage,
    )

    const cartItem = {
      productId: product._id,
      variantId: variantOption ? variantOption._id : null, // Capture variantId here
      productImage: selectedVariant?.images?.[0] || product.images[0], // Use the variant-specific image if available
      productName: product.name,
      productVariant: selectedPackage,
      productPrice: variantOption ? variantOption.price : product.price,
      quantity: parseInt(selectedQuantity, 10) || 1,
      grindType: getGrindLabel(selectedGrind),
    }

    console.log('Cart Item:', cartItem) // Ensure variantId is present

    addToCart(cartItem)
    toast.success(`${product.name} ${selectedPackage} added to the cart!`)
  }

  const images = product.images || []

  return (
    <main className="container flex-col items-center justify-between mt-5 p-4">
      <BreadcrumdsProduct product={product} />
      {/* Add the Toaster component here */}
      <Toaster position="top-right" richColors />
      <div className="block md:hidden text-left mb-4">
        {/* Include the ProductRating component */}
        <ProductRating productId={productId} />
        <h1 className="text-2xl mt-1 font-semibold ">
          {product.name || 'N/A'}
        </h1>
        <h2 className="text-md font-semi-bold text-stone-500 mb-2">
          {product.technicalData.tasteNotes || 'No taste notes available'}
        </h2>
        {isOutOfStock && (
          <p className="text-red-600 font-semibold mb-1">Out of Stock</p>
        )}
        <p className="text-2xl font-bold mb-4">${price}</p>{' '}
        {/* Display the dynamic price */}
      </div>
      <div className="flex flex-col mt-6 items-center md:flex-row md:items-start">
        <div className="w-full md:w-1/2">
          {images.length > 0 ? (
            <>
              <EmblaCarousel slides={selectedImages} options={{ loop: true }} />
              <EmblaCarouselDesktop slides={selectedImages} />
            </>
          ) : (
            <p>No images available</p>
          )}
        </div>
        {/* Desktop product details section */}
        <div className="w-full md:w-1/2 md:ml-20 md:text-left">
          <div className="hidden md:block">
            <h1 className="text-2xl mb-1 font-semibold ">
              {product.name || 'N/A'}
            </h1>
            {/* Include the ProductRating component */}
            <ProductRating productId={productId} />
            <p className="text-md mt-1 font-semi-bold text-stone-600 mb-2">
              {product.technicalData.tasteNotes || 'No taste notes available'}
            </p>
            {isOutOfStock && (
              <p className="text-red-600 font-semibold mb-1">Out of Stock</p>
            )}
            <p className="text-2xl font-bold mb-4">${price}</p>{' '}
            {/* Display the dynamic price */}
          </div>

          <div>
            <h3 className="text-md font-semibold ">
              Which is the Best for You:
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Include the main product as the first option */}
              <CustomPackageCheckbox
                key="main-product"
                title={product.size}
                weight={product.size}
                value={product.size}
                selectedValue={selectedPackage}
                onChange={handlePackageChange}
              />
              {product.variants.map((variant) => (
                <CustomPackageCheckbox
                  key={variant._id}
                  title={variant.optionValues[0]?.value || 'N/A'}
                  weight={variant.optionValues[0]?.value || 'N/A'}
                  value={variant.optionValues[0]?.value || 'N/A'}
                  selectedValue={selectedPackage}
                  onChange={handlePackageChange}
                />
              ))}
            </div>
            <p className="text-sm mt-2">
              Selected Package: {selectedPackage || 'N/A'}
            </p>
          </div>

          <h3 className=" mt-4 font-semibold text-md ">Grind Type:</h3>
          <GrindTypeSelect
            selectedGrind={selectedGrind} // Pass selectedGrind state
            onGrindChange={handleGrindChange}
          />
          <p className="mt-2 text-sm">
            Grind Type: {getGrindLabel(selectedGrind)}{' '}
            {/* Convert to human-readable format */}
          </p>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-4">
              Choose Your Delivery Option:
            </h3>
            <DeliveryCheckbox
              options={[{ label: 'Standard Delivery', value: 'standard' }]}
              selectedOption={selectedDelivery || 'N/A'}
              onChange={setSelectedDelivery}
            />
            <p className="mt-2 text-sm">
              Selected Delivery: {selectedDelivery || 'N/A'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 ">
            <Button
              size="md"
              color="danger"
              className="mt-9 hidden md:block text-white"
              onClick={handleAddToCart}
              disabled={isOutOfStock} // Disable button if out of stock
            >
              {isOutOfStock
                ? 'Out of Stock'
                : `Add ${selectedQuantity ? selectedQuantity : ''} Item to Cart`}
            </Button>
            <Select
              label="Quantity"
              labelPlacement="outside-left"
              color="danger"
              size=""
              variant="flat"
              placeholder="Select quantity"
              selectedKeys={
                selectedQuantity ? new Set([selectedQuantity]) : undefined
              }
              onSelectionChange={handleQuantityChange}
              className="max-w-xs mt-4 hidden md:block"
            >
              {[1, 2, 3, 4, 5].map((quantity) => (
                <SelectItem
                  key={quantity}
                  value={String(quantity)}
                  textValue={String(quantity)}
                >
                  {quantity}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className="text-center  mt-10 text-black rounded-lg">
        <h2 className="text-left mb-4 text-2xl font-semibold">Highlights</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AboutModal product={product} />
          <TechnicalDataModal product={product} />
          <HowToBrewModal />
          <BeanTypeModal />
        </div>
        {/* Add the ReviewSection below the product details */}
        <ReviewProvider productId={productId}>
          <ReviewSection productId={productId} />
        </ReviewProvider>
        <h2 className="text-2xl mt-16 font-bold">
          Brewed from the Heart of Volcanoes: Where Every Sip Tells a Story
        </h2>
        <p className="mt-2 font-light text-lg">
          {product.description || 'N/A'}
        </p>
      </div>
      <ImageCollage />
      {/* Similar Products Carousel */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Similar Products</h2>

        <ProductCarouselContainer
          products={products}
          options={{ loop: true }}
        />
      </div>
      <StickyAddToCartButton
        product={product}
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        handleAddToCart={handleAddToCart}
        disabled={isOutOfStock} // Disable sticky button if out of stock
      />{' '}
    </main>
  )
}
