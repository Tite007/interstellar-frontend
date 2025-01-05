// src/components/Navbar/CategoryMenuSheet.jsx
'use client'
import React, { useState } from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../components/ui/Sheet' // Adjust the path to your Sheet component
import { Button } from '@nextui-org/button'
import { ChevronLeft, Menu, Home } from 'lucide-react' // Import back arrow and home icons

export default function CategoryMenuSheet({ shopCategories }) {
  const [activeCategory, setActiveCategory] = useState(null)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="light" isIconOnly>
          <Menu color="white" className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="flex items-center text-sm font-medium text-muted-foreground mb-2"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </button>
          )}
          <SheetTitle className="text-left text-lg mt-2 font-medium">
            {activeCategory ? activeCategory.label : 'Menu'}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col space-y-4">
          {activeCategory ? (
            <>
              {activeCategory.subcategories.map((subcategory) => (
                <a
                  key={subcategory.label}
                  href={subcategory.href}
                  className="text-2xl font-medium"
                >
                  {subcategory.label}
                </a>
              ))}
            </>
          ) : (
            <>
              <a href="/" className="text-2xl font-medium font-sans">
                Home
              </a>
              {shopCategories.map((category) => (
                <button
                  key={category.label}
                  onClick={() => setActiveCategory(category)}
                  className="text-left text-2xl font-medium font-sans"
                >
                  {category.label}
                </button>
              ))}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
