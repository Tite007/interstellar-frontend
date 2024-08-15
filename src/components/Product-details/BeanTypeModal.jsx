// src/components/AboutModal.jsx
import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { ClipboardPenLine } from 'lucide-react'

export default function BeanTypeModal() {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <>
      <Button
        startContent={<ClipboardPenLine strokeWidth={1.5} />}
        onPress={openModal}
        className=" bg-yellow-200"
      >
        Bean Type
      </Button>
      <Modal isOpen={isOpen} size="lg" onOpenChange={setIsOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                What Is Geisha Coffee
              </ModalHeader>
              <ModalBody>
                <p>
                  The flavor profile of Geisha coffee is one aspect that
                  contributes to its renown. Geisha is known for its sweet
                  flavor and aroma of floral notes, jasmine, chocolate, honey,
                  and even black tea.
                </p>
                <p>
                  These sweet floral notes, and complex flavor profiles are some
                  of the many characteristics that Geisha coffee shares with
                  most other African coffees.
                </p>
                <p>
                  Gesha (Geisha) coffee grown within and outside Ethiopia is
                  noted for its outstanding aroma and flavour, with notes of
                  jasmine, black tea, and tropical fruit, and for profound
                  sweetness. For these reasons, Gesha (Geisha) coffee is
                  sought-after and usually commands a high price.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={closeModal}>
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
