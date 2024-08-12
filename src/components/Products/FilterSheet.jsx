// src/components/Products/FilterSheet.jsx
import React from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/src/components/ui/sheet'
import { Button } from '@nextui-org/button'
import { Filter } from 'lucide-react' // Import a filter icon
import Sidebar from '@/src/components/Products/Sidebar'

const FilterSheet = ({
  categories,
  roastLevels,
  countries,
  onSelectCategory,
  onClearFilter,
  selectedCategory, // Pass down the selected state
  selectedRoastLevel, // Pass down the selected state
  selectedCountry, // Pass down the selected state
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="flat" color="primary">
          <Filter size={24} strokeWidth={1.5} />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
        </SheetHeader>
        <Sidebar
          categories={categories}
          roastLevels={roastLevels}
          countries={countries}
          onSelectCategory={onSelectCategory}
          onClearFilter={onClearFilter}
          selectedCategory={selectedCategory} // Pass the state
          selectedRoastLevel={selectedRoastLevel} // Pass the state
          selectedCountry={selectedCountry} // Pass the state
        />
      </SheetContent>
    </Sheet>
  )
}

export default FilterSheet
