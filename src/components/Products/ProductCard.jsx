// components/ProductCard.js
import Image from 'next/image'
import React from 'react'

const ProductCard = ({ product }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 m-1 shadow-md text-left sm:min-w-[260px] h-[340px] md:h-[400px] sm:max-w-[5000px] lg:max-w-[340px]">
      <div className="relative w-full h-[200px] md:h-[250px] lg:h-[260px] ">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="object-cover rounded-t-md"
          priority
        />
      </div>
      <h3 className="text-md font-semibold mt-2 sm:text-md md:text-lg ">
        {product.name}
      </h3>
      <p className="text-xs md:text-md lg:text-md xl:text-md text-gray-500">
        {product.technicalData?.tasteNotes}
      </p>
      <p className="text-black text-xs md:text-md lg:text-md xl:text-md">
        {product.category}
      </p>
      <p className="text-gray-900 font-bold">${product.price.toFixed(2)}</p>
    </div>
  )
}

export default ProductCard
