import BreadcrumbsOrder from '@/src/components/Admin/Orders/BreadcrumbsOrder'
import OrdersTable from '@/src/components/Admin/Orders/OrdersTable'
import React from 'react'

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl mt-10 font-semibold text-gray-700 ">Orders</h1>
      <OrdersTable />
    </div>
  )
}
