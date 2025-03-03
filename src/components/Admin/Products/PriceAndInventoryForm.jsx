// src/components/Admin/Products/PriceAndInventoryForm.jsx
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
    <div className="grid grid-cols-1 gap-4 mt-6 border bg-white p-4 shadow-md rounded-2xl md:grid-cols-2 md:gap-6 md:p-5">
      <h1 className="col-span-full text-lg font-semibold text-gray-700">
        Price & Inventory
      </h1>
      <Input
        label="Price"
        name="price"
        value={product.price}
        onChange={handleChange}
        type="number"
        isRequired
        className="w-full"
      />
      <Input
        label="Cost Price"
        name="costPrice"
        value={product.costPrice}
        onChange={handleChange}
        type="number"
        className="w-full"
      />
      <Input
        label="Compare At Price"
        name="compareAtPrice"
        value={product.compareAtPrice}
        onChange={handleChange}
        type="number"
        className="w-full"
      />
      <Input
        label="Margin (%)"
        name="margin"
        value={product.margin}
        readOnly
        className="w-full"
      />
      <Input
        label="Profit"
        name="profit"
        value={product.profit}
        readOnly
        className="w-full"
      />
      <div className="col-span-full w-full">
        <RadioGroup
          value={product.inventoryType}
          onChange={handleInventoryTypeChange}
          className="w-full"
        >
          <Radio value="track">Track inventory for this product</Radio>
          <Radio value="doNotTrack">
            Do not track inventory for this product
          </Radio>
          <Radio value="trackByOptions">Track inventory by options</Radio>
        </RadioGroup>
      </div>
      <Input
        label="Current Stock"
        name="currentStock"
        value={product.currentStock}
        onChange={handleChange}
        type="number"
        className="w-full"
      />
    </div>
  )
}

export default PriceAndInventoryForm
