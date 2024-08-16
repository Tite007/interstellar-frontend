// src/components/Product-details/HowToBrewModal.jsx

import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/modal' // Ensure the correct path
import { Button } from '@nextui-org/button' // Ensure the correct path
import { Coffee, Weight, Filter, Beaker, Droplet } from 'lucide-react'
import Image from 'next/image'

export default function HowToBrewModal() {
  const [isOpen, setIsOpen] = useState(false)
  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <>
      <Button
        startContent={<Coffee strokeWidth={1.5} />}
        onPress={openModal}
        className=" bg-yellow-100"
        variant="flat"
      >
        How to Brew
      </Button>
      <Modal
        isOpen={isOpen}
        size="lg"
        scrollBehavior="inside"
        onOpenChange={setIsOpen}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              How to Brew
            </ModalHeader>
            <ModalBody>
              <p className="mb-4">
                We recommend starting with a 1:18 coffee-to-water ratio, which
                provides an excellent total extraction level and maximizes
                flavor pulled out of the bean. For our special selection coffees
                we recommend a pour over method either on a Chemex, V60 or
                Kalita Wave.
              </p>
              <hr className="my-4" />
              <h3 className="text-lg font-semibold mb-4">
                Recommended Method: Pour Over
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center">
                  <Coffee
                    size={32}
                    strokeWidth={1.5}
                    absoluteStrokeWidth
                    className="mr-6"
                  />
                  <div>
                    <p className="font-semibold">01. Boil Water</p>
                    <p className="font-light">205 - 212 F</p>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="flex items-center">
                  <Weight
                    size={32}
                    strokeWidth={1.5}
                    absoluteStrokeWidth
                    className="mr-6"
                  />
                  <div>
                    <p className="font-semibold">02. Weigh Coffee</p>
                    <p className="font-light">1g of coffee per 18g of water</p>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="flex items-center">
                  <Filter
                    size={32}
                    strokeWidth={1.5}
                    absoluteStrokeWidth
                    className="mr-6"
                  />
                  <div>
                    <p className="font-semibold">03. Drop in Filter</p>
                    <p className="font-light">Add filter to equipment</p>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="hand-coffee-grinder flex items-center">
                  <Image
                    src="/hand-coffee-grinder.svg"
                    alt="Hand Coffee Grinder"
                    className="mr-6"
                    width={42}
                    height={42}
                  />
                  <div>
                    <p className="font-semibold">04. Grind Coffee</p>
                    <p className="font-light">Grind coffee and add to filter</p>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="flex items-center">
                  <Droplet
                    size={32}
                    strokeWidth={1.5}
                    absoluteStrokeWidth
                    className="mr-6"
                  />
                  <div>
                    <p className="font-semibold">05. Add Water</p>
                    <p className="font-light">Add water in stages</p>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="flex items-center">
                  <Coffee
                    size={32}
                    strokeWidth={1.5}
                    absoluteStrokeWidth
                    className="mr-6"
                  />
                  <div>
                    <p className="font-semibold">06. Remove Filter</p>
                    <p className="font-light">Enjoy your coffee!</p>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  )
}
