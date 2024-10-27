import NotificationTable from '@/src/components/Admin/notifications/NotificationTable'
import dynamic from 'next/dynamic'
import React from 'react'

export default function ProductTable() {
  return (
    <div>
      <h1 className=" xl:container text-2xl mt-10 font-semibold text-gray-700">
        Products
      </h1>
      <NotificationTable />
    </div>
  )
}
