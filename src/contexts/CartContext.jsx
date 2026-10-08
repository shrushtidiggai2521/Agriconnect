import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import toast from 'react-hot-toast'
import CartService from '@/services/cartService'
import { useAuth } from '@/contexts/AuthContext'
import { ROLES } from '@/utils/constants'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated, role } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const canShop = isAuthenticated && role !== ROLES.FARMER

  const refresh = useCallback(async () => {
    if (!canShop) {
      setItems([])
      return
    }
    setLoading(true)
    try {
const data = await CartService.getCart()

console.log('CART RESPONSE:', data)

const cartItems =
  Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.items)
          ? data.data.items
          : []

setItems(cartItems)
    } catch {
      // silent — interceptor already surfaces network/server errors
    } finally {
      setLoading(false)
    }
  }, [canShop])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addItem = useCallback(async (productId, quantity = 1) => {
    if (!canShop) {
      toast.error('Log in as a buyer to add items to your cart.')
      return
    }
    try {
      await CartService.addItem(productId, quantity)
      toast.success('Added to cart')
      refresh()
    } catch {
      // interceptor handles the toast for server/network errors
    }
  }, [canShop, refresh])

  const updateItem = useCallback(async (payload) => {
    try {
      await CartService.updateItem(payload)
      refresh()
    } catch {
      /* handled by interceptor */
    }
  }, [refresh])

  const removeItem = useCallback(async (cartItemId) => {
    try {
      await CartService.removeItem(cartItemId)
      toast.success('Removed from cart')
      refresh()
    } catch {
      /* handled by interceptor */
    }
  }, [refresh])

  const clearCart = useCallback(async () => {
    try {
      await CartService.clearCart()
      refresh()
    } catch {
      /* handled by interceptor */
    }
  }, [refresh])

  const itemCount = useMemo(
    () => items.reduce((sum, it) => sum + (it.quantity ?? 1), 0),
    [items]
  )

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (it.price ?? it.product?.price ?? 0) * (it.quantity ?? 1), 0),
    [items]
  )

  const value = useMemo(
    () => ({ items, loading, itemCount, subtotal, refresh, addItem, updateItem, removeItem, clearCart }),
    [items, loading, itemCount, subtotal, refresh, addItem, updateItem, removeItem, clearCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
