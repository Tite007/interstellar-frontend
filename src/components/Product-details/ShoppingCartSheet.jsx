// src/components/Product-details/ShoppingCartSheet.jsx
'use client'
import React, { useEffect, useState } from 'react'
import ShoppingCart from '@/src/components/Product-details/ShoppingCart' // Adjust path as needed
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../components/ui/Sheet' // Adjust the relative path as needed
import { Button } from '@heroui/button'
import { ShoppingBag } from 'lucide-react' // Import the ShoppingBag icon
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function ShoppingCartSheet() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close the sheet every time the pathname changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button isIconOnly variant="light">
          <ShoppingBag color="white" size={24} strokeWidth={1.5} />{' '}
          {/* Replace the cart icon with the bag icon */}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Image
                src="/muchio_logo.webp" // Path to your logo in the public folder
                alt="Muchio Logo"
                width={90} // Adjust the width as needed
                height={70} // Adjust the height as needed
              />
            </Link>
            <SheetTitle>Your Shopping Cart</SheetTitle>
          </div>
        </SheetHeader>
        <ShoppingCart closeSheet={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

export default ShoppingCartSheet
