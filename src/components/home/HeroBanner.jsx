import React from 'react'
import { Button } from '@nextui-org/button'
import Link from 'next/link'

const HeroBanner = () => {
  return (
    <section className="hero-banner ">
      <div className="container mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          {/* Left Column: Letters/Text */}
          <div className="hero-banner text">
            <h1 className="text-6xl font-bold font-sans mb-4">
              Good Ideas Start with Great Coffee
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              Enjoy the notes of our grain in every sip of our perfectly roasted
              coffees{' '}
            </p>

            <Button
              as={Link}
              href="/products"
              radius="lg"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md mt-4 hover:bg-blue-700 transition duration-300"
            >
              Shop Now
            </Button>
          </div>

          {/* Right Column: Image */}
          <div className="hero-banner__image">
            {/* <img
              src="https://via.placeholder.com/600x400"
              alt="Hero Banner"
              className="w-full h-auto rounded-lg shadow-lg"
            /> */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
