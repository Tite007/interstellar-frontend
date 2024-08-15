// components/ProductCard.js
import Image from 'next/image'
import React from 'react'

const SimilarProductsCard = ({ product }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-4 m-4 shadow-md text-left min-w-[300px] max-w-[320px]">
      <Image
        src={product.images[0]}
        alt={product.name}
        className="w-full h-auto max-w-xs mx-auto rounded-t-md mb-4"
        width={300}
        height={300}
        priority
        style={{ objectFit: 'cover', width: '260px', height: '260px' }} // Ensure the image fills the space
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className=" text-sm text-gray-500">
        {product.technicalData?.tasteNotes}
      </p>
      <p className="text-black">{product.category}</p>
      <p className="text-gray-900 font-bold">${product.price.toFixed(2)}</p>
    </div>
  )
}

export default SimilarProductsCard
