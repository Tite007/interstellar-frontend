// client/src/app/(customer)/customer-profile/layout.jsx
import React from 'react'
import Link from 'next/link'
import MobileNavbar from '@/src/components/customer/MobileNavbar' // Import the MobileNavbar component

const CustomerProfileLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Mobile Navbar for Small and Medium Screens */}

      {/* Vertical Sidebar for Large Screens */}
      <nav className="hidden lg:flex lg:w-64 bg-gray-800 text-white flex-col p-4">
        <h2 className="text-xl font-bold mb-4">Customer Profile</h2>
        <ul>
          <li className="mb-2">
            <Link href="/customer-profile">
              <p className="block py-2 px-4 rounded hover:bg-gray-700">
                Account Information
              </p>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/customer-profile/orders">
              <p className="block py-2 px-4 rounded hover:bg-gray-700">
                Orders History
              </p>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">{children}</div>
    </div>
  )
}

export default CustomerProfileLayout
