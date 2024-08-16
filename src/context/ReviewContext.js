import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const ReviewContext = createContext()

export const ReviewProvider = ({ children, productId }) => {
  const { data: session, status } = useSession()
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/reviews/getByProduct/${productId}`,
        )
        setReviews(response.data)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    fetchReviews()
  }, [productId])

  const addReview = async (newComment, newRating, replyTo = null) => {
    if (status === 'unauthenticated') {
      toast.error('You need to sign in to submit a review.')
      return
    }

    try {
      const payload = {
        productId,
        rating: newRating,
        comment: newComment,
        userId: session.user.id,
        replyTo,
      }

      const response = await axios.post(
        `${API_BASE_URL}/reviews/addReview`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        },
      )

      if (replyTo) {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === replyTo
              ? { ...review, replies: [...review.replies, response.data] }
              : review,
          ),
        )
      } else {
        setReviews((prevReviews) => [...prevReviews, response.data])
      }

      toast.success(
        replyTo ? 'Reply added successfully.' : 'Review added successfully.',
      )
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit the review.')
    }
  }

  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`${API_BASE_URL}/reviews/delete/${reviewId}`)

      const removeReviewById = (reviewsList, reviewIdToRemove) => {
        return reviewsList
          .filter((review) => review._id !== reviewIdToRemove)
          .map((review) => ({
            ...review,
            replies: removeReviewById(review.replies || [], reviewIdToRemove),
          }))
      }

      setReviews((prevReviews) => removeReviewById(prevReviews, reviewId))

      toast.success('Review deleted successfully.')
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('Failed to delete the review.')
    }
  }
  return (
    <ReviewContext.Provider value={{ reviews, addReview, deleteReview }}>
      {children}
    </ReviewContext.Provider>
  )
}
