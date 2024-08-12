'use client'

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

export default function Payment({
  subtotal,
  onShippingInfoChange,
  onTaxInfoChange,
  onUpdateTotal = () => {}, // Provide a default no-op function
}) {
  const [total, setTotal] = useState(subtotal)
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false)
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false)
  const [shippingDetails, setShippingDetails] = useState({
    carrierName: '',
    shippingCost: 0,
  })
  const [taxDetails, setTaxDetails] = useState({
    taxName: '',
    taxPercentage: 0,
  })

  useEffect(() => {
    const shippingCost = parseFloat(shippingDetails.shippingCost || 0)
    const taxAmount = parseFloat(
      (
        (subtotal + shippingCost) *
        (parseFloat(taxDetails.taxPercentage || 0) / 100)
      ).toFixed(2),
    )
    const finalTotal = parseFloat(
      (subtotal + shippingCost + taxAmount).toFixed(2),
    )
    setTotal(finalTotal)
    onUpdateTotal(finalTotal) // This is now safe even if the prop isn't passed
  }, [subtotal, shippingDetails, taxDetails, onUpdateTotal]) // Dependency array

  // When adding shipping
  const handleShippingSubmit = () => {
    onShippingInfoChange(shippingDetails) // This should trigger the parent's state update
    setIsShippingModalOpen(false) // Close modal after submission
  }

  // When adding tax
  const handleTaxSubmit = () => {
    onTaxInfoChange(taxDetails) // This should trigger the parent's state update
    setIsTaxModalOpen(false) // Close modal after submission
  }

  return (
    <div className="border bg-white mt-4 rounded-lg p-4">
      <h1 className="font-medium mb-4">Payment</h1>
      <div className="grid mb-2 grid-cols-3 gap-2">
        <p>Order Subtotal:</p>
        <p></p>
        <p>${subtotal.toFixed(2)}</p>
      </div>

      {shippingDetails.carrierName && (
        <div className="grid mb-2 grid-cols-3 gap-2">
          <p>Shipping ({shippingDetails.carrierName}):</p>
          <p></p>
          <p>${shippingDetails.shippingCost}</p>
        </div>
      )}

      {taxDetails.taxName && (
        <div className="grid grid-cols-3 gap-2">
          <p>{taxDetails.taxName}:</p>
          <p></p>
          <p>{taxDetails.taxPercentage}%</p>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        <p>Total:</p>
        <p>Items</p>
        <p>${total.toFixed(2)}</p>
      </div>
      <Button
        size="sm"
        className="mt-4 mb-4 mr-3"
        variant="flat"
        onPress={() => setIsShippingModalOpen(true)}
      >
        Add Shipping
      </Button>
      <Modal
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Shipping Options</ModalHeader>
          <ModalBody>
            <Input
              clearable
              label="Carrier Name"
              placeholder="Enter carrier name"
              value={shippingDetails.carrierName}
              onChange={(e) =>
                setShippingDetails((prev) => ({
                  ...prev,
                  carrierName: e.target.value,
                }))
              }
            />
            <Input
              clearable
              type="number"
              label="Shipping Cost"
              placeholder="0.00"
              value={shippingDetails.shippingCost}
              onChange={(e) =>
                setShippingDetails((prev) => ({
                  ...prev,
                  shippingCost: e.target.value,
                }))
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onPress={() => setIsShippingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onPress={() => handleShippingSubmit(shippingDetails)}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Button size="sm" variant="flat" onPress={() => setIsTaxModalOpen(true)}>
        Add Tax
      </Button>
      <Modal isOpen={isTaxModalOpen} onClose={() => setIsTaxModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Tax Details</ModalHeader>
          <ModalBody>
            <Input
              clearable
              label="Tax Name"
              placeholder="Enter tax name"
              value={taxDetails.taxName}
              onChange={(e) =>
                setTaxDetails((prev) => ({ ...prev, taxName: e.target.value }))
              }
            />
            <Input
              clearable
              type="number"
              label="Tax Percentage"
              placeholder="0"
              value={taxDetails.taxPercentage}
              onChange={(e) =>
                setTaxDetails((prev) => ({
                  ...prev,
                  taxPercentage: e.target.value,
                }))
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              color="error"
              onPress={() => setIsTaxModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onPress={() => handleTaxSubmit(taxDetails)}>Add</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
