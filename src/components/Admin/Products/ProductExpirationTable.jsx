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
import { Input } from "@heroui/input"
import { Pagination } from "@heroui/pagination"
import { toast } from 'sonner'
import { Chip } from "@heroui/chip"
import { useRouter } from 'next/navigation'
import ColorLegendPopover from '@/src/components/Admin/Products/ColorLegendPopover'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ExpirationTable() {
  const [products, setProducts] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const router = useRouter()

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

  const calculateDaysUntilExpiration = (expirationDate) => {
    const currentDate = new Date()
    const expiration = new Date(expirationDate)
    const timeDiff = expiration - currentDate
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
  }

  const getStatusColor = (status) => {
    if (status === 'red') return 'error'
    if (status === 'yellow') return 'warning'
    return 'success'
  }

  const formatPrice = (price) => {
    return price !== null && price !== undefined
      ? `$${price.toFixed(2)}`
      : 'N/A'
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filterValue.toLowerCase()),
  )

  return (
    <div className="xl:container bg-white shadow-md rounded-2xl">
      <div className="flex justify-between items-center p-4">
        <Input
          size="small"
          className="sm:w-80 md:w-80 lg:w-80 w-56"
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
          className="rounded-xl"
          isHeaderSticky
          isStriped
          isCompact
          shadow="none"
        >
          <TableHeader>
            <TableColumn className="text-sm sm:w-1/4">Product Name</TableColumn>
            <TableColumn className="text-sm sm:w-1/6">Status</TableColumn>
            <TableColumn className="text-sm sm:w-1/8">Days left</TableColumn>
            <TableColumn className="text-sm sm:w-1/8">
              Expiration Date
            </TableColumn>
            <TableColumn className="text-sm sm:w-1/6">Category</TableColumn>
            <TableColumn className="text-sm sm:w-1/6">Subcategory</TableColumn>
            <TableColumn className="text-sm sm:w-1/8">Stock</TableColumn>
            <TableColumn className="text-sm sm:w-1/8">Price</TableColumn>
            <TableColumn className="text-sm sm:w-1/8">
              Compare Price
            </TableColumn>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const daysUntilExpiration = calculateDaysUntilExpiration(
                product.expirationDate,
              )

              return (
                <TableRow key={product._id}>
                  <TableCell>
                    <span
                      className="text-blue-500 cursor-pointer"
                      onClick={() =>
                        router.push(`/admin/products/edit/${product._id}`)
                      }
                    >
                      {product.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      variant="flat"
                      size="sm"
                      color={getStatusColor(product.status)}
                    >
                      {`${product.status.toUpperCase()} `}
                    </Chip>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {daysUntilExpiration} days left
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
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

      <div className="flex justify-between items-center p-4">
        <Pagination
          total={Math.ceil(filteredProducts.length / rowsPerPage)}
          page={page}
          onChange={setPage}
        />
        <select
          className="border rounded-lg p-2"
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
