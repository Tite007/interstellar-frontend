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
    <div className="bg-white mt-4 rounded-3xl p-4">
      <h2 className="text-xl font-semibold mb-4">Balance Summary</h2>
      <div className="flex justify-center overflow-x-auto pb-4">
        {' '}
        <table className="min-w-30 divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 min-w-[30px]">Starting Balance</th>
              <th className="px-6 py-3 min-w-[30px]">Account Activity</th>
              <th className="px-6 py-3 min-w-[30px]">Fees</th>
              <th className="px-6 py-3 min-w-[30px]">Net Balance Change</th>
              <th className="px-6 py-3 min-w-[30px]">Total Payouts</th>
              <th className="px-6 py-3 min-w-[30px]">Ending Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center pt-4">
              <td className="px-6 py-3">
                {formatCurrency(summary.startingBalance)}
              </td>
              <td className="px-6 py-3">
                {formatCurrency(summary.accountActivity)}
              </td>
              <td className="px-6 py-3 text-red-700">{`${formatCurrency(summary.fees)}`}</td>
              <td className="px-6 py-3">{formatCurrency(summary.netChange)}</td>
              <td className="px-6 py-3">
                {formatCurrency(summary.totalPayouts)}
              </td>
              <td className="px-6 py-3">
                {formatCurrency(summary.endingBalance)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BalanceSummary
