import React from 'react'
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs"

export default function BreadcrumdsSubcategoryList({ category, subcategory }) {
  // Helper function to format the subcategory name
  const formatName = (name) => {
    const formattedName = name.replace(/-/g, ' ') // Replace hyphens with spaces
    return formattedName.charAt(0).toUpperCase() + formattedName.slice(1) // Capitalize the first letter
  }

  return (
    <div className="mb-2">
      <Breadcrumbs color="primary">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href={`/categories/${category}`}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </BreadcrumbItem>
        <BreadcrumbItem href={`/categories/${category}/${subcategory}`}>
          {formatName(subcategory)}
        </BreadcrumbItem>
      </Breadcrumbs>
    </div>
  )
}
