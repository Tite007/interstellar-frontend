'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
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
import ProductDetailsSkeleton from '@/src/components/Product-details/ProductDetailsSkeleton'
import { getGrindLabel } from '@/src/utils/grindUtils'
import { Toaster, toast } from 'sonner'
import BreadcrumdsProduct from '@/src/components/Product-details/Breadcrumbs'
import ProductCarouselContainer from '@/src/components/Products/ProductCarouselContainer'
import { ReviewProvider } from '@/src/context/ReviewContext'
import ReviewSection from '@/src/components/Product-details/ReviewSection'
import ProductRating from '@/src/components/Product-details/ProductRating'
import { CartContext } from '@/src/context/CartContext'
import { Button } from '@nextui-org/button'
import NotifyMeModal from '@/src/components/Product-details/NotifyMeModal'
import { Bell } from 'lucide-react'

export default function MainProductDetails() {
  const searchParams = useSearchParams() // To extract query parameters
  const { addToCart } = useContext(CartContext)

  // State to store product data -GOOD TO GO
  const [product, setProduct] = useState(null)
  const [selectedQuantity, setSelectedQuantity] = useState('1')
  const [selectedGrind, setSelectedGrind] = useState('whole_bean')
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedDelivery, setSelectedDelivery] = useState('')
  const [price, setPrice] = useState(null)
  const [compareAtPrice, setCompareAtPrice] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [isOutOfStock, setIsOutOfStock] = useState(false)
  const [showNotifyModal, setShowNotifyModal] = useState(false)

  // Fetch product details by productId from query params
  useEffect(() => {
    const productId = searchParams.get('productId')
    if (productId) {
      fetchProductDetails(productId)
    } else {
      console.error('Product ID is missing from the URL')
    }
  }, [searchParams])

  // Fetch product details from API by productId
  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/findProduct/${productId}`,
      )
      const productData = response.data
      setProduct(productData)

      // Set defaults to the main product
      setSelectedPackage(productData.size)
      setPrice(productData.price)
      setCompareAtPrice(productData.compareAtPrice)
      setSelectedImages(productData.images)

      if (productData.currentStock === 0) {
        setIsOutOfStock(true)
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
    }
  }

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
      setPrice(variantOption.price || product.price)
      setCompareAtPrice(variantOption.compareAtPrice || product.compareAtPrice)
      setSelectedImages(selectedVariant.images || product.images)

      // Check if the selected variant is out of stock
      if (variantOption.quantity === 0) {
        setIsOutOfStock(true)
      } else {
        setIsOutOfStock(false)
      }
    } else {
      setPrice(product.price)
      setCompareAtPrice(product.compareAtPrice)
      setSelectedImages(product.images)

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

    // Create the base cart item
    const cartItem = {
      productId: product._id,
      variantId: variantOption ? variantOption._id : null,
      productImage: selectedVariant?.images?.[0] || product.images[0],
      productName: product.name,
      productVariant: selectedPackage,
      productPrice: price,
      compareAtPrice: compareAtPrice,
      quantity: parseInt(selectedQuantity, 10) || 1,
    }

    // Include grindType only if the product is a coffee-related product
    if (isCoffeeProduct) {
      cartItem.grindType = getGrindLabel(selectedGrind)
    }

    addToCart(cartItem)
    toast.success(`${product.name} ${selectedPackage} added to the cart!`)
  }

  const images = product.images || []

  // Determine if the product is coffee-related
  const isCoffeeProduct =
    product?.parentCategory === '670351ab96bf844ee6763504' || // ID for "Coffee"
    product?.subcategory === '67035c09407c1bf49bcf2720' // ID for "Specialty Coffee"

  return (
    <main className="container flex-col items-center justify-between mt-5 p-4">
      <BreadcrumdsProduct product={product} />
      <Toaster position="top-right" richColors />
      <div className="block md:hidden text-left mb-4">
        <p className="tex-lg font-semibold mt-1"> {product.brand}</p>

        <h1 className="text-xl mt-1 mb-1 font-semibold ">
          {product.name || 'N/A'}
        </h1>
        <ProductRating productId={product._id} />

        <h2 className="text-md font-semi-bold text-stone-500 mb-2">
          {product.technicalData?.tasteNotes || 'No taste notes available'}
        </h2>
        {isOutOfStock && (
          <div className="flex items-center space-x-3 mb-1">
            <p className="text-red-600 font-semibold">Out of Stock</p>
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onPress={() => setShowNotifyModal(true)}
              startContent={<Bell size={16} strokeWidth={1.75} />}
            >
              Notify Me
            </Button>
          </div>
        )}
        <p className="text-xl font-bold mb-4">
          ${price.toFixed(2)}
          {compareAtPrice && compareAtPrice > price && (
            <>
              <span className="text-gray-500 text-lg font-normal line-through ml-2">
                ${compareAtPrice.toFixed(2)}
              </span>
              <span className="text-red-500 text-lg font-normal ml-2">
                ({Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}
                % off)
              </span>
            </>
          )}
        </p>
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

        <div className="w-full md:w-1/2 md:ml-20 md:text-left">
          <div className="hidden md:block">
            <p className="tex-lg font-semibold mt-1"> {product.brand}</p>

            <h1 className="text-2xl mb-1 font-semibold ">
              {product.name || 'N/A'}
            </h1>
            <ProductRating productId={product._id} />
            <p className="text-md mt-1 font-semi-bold text-stone-600 mb-2">
              {product.technicalData?.tasteNotes || 'No taste notes available'}
            </p>
            {isOutOfStock && (
              <div className="flex items-center space-x-3 mb-1">
                <p className="text-red-600 font-semibold">Out of Stock</p>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onPress={() => setShowNotifyModal(true)}
                  startContent={<Bell size={16} strokeWidth={2.0} />}
                >
                  Notify Me
                </Button>
              </div>
            )}
            <NotifyMeModal
              isVisible={showNotifyModal}
              onClose={() => setShowNotifyModal(false)}
              productId={product?._id}
            />
            <p className="text-2xl font-bold mb-4">
              ${price.toFixed(2)}
              {compareAtPrice && compareAtPrice > price && (
                <>
                  <span className="text-gray-500 text-lg font-normal line-through ml-2">
                    ${compareAtPrice.toFixed(2)}
                  </span>
                  <span className="text-red-500 text-lg font-normal ml-2">
                    (
                    {Math.round(
                      ((compareAtPrice - price) / compareAtPrice) * 100,
                    )}{' '}
                    % off)
                  </span>
                </>
              )}
            </p>
          </div>
          <div>
            <h3 className="text-md font-semibold ">
              Which is the Best for You:
            </h3>
            <div className="grid grid-cols-2 gap-4">
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
          {isCoffeeProduct && (
            <div className="mt-4">
              <h3 className="font-semibold text-md">Grind Type:</h3>
              <GrindTypeSelect
                selectedGrind={selectedGrind}
                onGrindChange={(keys) => setSelectedGrind(keys.anchorKey)}
              />
              <p className="mt-2 text-sm">
                Grind Type: {getGrindLabel(selectedGrind)}
              </p>
            </div>
          )}

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
              className="mt-9 hidden md:block bg-tealGreen text-white"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock
                ? 'Out of Stock'
                : `Add ${selectedQuantity} Item(s) to Cart`}
            </Button>

            <Select
              label="Quantity"
              labelPlacement="outside-left"
              placeholder="Select quantity"
              variant="faded"
              selectedKeys={
                selectedQuantity ? new Set([selectedQuantity]) : undefined
              }
              onSelectionChange={(value) =>
                setSelectedQuantity(value.anchorKey)
              }
              className="max-w-xs   mt-4 hidden md:block"
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

      <div className="text-center mt-10 text-black rounded-lg">
        <h2 className="text-left mb-4 text-2xl font-semibold">Highlights</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AboutModal product={product} />
          <TechnicalDataModal product={product} />
          <HowToBrewModal />
          <BeanTypeModal />
        </div>

        <ReviewProvider productId={product._id}>
          <ReviewSection productId={product._id} />
        </ReviewProvider>
        <h2 className="text-2xl mt-16 font-bold">
          Brewed from the Heart of Volcanoes: Where Every Sip Tells a Story
        </h2>
        <p className="mt-2 font-light text-lg">
          {product.description || 'N/A'}
        </p>
      </div>

      <ImageCollage />

      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Similar Products</h2>
        <ProductCarouselContainer products={[]} options={{ loop: true }} />
      </div>

      <StickyAddToCartButton
        product={product}
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        handleAddToCart={handleAddToCart}
        isOutOfStock={isOutOfStock}
      />
    </main>
  )
}
