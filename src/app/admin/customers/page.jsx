import React from 'react'
import CustomerTable from '@/src/components/Admin/Customers/UserTable'

export default function CustomersPage() {
  return (
    <div>
      <h1 className="text-2xl mt-10 font-semibold text-gray-700">Customers</h1>

      <CustomerTable />
      {/* You can add your table here */}
    </div>
  )
}
