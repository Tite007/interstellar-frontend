// @/src/components/customer/OrderHistorySkeleton.jsx
'use client'
import { Skeleton } from '@heroui/skeleton'
import OrderCardSkeleton from './OrderCardSkeleton'

export default function OrderHistorySkeleton() {
  return (
    <div className="xl:container mb-10">
      {/* User Info Skeleton */}
      <div className="space-y-2">
        <Skeleton className="w-1/4 h-8 rounded-lg">
          <div className="h-8 bg-default-300" />
        </Skeleton>
        <Skeleton className="w-1/3 h-4 rounded-lg">
          <div className="h-4 bg-default-200" />
        </Skeleton>
      </div>

      {/* Order History Section Skeleton */}
      <div className="flex gap-4 mt-6 flex-col md:flex-row">
        <div className="flex-1 space-y-4">
          <Skeleton className="w-1/5 h-6 rounded-lg">
            <div className="h-6 bg-default-300" />
          </Skeleton>

          {/* 5 order card skeletons */}
          {[...Array(5)].map((_, index) => (
            <OrderCardSkeleton key={index} />
          ))}

          {/* Pagination Skeleton */}
          <div className="mt-6 flex justify-center">
            <Skeleton className="w-64 h-10 rounded-lg">
              <div className="h-10 bg-default-200" />
            </Skeleton>
          </div>
        </div>
      </div>
    </div>
  )
}
