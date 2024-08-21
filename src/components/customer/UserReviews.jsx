// src/components/UserReviews.jsx

'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import ReviewItem from '@/src/components/Product-details/ReviewItem'
import { Button } from '@nextui-org/button'
import { Spinner } from '@nextui-org/spinner'
import axios from 'axios'

const UserReviews = () => {
  const { data: session, status } = useSession()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserReviews()
    }
  }, [status])

  const fetchUserReviews = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

      // Console log the userId
      console.log('User ID:', session.user.id)

      const response = await axios.get(
        `${baseURL}/reviews/getByUser/${session.user.id}`,
      )
      setReviews(response.data.reviews)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching user reviews:', error)
      setLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`/reviews/delete/${reviewId}`)
      setReviews(reviews.filter((review) => review._id !== reviewId))
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const handleAddReply = async (text, reviewId) => {
    try {
      const response = await axios.post('/reviews/addReply', {
        productId: reviews.find((review) => review._id === reviewId).product,
        userId: session.user.id,
        comment: text,
        parentReviewId: reviewId,
      })
      setReviews(
        reviews.map((review) =>
          review._id === reviewId
            ? { ...review, replies: [...review.replies, response.data] }
            : review,
        ),
      )
    } catch (error) {
      console.error('Error adding reply:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner color="primary" />
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center mt-10">
        <p>No reviews found.</p>
      </div>
    )
  }

  return (
    <div>
      {reviews.map((review) => (
        <ReviewItem
          key={review._id}
          review={review}
          addReply={handleAddReply}
          deleteReview={handleDeleteReview}
        />
      ))}
    </div>
  )
}

export default UserReviews
