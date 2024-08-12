// File: components/Dashboard/TopProductsWidget.js
import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table'

const TopProductsWidget = ({ topProducts, totalRevenue }) => {
  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })
  }

  return (
    <div className="bg-white mt-5 shadow rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-4">Top 10 Most Sold Products</h3>
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
    </div>
  )
}

export default TopProductsWidget
