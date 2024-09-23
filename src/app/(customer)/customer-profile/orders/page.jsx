'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import BreadcrumbsUserProfile from '@/src/components/customer/BreadcrumbsProfile'
import OrderHistoryCard from '@/src/components/customer/OrderHistoryCard'
import { useRouter } from 'next/navigation'
import BreadcrumbsUserProfileOrders from '@/src/components/customer/BreadcrumbsProfileOrders'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CustomerOrdersPage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const [userOrders, setUserOrders] = useState([])
  const router = useRouter()

  const handleCardClick = (order) => {
    if (order && order._id) {
      router.push(`/customer-profile/orders/${order._id}`)
    } else {
      console.error('Order ID is undefined!')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        try {
          const userResponse = await fetch(
            `${API_BASE_URL}/auth/findUser/${session.user.id}`,
          )
          if (!userResponse.ok) {
            throw new Error('Network response was not ok')
          }
          const userData = await userResponse.json()
          setUser(userData)

          const ordersResponse = await fetch(
            `${API_BASE_URL}/orders/getUserOrders/${session.user.id}`,
          )
          if (!ordersResponse.ok) {
            throw new Error('Network response was not ok')
          }
          const ordersData = await ordersResponse.json()

          // Sort orders by most recent
          const sortedOrders = ordersData.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          )

          setUserOrders(sortedOrders)
        } catch (error) {
          console.error('Failed to fetch data:', error)
        }
      }
    }

    fetchData()
  }, [session])

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'unauthenticated' || session?.user.role !== 'user') {
    return <p>Access Denied</p>
  }

  return (
    <div className=" container mb-10 ">
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
                userOrders={userOrders}
                onCardClick={handleCardClick}
              />
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
