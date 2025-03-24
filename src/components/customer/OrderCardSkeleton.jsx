// @/src/components/customer/OrderCardSkeleton.jsx
'use client'
import { Skeleton } from '@heroui/skeleton'
import { Card } from '@heroui/card'

export default function OrderCardSkeleton() {
  return (
    <Card className="w-full space-y-4 p-4" radius="lg">
      <div className="flex gap-4">
        {/* Image Skeleton */}
        <Skeleton className="w-24 h-24 rounded-lg">
          <div className="h-24 w-24 rounded-lg bg-default-300" />
        </Skeleton>

        {/* Order Details Skeleton */}
        <div className="flex-1 space-y-3">
          <Skeleton className="w-3/5 h-4 rounded-lg">
            <div className="h-4 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/5 h-3 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 h-3 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </div>
    </Card>
  )
}
