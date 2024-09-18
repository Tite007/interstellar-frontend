'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@nextui-org/button'
import { useRouter } from 'next/navigation'
import { Input } from '@nextui-org/input'
import { Checkbox } from '@nextui-org/checkbox'
import { PDFDownloadLink } from '@react-pdf/renderer'
import MyDocument from '@/src/components/Admin/Orders/PDFPackingSlip'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table'
import ContactInfoCardShipping from '@/src/components/Admin/Customers/ContactInfoCardShipping'
import BreadcrumbsFullfill from '@/src/components/Admin/Orders/BreadcrumbsFullfil'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function Orderfullfill() {
  const [order, setOrder] = useState(null)
  const [orderId, setOrderId] = useState('')
  const [userDetails, setUserDetails] = useState(null)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('')
  const [sendEmailToCustomer, setSendEmailToCustomer] = useState(false) // Checkbox state to send email
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlSegments = window.location.pathname.split('/')
      const extractedOrderId = urlSegments[urlSegments.length - 1]
      setOrderId(extractedOrderId)
    }
  }, [])

  useEffect(() => {
    if (!orderId) return
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/orders/findOrder/${orderId}`,
        )
        const data = await response.json()
        setOrder(data)
        setTrackingNumber(data.trackingNumber || '')
        setCarrier(data.carrier || '')
        const userResponse = await fetch(
          `${API_BASE_URL}/auth/findUser/${data.user}`,
        )
        const userData = await userResponse.json()
        setUserDetails(userData)
      } catch (error) {
        console.error('Failed to fetch details:', error)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  // Function to update the tracking information
  const handleUpdateTrackingInfo = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/updateOrderTracking/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trackingNumber, carrier }),
        },
      )
      if (response.ok) {
        alert('Tracking information updated successfully')
        const updatedOrder = await response.json()
        setOrder(updatedOrder)
      } else {
        throw new Error('Failed to update tracking information')
      }
    } catch (error) {
      console.error('Error updating tracking information:', error)
      alert('Error updating tracking information')
    }
  }

  // Function to fulfill the order
  const handleFulfillment = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/updateOrderTracking/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trackingNumber, carrier }),
        },
      )
      if (response.ok) {
        alert('Order fulfilled successfully')
        setOrder((prevOrder) => ({
          ...prevOrder,
          trackingNumber,
          carrier,
          fulfillmentStatus: 'fulfilled',
        }))

        // If checkbox is selected, send email to the customer
        if (sendEmailToCustomer) {
          console.log('Send email checkbox is selected, triggering email...')
          await sendFulfillmentEmail()
        } else {
          console.log(
            'Send email checkbox is not selected, email will not be sent.',
          )
        }
      } else {
        throw new Error('Failed to fulfill order')
      }
    } catch (error) {
      console.error('Error fulfilling order:', error)
      alert('Error fulfilling order')
    }
  }

  // Function to trigger fulfillment email
  const sendFulfillmentEmail = async () => {
    try {
      console.log('Sending fulfillment email...')
      const emailResponse = await fetch(
        `${API_BASE_URL}/orders/sendFulfillmentEmail/${order._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userDetails, trackingNumber, carrier }), // Send the required data
        },
      )

      if (emailResponse.ok) {
        console.log('Fulfillment email sent successfully')
      } else {
        console.error('Failed to send fulfillment email')
      }
    } catch (error) {
      console.error('Error sending fulfillment email:', error)
    }
  }

  // Show a loading state while the order details are being fetched
  if (!order || !userDetails) {
    return <div>Loading...</div>
  }

  return (
    <div className="xl:container">
      <BreadcrumbsFullfill order={order} />

      <div className="grid grid-cols-2">
        <h1 className="mt-2 font-semibold text-2xl">
          Order # {order.orderNumber}
        </h1>
        <div className="flex justify-end items-end">
          <PDFDownloadLink
            document={<MyDocument order={order} userDetails={userDetails} />}
            fileName={`packing-slip-${order.orderNumber}.pdf`}
          >
            {({ blob, url, loading, error }) => (
              <Button size="sm" className="mt-7 w-52">
                {loading ? 'Preparing Document...' : 'Print Packing Slip'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="flex gap-4 flex-col md:flex-row">
        <div className="flex-1">
          <div className="border mt-10 p-4 bg-white rounded-xl">
            <h2 className="font-medium">Items in Order</h2>
            <Table shadow="none" aria-label="Items in Order">
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Quantity</TableColumn>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow
                    key={item._id}
                    className={index % 2 === 1 ? 'bg-gray-50' : ''}
                  >
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      {`${item.quantity} of ${item.totalQuantity || item.quantity}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-5 border-t-1 pt-4 font-medium">
              <h1>Tracking Information</h1>
            </div>
            <div className="mt-5 gap-3 grid grid-cols-2">
              <Input
                size="sm"
                isClearable
                type="tracking"
                label="Tracking Number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
              <Input
                size="sm"
                isClearable
                type="tracking"
                label="Carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
              />
            </div>
            <div className="mt-5 flex justify-end">
              <Button size="sm" onClick={handleUpdateTrackingInfo}>
                Update Tracking Info
              </Button>
            </div>
            <div className="flex-1 border-t-1 pt-4 mt-10">
              <h1 className="font-medium">Additional Information</h1>
              <Checkbox
                className="mt-1 font-light"
                isSelected={sendEmailToCustomer}
                onChange={setSendEmailToCustomer}
              >
                Send Shipment details to customer
              </Checkbox>
            </div>
          </div>
        </div>
        <div className="">
          <ContactInfoCardShipping user={userDetails} order={order} />
          <Button
            size="sm"
            className={`mt-4 w-52 ${
              order.fulfillmentStatus === 'fulfilled'
                ? 'bg-lime-300'
                : 'bg-lime-400'
            }`}
            onClick={handleFulfillment}
            disabled={order.fulfillmentStatus === 'fulfilled'}
          >
            {order.fulfillmentStatus === 'fulfilled'
              ? 'Fulfilled'
              : 'Fulfill Order'}
          </Button>
        </div>
      </div>
    </div>
  )
}
