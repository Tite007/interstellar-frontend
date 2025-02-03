'use client'

import React, { useState, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table"
import { Button } from "@heroui/button"
import { Pagination } from "@heroui/pagination"
import { toast } from 'sonner' // Import the toast

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const transactionColumns = [
  { name: 'ID', uid: 'id' },
  { name: 'Date', uid: 'created' },
  { name: 'Amount (CAD)', uid: 'amount' },
  { name: 'Fee (CAD)', uid: 'fee' },
  { name: 'Net Amount (CAD)', uid: 'net' },
  { name: 'Currency', uid: 'currency' },
  { name: 'Description', uid: 'description' },
  { name: 'Status', uid: 'status' },
]

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]) // Ensure transactions is initialized as an empty array
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/payment/stripe/balance-transactions`,
        )
        const data = await response.json()
        console.log('Fetched data:', data) // Log the fetched data
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format')
        }
        data.sort((a, b) => b.created - a.created) // Sort by date descending
        setTransactions(data) // Directly set the transactions state
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
        toast.error('Failed to fetch transactions.')
      }
    }

    fetchTransactions()
  }, [])

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatAmount = (amount) => {
    return (amount / 100).toFixed(2)
  }

  const itemsPerPage = 15
  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const currentTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div className="xl:container  bg-white p-4 shadow-md rounded-2xl mt-2">
      <Table
        isHeaderSticky
        isStriped
        isCompact
        shadow="none"
        selectionMode="none"
        aria-label="Transaction Table"
      >
        <TableHeader>
          {transactionColumns.map((column) => (
            <TableColumn key={column.uid} className="text-center">
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {currentTransactions.map((transaction, index) => (
            <TableRow key={index}>
              {transactionColumns.map((column, colIndex) => (
                <TableCell key={colIndex} className="text-center">
                  {column.uid === 'created'
                    ? formatDate(transaction.created)
                    : column.uid === 'amount'
                      ? `$${formatAmount(transaction.amount)}`
                      : column.uid === 'fee'
                        ? `$${formatAmount(transaction.fee)}`
                        : column.uid === 'net'
                          ? `$${formatAmount(transaction.net)}`
                          : transaction[column.uid]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        <Pagination
          showShadow
          showControls
          color="primary"
          total={totalPages}
          initialPage={1}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  )
}
