import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Search } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function SearchModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 2) {
      fetchSuggestions(query)
    } else {
      setSuggestions([])
    }
  }

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/searchProducts?name=${encodeURIComponent(query)}`,
      )
      const data = await response.json()

      const productSuggestions = data.products.map((product) => ({
        type: 'product',
        id: product._id,
        name: product.name,
        category: product.parentCategory?.name || '',
        subcategory: product.subcategory?.name || '',
      }))

      const categorySuggestions = data.categories.map((category) => ({
        type: 'category',
        id: category._id,
        name: category.name,
      }))

      const subcategorySuggestions = data.subcategories.map((subcategory) => ({
        type: 'subcategory',
        id: subcategory._id,
        name: subcategory.name,
        category: subcategory.parent?.name || '',
      }))

      setSuggestions([
        ...productSuggestions,
        ...categorySuggestions,
        ...subcategorySuggestions,
      ])
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setError('Error fetching suggestions. Please try again.')
    }
  }

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      const productPath = `/categories/${suggestion.category.toLowerCase()}/${suggestion.subcategory.toLowerCase()}/${suggestion.name.toLowerCase()}?productId=${suggestion.id}`
      window.location.href = productPath
    } else if (suggestion.type === 'category') {
      const categoryPath = `/categories/${suggestion.name.toLowerCase()}`
      window.location.href = categoryPath
    } else if (suggestion.type === 'subcategory') {
      const subcategoryPath = `/categories/${suggestion.category.toLowerCase()}/${suggestion.name.toLowerCase()}?subcategoryId=${suggestion.id}`
      window.location.href = subcategoryPath
    }
  }

  const handleModalClose = (onClose) => {
    setSearchQuery('')
    setSuggestions([])
    setError(null)
    onClose()
  }

  return (
    <>
      <Button
        onClick={onOpen}
        variant="flat"
        endContent={<Search />}
        color="primary"
      >
        Search Products...
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        placement="center" // Ensures the modal opens in the center of the screen
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Search Products
              </ModalHeader>
              <ModalBody>
                <Input
                  clearable
                  className="text-lg"
                  fullWidth
                  placeholder="Search by name, brand, category..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  style={{ fontSize: '16px' }} // Inline style to ensure 16px on all screen sizes
                />

                <ul className="suggestions-list">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.type === 'product' ? (
                        <>
                          <strong>{suggestion.name}</strong> -{' '}
                          {suggestion.category} &gt; {suggestion.subcategory}
                        </>
                      ) : suggestion.type === 'category' ? (
                        <strong>Category: {suggestion.name}</strong>
                      ) : (
                        <strong>Subcategory: {suggestion.name}</strong>
                      )}
                    </li>
                  ))}
                </ul>

                {error && <p className="text-red-500">{error}</p>}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => handleModalClose(onClose)}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
