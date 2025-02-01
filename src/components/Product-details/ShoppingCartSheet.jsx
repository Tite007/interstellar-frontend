// src/components/Product-details/ShoppingCartSheet.jsx
'use client'
import React from 'react'
import ShoppingCart from '@/src/components/Product-details/ShoppingCart' // Adjust path as needed
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../components/ui/Sheet' // Adjust the relative path as needed
import { Button } from '@nextui-org/button'
import { ShoppingBag } from 'lucide-react' // Import the ShoppingBag icon
import Image from 'next/image'
import Link from 'next/link'

export function ShoppingCartSheet() {
  return (
    <Sheet>
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
        <ShoppingCart />
      </SheetContent>
    </Sheet>
  )
}

export default ShoppingCartSheet
