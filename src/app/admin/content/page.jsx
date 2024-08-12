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
import { Button } from '@nextui-org/button'
import { Pagination } from '@nextui-org/pagination'
import { PlusIcon } from '@/src/components/Admin/Content/PlusIcon'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Chip } from '@nextui-org/chip'
import { Tooltip } from '@nextui-org/tooltip'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ContentManagementPage() {
  const [contents, setContents] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/content`)
      if (!res.ok) throw new Error('Failed to fetch contents')
      const data = await res.json()
      setContents(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching contents:', error)
      toast('Error fetching contents, please try again later.', {
        type: 'error',
      })
      setIsLoading(false)
    }
  }

  const handleDeleteContent = async (id) => {
    if (confirm('Are you sure you want to delete this content?')) {
      try {
        const contentRes = await fetch(`${API_BASE_URL}/content/${id}`)
        if (!contentRes.ok) throw new Error('Failed to fetch content')
        const contentData = await contentRes.json()

        const imagesToDelete = contentData.image || []

        if (imagesToDelete.length > 0) {
          await fetch(`${API_BASE_URL}/delete-images`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ images: imagesToDelete }),
          })
        }

        const res = await fetch(`${API_BASE_URL}/content/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!res.ok) throw new Error('Failed to delete content')
        fetchContents()
        toast('Content deleted successfully!', { type: 'success' })
      } catch (error) {
        console.error('Error deleting content:', error)
        toast('Failed to delete content. Please try again.', { type: 'error' })
      }
    }
  }

  const filteredContents = contents.filter((content) =>
    content.headline.toLowerCase().includes(filterValue.toLowerCase()),
  )

  const items = filteredContents.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  )
  const totalPages = Math.ceil(filteredContents.length / rowsPerPage)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="xl:container bg-white p-4 mt-5 rounded-lg w-full ">
      <h1 className="text-2xl mt-5 font-semibold text-gray-700">Content</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          className=" mt-5  w-1/2"
          isClearable
          size="sm"
          radius="md"
          variant="faded"
          placeholder="Search by headline..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <Button
          color="primary"
          className="mt-3"
          endContent={<PlusIcon />}
          onClick={() => router.push('/admin/content/new')}
          size="sm"
        >
          Add New
        </Button>
      </div>
      <Table
        isStriped
        selectionMode="multiple"
        shadow="none"
        aria-label="Content Management Table"
        isCompact
      >
        <TableHeader>
          <TableColumn>Headline</TableColumn>
          <TableColumn>Published Date</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((content) => (
            <TableRow key={content._id}>
              <TableCell>
                <Tooltip className=" w-96" content={content.headline}>
                  <span>
                    {content.headline.length > 60
                      ? `${content.headline.substring(0, 60)}...`
                      : content.headline}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell>
                {new Date(content.datePublished).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Chip
                  variant="flat"
                  color={content.status === 'published' ? 'success' : 'warning'}
                >
                  {content.status}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      router.push(`/admin/content/edit/${content._id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onClick={() => handleDeleteContent(content._id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        className="mt-5"
        page={page}
        total={totalPages}
        onChange={setPage}
      />
    </div>
  )
}
