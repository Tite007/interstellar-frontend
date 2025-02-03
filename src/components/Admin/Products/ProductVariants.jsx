// components/ProductVariant.js
import React, { useState } from 'react'
import { Input } from "@heroui/input"
import { Button } from "@heroui/button"

const ProductVariant = ({ onVariantsChange }) => {
  const [variants, setVariants] = useState([])

  const handleOptionChange = (variantIndex, optionIndex, field, value) => {
    const updatedVariants = variants.map((variant, vIdx) => {
      if (vIdx === variantIndex) {
        const updatedOptionValues = variant.optionValues.map((option, oIdx) => {
          if (oIdx === optionIndex) {
            return { ...option, [field]: value }
          }
          return option
        })
        return { ...variant, optionValues: updatedOptionValues }
      }
      return variant
    })
    setVariants(updatedVariants)
    onVariantsChange(updatedVariants)
  }

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = variants.map((variant, variantIdx) => {
      if (index === variantIdx) {
        return { ...variant, [field]: value }
      }
      return variant
    })
    setVariants(updatedVariants)
    onVariantsChange(updatedVariants)
  }

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        optionName: '',
        optionValues: [{ value: '', price: '', quantity: '' }],
      },
    ])
  }
  const removeVariant = (index) => {
    const newVariants = [...variants]
    newVariants.splice(index, 1)
    setVariants(newVariants)
    onVariantsChange(newVariants)
  }

  return (
    <>
      {variants.map((variant, index) => (
        <div key={index} className="gap-6 ">
          <div key={index} className="variant">
            <Input
              labelPlacement="outside"
              className="mb-4 mt-4 w-1/4"
              clearable
              bordered
              label="Option name"
              value={variant.optionName}
              onChange={(e) =>
                handleVariantChange(index, 'optionName', e.target.value)
              }
            />
            {/* Map through optionValues array */}
            <div className="overflow-x-auto ">
              {variant.optionValues.map((value, valueIndex) => (
                <table key={valueIndex} className="min-w-full mt-4 table-auto">
                  <thead>
                    <tr>
                      <th className="text-sm  text-left">Option Values</th>
                      <th className="text-sm px-4  text-left ">Price</th>
                      <th className="text-sm text-left">Available Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b ">
                      <td>
                        <Input
                          labelPlacement="outside"
                          clearable
                          bordered
                          name="value"
                          type="text"
                          label={`Value ${valueIndex + 1}`}
                          value={value.value}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              valueIndex,
                              'value',
                              e.target.value,
                            )
                          }
                          className="w-full mb-6 "
                        />
                      </td>
                      <td className="text-sm px-4  ">
                        <Input
                          isRequired
                          clearable
                          labelPlacement="outside"
                          bordered
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
                          className="w-full"
                        />
                      </td>
                      <td>
                        <Input
                          isRequired
                          clearable
                          value={value.quantity}
                          labelPlacement="outside"
                          bordered
                          name="availableQuantity"
                          type="number"
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              valueIndex,
                              'quantity',
                              e.target.value,
                            )
                          }
                          className="w-full"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              ))}
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
              className="ml-4"
              auto
              onClick={() =>
                handleVariantChange(index, 'optionValues', [
                  ...variant.optionValues,
                  '',
                ])
              }
            >
              Add another value
            </Button>
          </div>
        </div>
      ))}
      <Button size="sm" className="mt-4" auto onClick={addVariant}>
        Add another option
      </Button>
    </>
  )
}

export default ProductVariant
