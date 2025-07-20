// customer-profile/orders/CustomerOrdersContent.jsx
'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import BreadcrumbsUserProfileOrders from '@/src/components/customer/BreadcrumbsProfileOrders'
import OrderHistoryCard from '@/src/components/customer/OrderHistoryCard'
import { Pagination } from '@heroui/pagination'
import OrderHistorySkeleton from '@/src/components/customer/OrderHistorySkeleton'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const ORDERS_PER_PAGE = 5

export default function CustomerOrdersContent() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const [userOrders, setUserOrders] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPage = Number(searchParams.get('page')) || 1

  const handleCardClick = (order) => {
    if (order && order._id) {
      router.push(`/customer-profile/orders/${order._id}?page=${currentPage}`)
    } else {
      console.error('Order ID is undefined!')
    }
  }

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/customer-profile/orders?${params.toString()}`, {
      scroll: false,
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        try {
          const userResponse = await fetch(
            `${API_BASE_URL}/auth/findUser/${session.user.id}`,
          )
          if (!userResponse.ok) throw new Error('Network response was not ok')
          const userData = await userResponse.json()
          setUser(userData)

          const ordersResponse = await fetch(
            `${API_BASE_URL}/orders/getUserOrders/${session.user.id}`,
          )
          if (!ordersResponse.ok) throw new Error('Network response was not ok')
          const ordersData = await ordersResponse.json()

          const sortedOrders = ordersData.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          )
          setUserOrders(sortedOrders)
          setTotalPages(Math.ceil(sortedOrders.length / ORDERS_PER_PAGE))
        } catch (error) {
          console.error('Failed to fetch data:', error)
        }
      }
    }

    fetchData()
  }, [session])

  if (status === 'loading') return <OrderHistorySkeleton />
  if (status === 'unauthenticated' || session?.user.role !== 'user')
    return <p>Access Denied</p>

  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE
  const paginatedOrders = userOrders.slice(
    startIndex,
    startIndex + ORDERS_PER_PAGE,
  )

  return (
    <div className="xl:container mb-10">
      <BreadcrumbsUserProfileOrders />
      {user ? (
        <>
          <div>
            <h1 className="mt- font-semibold mb-2 text-2xl">
              {user.name} {user.lastName}
            </h1>
            <p className="mt-1 font-light text-sm">
              {user.city}, {user.province}, {user.country} 🔹 Customer for:{' '}
              {calculateDurationInDays(user.time)}
            </p>
          </div>
          <div className="flex gap-4 mt-6 flex-col md:flex-row">
            <div className="flex-1">
              <h1 className="font-semibold text-xl mb-2">Your Order History</h1>
              <OrderHistoryCard
                userOrders={paginatedOrders}
                onCardClick={handleCardClick}
              />
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    showControls
                    total={totalPages}
                    initialPage={currentPage}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="md"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  )
}

const calculateDurationInDays = (time) => {
  const startDate = new Date(time)
  const currentDate = new Date()
  const differenceInTime = currentDate.getTime() - startDate.getTime()
  const days = Math.floor(differenceInTime / (1000 * 3600 * 24))
  return `${days} days`
}
