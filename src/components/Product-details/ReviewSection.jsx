// ReviewSection.js
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
  const { reviews, addReview, addReply, deleteReview, hasPurchased } =
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
      <h2 className="text-2xl font-semibold mb-3">Customer Reviews</h2>

      {/* Scrollable and Centered Container */}
      <div
        className={`flex overflow-x-auto space-x-4 pb-2 snap-x snap-mandatory ${
          reviews.length <= 2 ? 'md:justify-center' : ''
        }`}
      >
        {reviews.map((review) => (
          <div
            key={review._id}
            className="flex-shrink-0 w-80 h-52 pb-1 snap-start"
          >
            <ReviewItem
              review={review}
              addReply={addReply}
              deleteReview={deleteReview}
            />
          </div>
        ))}
      </div>

      {status === 'authenticated' && hasPurchased && (
        <div className="new-review">
          <p className="text-left mt-4 text-xl font-semibold mb-4">
            Rate this Product
          </p>
          <StarRating maxStars={5} onRatingChange={setNewRating} />
          <h3 className="text-left mt-4 mb-2 text-lg font-semibold">
            Add a Review
          </h3>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your review here"
            rows={4}
            className="text-[17px]"
          />
          <Button
            color="primary"
            size="sm"
            className="mt-4"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      )}

      {status === 'authenticated' && !hasPurchased && (
        <p className="text-center mt-4 text-md font-semibold mb-4">
          You must purchase this product to leave a review.
        </p>
      )}

      {status === 'unauthenticated' && (
        <p className="text-center mt-4 text-md font-semibold mb-4">
          Please sign in to leave a review.
        </p>
      )}
    </div>
  )
}

export default ReviewSection
