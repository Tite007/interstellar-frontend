'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// SVG Icons for full, half, and empty stars
const FullStar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#FFD700"
    width="20px"
    height="20px"
  >
    <path d="M12 17.27L18.18 21 16.54 14.81 22 10.24 15.81 9.63 12 3.5 8.19 9.63 2 10.24 7.46 14.81 5.82 21z" />
  </svg>
)

const HalfStar = () => (
  <div style={{ position: 'relative', width: '20px', height: '20px' }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="#FFD700"
      width="20px"
      height="20px"
      style={{
        position: 'absolute',
        left: '0',
        top: '0',
        clipPath: 'inset(0 50% 0 0)',
      }}
    >
      <path d="M22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-6.97L22 9.24z" />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="#d3d3d3"
      width="20px"
      height="20px"
      style={{
        position: 'absolute',
        left: '0',
        top: '0',
        clipPath: 'inset(0 0 0 50%)',
      }}
    >
      <path d="M22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-6.97L22 9.24z" />
    </svg>
  </div>
)

const EmptyStar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#d3d3d3"
    width="20px"
    height="20px"
  >
    <path d="M22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-6.97L22 9.24z" />
  </svg>
)

const ProductRating = ({ productId }) => {
  const [averageRating, setAverageRating] = useState(null)
  const [totalReviews, setTotalReviews] = useState(0) // New state for total reviews

  useEffect(() => {
    if (productId) {
      axios
        .get(`${API_BASE_URL}/reviews/getByProduct/${productId}`)
        .then((response) => {
          const data = response.data
          const totalRatings = data.reduce(
            (acc, review) => acc + review.rating,
            0,
          )
          const average = totalRatings / data.length
          console.log('Calculated average rating:', average) // Log to ensure consistency
          setAverageRating(average)
          setTotalReviews(data.length) // Set total reviews
        })
        .catch((error) => console.error('Error fetching reviews:', error))
    }
  }, [productId])

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

    console.log('Rendering stars for rating:', rating) // Log to check rendering

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {Array(fullStars)
          .fill(null)
          .map((_, index) => (
            <FullStar key={index} />
          ))}
        {halfStar && <HalfStar />}
        {Array(emptyStars)
          .fill(null)
          .map((_, index) => (
            <EmptyStar key={index} />
          ))}
        {/* Display the rating value and total reviews */}
        <span
          style={{
            marginLeft: '8px',
            fontWeight: 'light',
            fontSize: '14px',
            color: '#666',
          }}
        >
          {rating.toFixed(1)} ({totalReviews} reviews)
        </span>
      </div>
    )
  }

  return (
    <div>
      {averageRating !== null ? (
        <div>{renderStars(averageRating)}</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default ProductRating
