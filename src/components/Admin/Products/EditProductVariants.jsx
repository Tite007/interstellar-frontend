// src/components/Admin/Products/EditProductVariants.jsx
import React, { useState, useEffect } from 'react'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import Dropzone from '@/src/components/Admin/Products/Dropzone'
import { toast } from 'sonner'
import Image from 'next/image'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const EditProductVariant = ({
  initialVariants = [],
  productId,
  onVariantsChange,
}) => {
  const [variants, setVariants] = useState(initialVariants)
  const [variantCounter, setVariantCounter] = useState(initialVariants.length)

  useEffect(() => {
    setVariants(initialVariants)
    setVariantCounter(initialVariants.length)
    console.log('Initial variants set:', initialVariants)
  }, [initialVariants])

  useEffect(() => {
    console.log('Variants state updated:', variants)
  }, [variants])

  const handleOptionChange = (variantIndex, optionIndex, field, value) => {
    const updatedVariants = variants.map((variant, vIdx) => {
      if (vIdx === variantIndex) {
        const updatedOptionValues = variant.optionValues.map((option, oIdx) => {
          if (oIdx === optionIndex) {
            const updatedOption = { ...option, [field]: value }
            if (field === 'price' || field === 'costPrice') {
              const price = Number(updatedOption.price) || 0
              const costPrice = Number(updatedOption.costPrice) || 0
              if (price && costPrice) {
                updatedOption.profit = price - costPrice
                updatedOption.margin =
                  ((updatedOption.profit / price) * 100).toFixed(2) + '%'
              }
            }
            return updatedOption
          }
          return option
        })
        return { ...variant, optionValues: updatedOptionValues }
      }
      return variant
    })
    setVariants(updatedVariants)
  }

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = variants.map((variant, variantIdx) => {
      if (index === variantIdx) {
        return { ...variant, [field]: value }
      }
      return variant
    })
    setVariants(updatedVariants)
  }

  const addVariant = () => {
    const newVariant = {
      optionName: `Option ${variantCounter + 1}`,
      optionValues: [
        {
          value: '',
          price: '',
          quantity: '',
          costPrice: '',
          profit: '',
          margin: '',
          compareAtPrice: '',
        },
      ],
      images: [],
    }
    setVariants((prevVariants) => [...prevVariants, newVariant])
    setVariantCounter(variantCounter + 1)
  }

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, variantIdx) => variantIdx !== index)
    setVariants(newVariants)
  }

  const handleImagesChange = (newImages, variantIndex) => {
    const updatedVariants = variants.map((variant, index) => {
      if (index === variantIndex) {
        return { ...variant, images: newImages }
      }
      return variant
    })
    setVariants(updatedVariants)
  }

  const handleDeleteImage = async (image, variantIndex) => {
    const imageUrl = typeof image === 'string' ? image : image.url
    if (!imageUrl) {
      console.error('Invalid image:', image)
      toast.error('Invalid image URL')
      return
    }

    if (!window.confirm('Are you sure you want to delete this image?')) return

    try {
      await fetch(`${API_BASE_URL}/delete-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: [imageUrl], productId }),
      })

      const updatedImages = variants[variantIndex].images.filter(
        (img) => img !== imageUrl,
      )
      const updatedVariants = [...variants]
      updatedVariants[variantIndex].images = updatedImages
      setVariants(updatedVariants)
      toast.success('Image deleted successfully!')
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Error deleting image')
    }
  }

  const handleDeleteVariant = async (variantId, variantIndex) => {
    if (!window.confirm('Are you sure you want to delete this variant?')) return

    try {
      const imagesToDelete = variants[variantIndex].images

      await fetch(`${API_BASE_URL}/delete-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: imagesToDelete, productId }),
      })

      const response = await fetch(
        `${API_BASE_URL}/products/deleteProductVariant/${productId}/${variantId}`,
        { method: 'DELETE' },
      )

      if (!response.ok) throw new Error('Failed to delete variant')

      const updatedVariants = variants.filter(
        (variant) => variant._id !== variantId,
      )
      setVariants(updatedVariants)
      if (onVariantsChange) {
        onVariantsChange(updatedVariants)
      }
      toast.success('Variant and associated images deleted successfully!')
    } catch (error) {
      console.error('Error deleting variant:', error)
      toast.error('Error deleting variant')
    }
  }

  const handleSaveVariant = async (variant, variantIndex) => {
    if (!productId) {
      toast.error('Product ID is missing. Cannot save variant.')
      return
    }

    const newImages = variant.images.filter((image) => image.file)
    const uploadedImages = []

    try {
      for (const image of newImages) {
        const formData = new FormData()
        formData.append('images', image.file)

        const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          const errorText = await uploadRes.text()
          throw new Error(`Failed to upload images: ${errorText}`)
        }

        const uploadedImage = await uploadRes.json()
        uploadedImages.push(uploadedImage[0].url)
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Error uploading images')
      return
    }

    const allImages = [
      ...variant.images.filter((image) => typeof image === 'string'),
      ...uploadedImages,
    ]

    const formattedVariant = {
      ...variant,
      images: allImages,
      optionValues: variant.optionValues.map((ov) => ({
        ...ov,
        price: Number(ov.price) || 0,
        quantity: Number(ov.quantity) || 0,
        costPrice: Number(ov.costPrice) || 0,
        profit: Number(ov.profit) || 0,
        compareAtPrice: Number(ov.compareAtPrice) || 0,
      })),
    }

    const url = formattedVariant._id
      ? `${API_BASE_URL}/products/updateProductVariant/${productId}/${formattedVariant._id}`
      : `${API_BASE_URL}/products/addProductVariant/${productId}`
    const method = formattedVariant._id ? 'PUT' : 'POST'

    try {
      console.log('Saving variant with payload:', formattedVariant)
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedVariant),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server response:', errorText)
        throw new Error(
          `Failed to ${method === 'POST' ? 'add' : 'update'} variant: ${errorText}`,
        )
      }

      const updatedVariantsData = await response.json()
      console.log('Server response data:', updatedVariantsData)

      const updatedVariants =
        method === 'POST'
          ? updatedVariantsData.variants // Expecting { message: "...", variants: [...] }
          : variants.map((v, idx) =>
              idx === variantIndex ? updatedVariantsData.variant : v,
            )

      setVariants(updatedVariants)
      if (onVariantsChange) {
        onVariantsChange(updatedVariants)
      }
      toast.success('Variant saved successfully!')
    } catch (error) {
      console.error('Error saving variant:', error)
      toast.error(error.message || 'Error saving variant')
    }
  }
  return (
    <>
      {variants.map((variant, index) => (
        <div key={index} className="gap-6">
          <div className="variant">
            <h1 className="col-span-1 md:col-span-3 mt-10 text-lg font-semibold text-gray-700">
              Option Value {index + 1}
            </h1>
            <Input
              isClearable={true}
              labelPlacement="outside"
              className="mb-4 pt-5 ml-2 w-full md:w-1/4"
              clearable
              bordered
              label="Option name"
              value={variant.optionName}
              onChange={(e) =>
                handleVariantChange(index, 'optionName', e.target.value)
              }
            />
            {variant.optionValues.map((value, valueIndex) => (
              <div
                key={valueIndex}
                className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 pr-4 pl-4 pt-5 pb-10"
              >
                <Input
                  labelPlacement="outside"
                  isClearable={true}
                  bordered
                  name="value"
                  type="text"
                  label="Option Value"
                  value={value.value}
                  onChange={(e) =>
                    handleOptionChange(
                      index,
                      valueIndex,
                      'value',
                      e.target.value,
                    )
                  }
                  className="col-span-1"
                />
                <Input
                  isRequired
                  clearable
                  labelPlacement="outside"
                  bordered
                  label="Price"
                  value={value.price}
                  placeholder="0.00"
                  name="price"
                  type="number"
                  onChange={(e) =>
                    handleOptionChange(
                      index,
                      valueIndex,
                      'price',
                      e.target.value,
                    )
                  }
                  className="col-span-1"
                />
                <Input
                  isRequired
                  clearable
                  value={value.quantity}
                  labelPlacement="outside"
                  bordered
                  label="Quantity"
                  name="quantity"
                  type="number"
                  onChange={(e) =>
                    handleOptionChange(
                      index,
                      valueIndex,
                      'quantity',
                      e.target.value,
                    )
                  }
                  className="col-span-1"
                />
                <Input
                  isRequired
                  clearable
                  label="Cost Price"
                  value={value.costPrice}
                  labelPlacement="outside"
                  bordered
                  name="costPrice"
                  type="number"
                  onChange={(e) =>
                    handleOptionChange(
                      index,
                      valueIndex,
                      'costPrice',
                      e.target.value,
                    )
                  }
                  className="col-span-1"
                />
                <Input
                  isRequired
                  clearable
                  label="Compare Price"
                  value={value.compareAtPrice}
                  labelPlacement="outside"
                  bordered
                  name="compareAtPrice"
                  type="number"
                  onChange={(e) =>
                    handleOptionChange(
                      index,
                      valueIndex,
                      'compareAtPrice',
                      e.target.value,
                    )
                  }
                  className="col-span-1"
                />
                <Input
                  isRequired
                  readOnly
                  label="Profit"
                  value={value.profit}
                  labelPlacement="outside"
                  bordered
                  name="profit"
                  type="number"
                  className="col-span-1"
                />
                <Input
                  isRequired
                  readOnly
                  label="Margin"
                  value={value.margin}
                  labelPlacement="outside"
                  bordered
                  name="margin"
                  type="text"
                  className="col-span-1"
                />
              </div>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white pr-4 pl-4 border rounded-2xl pt-5 pb-10">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload new product images
                </label>
                <Dropzone
                  images={variant.images}
                  setImages={(newImages) =>
                    handleImagesChange(newImages, index)
                  }
                />
              </div>
              <div className="files-preview">
                <h4>Uploaded Images</h4>
                <ul>
                  {Array.isArray(variant.images) &&
                    variant.images.map((image, imgIndex) => (
                      <li key={imgIndex} className="flex items-center mb-2">
                        <Image
                          src={typeof image === 'string' ? image : image.url}
                          alt={`Preview ${imgIndex}`}
                          className="w-24 h-24 object-cover mr-2"
                          width={96}
                          height={96}
                        />
                        <Button
                          auto
                          color="danger"
                          size="sm"
                          onClick={() => handleDeleteImage(image, index)}
                          className="ml-2"
                        >
                          Delete
                        </Button>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <Button
              size="sm"
              auto
              flat
              color="danger"
              onClick={() => removeVariant(index)}
              className="mt-4"
            >
              Remove Variant
            </Button>
            <Button
              size="sm"
              auto
              color="success"
              onClick={() => handleSaveVariant(variant, index)}
              className="mt-4 ml-4"
            >
              Save Variant
            </Button>
            {variant._id && (
              <Button
                size="sm"
                auto
                color="danger"
                onClick={() => handleDeleteVariant(variant._id, index)}
                className="mt-4 ml-4"
              >
                Delete Variant
              </Button>
            )}
          </div>
        </div>
      ))}
      <Button
        size="sm"
        color="primary"
        className="mt-5 mb-5"
        auto
        onClick={addVariant}
      >
        Add another option
      </Button>
    </>
  )
}

export default EditProductVariant
