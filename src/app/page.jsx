'use client'
import React from 'react'
import MainNavbarCustomer from '../components/Navbar/CustomerNavbar'
import { CartProvider } from '../context/CartContext'
import HeroBanner from '@/src/components/home/HeroBanner'
import ProductCarouselContainer from '../components/Products/ProductCarouselContainer'
import SubcategoryProductSection from '@/src/components/home/SubcategoryProductSection'

export default function Home() {
  return (
    <>
      <CartProvider>
        <MainNavbarCustomer />
        <main className="container items-center justify-between">
          <HeroBanner />

          <div className="mt-16">
            <h2 className="text-2xl font-semibold font-sans mb-6">
              Bakery Goods
            </h2>
            <SubcategoryProductSection subcategoryId="670574babca4093879df787a" />
          </div>
          <div className="mt-16">
            <h2 className="text-2xl font-semibold font-sans mb-6">
              Health & Medicine
            </h2>
            <SubcategoryProductSection subcategoryId="6704597449fb7e91c33c0f30" />
          </div>
          {/* Subcategory Sections */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold font-sans mb-6">
              Specialty Coffee
            </h2>
            <SubcategoryProductSection subcategoryId="67035c09407c1bf49bcf2720" />
          </div>

          {/* Similar Products Carousel */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold font-sans mb-6">
              Similar Products
            </h2>
            <ProductCarouselContainer options={{ loop: true }} />
          </div>
        </main>
      </CartProvider>
    </>
  )
}
