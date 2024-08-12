import UserAddForm from '@/src/components/Admin/Customers/AddUser'
import React from 'react'
import Breadcrumbs from '@/src/components/Admin/Customers/Breadcrumbs'

export default function AddCustomerPage(users) {
  return (
    <div>
      <h1>Add User</h1>
      <Breadcrumbs />
      <UserAddForm users={users} />
      {/* You can add your table here */}
    </div>
  )
}
