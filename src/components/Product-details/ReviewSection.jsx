'use client'
import React, { useState, useContext } from 'react'
import { Button } from '@nextui-org/button'
import { Textarea } from '@nextui-org/input'
import { useSession } from 'next-auth/react'
import StarRating from '@/src/components/Product-details/StarRating'
import { Toaster } from 'sonner'
import ReviewItem from './ReviewItem'
import { ReviewContext } from '@/src/context/ReviewContext'

const ReviewSection = ({ productId }) => {
  const { data: session, status } = useSession()
  const { reviews, addReview, addReply, deleteReview } =
    useContext(ReviewContext)
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(0)

  const handleSubmit = () => {
    addReview(newComment, newRating)
    setNewComment('')
    setNewRating(0)
  }

  return (
    <div className="review-section">
      <Toaster position="top-right" richColors />
      <h2 className=" text-xl font-semibold mb-2">Customer Reviews</h2>
      {reviews.map((review) => (
        <ReviewItem
          key={review._id}
          review={review}
          addReply={addReply}
          deleteReview={deleteReview}
        />
      ))}

      {status === 'authenticated' && (
        <div className="new-review">
          <p className="text-left text-lg font-semibold mb-4">
            Rate this Product
          </p>
          <StarRating maxStars={5} onRatingChange={setNewRating} />
          <h3 className=" text-left mt-4 mb-2 text-lg font-semibold">
            Add a Review
          </h3>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your review here"
            rows={4}
          />
          <Button size="sm" className=" mt-4" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      )}
    </div>
  )
}

export default ReviewSection
