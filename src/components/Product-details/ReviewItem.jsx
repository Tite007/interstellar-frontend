'use client'
import React, { useState } from 'react'
import { Button } from '@nextui-org/button'
import { Textarea } from '@nextui-org/input'
import { useSession } from 'next-auth/react'
import StarRating from '@/src/components/Product-details/StarRating'
import { format } from 'date-fns'
import { Trash, Send } from 'lucide-react'
import { User } from '@nextui-org/user' // Import the User component

const ReviewItem = ({ review, addReply, deleteReview, isReply = false }) => {
  const { data: session, status } = useSession()
  const [replyText, setReplyText] = useState('')
  const [replyTo, setReplyTo] = useState(null)

  const handleReplySubmit = () => {
    addReply(replyText, review._id)
    setReplyText('')
    setReplyTo(null)
  }

  return (
    <div style={{ marginLeft: isReply ? '20px' : '0' }}>
      <div className="review-item border shadow-md rounded-lg mb-2 text-left p-4">
        <div className="flex justify-between">
          <div>
            {/** User Info */}
            <div className="flex items-center mt-1 ">
              <User
                name={review.user.name}
                description={review.user.role || 'Customer'}
                avatarProps={{
                  src: review.user.avatarUrl || '/default-avatar.png',
                }}
              />
              {/** Rating Component */}
              {!isReply && review.rating !== null && (
                <span className="ml-2 text-yellow-500">
                  <StarRating maxStars={5} value={review.rating} readOnly />
                </span>
              )}
            </div>
            {/** Time and Comment */}
            <p className="text-xs mt-1 text-gray-500">
              {format(new Date(review.time), 'PPpp')}
            </p>
            <p className="mt-2">{review.comment}</p>
          </div>
          {/** Delete Button */}
          {status === 'authenticated' &&
            session.user.id === review.user._id && (
              <Button
                size="sm"
                auto
                variant="flat"
                isIconOnly
                light
                color="danger"
                onClick={() => deleteReview(review._id)}
              >
                <Trash strokeWidth={1.5} size={18} />
              </Button>
            )}
        </div>
        {/** Reply Section  Button */}
        {status === 'authenticated' && !isReply && (
          <Button
            className="mt-4"
            size="sm"
            auto
            light
            onClick={() => setReplyTo(review._id)}
          >
            Reply
          </Button>
        )}
        {replyTo === review._id && (
          <div
            style={{ marginLeft: '20px', marginBottom: '20px' }}
            className="mt-2"
          >
            <Textarea
              className="mb-4 mt-4 text-[17px]"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply here"
              rows={3}
            />
            <Button size="sm" onClick={handleReplySubmit}>
              <Send strokeWidth={1.5} size={18} className="mr-2" /> Send Reply
            </Button>
          </div>
        )}
        {/** Replies Box Message*/}
        {review.replies &&
          review.replies.length > 0 &&
          review.replies.map((reply) => (
            <div key={reply._id} className="mt-3 ">
              <ReviewItem
                review={reply}
                addReply={addReply}
                deleteReview={deleteReview}
                isReply={true}
              />
            </div>
          ))}
      </div>
    </div>
  )
}

export default ReviewItem