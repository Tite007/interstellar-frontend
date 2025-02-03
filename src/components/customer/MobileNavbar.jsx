// client/src/app/(customer)/customer-profile/MobileNavbar.jsx
import React from 'react'
import Link from 'next/link'
import { Button } from "@heroui/button"

const MobileNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center lg:hidden">
      <ul className="flex space-x-4">
        <li>
          <Link href="/customer-profile">
            <Button color="primary" auto>
              Account Info
            </Button>
          </Link>
        </li>
        <li>
          <Link href="/customer-profile/orders">
            <Button color="primary" auto>
              Orders
            </Button>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default MobileNavbar
