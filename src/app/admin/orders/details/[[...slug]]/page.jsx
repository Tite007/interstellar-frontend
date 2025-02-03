'use client'

import React, { useEffect, useState } from 'react'
import ContactInfoCardShipping from '@/src/components/Admin/Customers/ContactInfoCardShipping'
import { Button } from "@heroui/button"
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table"
import BreadcrumbsOrder from '@/src/components/Admin/Orders/BreadcrumbsOrder'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function OrderDetails() {
  const [order, setOrder] = useState(null)
  const [orderId, setOrderId] = useState('')
  const [userDetails, setUserDetails] = useState(null)
  const router = useRouter()

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

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

  if (!order || !userDetails) {
    return <div>Loading...</div>
  }

  return (
    <div className="xl:container">
      <div>
        <BreadcrumbsOrder />
        <h1 className="mt-7 mb-2 font-semibold text-2xl">
          Order # {order.orderNumber}{' '}
        </h1>

        <p>
          <strong>Total Price:</strong> ${order.totalPrice}
        </p>
        <p>
          {' '}
          <strong>Order Date:</strong> {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="flex gap-4 flex-col md:flex-row">
        <div className="flex-1">
          <div className="border mt-10 p-4 bg-white rounded-xl">
            <h2>Items in Order</h2>
            <Table shadow="none" aria-label="Items in Order">
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Quantity</TableColumn>
                <TableColumn>Price per item</TableColumn>
                <TableColumn>Total</TableColumn>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow
                    key={item._id}
                    className={index % 2 === 1 ? 'bg-gray-50' : ''}
                  >
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>${item.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 w-80 grid grid-cols-2 gap-3">
            <Button
              onClick={() =>
                router.push(`/admin/orders/fullfil-item/${order._id}`)
              }
              size="sm"
              className=" bg-lime-300"
            >
              Fulfil Item
            </Button>
          </div>
        </div>
        <div className="">
          <ContactInfoCardShipping user={userDetails} order={order} />
        </div>
      </div>
    </div>
  )
}
