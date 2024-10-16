'use client'
import React, { useState, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table'
import { Input } from '@nextui-org/input'
import { Pagination } from '@nextui-org/pagination'
import { toast } from 'sonner'
import { Chip } from '@nextui-org/chip'
import ColorLegendPopover from '@/src/components/Admin/Products/ColorLegendPopover'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ExpirationTable() {
  const [products, setProducts] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    const fetchExpiringProducts = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/expiration/trackExpiration?daysUntilExpire=180`,
        )
        const data = await response.json()
        setProducts(data.products)
      } catch (error) {
        console.error('Failed to fetch expiring products:', error)
        toast('Failed to load expiration data.', {})
      }
    }
    fetchExpiringProducts()
  }, [])

  // Function to calculate days remaining until expiration
  const calculateDaysUntilExpiration = (expirationDate) => {
    const currentDate = new Date()
    const expiration = new Date(expirationDate)
    const timeDiff = expiration - currentDate
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) // Convert from milliseconds to days
  }

  // Map status to color for the Chip component
  const getStatusColor = (status) => {
    if (status === 'red') return 'error' // Red for urgent expiration
    if (status === 'yellow') return 'warning' // Yellow for warning
    return 'success' // Green for long-term expiration
  }

  const formatPrice = (price) => {
    return price !== null && price !== undefined
      ? `$${price.toFixed(2)}`
      : 'N/A'
  }

  return (
    <div className=" bg-white rounded-xl">
      <div className="flex  justify-between items-center mb-4 p-4">
        <Input
          size="small"
          className="w-96"
          clearable
          bordered
          placeholder="Search by product name..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <ColorLegendPopover />
      </div>

      <div className="overflow-x-auto p-4">
        <Table
          className="border rounded-xl "
          isHeaderSticky
          isStriped
          isCompact
          shadow="none"
        >
          <TableHeader>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Days left</TableColumn>
            <TableColumn>Expiration Date</TableColumn>
            <TableColumn>Category</TableColumn>
            <TableColumn>Subcategory</TableColumn>
            <TableColumn>Stock</TableColumn>
            <TableColumn>Price</TableColumn>
            <TableColumn>Compare Price</TableColumn>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const daysUntilExpiration = calculateDaysUntilExpiration(
                product.expirationDate,
              )
              return (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <Chip
                      variant="flat"
                      size="sm"
                      color={getStatusColor(product.status)}
                    >
                      {`${product.status.toUpperCase()} `}
                    </Chip>
                  </TableCell>
                  <TableCell> {daysUntilExpiration} days left</TableCell>
                  <TableCell>
                    {new Date(product.expirationDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.subcategory}</TableCell>
                  <TableCell>{product.currentStock}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{formatPrice(product.compareAtPrice)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4 p-4">
        <Pagination
          total={Math.ceil(products.length / rowsPerPage)}
          page={page}
          onChange={setPage}
        />
        <select
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          defaultValue={rowsPerPage}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>
    </div>
  )
}
