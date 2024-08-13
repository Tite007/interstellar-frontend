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

export function ShoppingCartSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button isIconOnly variant="flat" color="primary">
          <ShoppingBag size={24} strokeWidth={1.5} />{' '}
          {/* Replace the cart icon with the bag icon */}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Shopping Cart</SheetTitle>
        </SheetHeader>
        <ShoppingCart />
      </SheetContent>
    </Sheet>
  )
}

export default ShoppingCartSheet
