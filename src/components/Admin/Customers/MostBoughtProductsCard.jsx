'use client'

import React from 'react'

export default function MostBoughtProductsCard({ products }) {
  return (
    <div className="border bg-white shadow-md w-full rounded-2xl s= mt-5 p-5">
      <h2 className="font-semibold mb-4">Most Bought Products</h2>
      <ul>
        {products.map((product, index) => (
          <li key={index} className="mb-2">
            {product.name} - Quantity: {product.quantity}
          </li>
        ))}
      </ul>
    </div>
  )
}
