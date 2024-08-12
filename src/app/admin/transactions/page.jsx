import TransactionsTable from '@/src/components/Admin/Transactions/TransactionsTable'
import React from 'react'

export default function TransactionsPage() {
  return (
    <div>
      <h1 className=" xl:container text-2xl mt-10 font-semibold text-gray-700 ">
        Transactions
      </h1>
      <TransactionsTable />
    </div>
  )
}
