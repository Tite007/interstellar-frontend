// src/components/CustomerReviewItem.jsx

'use client'
import React from 'react'
import { format } from 'date-fns'
import { User } from '@nextui-org/user'
import StarRating from '@/src/components/Product-details/StarRating'
import { Button } from '@nextui-org/button'
import { Trash } from 'lucide-react'

const CustomerReviewItem = ({ review, onDelete }) => {
  const { user = {} } = review
  const { name, role, avatarUrl } = user

  // Get the logged-in user's session info (adjust as necessary)
  const sessionUser = {} // Replace with the actual session user object

  const isReviewOwner = sessionUser?.id === user._id

  return (
    <div className="customer-review-item border shadow-md rounded-lg mb-2 text-left p-4">
      <div className="flex justify-between">
        <div>
          {/** User Info */}
          <div className="flex items-center mt-1">
            <User
              name={name || 'Unknown User'}
              description={role || 'Customer'}
              avatarProps={{
                src: avatarUrl || '/default-avatar.png',
              }}
            />
          </div>

          {/** Product Info */}
          <p className="text-sm font-semibold mt-2">
            Product: {review.product.name || 'Unknown Product'}
          </p>

          {/** Rating Component */}
          {review.rating !== null && (
            <span className="text-yellow-500">
              <StarRating maxStars={5} value={review.rating} readOnly />
            </span>
          )}

          {/** Time and Comment */}
          <p className="text-xs mt-1 text-gray-500">
            {format(new Date(review.time), 'PPpp')}
          </p>
          <p className="mt-2">{review.comment}</p>
        </div>

        {/** Delete Button */}
        {isReviewOwner && (
          <Button
            size="sm"
            auto
            variant="flat"
            isIconOnly
            light
            color="danger"
            onClick={() => onDelete(review._id)}
          >
            <Trash strokeWidth={1.5} size={18} />
          </Button>
        )}
      </div>
    </div>
  )
}

export default CustomerReviewItem
