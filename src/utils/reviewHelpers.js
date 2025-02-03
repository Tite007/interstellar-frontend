import axios from 'axios'
import { toast } from 'sonner'
import { Textarea } from "@heroui/input"
import { Button } from "@heroui/button"
import { Send, Trash } from 'lucide-react'
import StarRating from '@/src/components/Product-details/StarRating'
import { format } from 'date-fns'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchReviews = async (productId, setReviews) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/reviews/getByProduct/${productId}`,
    )
    setReviews(response.data)
  } catch (error) {
    console.error('Error fetching reviews:', error)
  }
}

export const createReviewPayload = (
  productId,
  rating,
  comment,
  userId,
  replyTo,
) => ({
  productId,
  rating,
  comment,
  userId,
  replyTo,
})

export const postReview = async (payload, token) => {
  return await axios.post(`${API_BASE_URL}/reviews/addReview`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const deleteReview = async (reviewId, token) => {
  return await axios.delete(`${API_BASE_URL}/reviews/delete/${reviewId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const updateReviews = (newReview, setReviews) => {
  setReviews((prevReviews) => [...prevReviews, newReview])
}

export const updateReplyInReviews = (newReply, replyTo, setReviews) => {
  setReviews((prevReviews) => {
    const updatedReviews = [...prevReviews]
    const parentIndex = updatedReviews.findIndex(
      (review) => review._id === replyTo,
    )
    if (parentIndex !== -1) {
      updatedReviews[parentIndex].replies.push(newReply)
    }
    return updatedReviews
  })
}

export const resetReviewForm = (
  setNewComment,
  setNewRating,
  setReplyTo,
  setReplyText,
) => {
  setNewComment('')
  setNewRating(0)
  setReplyTo(null)
  setReplyText('')
}

export const resetReplyForm = (setReplyText, setReplyTo) => {
  setReplyText('')
  setReplyTo(null)
}

export const removeReviewFromList = (reviewId, setReviews) => {
  setReviews((prevReviews) =>
    prevReviews.filter((review) => review._id !== reviewId),
  )
}

export const handleError = (error, message) => {
  console.error(message, error)
  toast.error(message)
}

export const renderReviews = (
  reviews,
  handleDelete,
  replyTo,
  setReplyTo,
  replyText,
  setReplyText,
  handleReplySubmit,
  status,
  session,
) => {
  return reviews.map((review) => (
    <div key={review._id} style={{ marginLeft: review.isReply ? '20px' : '0' }}>
      <div className="review-item border rounded-lg mb-4 text-left p-4">
        <div className="flex justify-between">
          <div>
            <p>
              <strong>{review.user.name}</strong> rated it{' '}
              <StarRating maxStars={5} value={review.rating} readOnly />{' '}
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
                onClick={() => handleDelete(review._id)}
              >
                <Trash className="mr-2" /> Delete
              </Button>
            )}
        </div>
        {status === 'authenticated' && (
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
            <Button onClick={handleReplySubmit}>
              <Send className="mr-2" /> Send Reply
            </Button>
          </div>
        )}
        {review.replies &&
          renderReviews(
            review.replies,
            handleDelete,
            replyTo,
            setReplyTo,
            replyText,
            setReplyText,
            handleReplySubmit,
            status,
            session,
          )}
      </div>
    </div>
  ))
}
