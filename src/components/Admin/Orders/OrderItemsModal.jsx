'use client'

import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal'
import { Button } from '@heroui/button'

export default function OrderItemsModal({
  isOpen,
  onOpenChange,
  items,
  formatAmount,
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Order Items
            </ModalHeader>
            <ModalBody>
              {items.map((item) => (
                <div key={item._id} className="border-b py-2">
                  <p>
                    <strong>Name:</strong> {item.name || 'N/A'}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity || 0}
                  </p>
                  <p>
                    <strong>Total:</strong> {formatAmount(item.total)}
                  </p>
                </div>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
