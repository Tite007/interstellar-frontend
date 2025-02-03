'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@heroui/button"
import { useRouter } from 'next/navigation' // Import useRouter
import { Input } from "@heroui/input"
import { Trash2 } from 'lucide-react'
import { CheckBox } from "@heroui/checkbox"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal"
import { Search } from 'lucide-react'
import { CornerDownRight } from 'lucide-react'

export default function SearchProducts(props) {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProducts, setSelectedProducts] = useState([])
  const router = useRouter()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  // Fetch products data from API
  // Fetch products data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/getAllProducts`,
        )
        const data = await response.json()
        setProducts(data)
        console.log('Product', data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }

    fetchProducts()
  }, [])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Adjusted function to handle product selection
  const handleSelectProductOrVariant = (
    item,
    isVariant = false,
    productId = null,
  ) => {
    // Ensure matching against the `_id` field of the product
    const product = products.find(
      (p) => p._id === (isVariant ? productId : item.id),
    )

    if (!product) {
      console.error('Product not found')
      return // Early return to avoid further execution if product is not found
    }

    // Determine the item name based on whether it's a variant or not
    const itemName = isVariant ? `${product.name} - ${item.value}` : item.name

    const itemToAdd = {
      ...item,
      name: itemName, // Use the determined item name
      isVariant,
      productId: isVariant ? productId : item.id,
      quantity: 1,
      total: item.price,
    }

    setSelectedProducts([...selectedProducts, itemToAdd])
  }

  const handleSelectProduct = (product) => {
    const productToAdd = {
      ...product,
      quantity: 1,
      total: product.price,
    }
    setSelectedProducts([...selectedProducts, productToAdd])
  }

  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts(
      selectedProducts.map((product) =>
        product._id === productId // Use _id for comparison if that's your unique identifier
          ? { ...product, quantity, total: product.price * quantity }
          : product,
      ),
    )
  }

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product._id !== productId), // Use _id for comparison
    )
  }

  const filteredProducts = searchTerm
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  // Calculate subtotal of selected products
  const subtotal = selectedProducts.reduce((acc, current) => {
    return acc + current.price * current.quantity
  }, 0)

  useEffect(() => {
    // Call the function passed through props with the updated selected products
    props.onSelectedProductsChange(selectedProducts)
  }, [selectedProducts, props]) // Make sure to include props in the dependency array

  return (
    <div className="border bg-white shadow-sm w-full   rounded-xl mt-10 p-5">
      <h2 className="font-simibold mb-4">Search Product</h2>
      {/* Search Box */}
      <Button
        className="w-full border bg-gray-100"
        placeholder="Type to search..."
        label="Search"
        variant="flat"
        onPress={onOpen}
        startContent={<Search strokeWidth={1.5} absoluteStrokeWidth />}
      >
        Search Product...
      </Button>
      <Modal
        scrollBehavior="inside"
        size="2xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Listed Product
              </ModalHeader>
              <ModalBody>
                <Input
                  value={searchTerm}
                  onChange={handleSearchChange}
                  label="Search for a product"
                  size="sm"
                  isClearable={true}
                />
                {/* Display product Porudct */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Stock
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y rounded-lg divide-gray-200">
                      {filteredProducts.map((product) => (
                        <React.Fragment key={product._id}>
                          <tr
                            onClick={() => handleSelectProduct(product)}
                            className="cursor-pointer hover:text-blue-700"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm  hover:text-blue-700 font-medium text-gray-900">
                              {product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.currentStock} in stock
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${product.price}
                            </td>
                          </tr>
                          {product.variants.map((variant, variantIndex) =>
                            variant.optionValues.map(
                              (optionValue, valueIndex) => (
                                <tr
                                  key={`${product._id}-${variantIndex}-${valueIndex}`}
                                  onClick={() =>
                                    handleSelectProductOrVariant(
                                      optionValue,
                                      true,
                                      product._id,
                                    )
                                  }
                                  className="bg-gray-50 hover:text-blue-700 cursor-pointer"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap  hover:text-blue-700 text-sm text-gray-500">
                                    <p>
                                      {`${product.name} - ${optionValue.value}`}
                                    </p>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {optionValue.quantity}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${optionValue.price}
                                  </td>
                                </tr>
                              ),
                            ),
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  {/* Display subtotal */}
                </div>

                <ModalFooter>
                  <Button size="sm" color="danger" onPress={onClose}>
                    Close
                  </Button>
                  <Button size="sm" color="primary" onPress={onClose}>
                    Add Product
                  </Button>
                </ModalFooter>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Display selected products and their quantity and total price */}
      <div>
        <table className="w-full mt-10 font-light ">
          <thead>
            <tr className="">
              <th className="text-left  w-64">Product</th>
              <th className="text-left">Price</th>
              <th className="text-left">Quantity</th>
              <th className="text-left">Total</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>
          {selectedProducts.map((product) => (
            <tbody className=" border-b-1" key={product._id}>
              <tr className=" mb-5">
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <Input
                    size="sm"
                    className="w-16"
                    type="number"
                    value={product.quantity}
                    min="1"
                    onChange={(e) =>
                      handleQuantityChange(
                        product._id,
                        parseInt(e.target.value, 10),
                      )
                    }
                  />
                </td>
                <td>${(product.price * product.quantity).toFixed(2)}</td>
                <td className=" justify-center">
                  <Button
                    size="sm"
                    isIconOnly
                    color="danger"
                    variant="light"
                    onClick={() => handleRemoveProduct(product._id)}
                  >
                    <Trash2 strokeWidth={1.5} absoluteStrokeWidth />
                  </Button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
        <div className="mt-4">
          <h3 className="  font-semibold">
            Order Subtotal: ${subtotal.toFixed(2)}
          </h3>
        </div>
      </div>
    </div>
  )
}
