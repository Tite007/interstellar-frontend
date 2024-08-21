// src/app/(customer)/customer-profile/my-reviews/[reviewId]/page.jsx

import React from 'react'
import UserReviews from '@/src/components/customer/UserReviews'

const MyReviewsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Reviews</h1>
      <UserReviews />
    </div>
  )
}

export default MyReviewsPage
