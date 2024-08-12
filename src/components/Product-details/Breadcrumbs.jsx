import React from 'react'
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/breadcrumbs'

export default function BreadcrumdsProduct({ product }) {
  return (
    <div className="mb-2">
      <Breadcrumbs color="primary">
        <BreadcrumbItem href="/docs/components/button">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem href="/#">{product.name}</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  )
}
