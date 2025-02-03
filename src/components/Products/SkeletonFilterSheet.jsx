// client/src/components/SkeletonFilterSheet.jsx
import React from 'react'
import { Skeleton } from "@heroui/skeleton"
import { Card } from "@heroui/card"

const SkeletonFilterSheet = () => {
  return (
    <Card className="w-full p-4 space-y-4">
      <Skeleton className="h-8 w-full rounded-lg bg-default-300" />
      <Skeleton className="h-8 w-full rounded-lg bg-default-300" />
      <Skeleton className="h-8 w-full rounded-lg bg-default-300" />
    </Card>
  )
}

export default SkeletonFilterSheet
