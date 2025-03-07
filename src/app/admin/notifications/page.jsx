import NotificationTable from '@/src/components/Admin/notifications/NotificationTable'
import dynamic from 'next/dynamic'
import React from 'react'

export default function ProductTable() {
  return (
    <div>
      <h1 className=" xl:container text-2xl mt-10 mb-5 font-semibold text-gray-700">
        Products Notifications
      </h1>
      <NotificationTable />
    </div>
  )
}
