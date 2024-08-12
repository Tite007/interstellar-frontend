// components/BalanceSummary.js
import React from 'react'

const BalanceSummary = ({ summary }) => {
  if (!summary || typeof summary.startingBalance !== 'number') {
    return <div>Loading...</div>
  }

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })
  }

  return (
    <div className="bg-white shadow mt-5  rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Balance Summary</h2>
      <div className="overflow-x-auto pb-4 ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th>Starting Balance</th>
              <th>Account Activity</th>
              <th>Fees</th>
              <th>Net Balance Change</th>
              <th>Total Payouts</th>
              <th>Ending Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center pt-4">
              <td>{formatCurrency(summary.startingBalance)}</td>
              <td>{formatCurrency(summary.accountActivity)}</td>
              <td>{`-${formatCurrency(summary.fees)}`}</td>
              <td>{formatCurrency(summary.netChange)}</td>
              <td>{formatCurrency(summary.totalPayouts)}</td>
              <td>{formatCurrency(summary.endingBalance)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BalanceSummary
