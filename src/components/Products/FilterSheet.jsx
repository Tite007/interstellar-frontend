import React, { useState } from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../components/ui/Sheet'
import { Button } from '@nextui-org/button'
import { Filter } from 'lucide-react'
import Sidebar from '@/src/components/Products/Sidebar'

const FilterSheet = ({
  categories,
  roastLevels,
  countries,
  onSelectCategory,
  onClearFilter,
  selectedCategory,
  selectedRoastLevel,
  selectedCountry,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open) => {
    setIsOpen(open)
  }

  const handleSelectCategory = (type, value) => {
    onSelectCategory(type, value)
    setIsOpen(false) // Close the Sheet after selecting or unselecting a filter
  }

  const handleClearFilter = (type) => {
    onClearFilter(type)
    setIsOpen(false) // Close the Sheet after clearing the filter
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="flat" color="primary" onClick={() => setIsOpen(true)}>
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
          onSelectCategory={handleSelectCategory} // Use the updated handler
          onClearFilter={handleClearFilter} // Use the updated handler
          selectedCategory={selectedCategory}
          selectedRoastLevel={selectedRoastLevel}
          selectedCountry={selectedCountry}
        />
      </SheetContent>
    </Sheet>
  )
}

export default FilterSheet
