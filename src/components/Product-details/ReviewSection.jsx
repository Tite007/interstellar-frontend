'use client'
import React, { useState, useContext } from 'react'
import { Button } from '@nextui-org/button'
import { Textarea } from '@nextui-org/input'
import { useSession } from 'next-auth/react'
import StarRating from '@/src/components/Product-details/StarRating'
import { Toaster } from 'sonner'
import { Send, Trash } from 'lucide-react'
import { format } from 'date-fns'
import { ReviewContext } from '@/src/context/ReviewContext'

const ReviewSection = ({ productId }) => {
  const { data: session, status } = useSession()
  const { reviews, addReview, deleteReview } = useContext(ReviewContext)
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(0)
  const [replyTo, setReplyTo] = useState(null)
  const [replyText, setReplyText] = useState('')

  const handleSubmit = () => {
    if (replyTo) {
      // Submit a reply (without rating)
      addReview(replyText, null, replyTo)
      setReplyText('')
      setReplyTo(null)
    } else {
      // Submit a new review (with rating)
      addReview(newComment, newRating)
      setNewComment('')
      setNewRating(0)
    }
  }

  const renderReviews = (reviews, isReply = false) => {
    return reviews.map((review) => (
      <div key={review._id} style={{ marginLeft: isReply ? '20px' : '0' }}>
        <div className="review-item border rounded-lg mb-4 text-left p-4">
          <div className="flex justify-between">
            <div>
              <p>
                <strong>{review.user.name}</strong>{' '}
                {isReply ? null : 'rated it'}{' '}
                {!isReply && (
                  <StarRating maxStars={5} value={review.rating} readOnly />
                )}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(review.time), 'PPpp')}
              </p>
              <p>{review.comment}</p>
            </div>
            {status === 'authenticated' &&
              session.user.id === review.user._id && (
                <Button
                  size="sm"
                  auto
                  light
                  color="error"
                  onClick={() => deleteReview(review._id)}
                >
                  <Trash className="mr-2" /> Delete
                </Button>
              )}
          </div>
          {status === 'authenticated' && !isReply && (
            <Button size="sm" auto light onClick={() => setReplyTo(review._id)}>
              Reply
            </Button>
          )}
          {replyTo === review._id && (
            <div style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Textarea
                className="mb-4 mt-4"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply here"
                rows={2}
              />
              <Button onClick={handleSubmit}>
                <Send className="mr-2" /> Send Reply
              </Button>
            </div>
          )}
          {review.replies &&
            review.replies.length > 0 &&
            renderReviews(review.replies, true)}
        </div>
      </div>
    ))
  }

  return (
    <div className="review-section">
      <Toaster position="top-right" richColors />
      <h2>Customer Reviews</h2>
      {renderReviews(reviews)}

      {status === 'authenticated' && !replyTo ? (
        <div className="new-review">
          <p className="text-left mb-4">Rate this Product</p>
          <StarRating maxStars={5} onRatingChange={setNewRating} />
          <h3>Add a Review</h3>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your review here"
            rows={4}
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      ) : (
        status === 'authenticated' &&
        replyTo && (
          <p>You are replying to a comment. Use the reply section above.</p>
        )
      )}
    </div>
  )
}

export default ReviewSection
