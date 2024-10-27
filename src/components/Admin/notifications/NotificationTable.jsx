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
} from '@nextui-org/table'
import { Pagination } from '@nextui-org/pagination'
import { format } from 'date-fns'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function NotificationTable() {
  const [notifications, setNotifications] = useState([])
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Fetch notifications
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
      // Step 1: Fetch email content from the backend
      const emailContentResponse = await fetch(
        `${API_BASE_URL}/notifications/generate-email-content`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerName, productId }),
        },
      )

      const { emailSubject, emailText, emailHtml } =
        await emailContentResponse.json()

      // Step 2: Send the email with the generated content
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
        alert('Notification email sent successfully.')
      } else {
        console.error(
          'Error sending email notification:',
          await response.json(),
        )
      }
    } catch (error) {
      console.error('Failed to send email notification:', error)
    }
  }

  // Function to delete a notification
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
        alert('Notification deleted successfully.')
      } else {
        console.error('Error deleting notification:', await response.json())
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
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
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody>
            {paginatedNotifications.map((notification) => (
              <TableRow key={notification._id}>
                <TableCell>{notification.name}</TableCell>
                <TableCell>{notification.email}</TableCell>
                <TableCell>{notification.product?.name || 'N/A'}</TableCell>
                <TableCell>
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
                        notification.product?._id, // Use product ID directly here
                      )
                    }
                  >
                    {notification.notified ? 'Notified' : 'Send Email'}
                  </button>
                  <button
                    onClick={() => deleteNotification(notification._id)}
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
