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

//URL working with the API :) 1
export default function SearchModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure() // Control modal state
  const [searchQuery, setSearchQuery] = useState('') // To hold the search input
  const [suggestions, setSuggestions] = useState([]) // To hold suggestions for autocomplete
  const [isLoading, setIsLoading] = useState(false) // To show loading state
  const [error, setError] = useState(null) // To hold any errors

  // Function to handle input change and fetch suggestions
  const handleInputChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 2) {
      fetchSuggestions(query) // Fetch suggestions when input length > 2
    } else {
      setSuggestions([]) // Clear suggestions when query is too short
    }
  }

  // Function to fetch suggestions for autocomplete
  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/searchProducts?name=${encodeURIComponent(query)}`,
      )
      const data = await response.json()

      // Combine product, category, and subcategory suggestions
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

      // Set suggestions with combined data
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

  // Function to handle selecting a suggestion
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      // Redirect to product page
      const productPath = `/categories/${suggestion.category.toLowerCase()}/${suggestion.subcategory.toLowerCase()}/${suggestion.name.toLowerCase()}?productId=${suggestion.id}`
      window.location.href = productPath
    } else if (suggestion.type === 'category') {
      // Redirect to category page
      const categoryPath = `/categories/${suggestion.name.toLowerCase()}`
      window.location.href = categoryPath
    } else if (suggestion.type === 'subcategory') {
      // Redirect to subcategory page
      const subcategoryPath = `/categories/${suggestion.category.toLowerCase()}/${suggestion.name.toLowerCase()}?subcategoryId=${suggestion.id}`
      window.location.href = subcategoryPath
    }
  }

  // Function to clear search and suggestions when modal closes
  const handleModalClose = (onClose) => {
    setSearchQuery('') // Clear the search input
    setSuggestions([]) // Clear the suggestions
    setError(null) // Clear any errors
    onClose() // Close the modal
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Search Products
              </ModalHeader>
              <ModalBody>
                {/* Search input */}
                <Input
                  clearable
                  fullWidth
                  placeholder="Search by name, brand, category..."
                  value={searchQuery}
                  onChange={handleInputChange}
                />

                {/* Autocomplete suggestions */}
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
