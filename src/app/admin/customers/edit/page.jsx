import UserAddForm from '@/src/components/Admin/Customers/AddUser'
import React from 'react'
import Breadcrumbs from '@/src/components/Admin/Customers/Breadcrumbs'
import EditUserForm from '@/src/components/Admin/Customers/EditUser'

export default function EditCustomerPage(users) {
  return (
    <div>
      <h1 className="text-xl mt-5 font-semibold">Edit Customer</h1>
      <Breadcrumbs />
      <EditUserForm users={users} />
      {/* You can add your table here */}
    </div>
  )
}
