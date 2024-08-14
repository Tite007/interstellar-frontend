'use client'
import React, { useContext, useState, useEffect } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@nextui-org/navbar'
import { Button } from '@nextui-org/button'
import { AcmeLogo } from '@/src/components/Navbar/logo'
import Link from 'next/link'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/dropdown'
import { useSession, signOut } from 'next-auth/react'
import { Avatar } from '@nextui-org/avatar'
import { Badge } from '@nextui-org/badge'
import ShoppingCartSheet from '@/src/components/Product-details/ShoppingCartSheet'
import { CartContext } from '@/src/context/CartContext'
import { User } from 'lucide-react'

export default function MainNavbarCustomer() {
  const { data: session, status } = useSession()
  const { cart } = useContext(CartContext)
  const [hydrated, setHydrated] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  const isUser = session?.user?.role === 'user'
  const cartItemCount = cart.length

  if (!hydrated) {
    return null
  }

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ]

  return (
    <Navbar
      maxWidth="2xl"
      className="bg-gray-200 shadow-lg"
      onMenuOpenChange={(isOpen) => setIsMenuOpen(isOpen)}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
        />
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit"></p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={index}>
            <Link color="foreground" href={item.href}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end" className="items-center gap-4">
        {status === 'unauthenticated' && (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="flat">
                <User size={24} strokeWidth={1.5} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Login Actions" variant="flat">
              <DropdownItem key="login">
                <Link href="/customer/login" className="w-full">
                  <Button
                    color="primary"
                    size="sm"
                    variant="fl"
                    className="w-full text-left"
                  >
                    Login
                  </Button>
                </Link>
              </DropdownItem>
              <DropdownItem key="signup">
                <Link href="/customer/sign-up" className="w-full">
                  <Button
                    color="primary"
                    size="sm"
                    variant="flat"
                    className="w-full text-left"
                  >
                    Sign Up
                  </Button>
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
        <NavbarItem>
          <Badge
            content={cartItemCount}
            color="danger"
            variant="solid"
            showOutline={false}
            isInvisible={cartItemCount === 0}
          >
            <ShoppingCartSheet />
          </Badge>
        </NavbarItem>
        {status === 'authenticated' && isUser && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="cursor-pointer"
                src={session.user.image}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <Link
                  href="/customer-profile"
                  className="flex flex-col items-start"
                >
                  <p className="font-semibold">Welcome</p>
                  <p>
                    {session.user.name} {session.user.lastName}
                  </p>
                </Link>
              </DropdownItem>
              <DropdownItem key="orders" className="gap-2">
                <Link
                  href="/customer-profile/orders"
                  className="flex flex-col items-start"
                >
                  <p className="font-semibold">Order History</p>
                </Link>
              </DropdownItem>
              <DropdownItem
                className="mt-2"
                key="logout"
                color="danger"
                variant="solid"
                withDivider
                onClick={() => {
                  signOut({ callbackUrl: '/' })
                }}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>

      {/* Modify NavbarMenu to use data attributes instead of passing isOpen directly */}
      <NavbarMenu data-menu-open={isMenuOpen}>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link
              color="foreground"
              href={item.href}
              className="w-full"
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
