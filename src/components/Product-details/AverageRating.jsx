import React from 'react'
import StarRating from '@/src/components/Product-details/StarRating'

export default function AverageRating({ reviews = [] }) {
  const totalReviews = reviews.length
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
      : 0

  return (
    <div className="flex items-center">
      {/* Render the star rating based on the average rating */}
      <StarRating maxStars={5} value={averageRating} readOnly />
      {/* Optionally, display the total number of reviews */}
      <span className="ml-2 text-sm text-gray-600">
        ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  )
}
