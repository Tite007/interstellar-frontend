import React, { useState, useEffect } from 'react'
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
import { Search, SquareArrowOutUpLeft } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const TaxCodeSearchModal = ({ onSelectTaxCode }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAllTaxCodes()
  }, [])

  const fetchAllTaxCodes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/taxCodes/all`)
      const data = await response.json()
      setSuggestions(Array.isArray(data.taxCodes) ? data.taxCodes : [])
    } catch (error) {
      console.error('Error fetching tax codes:', error)
      setError('Error loading tax codes. Please try again.')
      setSuggestions([])
    }
  }

  const handleInputChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.length > 2) fetchSuggestions(query)
    else fetchAllTaxCodes()
  }

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/taxCodes/searchTaxCodes?name=${encodeURIComponent(query)}`,
      )
      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error('Error fetching tax code suggestions:', error)
      setError('Error fetching suggestions. Please try again.')
    }
  }

  const handleSuggestionClick = (taxCode) => {
    onSelectTaxCode(taxCode) // Pass the entire taxCode object
    handleModalClose()
  }

  const handleModalClose = () => {
    setSearchQuery('')
    fetchAllTaxCodes()
    setError(null)
    onOpenChange(false)
  }

  return (
    <>
      <Button
        onClick={onOpen}
        variant="flat"
        endContent={<Search />}
        color="primary"
      >
        Search Tax Codes...
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Search Tax Codes
          </ModalHeader>
          <ModalBody>
            <Input
              clearable
              className="text-lg"
              fullWidth
              placeholder="Search by tax code type or name..."
              value={searchQuery}
              onChange={handleInputChange}
              style={{ fontSize: '16px' }}
            />
            <ul className="suggestions-list">
              <h1 className="mb-4 text-lg font-semibold mt-2">Suggestions</h1>
              {suggestions.map((taxCode) => (
                <li
                  key={taxCode._id}
                  className="suggestion-item mb-2 cursor-pointer hover:bg-blue-200 rounded-lg p-2 border-b-1 flex justify-between items-center"
                  onClick={() => handleSuggestionClick(taxCode)}
                >
                  <div>
                    <strong>{taxCode.type}</strong> - {taxCode.name}
                    <p className="text-sm text-gray-600">
                      {taxCode.description}
                    </p>
                  </div>
                  <SquareArrowOutUpLeft strokeWidth={1.5} />
                </li>
              ))}
            </ul>
            {error && <p className="text-red-500">{error}</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={handleModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default TaxCodeSearchModal
