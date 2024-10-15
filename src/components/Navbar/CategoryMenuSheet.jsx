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

export function CategoryMenuSheet({ shopCategories }) {
  const [activeCategory, setActiveCategory] = useState(null) // Track active category

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button isIconOnly variant="flat" color="primary">
          <Menu />
        </Button>
      </SheetTrigger>

      {/* Main Categories Sheet */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Main Categories</SheetTitle>
        </SheetHeader>
        <div className="mt-4 p-4">
          <Button
            className="w-full mb-2"
            variant="flat"
            color="primary"
            onClick={() => {
              // Redirect to home when clicked
              window.location.href = '/'
            }}
            startContent={<Home />} // Home icon
          >
            Home
          </Button>
          {shopCategories.map((category) => (
            <Button
              key={category.label}
              className="w-full mb-2"
              onClick={() => setActiveCategory(category)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </SheetContent>

      {/* Subcategories Sheet */}
      {activeCategory && (
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{activeCategory.label}</SheetTitle>
            <Button
              className="mt-4 text-left mb-4"
              variant="light"
              onClick={() => setActiveCategory(null)}
              startContent={<ChevronLeft />}
            >
              Go Back
            </Button>
            {/*   <Button
              className="mt-4 text-left mb-4"
              variant="flat"
              color="primary"
              onClick={() => {
                // Redirect to home when clicked
                window.location.href = '/'
              }}
              startContent={<Home />} // Home icon
            >
              Home
            </Button>*/}
          </SheetHeader>
          <div className="p-4">
            {activeCategory.subcategories.length > 0 ? (
              activeCategory.subcategories.map((subcategory) => (
                <Button
                  key={subcategory.label}
                  className="w-full mb-2 "
                  onClick={() => {
                    // Handle subcategory click, can redirect here
                    window.location.href = subcategory.href
                  }}
                >
                  {subcategory.label}
                </Button>
              ))
            ) : (
              <p>No subcategories available</p>
            )}
          </div>
        </SheetContent>
      )}
    </Sheet>
  )
}

export default CategoryMenuSheet
