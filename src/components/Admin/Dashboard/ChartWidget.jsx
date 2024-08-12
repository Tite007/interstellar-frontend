import React, { useEffect, useState, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import 'chartjs-adapter-date-fns'
import { processTransactions } from '@/src/utils/processTransactions'
import { Tabs, Tab } from '@nextui-org/tabs'

Chart.register(...registerables)

const ChartWidget = ({ id }) => {
  const [balanceTransactions, setBalanceTransactions] = useState([])
  const [selectedDays, setSelectedDays] = useState(7)
  const chartRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const fetchBalanceTransactions = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
        const response = await fetch(
          `${baseURL}/payment/stripe/balance-transactions`,
        )
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to fetch balance transactions: ${errorText}`)
        }
        const jsonResponse = await response.json()
        const processedData = processTransactions(jsonResponse, selectedDays)
        setBalanceTransactions(processedData)
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }

    fetchBalanceTransactions()
  }, [selectedDays])

  useEffect(() => {
    if (canvasRef.current && balanceTransactions.length > 0) {
      const ctx = canvasRef.current.getContext('2d')

      if (chartRef.current) {
        chartRef.current.destroy()
      }

      const data = {
        labels: balanceTransactions.map((txn) => new Date(txn.date)),
        datasets: [
          {
            label: 'Daily Sales Amount',
            data: balanceTransactions.map((txn) => txn.amount),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          },
        ],
      }

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'P',
              displayFormats: {
                day: 'MMM d, yyyy',
              },
            },
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount (CAD)',
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return `Amount: $${context.parsed.y.toFixed(2)}`
              },
            },
          },
        },
      }

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options,
      })
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [balanceTransactions])

  const handleTabChange = (key) => {
    setSelectedDays(parseInt(key))
  }

  return (
    <div className="p-4 border rounded-lg bg-white">
      <Tabs
        selectedKey={selectedDays.toString()}
        onSelectionChange={handleTabChange}
        variant="light"
        aria-label="Select days to view"
        color="primary"
      >
        <Tab key="7" title="7D" />
        <Tab key="15" title="15D" />
        <Tab key="30" title="30D" />
      </Tabs>
      <div className="flex">
        <div className="flex-grow">
          {balanceTransactions.length > 0 ? (
            <div className="relative w-full h-64 md:h-96">
              <canvas
                ref={canvasRef}
                id={id}
                className="w-full h-full"
              ></canvas>
            </div>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChartWidget
