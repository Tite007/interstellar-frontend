'use client'

import React, { useState, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table'
import { Button } from '@nextui-org/button'
import { Pagination } from '@nextui-org/pagination'
import { useRouter } from 'next/navigation'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/src/components/ui/HoverCard'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner' // Import the toast

const orderColumns = [
  { name: 'Order #', uid: 'orderNumber' },
  { name: 'User', uid: 'user.name' },
  { name: 'Date Created', uid: 'createdAt' },
  { name: 'Items', uid: 'items' },
  { name: 'Total', uid: 'totalPrice' },
  { name: 'Payment Status', uid: 'paymentStatus' },
  { name: 'Fulfillment status', uid: 'fulfillmentStatus' },
  { name: 'Delivery Status', uid: 'deliveryStatus' },
  { name: 'Delivery Method', uid: 'deliveryMethod' },
  { name: 'Actions', uid: 'actions' },
]

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function OrdersTable() {
  const [orders, setOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/getAllOrders`)
        const data = await response.json()
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by date descending
        setOrders(data)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      }
    }

    fetchOrders()
  }, [])

  const deleteOrder = async (orderId) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/orders/deleteOrder/${orderId}`,
          {
            method: 'DELETE',
          },
        )
        if (response.ok) {
          setOrders(orders.filter((order) => order._id !== orderId))
          toast('Order deleted successfully!', {})
        } else {
          throw new Error('Failed to delete the order')
        }
      } catch (error) {
        console.error('Error deleting order:', error)
        toast('Error deleting order. Please try again.', {})
      }
    }
  }

  const formatDateAndTime = (dateString) => {
    const options = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      hourCycle: 'h12',
    }
    return new Intl.DateTimeFormat('en-US', options).format(
      new Date(dateString),
    )
  }

  const formatUserAddress = (order) => {
    const { street, city, province, postalCode, country } = order.user
    return `${street}, ${city}, ${province}, ${postalCode}, ${country}`
  }

  const formatAmount = (amount) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
  }

  const itemsPerPage = 15
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const currentOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div className=" bg-white p-4 rounded-xl mt-2">
      <div className="mt-4 mb-4 items-end justify-end flex ">
        <Button
          className="bg-blue-500 text-white"
          onClick={() => router.push(`/admin/orders/create-checkout`)}
          size="sm"
        >
          Create new order
        </Button>
      </div>

      <Table
        isHeaderSticky
        isStriped
        isCompact
        shadow="none"
        selectionMode="none"
        aria-label="Order Table"
      >
        <TableHeader>
          {orderColumns.map((column) => (
            <TableColumn key={column.uid} className="text-center">
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {currentOrders.map((order, index) => (
            <TableRow key={index}>
              {orderColumns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={
                    column.uid === 'user.name' ? 'text-left' : 'text-center'
                  }
                >
                  {column.uid === 'user.name' ? (
                    <HoverCard>
                      <HoverCardTrigger className="text-left  cursor-pointer ">
                        {order.user.name} {order.user.lastName}
                      </HoverCardTrigger>
                      <HoverCardContent className="bg-white ml-4 w-80 p-2 text-left ">
                        <div className=" font-semibold">
                          {order.user.name} {order.user.lastName}
                        </div>
                        <div className=" text-blue-500">{order.user.email}</div>
                        <div> {formatUserAddress(order)} </div>
                        <Button
                          size="sm"
                          className="mt-2 bg-blue-500 text-white"
                          onClick={() =>
                            router.push(
                              `/admin/customers/profile?id=${order.user._id}`,
                            )
                          }
                        >
                          View Profile
                        </Button>
                      </HoverCardContent>
                    </HoverCard>
                  ) : column.uid === 'items' ? (
                    <HoverCard>
                      <HoverCardTrigger>
                        <Button variant="flat" size="sm">
                          View items ({order.items.length})
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent
                        className="p-4 bg-white w-full text-left"
                        aria-label="User Actions"
                      >
                        {order.items.map((item) => (
                          <div
                            className="border-b-2 border-gray-100 p-2 text-sm"
                            key={item._id}
                          >
                            {item.name} - Quantity: {item.quantity} - Total:{' '}
                            {formatAmount(item.total)}
                          </div>
                        ))}
                      </HoverCardContent>
                    </HoverCard>
                  ) : column.uid === 'actions' ? (
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      color="danger"
                      auto
                      onClick={() => deleteOrder(order._id)}
                    >
                      <Trash2 strokeWidth={1.5} absoluteStrokeWidth />
                    </Button>
                  ) : column.uid === 'fulfillmentStatus' ? (
                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/orders/details/${order._id}`)
                      }
                      className={`${
                        order.fulfillmentStatus === 'fulfilled'
                          ? 'bg-lime-300'
                          : 'bg-yellow-300'
                      } w-full py-2`}
                    >
                      {order.fulfillmentStatus === 'fulfilled'
                        ? 'Fulfilled'
                        : 'Unfulfilled'}
                    </Button>
                  ) : column.uid === 'createdAt' ? (
                    formatDateAndTime(order[column.uid])
                  ) : column.uid === 'totalPrice' ? (
                    formatAmount(order[column.uid])
                  ) : column.uid === 'paymentStatus' ? (
                    order.paymentStatus
                  ) : (
                    order[column.uid]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        <Pagination
          showShadow
          showControls
          color="primary"
          total={totalPages}
          initialPage={1}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  )
}
