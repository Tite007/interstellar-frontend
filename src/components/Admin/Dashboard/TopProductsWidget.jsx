// File: components/Dashboard/TopProductsWidget.js
import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table'
import { Pagination } from '@heroui/pagination'

const TopProductsWidget = ({
  topProducts,
  totalRevenue,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })
  }

  return (
    <div className="bg-white mt-4 rounded-3xl p-4">
      <h3 className="text-xl mt-4 font-semibold mb-4">
        Top 10 Most Sold Products
      </h3>
      <Table shadow="none" isCompact aria-label="Top Products Table">
        <TableHeader>
          <TableColumn>Product Description</TableColumn>
          <TableColumn>Quantity Sold</TableColumn>
          <TableColumn>% of Sales</TableColumn>
          <TableColumn>Total Revenue</TableColumn>
        </TableHeader>
        <TableBody>
          {topProducts.map((product, index) => {
            const percentOfSales = (
              (product.totalRevenue / totalRevenue) *
              100
            ).toFixed(2)
            return (
              <TableRow
                key={product._id || index} // Ensure each row has a unique key
                className={index % 2 === 0 ? 'bg-white' : ' bg-gray-100'}
              >
                <TableCell className="py-2 px-4">{product.name}</TableCell>
                <TableCell className="py-2 px-4">{product.totalSold}</TableCell>
                <TableCell className="py-2 px-4">{percentOfSales}%</TableCell>
                <TableCell className="py-2 px-4">
                  {formatCurrency(product.totalRevenue)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Pagination Component */}
      <div className="flex justify-center mt-4">
        <Pagination
          total={totalPages}
          initialPage={currentPage}
          onChange={onPageChange}
        />
      </div>
    </div>
  )
}

export default TopProductsWidget
