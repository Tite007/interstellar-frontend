// src/components/customer/UserReviews.jsx

'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import CustomerReviewItem from '@/src/components/customer/CustomerReviewItem'
import { Spinner } from '@nextui-org/spinner'
import axios from 'axios'

const UserReviews = () => {
  const { data: session, status } = useSession()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserReviews()
    }
  }, [status])

  const fetchUserReviews = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
      const response = await axios.get(
        `${baseURL}/reviews/getByUser/${session.user.id}`,
      )
      setReviews(response.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching user reviews:', error)
      setReviews([])
      setLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
      await axios.delete(`${baseURL}/reviews/delete/${reviewId}`)
      setReviews(reviews.filter((review) => review._id !== reviewId))
    } catch (error) {
      console.error('Error deleting review:', error)
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
        <CustomerReviewItem
          key={review._id}
          review={review}
          onDelete={handleDeleteReview}
        />
      ))}
    </div>
  )
}

export default UserReviews
