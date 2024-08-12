'use client'

import React, { useEffect, useState } from 'react'
import CustomerOrderHistory from '@/src/components/Admin/Customers/CustomerOrderHistory'
import ContactInfoCard from '@/src/components/Admin/Customers/ContactInfoCard'
import MostBoughtProductsCard from '@/src/components/Admin/Customers/MostBoughtProductsCard'
import BreadcrumbsCustomerProfile from '@/src/components/Admin/Customers/BreadcrumbsProfile'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [mostBoughtProducts, setMostBoughtProducts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const id = searchParams.get('id')

      if (id) {
        try {
          const userResponse = await fetch(
            `${API_BASE_URL}/auth/findUser/${id}`,
          )
          if (!userResponse.ok) {
            throw new Error('Network response was not ok')
          }
          const userData = await userResponse.json()
          console.log('Fetched user data:', userData)
          setUser(userData)

          const productsResponse = await fetch(
            `${API_BASE_URL}/orders/getUserOrders/${id}`,
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
  }, [])

  if (!user) {
    return <div>Loading user data...</div>
  }

  const calculateDurationInDays = (time) => {
    const startDate = new Date(time)
    const currentDate = new Date()
    const differenceInTime = currentDate.getTime() - startDate.getTime()
    const days = Math.floor(differenceInTime / (1000 * 3600 * 24))
    return `${days} days`
  }

  return (
    <div className="xl:container">
      <BreadcrumbsCustomerProfile />
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
        <div className="flex-1 ">
          <CustomerOrderHistory user={user} />
        </div>
        <div>
          <ContactInfoCard user={user} />
          <MostBoughtProductsCard products={mostBoughtProducts} />
        </div>
      </div>
    </div>
  )
}
