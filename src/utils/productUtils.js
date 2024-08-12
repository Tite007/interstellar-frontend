// src/utils/productUtils.js

export const fetchProductData = async (_id) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/findProduct/${_id}`,
  )
  if (!response.ok) throw new Error('Failed to fetch product')
  return await response.json()
}

export const saveProduct = async (product) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/updateProduct/${product._id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    },
  )
  if (!res.ok) throw new Error('Failed to save product')
  return res.json()
}
