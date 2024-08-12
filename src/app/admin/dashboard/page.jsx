'use client'
import React, { useEffect, useState } from 'react'
import ChartWidget from '@/src/components/Admin/Dashboard/ChartWidget'
import BalanceWidget from '@/src/components/Admin/Dashboard/BalanceWidget'
import BalanceSummary from '@/src/components/Admin/Dashboard/BalanceSummary'
import TopProductsWidget from '@/src/components/Admin/Dashboard/TopProductsWidget'
import TotalOrdersWidget from '@/src/components/Admin/Dashboard/TotalOrdersWidget'
import { processBalanceTransactions } from '@/src/utils/processBalanceTransactions'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const Dashboard = () => {
  const [balance, setBalance] = useState(null)
  const [balanceSummary, setBalanceSummary] = useState({
    startingBalance: 0,
    accountActivity: 0,
    fees: 0,
    netChange: 0,
    totalPayouts: 0,
    endingBalance: 0,
    transactions: [],
  })
  const [topProducts, setTopProducts] = useState([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    fetch(`${API_BASE_URL}/payment/stripe/balance`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setBalance(data)
      })
      .catch((error) => console.error('Error fetching balance:', error))

    fetch(`${API_BASE_URL}/payment/stripe/balance-transactions`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        if (data && Array.isArray(data)) {
          const { summary, transactions } = processBalanceTransactions(data)
          if (summary && transactions) {
            setBalanceSummary({ ...summary, transactions })
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching balance transactions:', error)
      })

    fetch(`${API_BASE_URL}/orders/topProducts`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setTopProducts(data)
        const totalRevenue = data.reduce(
          (acc, product) => acc + product.totalRevenue,
          0,
        )
        setTotalRevenue(totalRevenue)
      })
      .catch((error) => console.error('Error fetching top products:', error))

    fetch(`${API_BASE_URL}/orders/totalOrders`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setTotalOrders(data.totalOrders)
      })
      .catch((error) => console.error('Error fetching total orders:', error))
  }, [])

  const salesData =
    balanceSummary.transactions && balanceSummary.transactions.length
      ? {
          labels: balanceSummary.transactions.map((txn) => txn.date),
          datasets: [
            {
              label: 'Daily Sales Amount',
              data: balanceSummary.transactions.map((txn) => txn.amount),
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              tension: 0,
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            },
          ],
        }
      : { labels: [], datasets: [] }

  const salesOptions = {
    scales: {
      x: { type: 'time', time: { unit: 'day' } },
      y: { beginAtZero: true },
    },
  }

  return (
    <div className="xl:container mt-4  grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <BalanceWidget balance={balance} />
      <TotalOrdersWidget totalOrders={totalOrders} />
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <ChartWidget id="salesChart" data={salesData} options={salesOptions} />
        <BalanceSummary summary={balanceSummary} />
        <TopProductsWidget
          topProducts={topProducts}
          totalRevenue={totalRevenue}
        />
      </div>
    </div>
  )
}

export default Dashboard
