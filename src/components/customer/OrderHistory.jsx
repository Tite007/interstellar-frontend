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

const orderColumns = [
  { name: 'Order Number', uid: 'orderNumber' },
  { name: 'Date Created', uid: 'createdAt' },
  { name: 'Items', uid: 'items' },
  { name: 'Total', uid: 'totalPrice' },
  { name: 'Payment Status', uid: 'paymentStatus' },
]
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function OrderHistory({ user }) {
  const [orders, setOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalAmountSpent, setTotalAmountSpent] = useState(0)
  const [mostBoughtProducts, setMostBoughtProducts] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user._id) {
        console.error('User ID is not available')
        return
      }

      console.log('Fetching orders for user ID:', user._id)

      try {
        const response = await fetch(
          `${API_BASE_URL}/orders/getUserOrders/${user._id}`,
        )
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`)
        }
        const data = await response.json()
        console.log('Fetched orders:', data)
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format')
        }
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by date descending
        setOrders(data)

        const totalAmount = data.reduce(
          (acc, order) => acc + order.totalPrice,
          0,
        )
        setTotalAmountSpent(totalAmount)

        const productMap = {}
        data.forEach((order) => {
          order.items.forEach((item) => {
            if (productMap[item.product]) {
              productMap[item.product].quantity += item.quantity
            } else {
              productMap[item.product] = {
                name: item.name,
                quantity: item.quantity,
              }
            }
          })
        })

        const sortedProducts = Object.values(productMap).sort(
          (a, b) => b.quantity - a.quantity,
        )
        setMostBoughtProducts(sortedProducts.slice(0, 5))
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      }
    }

    fetchOrders()
  }, [user])

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

  const formatAmount = (amount) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
  }

  const itemsPerPage = 10
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const currentOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div className="border bg-white shadow-sm w-full rounded-xl mt-10 p-5 mb-16">
      <div className="flex justify-between">
        <h2 className=" text-lg font-semibold mb-4">Order History</h2>
        <div className="text-right">
          <h2 className="text-lg font-semibold mb-4">Total Amount Spent</h2>
          <p>{formatAmount(totalAmountSpent)}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <Table
            isHeaderSticky
            isStriped
            isCompact
            shadow="none"
            aria-label="Order History Table"
          >
            <TableHeader>
              {orderColumns.map((column) => (
                <TableColumn
                  key={column.uid}
                  className={`text-center ${column.uid === 'orderNumber' ? 'w-20' : ''}`}
                >
                  {column.name}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody>
              {currentOrders.map((order, index) => (
                <TableRow key={index}>
                  {orderColumns.map((column, colIndex) => (
                    <TableCell key={colIndex} className="text-center">
                      {column.uid === 'createdAt' ? (
                        formatDateAndTime(order[column.uid])
                      ) : column.uid === 'items' ? (
                        <HoverCard>
                          <HoverCardTrigger>
                            <Button variant="light">
                              view items ({order.items.length})
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
                      ) : column.uid === 'totalPrice' ? (
                        formatAmount(order[column.uid])
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
        </>
      )}
    </div>
  )
}
