import React from 'react'
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/breadcrumbs'

export default function BreadcrumdsCategory() {
  return (
    <div className="mb-2">
      <Breadcrumbs color="primary">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/Categories">Categories</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  )
}
