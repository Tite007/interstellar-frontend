import React, { useState } from 'react'
import { Checkbox } from '@nextui-org/checkbox'
import { Star } from 'lucide-react'

export default function StarRating({
  maxStars = 5,
  onRatingChange,
  value = 0,
  readOnly = false,
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
    <div className="flex gap-1">
      {Array.from({ length: maxStars }, (_, index) => (
        <Checkbox
          key={index + 1}
          icon={<Star />}
          isSelected={index + 1 <= selectedRating}
          onClick={() => handleStarClick(index + 1)}
          isReadOnly={readOnly} // Make it read-only if necessary
        />
      ))}
    </div>
  )
}
