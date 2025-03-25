'use client'
import React from 'react'
import MainNavbarCustomer from '../components/Navbar/CustomerNavbar'
import { CartProvider } from '../context/CartContext'
import HeroBanner from '@/src/components/home/HeroBanner'
import ProductCarouselContainer from '../components/Products/ProductCarouselContainer'
import SubcategoryProductSection from '@/src/components/home/SubcategoryProductSection'
import CategoriesCarousel from '../components/home/CategoryCarousel'
import Banner from '../components/home/Banner'
import CustomerChatBox from '../components/customer/CustomerChatBox'

export default function Home() {
  return (
    <>
      <CartProvider>
        <MainNavbarCustomer />
        <CustomerChatBox /> {/* Added here */}
        <main className="xl:container mx-auto items-center justify-between">
          {/* Add the banner at the top */}
          <HeroBanner />
          <Banner />

          <div className=" p-4">
            <h2 className="text-xl md:text-2xl lg:text-2xl font-semibold font-sans"></h2>
            <CategoriesCarousel />
          </div>
          {/* 
          <div className="mt-16">
            <h2 className="text-2xl font-semibold font-sans mb-6">
              Bakery Goods
            </h2>
            <SubcategoryProductSection subcategoryId="670574babca4093879df787a" />
          </div>
          {/* 
          <div className="mt-16">
            <h2 className="text-2xl font-semibold font-sans mb-6">
              Health & Medicine
            </h2>
            <SubcategoryProductSection subcategoryId="6704597449fb7e91c33c0f30" />
          </div> */}
          {/* Subcategory Sections */}
          <div className=" p-4 mt-5">
            <h2 className="text-2xl font-semibold font-sans mb-6">
              Specialty Coffee
            </h2>
            <SubcategoryProductSection subcategoryId="67035c09407c1bf49bcf2720" />
          </div>
          {/* Similar Products Carousel */}
          {/*<div className="mt-16">
            <h2 className="text-2xl font-semibold font-sans mb-6">
              Similar Products
            </h2>
            <ProductCarouselContainer options={{ loop: true }} />
          </div> */}
        </main>
      </CartProvider>
    </>
  )
}
