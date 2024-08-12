// client/src/components/SkeletonProductCard.jsx
import React from 'react'
import { Skeleton } from '@nextui-org/skeleton'
import { Card } from '@nextui-org/card'

const SkeletonProductCard = () => {
  return (
    <Card className="border border-gray-200 rounded-xl p-4 m-4 shadow-md text-left w-full max-w-xs">
      <Skeleton className="rounded-lg">
        <div className="h-80 w-full bg-default-300"></div>{' '}
        {/* Matches the 300px height of the image */}
      </Skeleton>
      <div className="space-y-3 mt-4">
        <Skeleton className="w-full rounded-lg">
          <div className="h-5 w-full bg-default-200"></div>{' '}
          {/* Matches the title */}
        </Skeleton>
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-4 w-full bg-default-200"></div>{' '}
          {/* Matches the taste notes */}
        </Skeleton>
        <Skeleton className="w-1/2 rounded-lg">
          <div className="h-4 w-full bg-default-200"></div>{' '}
          {/* Matches the category */}
        </Skeleton>
        <Skeleton className="w-1/3 rounded-lg">
          <div className="h-4 w-full bg-default-300"></div>{' '}
          {/* Matches the price */}
        </Skeleton>
      </div>
    </Card>
  )
}

export default SkeletonProductCard
