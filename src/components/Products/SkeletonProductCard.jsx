// client/src/components/SkeletonProductCard.jsx
import React from 'react'
import { Skeleton } from '@heroui/skeleton'
import { Card } from '@heroui/card'

const SkeletonProductCard = () => {
  return (
    <Card className="border border-gray-200 rounded-xl p-4 shadow-md text-left w-full">
      {/* Image placeholder */}
      <Skeleton className="rounded-lg">
        <div className="h-48 sm:h-56 md:h-64 w-full bg-default-300"></div>
      </Skeleton>

      {/* Text placeholders */}
      <div className="space-y-3 mt-4">
        {/* Title */}
        <Skeleton className="w-full rounded-lg">
          <div className="h-5 w-full bg-default-200"></div>
        </Skeleton>

        {/* Subtitle or secondary info */}
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-4 w-full bg-default-200"></div>
        </Skeleton>

        {/* Price or additional info */}
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-4 w-full bg-default-300"></div>
        </Skeleton>
      </div>
    </Card>
  )
}

export default SkeletonProductCard
