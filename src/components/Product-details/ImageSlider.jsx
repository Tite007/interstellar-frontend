'use client'
import React, { useState } from 'react'
import Image from 'next/image'

export default function ImageSlider({ images }) {
  const [selectedImage, setSelectedImage] = useState(images[0])

  return (
    <div className="image-slider hidden md:block">
      {' '}
      {/* Apply the hidden class here */}
      <div className="main-image mb-4 rounded-lg md:mb-4 md:mr- ">
        <Image
          src={selectedImage}
          alt="Selected"
          width={700}
          height={500}
          className="rounded-lg justify-center"
        />
      </div>
      <div className="thumbnails mb-4 flex overflow-x-auto justify-center w-full">
        {' '}
        {/* Center thumbnails horizontally */}
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Thumbnail ${index}`}
            className={`thumbnail cursor-pointer mr-2 w-24 h-20 object-cover rounded transition-opacity duration-300 hover:opacity-100 ${image === selectedImage ? 'opacity-100' : 'opacity-60'}`}
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>
    </div>
  )
}
