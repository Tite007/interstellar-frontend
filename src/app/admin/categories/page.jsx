'use client'

import React, { useState, useEffect } from 'react'
import { Select, SelectItem } from '@nextui-org/select'
import { Input } from '@nextui-org/input'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/modal'
import { Button } from '@nextui-org/button'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const CategoryAdminPage = () => {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState({ name: '', parentId: '' })
  const [editingCategory, setEditingCategory] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ name: '', parentId: '' })

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/categories`)
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Handle input change for category name
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewCategory({ ...newCategory, [name]: value })
  }

  // Handle parent category selection change
  const handleSelectChange = (selectedValue) => {
    console.log('Selected parentId:', selectedValue) // Debugging log
    setNewCategory({ ...newCategory, parentId: selectedValue }) // Set only the ID
  }

  // Add a new category or subcategory
  const handleAddCategory = async () => {
    console.log('Adding Category:', newCategory) // Debugging log

    if (!newCategory.name || typeof newCategory.name !== 'string') {
      console.error('Invalid category name')
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/categories/addCategory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategory.name,
          parentId: newCategory.parentId || null, // Ensure parentId is passed as null or valid ID
        }),
      })

      if (res.ok) {
        setNewCategory({ name: '', parentId: '' }) // Reset form
        fetchCategories() // Refresh category list
      } else {
        console.error('Failed to add category')
      }
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  // Delete a category and its subcategories
  const deleteCategory = async (categoryId) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this category? It will delete all its subcategories.',
      )
    ) {
      return
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/categories/deleteCategory/${categoryId}`,
        {
          method: 'DELETE',
        },
      )

      if (res.ok) {
        fetchCategories() // Refresh category list
      } else {
        console.error('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  // Open the modal for updating a category
  const openUpdateModal = (category) => {
    setEditingCategory(category)
    setModalContent({
      name: category.name,
      parentId: category.parent ? category.parent._id : '',
    })
    setIsModalOpen(true)
  }

  // Update the category
  const handleUpdateCategory = async () => {
    if (!editingCategory) return

    try {
      const res = await fetch(
        `${API_BASE_URL}/categories/updateCategory/${editingCategory._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(modalContent), // Ensure valid structure
        },
      )

      if (res.ok) {
        setIsModalOpen(false) // Close modal
        fetchCategories() // Refresh category list
      } else {
        console.error('Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  // Render category tree with subcategories
  const renderCategoryTree = (categories) => {
    const categoryMap = categories.reduce((map, category) => {
      map[category._id] = { ...category, subcategories: [] }
      return map
    }, {})

    // Organize subcategories under their parent
    categories.forEach((category) => {
      if (category.parent) {
        categoryMap[category.parent._id].subcategories.push(
          categoryMap[category._id],
        )
      }
    })

    // Filter for root categories (categories without parents)
    const rootCategories = Object.values(categoryMap).filter(
      (category) => !category.parent,
    )

    // Recursively render the category tree
    const renderTree = (category) => (
      <li key={category._id} className="mb-2">
        <div>
          {category.name}
          <Button
            size="sm"
            color="primary"
            onClick={() => openUpdateModal(category)}
            className="ml-2"
          >
            Update
          </Button>
          <Button
            size="sm"
            color="error"
            onClick={() => deleteCategory(category._id)}
            className="ml-2"
          >
            Delete
          </Button>
        </div>
        {category.subcategories.length > 0 && (
          <ul className="ml-6 mt-2">
            {category.subcategories.map(renderTree)}
          </ul>
        )}
      </li>
    )

    return <ul>{rootCategories.map(renderTree)}</ul>
  }

  return (
    <div className="admin-page">
      <h1 className="text-lg font-semibold">Manage Categories</h1>

      {/* Add Category Form */}
      <div className="category-form space-y-4">
        <Input
          clearable
          label="Category Name"
          name="name"
          value={newCategory.name}
          onChange={handleInputChange}
          placeholder="Enter category name"
        />
        <Select
          label="Parent Category (Optional)"
          name="parentId"
          value={newCategory.parentId}
          onChange={(e) => handleSelectChange(e.target.value)} // Correctly passing only the value
          placeholder="Select parent category (optional)"
        >
          <SelectItem value="">None (Main Category)</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category._id} value={category._id}>
              {category.name}
            </SelectItem>
          ))}
        </Select>
        <Button color="success" onClick={handleAddCategory}>
          Add Category
        </Button>
      </div>

      {/* Category Tree */}
      <div className="category-list mt-8">
        <h2 className="text-lg">Category Tree</h2>
        {renderCategoryTree(categories)}
      </div>

      {/* Update Category Modal */}
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <ModalHeader>
            <h2 id="modal-title" className="text-lg">
              Update Category
            </h2>
          </ModalHeader>
          <ModalBody>
            <Input
              clearable
              label="Category Name"
              name="name"
              value={modalContent.name}
              onChange={(e) =>
                setModalContent({ ...modalContent, name: e.target.value })
              }
            />
            <Select
              label="Parent Category (Optional)"
              value={modalContent.parentId}
              onChange={(value) =>
                setModalContent({ ...modalContent, parentId: value })
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
