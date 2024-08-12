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
import { columns } from '@/src/components/Admin/Products/data' // Assume you have a customers data array and columns definition
import Link from 'next/link'
import { useRouter } from 'next/navigation' // Correct import for Next.js router
import { toast } from 'sonner' // Import the toast

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// ProductsTable component
export default function ProductsTable() {
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [products, setProducts] = useState([])
  const router = useRouter()

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`
  }

  const filteredProducts = useMemo(() => {
    const result = []
    products.forEach((product) => {
      result.push({ ...product, isVariant: false })
      product.variants.forEach((variant, index) => {
        result.push({
          ...product,
          isVariant: true,
          variantName: `${product.name} - ${variant.optionValues[0].value}`,
          variantPrice: variant.optionValues[0].price,
          variantQuantity: variant.optionValues[0].quantity,
          variantId: `${product._id}-${index}`, // Create a unique variant ID
        })
      })
    })
    return result.filter(
      (product) =>
        product.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        product.price
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        product.category.toLowerCase().includes(filterValue.toLowerCase()),
    )
  }, [filterValue, products])

  // Fetch products data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/getAllProducts`)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }

    fetchProducts()
  }, [])

  const pages = Math.ceil(filteredProducts.length / rowsPerPage)

  // Delete a product
  const deleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(
          `$${API_BASE_URL}/products/deleteProduct/${id}`,
          {
            method: 'DELETE',
          },
        )
        if (!response.ok) throw new Error('Failed to delete product')
        // Remove the product from the state to update the UI
        setProducts(products.filter((product) => product._id !== id))
        toast('Product deleted successfully!', {})
      } catch (error) {
        console.error('Failed to delete product:', error)
        toast('Failed to delete product. Please try again.', {})
      }
    }
  }

  const onSearchChange = (e) => {
    setFilterValue(e.target.value)
    setPage(1) // Reset to first page with new filter
  }

  const onRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1) // Reset to first page with new rows per page
  }

  return (
    <div>
      {/* Input and Button for Adding New Product */}
      <div className="flex xl:container bg-white mt-6 pt-8 p-5 rounded-t-xl justify-between items-center">
        <Input
          size="small"
          className="w-96 "
          clearable
          bordered
          placeholder="Search by name, category, or price..."
          value={filterValue}
          onChange={onSearchChange}
          contentLeft={<Search size="18" />}
        />
        <Link href="/admin/products/add" passHref>
          <Button
            size="sm"
            className="ml-6"
            auto
            color="primary"
            endContent={<Plus />}
          >
            Add New
          </Button>
        </Link>
      </div>

      {/* Table Display */}
      <Table
        isHeaderSticky
        isStriped
        isCompact
        selectionMode="multiple"
        aria-label="Product Table"
        shadow="none"
        className="xl:container  bg-white overflow-x-auto shrink-0 p-2 "
      >
        <TableHeader>
          <TableColumn></TableColumn>
          {columns.map((column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          ))}
        </TableHeader>
        <TableBody className="font-light">
          {filteredProducts
            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
            .map((product) => (
              <TableRow
                className="font-light"
                key={product.isVariant ? product.variantId : product._id}
              >
                <TableCell
                  key={`${product.isVariant ? product.variantId : product._id}-empty`}
                ></TableCell>
                {columns.map((column) => (
                  <TableCell
                    className="font-light"
                    key={`${product.isVariant ? product.variantId : product._id}-${column.uid}`}
                  >
                    {column.uid !== 'actions' ? (
                      product.isVariant ? (
                        column.uid === 'name' ? (
                          product.variantName
                        ) : column.uid === 'price' ? (
                          formatCurrency(product.variantPrice)
                        ) : column.uid === 'currentStock' ? (
                          product.variantQuantity
                        ) : (
                          product[column.uid]
                        )
                      ) : column.uid === 'currentStock' ? (
                        product.currentStock
                      ) : column.uid === 'price' ? (
                        formatCurrency(product[column.uid])
                      ) : (
                        product[column.uid]
                      )
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
                          <DropdownItem key="view">View</DropdownItem>
                          <DropdownItem
                            key="edit"
                            onClick={() =>
                              router.push(`/admin/products/edit/${product._id}`)
                            }
                          >
                            Edit
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            color="danger"
                            onClick={() => deleteProduct(product._id)}
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

      {/* Pagination */}
      <div className="flex xl:container bg-white rounded-b-xl justify-between items-center p-4">
        <Pagination
          showControls
          showShadow
          color="primary"
          total={pages}
          page={page}
          onChange={setPage}
        />
        <select
          onChange={onRowsPerPageChange}
          defaultValue={rowsPerPage}
          className="border rounded-lg p-1 h-9 w-19 text-center"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>
    </div>
  )
}
