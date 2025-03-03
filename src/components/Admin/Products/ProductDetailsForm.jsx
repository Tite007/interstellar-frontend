// src/components/Admin/Products/ProductDetailsForm.jsx
import { Input, Textarea } from '@heroui/input'
import { useProduct } from '@/src/context/ProductContext'
import TaxCodeSearchModal from './TaxCodeSearchModal'
import { Select, SelectItem } from '@heroui/select'
import { DatePicker } from '@heroui/date-picker'

const ProductDetailsForm = () => {
  const {
    product,
    categories,
    subcategories,
    updateProduct,
    updateSubcategories,
    selectedTaxCode,
    updateSelectedTaxCode,
  } = useProduct()

  const handleChange = (e) => {
    const { name, value } = e.target
    updateProduct({ [name]: value })
  }

  const handleDateChange = (date) => {
    updateProduct({ expirationDate: date })
  }

  const handleParentCategoryChange = async (selectedKey) => {
    const key = selectedKey.currentKey
    updateProduct({ parentCategory: key, subcategory: '' })
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/categories?parent=${key}`,
    )
    const data = await response.json()
    updateSubcategories(data)
  }

  const handleSubcategoryChange = (selectedKey) => {
    updateProduct({ subcategory: selectedKey.currentKey })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border shadow-md bg-white pr-4 pl-4 rounded-2xl pt-10 pb-10">
      <Input
        label="Name"
        name="name"
        value={product.name}
        onChange={handleChange}
        isRequired
      />
      <Input
        label="SKU"
        name="sku"
        value={product.sku}
        onChange={handleChange}
        isRequired
      />
      <Input
        label="Subtitle"
        name="subtitle"
        value={product.subtitle}
        onChange={handleChange}
      />
      <Input
        label="Size"
        name="size"
        value={product.size}
        onChange={handleChange}
      />
      <Input
        label="Roast Level"
        name="roastLevel"
        value={product.roastLevel}
        onChange={handleChange}
      />
      <Input
        label="Brand"
        name="brand"
        value={product.brand}
        onChange={handleChange}
      />
      <Select
        label="Parent Category"
        onSelectionChange={handleParentCategoryChange}
        selectedKeys={product.parentCategory ? [product.parentCategory] : []}
      >
        {categories.map((category) => (
          <SelectItem key={category._id} value={category._id}>
            {category.name}
          </SelectItem>
        ))}
      </Select>
      <Select
        label="Subcategory"
        onSelectionChange={handleSubcategoryChange}
        selectedKeys={product.subcategory ? [product.subcategory] : []}
        isDisabled={!product.parentCategory}
      >
        {subcategories.map((subcategory) => (
          <SelectItem key={subcategory._id} value={subcategory._id}>
            {subcategory.name}
          </SelectItem>
        ))}
      </Select>
      <DatePicker
        label="Expiration Date"
        value={product.expirationDate}
        onChange={handleDateChange}
      />
      <div>
        <label>Tax Code</label>
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={selectedTaxCode}
            placeholder="Select a tax code"
          />
          <TaxCodeSearchModal onSelectTaxCode={updateSelectedTaxCode} />
        </div>
      </div>
      <Textarea
        label="Description"
        name="description"
        value={product.description}
        onChange={handleChange}
        className="md:col-span-2"
      />
    </div>
  )
}

export default ProductDetailsForm
