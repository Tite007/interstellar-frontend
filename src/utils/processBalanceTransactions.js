// utils/processBalanceTransactions.js
export const processBalanceTransactions = (transactions) => {
  console.log('Raw Transactions:', transactions)

  if (!Array.isArray(transactions)) {
    console.error('Invalid transactions data')
    return { summary: {}, transactions: [] }
  }

  let startingBalance = 0.0
  let totalActivity = 0.0
  let totalFees = 0.0
  let totalPayouts = 0.0
  let netChange = 0.0

  const processedTransactions = transactions.map((transaction) => {
    console.log('Processing transaction:', transaction)

    totalActivity += transaction.amount / 100
    totalFees += transaction.fee / 100
    netChange += transaction.net / 100

    return {
      date: new Date(transaction.created * 1000).toISOString().split('T')[0],
      amount: transaction.amount / 100,
    }
  })

  let endingBalance = startingBalance + netChange - totalPayouts

  const summary = {
    startingBalance,
    accountActivity: totalActivity,
    fees: totalFees,
    netChange,
    totalPayouts,
    endingBalance,
  }

  console.log('Processed Summary:', summary)
  console.log('Processed Transactions:', processedTransactions)

  return {
    summary,
    transactions: processedTransactions,
  }
}
