// src/app/(customer)/customer-profile/my-reviews/[reviewId]/page.jsx

import React from 'react'
import UserReviews from '@/src/components/customer/UserReviews' // Adjust the import path if necessary

const MyReviewsPage = () => {
  return (
    <div>
      <h1 className=" container text-2xl font-semibold mb-4">My Reviews</h1>
      <UserReviews />
    </div>
  )
}

export default MyReviewsPage
