'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Navbar } from "@heroui/navbar"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown"
import { Avatar } from "@heroui/avatar"
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import {
  Home,
  Users,
  Box,
  ArrowRightLeft,
  ShoppingBag,
  FileText,
  Menu,
  CircleAlert,
  FolderOpen,
  Bell,
} from 'lucide-react'
import { Button } from "@heroui/button"

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

export default function MainNavbar() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef])

  if (status === 'loading' || status === 'unauthenticated') {
    return null
  }

  return (
    <Navbar
      maxWidth="full"
      className="xl:container bg-white justify-end items-end "
    >
      <div className="hidden lg:block">
        {/* Placeholder for desktop menu items or logo */}
      </div>

      <div className="justify-start items-start xl:hidden">
        <Button
          isIconOnly
          onClick={() => {
            setMenuOpen(!menuOpen)
          }}
        >
          <Menu />
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`absolute top-10 -ml-6 mt-6 border shadow-xl min-h-screen w-64 bg-gray-100 pt-16 ${menuOpen ? 'block' : 'hidden'}`}
      >
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex hover:bg-D9D9D9 w-full px-6 rounded-lg font-light text-sm items-center py-2"
            onClick={() => setMenuOpen(false)}
          >
            {item.icon}
            <span className="ml-4">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* Spacer to push content to the right on mobile */}
      <div className="flex-grow xl:hidden "></div>

      {/* Avatar Dropdown, ensuring it's the last element for right alignment */}
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="cursor-pointer"
            src={session?.user?.image}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Welcome</p>
            <p>
              {' '}
              {session.user.name} {session.user.lastName}
            </p>
          </DropdownItem>
          <DropdownItem
            className="mt-2"
            key="logout"
            color="danger"
            withDivider
            onClick={() => {
              console.log('Signing out with callbackUrl /admin/login')
              signOut({ callbackUrl: '/login' })
            }}
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Navbar>
  )
}
