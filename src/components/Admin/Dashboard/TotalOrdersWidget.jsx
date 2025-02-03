// File: components/Dashboard/TotalOrdersWidget.js
import React from 'react'

const TotalOrdersWidget = ({ totalOrders }) => {
  return (
    <div className="bg-white  rounded-3xl p-4">
      <h2 className="text-xl font-semibold mb-4">Total Orders</h2>
      <p className="text-2xl">
        {totalOrders !== null ? totalOrders : 'Loading...'}
      </p>
    </div>
  )
}

export default TotalOrdersWidget
