'use client'

import React, { useState } from 'react'
import { Input } from '@nextui-org/input'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/modal'
import { Select, SelectItem } from '@nextui-org/select'
import { toast } from 'sonner'
import { Button } from '@nextui-org/button'

const SignUpFormModal = ({ onSubmit }) => {
  const [user, setUser] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    birthMonth: '',
    birthDay: '',
  })
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(user)
  }

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Sign Up</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-6 border bg-white p-4 rounded-2xl">
                    <Input
                      size="sm"
                      clearable
                      bordered
                      label="Name"
                      name="name"
                      onChange={handleChange}
                    />
                    <Input
                      size="sm"
                      clearable
                      bordered
                      label="Last Name"
                      name="lastName"
                      onChange={handleChange}
                    />
                    <Input
                      size="sm"
                      clearable
                      bordered
                      label="Email"
                      name="email"
                      onChange={handleChange}
                    />
                    <Input
                      size="sm"
                      clearable
                      bordered
                      label="Phone"
                      name="phone"
                      onChange={handleChange}
                    />
                    <Input
                      size="sm"
                      clearable
                      bordered
                      label="Create Password"
                      name="password"
                      type="password"
                      onChange={handleChange}
                    />
                  </div>
                  <h1 className="text-lg font-semibold text-gray-700">
                    Birthday
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border bg-white p-4 rounded-2xl">
                    <Select
                      size="sm"
                      clearable
                      bordered
                      label="Select Month"
                      onChange={(value) =>
                        handleSelectChange('birthMonth', value)
                      }
                    >
                      {Array.from({ length: 12 }, (_, index) => (
                        <SelectItem key={index + 1} value={index + 1}>
                          {new Date(0, index).toLocaleString('default', {
                            month: 'long',
                          })}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      size="sm"
                      clearable
                      bordered
                      label="Select Day"
                      onChange={(value) =>
                        handleSelectChange('birthDay', value)
                      }
                    >
                      {Array.from({ length: 31 }, (_, index) => (
                        <SelectItem key={index + 1} value={index + 1}>
                          {index + 1}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" type="submit" onPress={onClose}>
                      Submit
                    </Button>
                  </ModalFooter>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default SignUpFormModal
