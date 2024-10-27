// src/components/Product-details/NotifyMeModal.jsx
import React, { useState } from 'react'
import { Input } from '@nextui-org/input'
import axios from 'axios'
import { Button } from '@nextui-org/button'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/modal'

export default function NotifyMeModal({ isVisible, onClose, productId }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNotifyMe = async () => {
    if (!name || !email) return alert('Please fill out all fields')
    setLoading(true)

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/request`,
        {
          productId,
          name,
          email,
        },
      )
      alert('You will be notified when the product is back in stock.')
      onClose() // Close the modal after submission
    } catch (error) {
      console.error('Error submitting notify request:', error)
      alert('Failed to submit request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isVisible} onOpenChange={onClose}>
      <ModalContent>
        {(onCloseContent) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Notify Me When Available
            </ModalHeader>
            <ModalBody>
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={handleNotifyMe}
                isDisabled={loading}
              >
                {loading ? 'Submitting...' : 'Notify Me'}
              </Button>
              <Button color="danger" variant="light" onPress={onCloseContent}>
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
