import React from 'react'
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/breadcrumbs'

export default function BreadcrumdsSubcategory({ category }) {
  return (
    <div className="mb-2">
      <Breadcrumbs color="primary">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/categories/">Categories</BreadcrumbItem>
        <BreadcrumbItem href={`/categories/${category}`}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </BreadcrumbItem>
      </Breadcrumbs>
    </div>
  )
}
