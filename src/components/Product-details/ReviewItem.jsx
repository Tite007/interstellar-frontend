'use client'
import React, { useState } from 'react'
import { Button } from '@heroui/button'
import { useSession } from 'next-auth/react'
import StarRating from '@/src/components/Product-details/StarRating'
import { format } from 'date-fns'
import { Trash } from 'lucide-react'
import { User } from '@heroui/user'

const ReviewItem = ({ review, deleteReview, isReply = false }) => {
  const { data: session, status } = useSession()
  const [isExpanded, setIsExpanded] = useState(false)

  const truncatedComment =
    review.comment.length > 160
      ? `${review.comment.slice(0, 160)}...`
      : review.comment

  // Assume all top-level reviews are from verified buyers unless specified otherwise
  const isVerifiedBuyer =
    review.isVerifiedBuyer !== undefined ? review.isVerifiedBuyer : !isReply

  return (
    <div style={{ marginLeft: isReply ? '20px' : '0' }}>
      <div className="review-item border rounded-2xl mb-2 text-left p-4 w-80 max-h-60 overflow-hidden">
        <div className="flex justify-between">
          <div>
            {/** User Info */}
            <div className="flex items-center mt-1 space-x-2">
              <User
                name={review.user.name}
                description={review.user.role || 'Customer'}
                avatarProps={{
                  src: review.user.avatarUrl || '/default-avatar.png',
                }}
              />
              {/** Verified Buyer Badge */}
              {isVerifiedBuyer && !isReply && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified Buyer
                </span>
              )}
            </div>
            {/** Time and Comment */}
            <p className="text-xs mt-1 text-gray-500">
              {format(new Date(review.time), 'PPpp')}
            </p>
            {/** Rating Component */}
            {!isReply && review.rating !== null && (
              <span className=" text-yellow-500">
                <StarRating maxStars={5} value={review.rating} readOnly />
              </span>
            )}
            <p className="mt-2 h-12">
              {isExpanded ? review.comment : truncatedComment}
              {review.comment.length > 160 && (
                <Button
                  auto
                  light
                  size="xs"
                  className="ml-2"
                  onPress={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Read less' : 'Read more'}
                </Button>
              )}
            </p>
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
                onPress={() => deleteReview(review._id)}
              >
                <Trash strokeWidth={1.5} size={18} />
              </Button>
            )}
        </div>
        {/** Replies Display */}
        {review.replies &&
          review.replies.length > 0 &&
          review.replies.map((reply) => (
            <div key={reply._id} className="mt-3">
              <ReviewItem
                review={reply}
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
