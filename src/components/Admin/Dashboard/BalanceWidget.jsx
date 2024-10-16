// components/BalanceWidget.js
import React from 'react'

const BalanceWidget = ({ balance }) => {
  const formatCurrency = (amount, currency) => {
    return (amount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    })
  }

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4">Stripe Balance</h2>
      {balance ? (
        <div>
          <p>
            Available:{' '}
            {formatCurrency(
              balance.available[0].amount,
              balance.available[0].currency,
            )}
          </p>
          <p>
            Pending:{' '}
            {formatCurrency(
              balance.pending[0].amount,
              balance.pending[0].currency,
            )}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default BalanceWidget
