// pages/CategoryAdminPage.js
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Select, SelectItem } from '@heroui/select'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { Card, CardHeader, CardBody } from '@heroui/card'
import { Plus } from 'lucide-react'
import { Divider } from '@heroui/divider'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal'
import { ChevronRight, CornerDownRight } from 'lucide-react'
import { toast } from 'sonner' // Import sonner toast
import { Toaster } from '@/src/components/ui/Toaster' // Adjust the path to your Toaster component

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const CategoryAdminPage = () => {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [newSubcategory, setNewSubcategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [modalContent, setModalContent] = useState({
    name: '',
    parentId: '',
    image: null,
  })
  const [categoryImage, setCategoryImage] = useState(null)
  const [subcategoryImage, setSubcategoryImage] = useState(null)

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/categories`)
      const data = await res.json()
      const categoryTree = buildCategoryTree(data)
      setCategories(categoryTree)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const buildCategoryTree = (categories) => {
    const categoryMap = {}
    categories.forEach((category) => {
      categoryMap[category._id] = { ...category, subcategories: [] }
    })

    const categoryTree = []
    categories.forEach((category) => {
      if (category.parent && categoryMap[category.parent._id]) {
        categoryMap[category.parent._id].subcategories.push(
          categoryMap[category._id],
        )
      } else if (!category.parent) {
        categoryTree.push(categoryMap[category._id])
      }
    })
    return categoryTree
  }

  const addCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.trim()) return

    const formData = new FormData()
    formData.append('name', newCategory)
    if (categoryImage) formData.append('image', categoryImage)

    try {
      const res = await fetch(`${API_BASE_URL}/categories/addCategory`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setNewCategory('')
        setCategoryImage(null)
        fetchCategories()
        toast.success('Category added successfully')
      } else {
        console.error('Failed to add category')
      }
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  const addSubcategory = async (e) => {
    e.preventDefault()
    if (!newSubcategory.trim() || !selectedCategory) return

    const formData = new FormData()
    formData.append('name', newSubcategory)
    formData.append('parentId', selectedCategory)
    if (subcategoryImage) formData.append('image', subcategoryImage)

    try {
      const res = await fetch(`${API_BASE_URL}/categories/addSubcategory`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setNewSubcategory('')
        setSubcategoryImage(null)
        fetchCategories()
        toast.success('Subcategory added successfully')
      } else {
        console.error('Failed to add subcategory')
      }
    } catch (error) {
      console.error('Error adding subcategory:', error)
    }
  }

  const deleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?'))
      return

    try {
      const res = await fetch(
        `${API_BASE_URL}/categories/deleteCategory/${categoryId}`,
        {
          method: 'DELETE',
        },
      )

      if (res.ok) {
        fetchCategories()
        toast.success('Category deleted successfully')
      } else {
        console.error('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const openUpdateModal = (category) => {
    setEditingCategory(category)
    setModalContent({
      name: category.name,
      parentId: category.parent ? category.parent : '',
      image: category.image || null,
    })
    setIsModalOpen(true)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return

    const formData = new FormData()
    formData.append('name', modalContent.name)
    if (modalContent.parentId)
      formData.append('parentId', modalContent.parentId)
    if (modalContent.image instanceof File)
      formData.append('image', modalContent.image)

    try {
      const res = await fetch(
        `${API_BASE_URL}/categories/updateCategory/${editingCategory._id}`,
        {
          method: 'PUT',
          body: formData,
        },
      )

      if (res.ok) {
        setIsModalOpen(false)
        fetchCategories()
        toast.success('Category updated successfully')
      } else {
        console.error('Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const handleRemoveImage = async () => {
    if (!editingCategory || !modalContent.image) return

    try {
      const res = await fetch(
        `${API_BASE_URL}/categories/removeCategoryImage/${editingCategory._id}`,
        {
          method: 'PUT',
        },
      )

      if (res.ok) {
        setModalContent({ ...modalContent, image: null })
        fetchCategories()
        toast.success('Image removed successfully')
      } else {
        console.error('Failed to remove image')
      }
    } catch (error) {
      console.error('Error removing image:', error)
    }
  }

  const renderCategoryTree = (category) => (
    <li key={category._id} className="mb-4">
      <div className="flex justify-between items-center">
        <strong className="text-lg ml-1 flex items-center">
          {category.name}
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="ml-2 h-10 w-10 object-cover"
            />
          )}
        </strong>
        <div>
          <Button
            size="sm"
            className="mr-2"
            onClick={() => openUpdateModal(category)}
          >
            Update
          </Button>
          <Button
            size="sm"
            color="danger"
            onClick={() => deleteCategory(category._id)}
          >
            Delete
          </Button>
        </div>
      </div>
      {category.subcategories?.length > 0 && (
        <>
          <div className="ml-9 flex items-center">
            <CornerDownRight strokeWidth={1.5} className="mr-2 mb-2" />
            <span className="text-sm font-medium mb-2">Subcategories:</span>
          </div>
          <div className="ml-9">
            <Divider />
            <ul className="ml-8">
              {category.subcategories.map(renderCategoryTree)}
            </ul>
          </div>
        </>
      )}
    </li>
  )

  return (
    <div className="xl:container lg:container">
      <Toaster /> {/* Add the Toaster component */}
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="max-w-auto">
          <CardHeader>
            <h2>Add Main Category</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <form onSubmit={addCategory} className="space-y-4">
              <Input
                label="Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                clearable
              />
              <Input
                type="file"
                label="Category Image"
                onChange={(e) => setCategoryImage(e.target.files[0])}
                accept="image/*"
              />
              <Button size="sm" type="submit" color="primary">
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card className="max-w-auto">
          <CardHeader>
            <h2>Add Subcategory</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <form onSubmit={addSubcategory} className="space-y-4">
              <Select
                label="Main Category"
                placeholder="Select a category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories
                  .filter((category) => !category.parent)
                  .map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </Select>
              <Input
                label="Subcategory Name"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                placeholder="Enter subcategory name"
                clearable
              />
              <Input
                type="file"
                label="Subcategory Image"
                onChange={(e) => setSubcategoryImage(e.target.files[0])}
                accept="image/*"
              />
              <Button size="sm" type="submit" color="primary">
                <Plus className="mr-2 h-4 w-4" /> Add Subcategory
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
      <Card className="mt-6 max-w">
        <CardHeader>
          <h2>Existing Categories</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <ul className="space-y-4">{categories.map(renderCategoryTree)}</ul>
        </CardBody>
      </Card>
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <ModalHeader>
            <h2>Update Category</h2>
          </ModalHeader>
          <ModalBody>
            <Input
              clearable
              label="Category Name"
              value={modalContent.name}
              onChange={(e) =>
                setModalContent({ ...modalContent, name: e.target.value })
              }
            />
            <Select
              label="Parent Category (Optional)"
              value={modalContent.parentId}
              onChange={(e) =>
                setModalContent({ ...modalContent, parentId: e.target.value })
              }
              placeholder="Select parent category (optional)"
            >
              <SelectItem value="">None (Main Category)</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </Select>
            <Input
              type="file"
              label="Category Image"
              onChange={(e) =>
                setModalContent({ ...modalContent, image: e.target.files[0] })
              }
              accept="image/*"
            />
            {modalContent.image && typeof modalContent.image === 'string' && (
              <div className="mt-2">
                <img
                  src={modalContent.image}
                  alt="Current Image"
                  className="h-20 w-20 object-cover"
                />
                <Button
                  size="sm"
                  color="danger"
                  onClick={handleRemoveImage}
                  className="mt-2"
                >
                  Remove Image
                </Button>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              auto
              flat
              color="error"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button auto onClick={handleUpdateCategory}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default CategoryAdminPage
