// client/src/components/SkeletonSidebar.jsx
import React from 'react'
import { Skeleton } from "@heroui/skeleton"
import { Card } from "@heroui/card"

const SkeletonSidebar = () => {
  return (
    <div className="p-4 w-64 space-y-4">
      <Skeleton className=" h-56 w-full rounded-lg bg-default-300" />
      <Skeleton className="h-56 w-full rounded-lg bg-default-300" />
      <Skeleton className="h-56 w-full rounded-lg bg-default-300" />
    </div>
  )
}

export default SkeletonSidebar
