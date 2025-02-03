// src/components/Admin/Notifications/NotificationTable.jsx
'use client'
import React, { useState, useEffect, useMemo } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table"
import { Pagination } from "@heroui/pagination"
import { format } from 'date-fns'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function NotificationTable() {
  const [notifications, setNotifications] = useState([])
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/notifications/all`)
        const data = await response.json()
        setNotifications(Array.isArray(data) ? data : data.notifications || [])
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      }
    }

    fetchNotifications()
  }, [])

  const sendEmailNotification = async (
    notificationId,
    email,
    customerName,
    productId,
  ) => {
    try {
      // Use the correct route for fetching the product
      const productResponse = await fetch(
        `${API_BASE_URL}/products/findProduct/${productId}`,
      )

      // Check if the response is OK
      if (!productResponse.ok) {
        throw new Error(
          `Failed to fetch product: ${productResponse.statusText} (${productResponse.status})`,
        )
      }

      const productData = await productResponse.json()
      const productImageUrl = productData.images?.[0] || '' // Use the first image as the main image

      const emailContentResponse = await fetch(
        `${API_BASE_URL}/notifications/generate-email-content`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName,
            productId,
            productImageUrl, // Pass image URL
          }),
        },
      )

      // Check if email content generation was successful
      if (!emailContentResponse.ok) {
        throw new Error(
          `Failed to generate email content: ${emailContentResponse.statusText}`,
        )
      }

      const { emailSubject, emailText, emailHtml } =
        await emailContentResponse.json()

      const response = await fetch(`${API_BASE_URL}/notifications/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationId,
          email,
          emailSubject,
          emailText,
          emailHtml,
        }),
      })

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, notified: true }
              : notification,
          ),
        )
        toast.success('Notification email sent successfully.')
      } else {
        console.error(
          'Error sending email notification:',
          await response.json(),
        )
        toast.error('Failed to send notification email.')
      }
    } catch (error) {
      console.error('Failed to send email notification:', error)
      toast.error('Failed to send notification email.')
    }
  }

  const confirmDeleteNotification = (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      deleteNotification(notificationId)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/${notificationId}`,
        {
          method: 'DELETE',
        },
      )

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification._id !== notificationId,
          ),
        )
        toast.success('Notification deleted successfully.')
      } else {
        console.error('Error deleting notification:', await response.json())
        toast.error('Failed to delete notification.')
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
      toast.error('Failed to delete notification.')
    }
  }

  const paginatedNotifications = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return notifications.slice(startIndex, endIndex)
  }, [page, rowsPerPage, notifications])

  const pages = Math.ceil(notifications.length / rowsPerPage)

  return (
    <div>
      <div className="overflow-x-auto">
        <Table
          isHeaderSticky
          isStriped
          isCompact
          aria-label="Notification Table"
          shadow="none"
          className="xl:container rounded-t-2xl bg-white shrink-0 p-2"
        >
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Product</TableColumn>
            <TableColumn>Date Requested</TableColumn>
            <TableColumn>Notified</TableColumn>
            <TableColumn>Send Email</TableColumn>
            <TableColumn>Delete</TableColumn>
          </TableHeader>
          <TableBody>
            {paginatedNotifications.map((notification) => (
              <TableRow key={notification._id}>
                <TableCell style={{ minWidth: '150px' }}>
                  {notification.name}
                </TableCell>
                <TableCell style={{ minWidth: '200px' }}>
                  {notification.email}
                </TableCell>
                <TableCell style={{ minWidth: '150px' }}>
                  {notification.product?.name || 'N/A'}
                </TableCell>
                <TableCell style={{ minWidth: '120px' }}>
                  {format(new Date(notification.createdAt), 'yyyy-MM-dd')}
                </TableCell>
                <TableCell>{notification.notified ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <button
                    disabled={notification.notified}
                    onClick={() =>
                      sendEmailNotification(
                        notification._id,
                        notification.email,
                        notification.name,
                        notification.product?._id,
                      )
                    }
                  >
                    {notification.notified ? 'Notified' : 'Send Email'}
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => confirmDeleteNotification(notification._id)}
                    className="ml-2 text-red-500"
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex xl:container shadow-md bg-white rounded-b-2xl justify-between items-center p-4">
        <Pagination
          showControls
          showShadow
          color="primary"
          total={pages}
          page={page}
          onChange={setPage}
        />
        <select
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          defaultValue={rowsPerPage}
          className="border rounded-lg p-1 h-9 w-19 text-center"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>
    </div>
  )
}
