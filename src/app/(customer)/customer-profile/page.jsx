import UserAddForm from '@/src/components/Admin/Customers/AddUser'
import React from 'react'
import Breadcrumbs from '@/src/components/Admin/Customers/Breadcrumbs'
import CustomerProfilePage from '@/src/components/customer/EditProfileFrom'
import BreadcrumbsUserProfile from '@/src/components/customer/BreadcrumbsProfile'

export default function EditCustomerPage(users) {
  return (
    <div className=" container ">
      <BreadcrumbsUserProfile />
      <h1 className=" container text-xl mt-5 font-semibold">My Profile</h1>
      <CustomerProfilePage users={users} />
      {/* You can add your table here */}
    </div>
  )
}
