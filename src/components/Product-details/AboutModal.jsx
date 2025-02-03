// src/components/AboutModal.jsx
import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal"
import { Button } from "@heroui/button"
import { CircleUser } from 'lucide-react'

export default function AboutModal({ product }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <>
      <Button
        startContent={<CircleUser strokeWidth={1.5} />}
        onPress={openModal}
        className=" bg-fc6c74 text-white"
        variant="flat"
      >
        About
      </Button>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">About</ModalHeader>
              <ModalBody>
                <p>
                  {product?.description ||
                    'This product does not have a description.'}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-DCF230"
                  variant="flat"
                  onPress={closeModal}
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
