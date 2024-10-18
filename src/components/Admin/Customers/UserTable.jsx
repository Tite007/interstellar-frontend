'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table'
import {
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/dropdown'
import { Search, Plus, MoreVertical } from 'lucide-react'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Pagination } from '@nextui-org/pagination'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ChevronDown } from 'lucide-react'

const columns = [
  { uid: 'name', name: 'Name' },
  { uid: 'lastName', name: 'Last Name' },
  { uid: 'email', name: 'Email' },
  { uid: 'spending', name: 'Total Spending' },
  { uid: 'province', name: 'Province' },
  { uid: 'city', name: 'City' },
  { uid: 'emailSubscribed', name: 'Email Marketing' },
  { name: 'Actions', uid: 'actions' },
]
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CustomerTable() {
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(filterValue.toLowerCase()) ||
        customer.email.toLowerCase().includes(filterValue.toLowerCase()),
    )
  }, [filterValue, customers])

  useEffect(() => {
    const fetchCustomersAndSpending = async () => {
      try {
        const customerResponse = await fetch(`${API_BASE_URL}/auth/getAllUsers`)
        if (!customerResponse.ok) {
          throw new Error('Failed to fetch customers')
        }
        const customersData = await customerResponse.json()

        const spendingResponse = await fetch(
          `${API_BASE_URL}/orders/getCustomerSpending`,
        )
        if (!spendingResponse.ok) {
          throw new Error('Failed to fetch customer spending')
        }
        const spendingData = await spendingResponse.json()

        const combinedData = customersData.map((customer) => {
          const spending = spendingData.find((s) => s._id === customer._id)
          return {
            ...customer,
            spending: spending
              ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(spending.totalSpending)
              : '$0.00',
          }
        })

        setCustomers(combinedData)
        setIsLoading(false)
      } catch (error) {
        console.error(error.message)
        setIsLoading(false)
      }
    }

    fetchCustomersAndSpending()
  }, [])

  const deleteCustomer = async (id) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/deleteUser/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) throw new Error('Failed to delete customer')
        setCustomers(customers.filter((customer) => customer._id !== id))
        toast('Customer deleted successfully!', {})
      } catch (error) {
        console.error('Failed to delete user:', error)
        toast('Failed to delete customer. Please try again.', {})
      }
    }
  }

  const pages = Math.ceil(filteredCustomers.length / rowsPerPage)

  const onSearchChange = (e) => {
    setFilterValue(e.target.value)
    setPage(1)
  }

  const onRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }

  const paginatedCustomers = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredCustomers.slice(startIndex, endIndex)
  }, [page, rowsPerPage, filteredCustomers])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex xl:container bg-white mt-6 pt-8 p-5 shadow-md rounded-t-2xl  justify-between items-center">
        <Input
          size="small"
          className="w-96 "
          clearable
          bordered
          placeholder="Search by name, last name, or email..."
          value={filterValue}
          onChange={onSearchChange}
          contentLeft={<Search size="18" />}
        />
        <Link href="/admin/customers/add">
          <Button
            className="ml-6 mb-5"
            auto
            size="sm"
            color="primary"
            endContent={<Plus />}
          >
            Add New
          </Button>
        </Link>
      </div>

      <Table
        isHeaderSticky
        isStriped
        radius="md"
        isCompact
        shadow="none"
        selectionMode="multiple"
        aria-label="Customer Table"
        className="xl:container  bg-white overflow-x-auto shrink-0 p-4 pb-5 "
      >
        <TableHeader>
          <TableColumn> </TableColumn>
          {columns.map((column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          ))}
        </TableHeader>

        <TableBody className=" font-light">
          {paginatedCustomers.map((customer) => (
            <TableRow className="font-light" key={customer._id}>
              <TableCell></TableCell>
              {columns.map((column) => (
                <TableCell className=" font-light" key={column.uid}>
                  {column.uid !== 'actions' ? (
                    customer[column.uid]
                  ) : (
                    <Dropdown size="small">
                      <DropdownTrigger>
                        <Button
                          size="sm"
                          endContent={<MoreVertical />}
                          variant="light"
                        />
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Actions">
                        <DropdownItem
                          key="view"
                          onClick={() =>
                            router.push(
                              `/admin/customers/profile?id=${customer._id}`,
                            )
                          }
                        >
                          View
                        </DropdownItem>

                        <DropdownItem
                          key="edit"
                          onClick={() =>
                            router.push(
                              `/admin/customers/edit?id=${customer._id}`,
                            )
                          }
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          color="danger"
                          onClick={() => deleteCustomer(customer._id)}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex xl:container shadow-md justify-between rounded-b-2xl bg-white  items-center p-4">
        <Pagination
          total={pages}
          page={page}
          onChange={setPage}
          color="primary"
          showControls
        />

        <select
          onChange={onRowsPerPageChange}
          value={rowsPerPage}
          className="border rounded-lg p-2  w-16 text-center "
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>
    </div>
  )
}
