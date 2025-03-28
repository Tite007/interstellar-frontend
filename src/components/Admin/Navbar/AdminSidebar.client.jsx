// components/Sidebar.jsx
'use client'
import React, { useState, Fragment } from 'react'
import Link from 'next/link'
import {
  Home,
  Users,
  Box,
  ShoppingBag,
  FileText,
  ArrowRightLeft,
  ChevronDown,
  CircleAlert,
  FolderOpen,
  Bell,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation' // Assuming this is available in your project
import Image from 'next/image'

// Example structure updated to include potential dropdown items
const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: <Home strokeWidth={1.5} className="mr-4 h-5 w-5" />,
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: <ShoppingBag strokeWidth={1.5} className="mr-4 h-5 w-5" />,
  },

  {
    name: 'Products',
    href: '/admin/products',
    icon: <Box strokeWidth={1.5} className="mr-4 h-5 w-5" />,
  },
  {
    name: 'Products Expiration',
    href: '/admin/products-expiration',
    icon: <CircleAlert strokeWidth={1.5} className="mr-4 h-5 w-5" />,
  },
  {
    name: 'Product Notifications',
    href: '/admin/notifications',
    icon: <Bell size={20} strokeWidth={1.25} className="mr-4 h-5 w-5" />,
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: <Users strokeWidth={1.5} className="mr-4 h-5 w-5" />,
  },

  {
    name: 'Categories',
    href: '/admin/categories',
    icon: <FolderOpen strokeWidth={1.5} className="mr-4 h-5 w-5" />,
  },
  {
    name: 'Transactions',
    href: '/admin/transactions',
    icon: <ArrowRightLeft strokeWidth={1.5} className="mr-4 h-5 w-5" />,
  },

  {
    name: 'Content',
    href: '/admin/content',
    icon: <FileText strokeWidth={1.5} className="mr-4 h-5 w-5" />,
  },
]

{
  /*    dropdownItems: [{ name: 'Inventory', href: '/products/inventory' }],
   
  */
}

export default function Sidebar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState(null)

  // Toggle dropdown open state
  const toggleDropdown = (index) => {
    if (openDropdown === index) {
      setOpenDropdown(null)
    } else {
      setOpenDropdown(index)
    }
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return null
  }

  return (
    <div className="hidden xl:block fixed  bottom-0 bg-white start-0 z-50 h-full w-[270px]  2xl:w-72 ">
      <div className="flex items-center justify-center p-4 mt-2">
        <Link href="/admin/dashboard">
          <Image
            src="/muchio_logo.webp"
            alt="Muchio Logo"
            width={100}
            height={50}
          />
        </Link>
      </div>
      <div className=" pb-4">
        <nav className="mt-10">
          <ul>
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              const isDropdownOpen = openDropdown === index
              return (
                <Fragment key={item.name}>
                  <li>
                    <div
                      className="flex items-center font-light justify-between p-2 pl-10 text-sm text-gray-900 dark:text-white hover:bg-D9D9D9 dark:hover:D9D9D9 rounded-lg cursor-pointer"
                      onClick={() =>
                        item.dropdownItems ? toggleDropdown(index) : null
                      }
                    >
                      <Link
                        href={item.href}
                        className="flex items-center w-full"
                      >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </Link>
                      {item.dropdownItems && (
                        <ChevronDown
                          className={`transition-transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                          strokeWidth={1.5}
                        />
                      )}
                    </div>
                    {isDropdownOpen && item.dropdownItems && (
                      <ul className="pl-10">
                        {item.dropdownItems.map((dropdownItem) => (
                          <li key={dropdownItem.name}>
                            <Link
                              href={dropdownItem.href}
                              className="block font-light p-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full"
                            >
                              {dropdownItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                </Fragment>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}
