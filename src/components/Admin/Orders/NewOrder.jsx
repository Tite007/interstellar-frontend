'use client'

import React from 'react'
import { Input, Textarea } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Checkbox } from '@nextui-org/checkbox'
import { Select, SelectItem, SelectSection } from '@nextui-org/select'

export default function OrdersPage() {
  return (
    <div className=" p-6 bg-white rounded-lg shadow">
      <div className="flex items-center mb-6">
        <ArrowLeftIcon className="text-gray-500 mr-2" />
        <h1 className="text-xl font-semibold">Create order</h1>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Products</h2>
            <div className="flex space-x-2 mb-4">
              <Input placeholder="Search products" />
              <Button variant="outline">Browse</Button>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Finca San Rosa</p>
                <p className="text-sm text-gray-500">$24.00</p>
              </div>
              <div className="flex items-center space-x-4">
                <Input className="w-16" type="number" value="1" />
                <p className="font-medium">$24.00</p>
                <TrashIcon className="text-gray-500" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-medium mb-2">Payment</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>1 item</p>
                <p>$24.00</p>
              </div>
              <div className="flex justify-between">
                <p>Add discount</p>
                <p>—</p>
              </div>
              <div className="flex justify-between">
                <p>Add shipping or delivery</p>
                <p>—</p>
              </div>
              <div className="flex justify-between">
                <p>Estimated tax</p>
                <p>Not calculated</p>
              </div>
              <div className="flex justify-between font-medium">
                <p>Total</p>
                <p>$24.00</p>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <Checkbox id="payment-later" />
              <label className="ml-2" htmlFor="payment-later">
                Payment due later
              </label>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Send invoice</Button>
            <Button>Collect payment</Button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded">
            <h2 className="flex justify-between items-center text-lg font-medium mb-2">
              Notes
              <PencilIcon className="text-gray-500" />
            </h2>
            <Textarea placeholder="No notes" />
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <h2 className="text-lg font-medium mb-2">Customer</h2>
            <Input placeholder="Search or create a customer" />
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <h2 className="flex justify-between items-center text-lg font-medium mb-2">
              Market
              <PencilIcon className="text-gray-500" />
            </h2>
            <p className="mb-2">Pricing</p>
            <Select>
              <SelectItem id="pricing">
                <SelectItem placeholder="Canada (CAD $)" />
              </SelectItem>
              <SelectSection position="popper">
                <SelectItem value="cad">Canada (CAD $)</SelectItem>
                <SelectItem value="usd">USA (USD $)</SelectItem>
              </SelectSection>
            </Select>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <h2 className="flex justify-between items-center text-lg font-medium mb-2">
              Tags
              <PencilIcon className="text-gray-500" />
            </h2>
            <Input placeholder="Add tags" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

function PencilIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  )
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}
