'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Select, SelectItem } from '@nextui-org/select'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Card, CardHeader, CardBody } from '@nextui-org/card'
import { Plus } from 'lucide-react'
import { Divider } from '@nextui-org/divider'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/modal'
import { ChevronRight } from 'lucide-react'
import { CornerDownRight } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const CategoryAdminPage = () => {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [newSubcategory, setNewSubcategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [modalContent, setModalContent] = useState({ name: '', parentId: '' })

  // Fetch categories from the backend
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/categories`)
      const data = await res.json()

      console.log('Raw Data from Backend:', data)

      // Call function to build the category tree
      const categoryTree = buildCategoryTree(data)
      console.log(
        'Mapped Category Tree:',
        JSON.stringify(categoryTree, null, 2),
      )
      setCategories(categoryTree)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Build the category tree structure
  const buildCategoryTree = (categories) => {
    const categoryMap = {}

    categories.forEach((category) => {
      categoryMap[category._id] = { ...category, subcategories: [] }
    })

    const categoryTree = []
    categories.forEach((category) => {
      if (
        category.parent &&
        category.parent._id &&
        categoryMap[category.parent._id]
      ) {
        categoryMap[category.parent._id].subcategories.push(
          categoryMap[category._id],
        )
      } else if (!category.parent) {
        categoryTree.push(categoryMap[category._id])
      }
    })

    return categoryTree
  }

  // Add a new category
  const addCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.trim()) return

    try {
      const res = await fetch(`${API_BASE_URL}/categories/addCategory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategory,
          parentId: null,
        }),
      })

      if (res.ok) {
        setNewCategory('')
        fetchCategories()
      } else {
        console.error('Failed to add category')
      }
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  const addSubcategory = async (e) => {
    e.preventDefault()
    if (!newSubcategory.trim() || !selectedCategory) {
      console.error('Subcategory name or selected category is missing')
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/categories/addSubcategory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSubcategory,
          parentId: selectedCategory,
        }),
      })

      if (res.ok) {
        setNewSubcategory('')
        fetchCategories()
      } else {
        console.error('Failed to add subcategory')
      }
    } catch (error) {
      console.error('Error adding subcategory:', error)
    }
  }

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
        fetchCategories()
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
    })
    setIsModalOpen(true)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return

    try {
      const res = await fetch(
        `${API_BASE_URL}/categories/updateCategory/${editingCategory._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(modalContent),
        },
      )

      if (res.ok) {
        setIsModalOpen(false)
        fetchCategories()
      } else {
        console.error('Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const renderCategoryTree = (category) => {
    return (
      <li key={category._id} className="mb-4">
        <div className="flex justify-between items-center">
          <strong className="text-lg ml-1 flex items-center">
            {category.name}
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
          <div className="ml-9 flex items-center">
            <CornerDownRight strokeWidth={1.5} className="mr-2 mb-2" />
            <span className="text-sm font-medium mb-2">Subcategories:</span>
          </div>
        )}

        {category.subcategories?.length > 0 && (
          <div className="ml-9">
            <Divider />
            <ul className="ml-8">
              {category.subcategories.map((subcategory) => (
                <li key={subcategory._id} className="mb-2">
                  <div className="flex justify-between items-center ml-4">
                    <span className="text-sm flex items-center">
                      <CornerDownRight strokeWidth={1.5} className="mr-2" />
                      {subcategory.name}
                    </span>
                    <div>
                      <Button
                        size="sm"
                        className="mb-2 mr-2 mt-2"
                        onClick={() => openUpdateModal(subcategory)}
                      >
                        Update
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => deleteCategory(subcategory._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  {subcategory.subcategories?.length > 0 && (
                    <ul className="ml-6">
                      {subcategory.subcategories.map(renderCategoryTree)}
                    </ul>
                  )}
                  <Divider />
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    )
  }

  return (
    <div className="xl:container lg:container">
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
