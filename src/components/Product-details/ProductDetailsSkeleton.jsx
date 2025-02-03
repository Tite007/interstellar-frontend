import React from 'react'
import { Skeleton } from "@heroui/skeleton"

export default function ProductDetailsSkeleton() {
  return (
    <main className="container flex-col items-center justify-between mt-10 p-4">
      <div className="block md:hidden text-left mb-4">
        <Skeleton className="h-8 w-2/3 rounded-lg bg-default-200" />
        <Skeleton className="h-6 w-1/2 rounded-lg bg-default-200 mt-2" />
        <Skeleton className="h-8 w-1/3 rounded-lg bg-default-300 mt-4" />
      </div>
      <div className="flex flex-col items-center md:flex-row md:items-start">
        <div className="w-full md:w-1/2">
          <Skeleton
            className="rounded-lg bg-default-300"
            style={{ height: '400px' }}
          />
        </div>

        <div className="w-full md:w-1/2 md:ml-20 md:text-left">
          <div className="hidden md:block">
            <Skeleton className="h-8 w-2/3 rounded-lg bg-default-200" />
            <Skeleton className="h-6 w-1/2 rounded-lg bg-default-200 mt-2" />
            <Skeleton className="h-8 w-1/3 rounded-lg bg-default-300 mt-4" />
          </div>

          <div className="mt-4">
            <Skeleton className="h-6 w-full rounded-lg bg-default-200" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Skeleton className="h-10 w-full rounded-lg bg-default-300" />
              <Skeleton className="h-10 w-full rounded-lg bg-default-300" />
            </div>
            <Skeleton className="h-6 w-1/3 mt-2 rounded-lg bg-default-200" />
          </div>

          <div className="mt-4">
            <Skeleton className="h-6 w-full rounded-lg bg-default-200" />
            <Skeleton className="h-10 w-full mt-4 rounded-lg bg-default-300" />
            <Skeleton className="h-6 w-1/3 mt-2 rounded-lg bg-default-200" />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <Skeleton className="h-10 w-full rounded-lg bg-default-300" />
            <Skeleton className="h-10 w-full rounded-lg bg-default-300" />
          </div>
        </div>
      </div>

      <div className="text-center p-4 mt-10 text-black rounded-lg">
        <Skeleton className="h-8 w-1/3 rounded-lg bg-default-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 mt-4">
          <Skeleton className="h10 w-full rounded-lg bg-default-300" />
          <Skeleton className="h-10 w-full rounded-lg bg-default-300" />
          <Skeleton className="h-10 w-full rounded-lg bg-default-300" />
          <Skeleton className="h-10 w-full rounded-lg bg-default-300" />
        </div>
        <Skeleton className="h-8 w-1/2 rounded-lg bg-default-200 mt-8" />
        <Skeleton className="h-6 w-2/3 rounded-lg bg-default-200 mt-2" />
      </div>

      <div className="mt-10">
        <Skeleton className="h-10 w-full rounded-lg bg-default-300" />
      </div>
    </main>
  )
}
