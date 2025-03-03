// src/components/Admin/Products/PriceAndInventoryForm.jsx// best code
import { useProduct } from '@/src/context/ProductContext'
import { RadioGroup, Radio } from '@heroui/radio'
import { Input, Textarea } from '@heroui/input'

const PriceAndInventoryForm = () => {
  const { product, updateProduct } = useProduct()

  const handleChange = (e) => {
    const { name, value } = e.target
    let updates = { [name]: value }
    if (name === 'price' || name === 'costPrice') {
      const price = name === 'price' ? value : product.price
      const costPrice = name === 'costPrice' ? value : product.costPrice
      const profit = Number(price) - Number(costPrice)
      const margin =
        price > 0 ? ((profit / Number(price)) * 100).toFixed(2) + '%' : '0%'
      updates.profit = profit.toString()
      updates.margin = margin
    }
    updateProduct(updates)
  }

  const handleInventoryTypeChange = (value) => {
    updateProduct({ inventoryType: value })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border bg-white pr-4 pl-4 shadow-md rounded-2xl pt-5 pb-10">
      <h1 className="col-span-2 text-lg font-semibold text-gray-700">
        Price & Inventory
      </h1>
      <Input
        label="Price"
        name="price"
        value={product.price}
        onChange={handleChange}
        type="number"
        isRequired
      />
      <Input
        label="Cost Price"
        name="costPrice"
        value={product.costPrice}
        onChange={handleChange}
        type="number"
      />
      <Input
        label="Compare At Price"
        name="compareAtPrice"
        value={product.compareAtPrice}
        onChange={handleChange}
        type="number"
      />
      <Input label="Margin (%)" name="margin" value={product.margin} readOnly />
      <Input label="Profit" name="profit" value={product.profit} readOnly />
      <RadioGroup
        value={product.inventoryType}
        onChange={handleInventoryTypeChange}
      >
        <Radio value="track">Track inventory for this product</Radio>
        <Radio value="doNotTrack">
          Do not track inventory for this product
        </Radio>
        <Radio value="trackByOptions">Track inventory by options</Radio>
      </RadioGroup>
      <Input
        label="Current Stock"
        name="currentStock"
        value={product.currentStock}
        onChange={handleChange}
        type="number"
      />
    </div>
  )
}

export default PriceAndInventoryForm
