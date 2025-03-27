'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Select, SelectItem } from '@heroui/select'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { Card, CardHeader, CardBody } from '@heroui/card'
import { Plus, ChevronRight, CornerDownRight, Trash2 } from 'lucide-react'
import { Divider } from '@heroui/divider'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal'
import { toast } from 'sonner'
import { Toaster } from '@/src/components/ui/Toaster'

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
  const [toastMessage, setToastMessage] = useState(null)

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/categories`)
      const data = await res.json()
      const categoryTree = buildCategoryTree(data)
      setCategories(categoryTree)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setToastMessage({ type: 'error', message: 'Error fetching categories' })
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    if (toastMessage) {
      toast[toastMessage.type](toastMessage.message)
      setToastMessage(null)
    }
  }, [toastMessage])

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
        setToastMessage({
          type: 'success',
          message: 'Category added successfully',
        })
      } else throw new Error('Failed to add category')
    } catch (error) {
      console.error('Error adding category:', error)
      setToastMessage({ type: 'error', message: 'Error adding category' })
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
        setToastMessage({
          type: 'success',
          message: 'Subcategory added successfully',
        })
      } else throw new Error('Failed to add subcategory')
    } catch (error) {
      console.error('Error adding subcategory:', error)
      setToastMessage({ type: 'error', message: 'Error adding subcategory' })
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
        setToastMessage({
          type: 'success',
          message: 'Category deleted successfully',
        })
      } else throw new Error('Failed to delete category')
    } catch (error) {
      console.error('Error deleting category:', error)
      setToastMessage({ type: 'error', message: 'Error deleting category' })
    }
  }

  const openUpdateModal = (category) => {
    setEditingCategory(category)
    setModalContent({
      name: category.name,
      parentId: category.parent ? category.parent._id : '',
      image: category.image || null,
    })
    setIsModalOpen(true)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return
    const formData = new FormData()
    formData.append('name', modalContent.name)
    if (
      modalContent.parentId &&
      typeof modalContent.parentId === 'string' &&
      modalContent.parentId.length > 0
    ) {
      formData.append('parentId', modalContent.parentId)
    }
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
        setToastMessage({
          type: 'success',
          message: 'Category updated successfully',
        })
      } else throw new Error('Failed to update category')
    } catch (error) {
      console.error('Error updating category:', error)
      setToastMessage({ type: 'error', message: 'Error updating category' })
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
        setToastMessage({
          type: 'success',
          message: 'Image removed successfully',
        })
      } else throw new Error('Failed to remove image')
    } catch (error) {
      console.error('Error removing image:', error)
      setToastMessage({ type: 'error', message: 'Error removing image' })
    }
  }

  const renderCategoryTree = (category) => (
    <li key={category._id} className="mb-4">
      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
        <div className="flex items-center">
          <ChevronRight className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-sm sm:text-sm md:text-lg  font-semibold">
            {category.name}
          </span>
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="ml-3 h-8 w-8 rounded-full object-cover"
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="solid"
            onPress={() => openUpdateModal(category)}
            className="hover:bg-blue-100"
          >
            Edit
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="solid"
            onPress={() => deleteCategory(category._id)}
            className="hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {category.subcategories?.length > 0 && (
        <ul className="ml-6 mt-2 space-y-2">
          {category.subcategories.map((subcat) => renderCategoryTree(subcat))}
        </ul>
      )}
    </li>
  )

  return (
    <div className="xl:container mx-auto ">
      <Toaster />
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Category Management
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Add Main Category */}
        <Card className="shadow-md">
          <CardHeader className="bg-blue-50">
            <h2 className="text-xl font-semibold text-blue-700">
              Add Main Category
            </h2>
          </CardHeader>
          <Divider />
          <CardBody className="p-6">
            <form onSubmit={addCategory} className="space-y-4">
              <Input
                label="Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                className="w-full"
              />
              <Input
                type="file"
                label="Category Image"
                onChange={(e) => setCategoryImage(e.target.files[0])}
                accept="image/*"
                className="w-full"
              />
              <Button
                size="md"
                type="submit"
                color="primary"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-5 w-5" /> Add Category
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Add Subcategory */}
        <Card className="shadow-md">
          <CardHeader className="bg-green-50">
            <h2 className="text-xl font-semibold text-green-700">
              Add Subcategory
            </h2>
          </CardHeader>
          <Divider />
          <CardBody className="p-6">
            <form onSubmit={addSubcategory} className="space-y-4">
              <Select
                label="Main Category"
                placeholder="Select a category"
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full"
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
                className="w-full"
              />
              <Input
                type="file"
                label="Subcategory Image"
                onChange={(e) => setSubcategoryImage(e.target.files[0])}
                accept="image/*"
                className="w-full"
              />
              <Button
                size="md"
                type="submit"
                color="primary"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="mr-2 h-5 w-5" /> Add Subcategory
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      {/* Existing Categories */}
      <Card className="shadow-md">
        <CardHeader className="bg-gray-100">
          <h2 className="text-xl font-semibold text-gray-700">
            Existing Categories
          </h2>
        </CardHeader>
        <Divider />
        <CardBody className="p-6 ">
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories found.</p>
          ) : (
            <ul className="space-y-4">{categories.map(renderCategoryTree)}</ul>
          )}
        </CardBody>
      </Card>

      {/* Update Modal */}
      <Modal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        className="max-w-lg"
      >
        <ModalContent>
          <ModalHeader className="bg-gray-50">
            <h2 className="text-xl font-semibold">Update Category</h2>
          </ModalHeader>
          <ModalBody className="p-6">
            <Input
              label="Category Name"
              value={modalContent.name}
              onChange={(e) =>
                setModalContent({ ...modalContent, name: e.target.value })
              }
              className="mb-4"
            />
            <Select
              label="Parent Category (Optional)"
              value={modalContent.parentId}
              onChange={(e) =>
                setModalContent({ ...modalContent, parentId: e.target.value })
              }
              placeholder="Select parent category (optional)"
              className="mb-4"
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
              className="mb-4"
            />
            {modalContent.image && typeof modalContent.image === 'string' && (
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={modalContent.image}
                  alt="Current Image"
                  className="h-16 w-16 rounded-md object-cover"
                />
                <Button
                  size="sm"
                  color="danger"
                  variant="outline"
                  onPress={handleRemoveImage}
                  className="hover:bg-red-100"
                >
                  Remove Image
                </Button>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              color="error"
              onPress={() => setIsModalOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleUpdateCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default CategoryAdminPage
