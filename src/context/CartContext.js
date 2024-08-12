'use client'

import React, { createContext, useState, useEffect } from 'react'

// Create the context
export const CartContext = createContext()

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart')
      return savedCart ? JSON.parse(savedCart) : []
    }
    return []
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart])

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) =>
          item.productName === product.productName &&
          item.productVariant === product.productVariant,
      )

      if (existingProductIndex >= 0) {
        const updatedCart = [...prevCart]
        updatedCart[existingProductIndex].quantity += product.quantity
        return updatedCart
      } else {
        return [...prevCart, product]
      }
    })
  }

  const updateQuantity = (productName, productVariant, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productName === productName &&
        item.productVariant === productVariant
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    )
  }

  const removeFromCart = (productName, productVariant) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          item.productName !== productName ||
          item.productVariant !== productVariant,
      ),
    )
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}
