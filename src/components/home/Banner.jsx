// components/Banner.js
'use client'
import React from 'react'
import Image from 'next/image'

const Banner = () => {
  return (
    <div className="w-full mt-5 overflow-hidden ">
      <div className="max-w-7xl mx-auto  ">
        <Image
          src="/home-banner-Muchio.jpg" // Replace with actual image path
          alt="Wrapping up MUCHIO for you"
          width={1200} // Adjust based on your image dimensions
          height={300} // Adjust based on your image dimensions
          className="w-full h-auto object-contain"
          priority
        />
      </div>
    </div>
  )
}

export default Banner
