import Image from 'next/image'
import React from 'react'

const Thumb = ({ selected, index, onClick, image }) => {
  return (
    <div
      className={`embla-thumbs__slide ${
        selected ? 'embla-thumbs__slide--selected' : ''
      }`}
    >
      <button
        onClick={onClick}
        type="button"
        className="embla-thumbs__slide__button"
      >
        <Image
          src={image}
          alt={`Thumbnail ${index}`}
          className="embla-thumbs__slide__img rounded-lg"
          width={100}
          height={100}
        />
      </button>
    </div>
  )
}

export default Thumb
