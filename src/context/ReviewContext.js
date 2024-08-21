import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const ReviewContext = createContext()

export const ReviewProvider = ({ children, productId }) => {
  const { data: session, status } = useSession()
  const [reviews, setReviews] = useState([])
  const [hasPurchased, setHasPurchased] = useState(false)

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

    const checkPurchaseStatus = async () => {
      if (status === 'authenticated') {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/reviews/hasPurchased/${productId}`,
            {
              params: { userId: session.user.id },
            },
          )
          setHasPurchased(response.data.hasPurchased)
        } catch (error) {
          console.error('Error checking purchase status:', error)
          toast.error('Failed to verify purchase status.')
        }
      }
    }

    fetchReviews()
    checkPurchaseStatus()
  }, [productId, status, session])

  const addReview = async (newComment, newRating) => {
    if (status === 'unauthenticated') {
      toast.error('You need to sign in to submit a review.')
      return
    }

    if (!hasPurchased) {
      toast.error(
        'Only users who have purchased this product can write a review.',
      )
      return
    }

    try {
      const payload = {
        productId,
        rating: newRating,
        comment: newComment,
        userId: session.user.id, // Using session to get the user ID
      }

      const response = await axios.post(
        `${API_BASE_URL}/reviews/addReview`,
        payload,
      )

      setReviews((prevReviews) => [...prevReviews, response.data])

      toast.success('Review added successfully.')
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit the review.')
    }
  }

  const addReply = async (newComment, replyTo) => {
    if (status === 'unauthenticated') {
      toast.error('You need to sign in to submit a reply.')
      return
    }

    if (!hasPurchased) {
      toast.error(
        'Only users who have purchased this product can reply to a review.',
      )
      return
    }

    try {
      const payload = {
        productId,
        comment: newComment,
        userId: session.user.id, // Using session to get the user ID
        replyTo, // The ID of the review being replied to
      }

      const response = await axios.post(
        `${API_BASE_URL}/reviews/addReview`,
        payload,
      )

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === replyTo
            ? { ...review, replies: [...review.replies, response.data] }
            : review,
        ),
      )

      toast.success('Reply added successfully.')
    } catch (error) {
      console.error('Error submitting reply:', error)
      toast.error('Failed to submit the reply.')
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
    <ReviewContext.Provider
      value={{ reviews, addReview, addReply, deleteReview, hasPurchased }}
    >
      {children}
    </ReviewContext.Provider>
  )
}
