// Dummydata.js
export const products = [
  {
    id: 1,
    name: 'Santa Rosa Farm',
    category: 'Specialty Coffee',
    description: 'Salvadoran Coffee',
    price: '$45.45',
    stock: '20',
    promo: '10%',
    revenue: '$1,545',
  },
  // Add more customer objects here
]

export const columns = [
  { name: 'Name', uid: 'name' },
  { name: 'SKU', uid: 'sku' },
  { name: 'Current Stock', uid: 'currentStock' },
  { name: 'Price', uid: 'price' },
  { name: 'Actions', uid: 'actions' }, // Placeholder for action buttons
]

// You can place this inside your ProductAddForm.js or in a separate file and import it.
export const categories = [
  { label: 'Specialty Coffee', value: 'specialty coffee' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Accessories', value: 'accessories' },
  // Add other categories as needed
]
// You can place this inside your ProductAddForm.js or in a separate file and import it.
export const admin = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },

  // Add other categories as needed
]
