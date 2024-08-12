import { eachDayOfInterval, format } from 'date-fns'

export const processTransactions = (transactions = [], selectedDays = 7) => {
  if (!Array.isArray(transactions)) {
    return []
  }

  const dateMap = new Map()

  transactions.forEach((txn) => {
    const date = format(new Date(txn.created * 1000), 'yyyy-MM-dd')
    if (dateMap.has(date)) {
      dateMap.set(date, dateMap.get(date) + txn.amount / 100)
    } else {
      dateMap.set(date, txn.amount / 100)
    }
  })

  const today = new Date()
  const pastDate = new Date(today)
  pastDate.setDate(today.getDate() - selectedDays)

  const allDates = eachDayOfInterval({ start: pastDate, end: today }).map(
    (date) => ({
      date: format(date, 'yyyy-MM-dd'),
      amount: 0,
    }),
  )

  const mergedData = allDates.map((dateEntry) => {
    const amount = dateMap.get(dateEntry.date) || 0
    return { ...dateEntry, amount }
  })

  return mergedData
}
