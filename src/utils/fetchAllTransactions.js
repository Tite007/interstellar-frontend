// utils/fetchAllTransactions.js
export const fetchAllTransactions = async (stripe) => {
  let transactions = []
  let hasMore = true
  let startingAfter = null

  while (hasMore) {
    const response = await stripe.balanceTransactions.list({
      limit: 100, // Fetch maximum allowed items per request
      starting_after: startingAfter,
    })

    transactions = transactions.concat(response.data)
    hasMore = response.has_more

    if (hasMore) {
      startingAfter = response.data[response.data.length - 1].id
    }
  }

  return transactions
}
