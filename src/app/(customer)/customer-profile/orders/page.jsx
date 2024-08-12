'use client'

import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@nextui-org/button'
import OrderHistory from '@/src/components/customer/OrderHistory'
import ContactInfoCard from '@/src/components/Admin/Customers/ContactInfoCard'
import MostBoughtProductsCard from '@/src/components/Admin/Customers/MostBoughtProductsCard'
import BreadcrumbsUserProfile from '@/src/components/customer/BreadcrumbsProfile'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CustomerOrdersPage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const [mostBoughtProducts, setMostBoughtProducts] = useState([])

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

          const productsResponse = await fetch(
            `${API_BASE_URL}/orders/getUserOrders/${session.user.id}`,
          )
          if (!productsResponse.ok) {
            throw new Error('Network response was not ok')
          }
          const ordersData = await productsResponse.json()
          const productMap = {}
          ordersData.forEach((order) => {
            order.items.forEach((item) => {
              if (productMap[item.product]) {
                productMap[item.product].quantity += item.quantity
              } else {
                productMap[item.product] = {
                  name: item.name,
                  quantity: item.quantity,
                }
              }
            })
          })

          const sortedProducts = Object.values(productMap).sort(
            (a, b) => b.quantity - a.quantity,
          )
          setMostBoughtProducts(sortedProducts.slice(0, 5))
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

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const calculateDurationInDays = (time) => {
    const startDate = new Date(time)
    const currentDate = new Date()
    const differenceInTime = currentDate.getTime() - startDate.getTime()
    const days = Math.floor(differenceInTime / (1000 * 3600 * 24))
    return `${days} days`
  }

  return (
    <div className="mb-10">
      <BreadcrumbsUserProfile />
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
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1">
              <OrderHistory user={user} />
            </div>
          </div>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  )
}
