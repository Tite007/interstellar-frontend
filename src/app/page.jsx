'use client'
import React from 'react'
import MainNavbarCustomer from '../components/Navbar/CustomerNavbar'
import { CartProvider } from '../context/CartContext'
import HeroBanner from '@/src/components/home/HeroBanner'
import ProductCarouselContainer from '../components/Products/ProductCarouselContainer'

export default function Home({ products }) {
  return (
    <>
      <CartProvider>
        <MainNavbarCustomer />
        <main className="container  items-center justify-between ">
          <HeroBanner />
          {/* Similar Products Carousel */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Similar Products</h2>

            <ProductCarouselContainer
              products={products}
              options={{ loop: true }}
            />
          </div>
        </main>
      </CartProvider>
    </>
  )
}
