// src/components/Product-details/NotifyMeModal.jsx
import React, { useState } from 'react'
import { Input } from "@heroui/input"
import axios from 'axios'
import { Button } from "@heroui/button"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal"
import { toast } from 'sonner' // Import toast from sonner

export default function NotifyMeModal({ isVisible, onClose, productId }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNotifyMe = async () => {
    if (!name || !email) {
      toast.error('Please fill out all fields') // Show error toast
      return
    }
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
      toast.success('You will be notified when the product is back in stock.') // Show success toast
      onClose() // Close the modal after submission
    } catch (error) {
      console.error('Error submitting notify request:', error)
      toast.error('Failed to submit request.') // Show error toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal placement="center" isOpen={isVisible} onOpenChange={onClose}>
      <ModalContent>
        {(onCloseContent) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Notify Me When Available
            </ModalHeader>
            <ModalBody>
              <Input
                label="Name"
                size="sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ fontSize: '16px' }}
              />
              <Input
                label="Email"
                type="email"
                size="sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ fontSize: '16px' }}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                size="sm"
                color="primary"
                onPress={handleNotifyMe}
                isDisabled={loading}
              >
                {loading ? 'Submitting...' : 'Notify Me'}
              </Button>
              <Button size="sm" color="danger" onPress={onCloseContent}>
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
