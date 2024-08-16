import React, { useState } from 'react'
import { Checkbox } from '@nextui-org/checkbox'
import { StarIcon } from '@/src/components/Product-details/StarIcon' // Import the updated StarIcon

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
        <Checkbox
          key={index + 1}
          icon={
            <StarIcon
              isSelected={index + 1 <= selectedRating}
              disableAnimation={disableAnimation}
            />
          } // Use the StarIcon
          isSelected={index + 1 <= selectedRating}
          onClick={() => handleStarClick(index + 1)}
          isReadOnly={readOnly}
          disableAnimation={disableAnimation}
        />
      ))}
    </div>
  )
}
