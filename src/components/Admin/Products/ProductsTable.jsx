'use client'
import React, { useState, useMemo, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table"
import {
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown"
import { Search, Plus, MoreVertical } from 'lucide-react'
import { Input } from "@heroui/input"
import { Button } from "@heroui/button"
import { Pagination } from "@heroui/pagination"
import { columns } from '@/src/components/Admin/Products/data' // Assuming this contains the necessary columns
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ProductsTable() {
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([]) // Store category data
  const router = useRouter()

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`

  // Fetch categories and products from the API
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        // Fetch categories
        const categoryResponse = await fetch(
          `${API_BASE_URL}/categories/categories`,
        )
        const categoryData = await categoryResponse.json()
        setCategories(categoryData) // Save category data

        // Fetch products
        const productResponse = await fetch(
          `${API_BASE_URL}/products/getAllProducts`,
        )
        const productData = await productResponse.json()

        // Map product category and subcategory names
        const mappedProducts = productData.map((product) => ({
          ...product,
          parentCategoryName:
            categoryData.find((cat) => cat._id === product.parentCategory)
              ?.name || 'N/A',
          subcategoryName:
            categoryData.find((cat) => cat._id === product.subcategory)?.name ||
            'N/A',
        }))

        setProducts(mappedProducts)
      } catch (error) {
        console.error('Failed to fetch products or categories:', error)
      }
    }

    fetchCategoriesAndProducts()
  }, [])

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
          variantId: `${product._id}-${index}`,
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
        product.parentCategoryName
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        product.subcategoryName
          .toLowerCase()
          .includes(filterValue.toLowerCase()),
    )
  }, [filterValue, products])

  const pages = Math.ceil(filteredProducts.length / rowsPerPage)

  const deleteProduct = async (id, images) => {
    if (
      confirm('Are you sure you want to delete this product and its images?')
    ) {
      try {
        const imageDeleteResponse = await fetch(
          `${API_BASE_URL}/delete-images`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images, productId: id }),
          },
        )

        if (!imageDeleteResponse.ok) {
          throw new Error('Failed to delete images from S3')
        }

        const response = await fetch(
          `${API_BASE_URL}/products/deleteProduct/${id}`,
          {
            method: 'DELETE',
          },
        )
        if (!response.ok) throw new Error('Failed to delete product')

        setProducts(products.filter((product) => product._id !== id))
        toast('Product and images deleted successfully!', {})
      } catch (error) {
        console.error('Failed to delete product or images:', error)
        toast('Failed to delete product. Please try again.', {})
      }
    }
  }

  const onSearchChange = (e) => {
    setFilterValue(e.target.value)
    setPage(1)
  }

  const onRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }

  return (
    <div>
      <div className="flex xl:container bg-white mt-6 pt-8 p-5 shadow-md rounded-t-2xl justify-between items-center">
        <Input
          size="small"
          clearable
          bordered
          className="w-96"
          placeholder="Search by name, parent category, or subcategory..."
          value={filterValue}
          onChange={onSearchChange}
          endContent={<Search />}
          style={{ fontSize: '16px' }}
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

      <div className="overflow-x-auto">
        <Table
          isHeaderSticky
          isStriped
          isCompact
          aria-label="Product Table"
          shadow="none"
          className="xl:container bg-white shrink-0 p-2"
        >
          <TableHeader>
            <TableColumn></TableColumn>
            {columns.map((column) => (
              <TableColumn
                key={column.uid}
                className={`min-w-[120px] lg:min-w-[150px] ${column.uid === 'price' || column.uid === 'currentStock' ? 'min-w-[80px] lg:min-w-[100px] ' : ''}`}
              >
                {column.name}
              </TableColumn>
            ))}
            <TableColumn className="min-w-[100px] lg:min-w-[100px]">
              Parent Category
            </TableColumn>
            <TableColumn className="min-w-[100px] lg:min-w-[120px]">
              Subcategory
            </TableColumn>
            <TableColumn className="min-w-[70px] lg:min-w-[80px]">
              Actions
            </TableColumn>
          </TableHeader>
          <TableBody className="font-light">
            {filteredProducts
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((product) => (
                <TableRow
                  key={product.isVariant ? product.variantId : product._id}
                >
                  <TableCell
                    key={`${product.isVariant ? product.variantId : product._id}-empty`}
                  ></TableCell>
                  {columns.map((column) => (
                    <TableCell
                      key={`${product.isVariant ? product.variantId : product._id}-${column.uid}`}
                    >
                      {product.isVariant
                        ? column.uid === 'name'
                          ? product.variantName
                          : column.uid === 'price'
                            ? formatCurrency(product.variantPrice)
                            : column.uid === 'currentStock'
                              ? product.variantQuantity
                              : product[column.uid]
                        : column.uid === 'currentStock'
                          ? product.currentStock
                          : column.uid === 'price'
                            ? formatCurrency(product[column.uid])
                            : product[column.uid]}
                    </TableCell>
                  ))}
                  {/* Render Parent Category and Subcategory columns */}
                  <TableCell className="min-w-[120px] lg:min-w-[150px]">
                    {product.parentCategoryName}
                  </TableCell>
                  <TableCell className="min-w-[150px] lg:min-w-[150px]">
                    {product.subcategoryName}
                  </TableCell>
                  {/* Render Action Button */}
                  <TableCell className="min-w-[80px] lg:min-w-[80px]">
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
                          onClick={() =>
                            deleteProduct(product._id, product.images)
                          }
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex xl:container shadow-md bg-white rounded-b-2xl justify-between items-center p-4">
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
