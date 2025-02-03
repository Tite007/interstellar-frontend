// src/components/TechnicalDataModal.jsx
import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal"
import { Button } from "@heroui/button"
import { FlaskConical, Mountain, Compass, Tractor, Factory } from 'lucide-react'

export default function TechnicalDataModal({ product }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <>
      <Button
        startContent={<FlaskConical strokeWidth={1.5} />}
        onPress={openModal}
        className=" bg-fc6c74 text-white "
        variant="flat"
      >
        Technical Data
      </Button>
      <Modal isOpen={isOpen} size="lg" onOpenChange={setIsOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Technical Data
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center mt-4">
                  <div className="flex-shrink-0">
                    <Tractor
                      size={32}
                      strokeWidth={1.5}
                      absoluteStrokeWidth
                      className="mr-6"
                    />
                  </div>
                  <span>Producer:{''} </span>
                  <p className="flex-grow font-light">
                    {product.technicalData.producer || 'N/A'}
                  </p>
                </div>
                <hr className="my-4" />
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Compass
                      size={32}
                      strokeWidth={1.5}
                      absoluteStrokeWidth
                      className="mr-6"
                    />
                  </div>
                  <p className="flex-grow font-light">
                    {product.technicalData.region || 'N/A'}
                    {product.technicalData.country
                      ? `, ${product.technicalData.country}`
                      : ''}
                  </p>
                </div>
                <hr className="my-4" />
                <div className="flex font-light items-center">
                  <Mountain
                    size={32}
                    strokeWidth={1.5}
                    absoluteStrokeWidth
                    className="mr-6"
                  />
                  {product.technicalData.elevationRange || 'N/A'}
                </div>
                <hr className="my-4" />
                <div className="flex items-center ">
                  <div className="flex-shrink-0">
                    <FlaskConical
                      size={32}
                      strokeWidth={1.5}
                      absoluteStrokeWidth
                      className="mr-6"
                    />
                  </div>
                  <p className="flex-grow font-light">
                    {product.technicalData.tasteNotes || 'N/A'}
                  </p>
                </div>
                <hr className="my-4" />

                <div className=" flex gap-3 font-light items-center ">
                  <Factory size={32} strokeWidth={1.5} absoluteStrokeWidth />
                  <span>Drying Method: </span>
                  {product.technicalData.dryingMethod || 'N/A'}
                </div>
                <hr className="my-4" />
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
