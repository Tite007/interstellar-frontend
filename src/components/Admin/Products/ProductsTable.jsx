'use client'
import React, { useState, useMemo, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table'
import {
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from '@heroui/dropdown'
import { Search, Plus, MoreVertical } from 'lucide-react'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { Pagination } from '@heroui/pagination'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ProductsTable() {
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const router = useRouter()

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const categoryResponse = await fetch(
          `${API_BASE_URL}/categories/categories`,
        )
        const categoryData = await categoryResponse.json()
        setCategories(categoryData)

        const productResponse = await fetch(
          `${API_BASE_URL}/products/getAllProducts`,
        )
        const productData = await productResponse.json()

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
      const variants = Array.isArray(product.variants) ? product.variants : []
      variants.forEach((variant, index) => {
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

  // Delete a product and its images
  const deleteProduct = async (id) => {
    if (
      !confirm('Are you sure you want to delete this product and its images?')
    )
      return

    try {
      const productResponse = await fetch(
        `${API_BASE_URL}/products/findProduct/${id}`,
      )
      if (!productResponse.ok)
        throw new Error('Failed to fetch product details')
      const productData = await productResponse.json()

      const mainImages = Array.isArray(productData.images)
        ? productData.images
            .map((img) => (typeof img === 'string' ? img : img.url))
            .filter(Boolean)
        : []
      const variantImages = Array.isArray(productData.variants)
        ? productData.variants.flatMap((variant) =>
            Array.isArray(variant.images)
              ? variant.images
                  .map((img) => (typeof img === 'string' ? img : img.url))
                  .filter(Boolean)
              : [],
          )
        : []
      const allImages = [...mainImages, ...variantImages]

      if (allImages.length > 0) {
        const imageDeleteResponse = await fetch(
          `${API_BASE_URL}/delete-images`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images: allImages, productId: id }),
          },
        )
        if (!imageDeleteResponse.ok)
          throw new Error('Failed to delete images from S3')
      }

      const response = await fetch(
        `${API_BASE_URL}/products/deleteProduct/${id}`,
        { method: 'DELETE' },
      )
      if (!response.ok) throw new Error('Failed to delete product')

      setProducts(products.filter((product) => product._id !== id))
      toast.success('Product and all associated images deleted successfully!')
    } catch (error) {
      console.error('Failed to delete product or images:', error)
      toast.error(
        error.message || 'Failed to delete product. Please try again.',
      )
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

        <Button
          size="sm"
          className="ml-6"
          auto
          color="primary"
          endContent={<Plus />}
          onPress={() => router.push('/admin/products/add')}
        >
          Add New
        </Button>
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
            <TableColumn className="min-w-[200px] lg:min-w-[250px] bg-gray-100">
              Name
            </TableColumn>
            <TableColumn className="min-w-[120px] lg:min-w-[150px] bg-gray-100">
              SKU
            </TableColumn>
            <TableColumn className="min-w-[100px] lg:min-w-[120px] bg-gray-100">
              Current Stock
            </TableColumn>
            <TableColumn className="min-w-[100px] lg:min-w-[120px] bg-gray-100">
              Price
            </TableColumn>
            <TableColumn className="min-w-[120px] lg:min-w-[150px] bg-gray-100">
              Parent Category
            </TableColumn>
            <TableColumn className="min-w-[120px] lg:min-w-[150px] bg-gray-100">
              Subcategory
            </TableColumn>
            <TableColumn className="min-w-[70px] lg:min-w-[80px] bg-gray-100">
              Actions
            </TableColumn>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {filteredProducts
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((product) => (
                <TableRow
                  key={product.isVariant ? product.variantId : product._id}
                  className="hover:bg-gray-50"
                >
                  <TableCell className="p-2 min-w-[200px] lg:min-w-[250px] truncate">
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="text-blue-600 hover:underline block truncate"
                    >
                      {product.isVariant ? product.variantName : product.name}
                    </Link>
                  </TableCell>
                  <TableCell className="p-2 min-w-[120px] lg:min-w-[150px] truncate">
                    {product.sku || 'N/A'}
                  </TableCell>
                  <TableCell className="p-2 min-w-[100px] lg:min-w-[120px] truncate">
                    {product.isVariant
                      ? product.variantQuantity
                      : product.currentStock}
                  </TableCell>
                  <TableCell className="p-2 min-w-[100px] lg:min-w-[120px] truncate">
                    {product.isVariant
                      ? formatCurrency(product.variantPrice)
                      : formatCurrency(product.price)}
                  </TableCell>
                  <TableCell className="p-2 min-w-[120px] lg:min-w-[150px] truncate">
                    {product.parentCategoryName}
                  </TableCell>
                  <TableCell className="p-2 min-w-[120px] lg:min-w-[150px] truncate">
                    {product.subcategoryName}
                  </TableCell>
                  <TableCell className="p-2 min-w-[70px] lg:min-w-[80px]">
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
