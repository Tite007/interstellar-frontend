'use client'

import React, { useState, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table'
import { Button } from '@heroui/button'
import { Pagination } from '@heroui/pagination'
import { Input } from '@heroui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDisclosure } from '@heroui/modal'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import OrderItemsModal from './OrderItemsModal' // Adjust path as needed

const orderColumns = [
  { name: 'Order #', uid: 'orderNumber' },
  { name: 'User', uid: 'user.name' },
  { name: 'Date Created', uid: 'createdAt' },
  { name: 'Items', uid: 'items' },
  { name: 'Total', uid: 'totalPrice' },
  { name: 'Payment Status', uid: 'paymentStatus' },
  { name: 'Fulfillment Status', uid: 'fulfillmentStatus' },
  { name: 'Delivery Status', uid: 'deliveryStatus' },
  { name: 'Delivery Method', uid: 'deliveryMethod' },
  { name: 'Actions', uid: 'actions' },
]

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const ITEMS_PER_PAGE = 15

export default function OrdersTable() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedOrderItems, setSelectedOrderItems] = useState([])

  const currentPage = Number(searchParams.get('page')) || 1

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/getAllOrders`)
        const data = await response.json()
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setOrders(data)
        setFilteredOrders(data)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      }
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const orderNumberMatch = String(order.orderNumber || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const userNameMatch =
        `${order.user?.name || ''} ${order.user?.lastName || ''}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      const itemsMatch =
        order.items?.some((item) =>
          String(item.name || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        ) || false
      return orderNumberMatch || userNameMatch || itemsMatch
    })
    setFilteredOrders(filtered)
  }, [searchQuery, orders])

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/admin/orders?${params.toString()}`, { scroll: false })
  }

  const deleteOrder = async (orderId) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/orders/deleteOrder/${orderId}`,
          { method: 'DELETE' },
        )
        if (response.ok) {
          setOrders(orders.filter((order) => order._id !== orderId))
          setFilteredOrders(
            filteredOrders.filter((order) => order._id !== orderId),
          )
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
      hour12: true,
    }
    return new Intl.DateTimeFormat('en-US', options).format(
      new Date(dateString),
    )
  }

  const formatAmount = (amount) => {
    return (
      amount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) ||
      '$0.00'
    )
  }

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const showItemsModal = (items) => {
    setSelectedOrderItems(items)
    onOpen()
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <Button
          className="bg-blue-500 text-white w-full sm:w-auto"
          onPress={() => router.push(`/admin/orders/create-checkout`)}
          size="sm"
        >
          Create new order
        </Button>
        <Input
          placeholder="Search by order #, user, or item..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <Table
          isHeaderSticky
          isStriped
          isCompact
          shadow="none"
          selectionMode="none"
          aria-label="Order Table"
          className="min-w-[1024px]"
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
                {orderColumns.map((column) => (
                  <TableCell
                    key={column.uid}
                    className={
                      column.uid === 'user.name' ? 'text-left' : 'text-center'
                    }
                  >
                    {column.uid === 'user.name' ? (
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/admin/customers/profile?id=${order.user._id}`,
                          )
                        }
                      >
                        {order.user?.name || ''} {order.user?.lastName || ''}
                      </div>
                    ) : column.uid === 'items' ? (
                      <Button
                        variant="flat"
                        size="sm"
                        onPress={() => showItemsModal(order.items)}
                      >
                        View ({order.items?.length || 0})
                      </Button>
                    ) : column.uid === 'actions' ? (
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        color="danger"
                        onPress={() => deleteOrder(order._id)}
                      >
                        <Trash2 strokeWidth={1.5} />
                      </Button>
                    ) : column.uid === 'fulfillmentStatus' ? (
                      <Button
                        size="sm"
                        onPress={() =>
                          router.push(`/admin/orders/details/${order._id}`)
                        }
                        className={`w-full py-2 ${
                          order.fulfillmentStatus === 'fulfilled'
                            ? 'bg-lime-300'
                            : 'bg-yellow-300'
                        }`}
                      >
                        {order.fulfillmentStatus === 'fulfilled'
                          ? 'Fulfilled'
                          : 'Unfulfilled'}
                      </Button>
                    ) : column.uid === 'createdAt' ? (
                      formatDateAndTime(order[column.uid])
                    ) : column.uid === 'totalPrice' ? (
                      formatAmount(order[column.uid])
                    ) : (
                      order[column.uid] || ''
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            showShadow
            showControls
            color="primary"
            total={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </div>
      )}

      <OrderItemsModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        items={selectedOrderItems}
        formatAmount={formatAmount}
      />
    </div>
  )
}
