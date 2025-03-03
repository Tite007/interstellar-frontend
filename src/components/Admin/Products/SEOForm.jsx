// src/components/Admin/Products/SEOForm.jsx
import { Input, Textarea } from '@heroui/input'
import { useProduct } from '@/src/context/ProductContext'

const SEOForm = () => {
  const { product, updateProduct } = useProduct()

  const handleChange = (e) => {
    const { name, value } = e.target
    updateProduct({ [name]: value })
  }

  return (
    <div className="grid grid-cols-1 gap-6 border bg-white pr-4 pl-4 shadow-md rounded-2xl pt-5 pb-10">
      <h1 className="text-lg font-semibold text-gray-700">SEO Tags</h1>
      <Input
        label="SEO Title"
        name="seoTitle"
        value={product.seoTitle}
        onChange={handleChange}
      />
      <Textarea
        label="SEO Description"
        name="seoDescription"
        value={product.seoDescription}
        onChange={handleChange}
      />
      <Input
        label="SEO Keywords"
        name="seoKeywords"
        value={product.seoKeywords}
        onChange={handleChange}
      />
    </div>
  )
}

export default SEOForm
