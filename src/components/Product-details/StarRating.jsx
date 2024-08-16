import React, { useState } from 'react'
import { StarIcon } from '@/src/components/Product-details/StarIcon' // Assuming this imports the StarIcon correctly

function StarCheckbox({ isSelected, onClick, disableAnimation }) {
  return (
    <div
      className={`inline-block cursor-pointer ${isSelected ? 'text-yellow-500 ' : 'text-gray-400'}`}
      onClick={onClick}
    >
      <StarIcon
        size={19}
        isSelected={isSelected}
        disableAnimation={disableAnimation}
      />
    </div>
  )
}

export default function StarRating({
  maxStars = 5,
  onRatingChange,
  value = 0,
  readOnly = false,
  disableAnimation = false,
}) {
  const [selectedRating, setSelectedRating] = useState(value)

  const handleStarClick = (rating) => {
    if (!readOnly) {
      setSelectedRating(rating)
      if (onRatingChange) {
        onRatingChange(rating)
      }
    }
  }

  return (
    <div className="flex mt-1">
      {Array.from({ length: maxStars }, (_, index) => (
        <StarCheckbox
          key={index + 1}
          isSelected={index + 1 <= selectedRating}
          disableAnimation={disableAnimation}
          onClick={() => handleStarClick(index + 1)}
        />
      ))}
    </div>
  )
}
