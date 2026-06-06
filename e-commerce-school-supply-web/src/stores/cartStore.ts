import cartService from '@/services/cartService'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface CartItem {
  productId: string
  name: string
  itemNo: string
  brand: string
  color: string
  rating: number
  price: number
  quantity: number
  image?: string
  images?: string[]
}

export const useCartStore = defineStore('cart', () => {
  // STATE
  const items = ref<CartItem[]>([])
  const cartId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // GETTERS
  const itemCount = computed(() => items.value.length)
  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )
  const shipping = computed(() => (items.value.length > 0 ? 0 : 0)) // Free shipping
  const tax = computed(() => subtotal.value * 0.1) // 10% tax
  const total = computed(() => subtotal.value + shipping.value + tax.value)

  // ACTIONS
  /**
   * Fetch cart from backend
   */
  async function fetchCart() {
    isLoading.value = true
    error.value = null
    const token = sessionStorage.getItem('accessToken')
    if (!token) {
      error.value = 'Please sign in to view your cart.'
      isLoading.value = false
      return
    }
    try {
      const cart = await cartService.getCart()
      cartId.value = cart.id
      items.value = cart.items || []
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch cart'
      error.value = errorMsg
      console.error('Error fetching cart:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Add item to cart
   */
  async function addToCart(item: CartItem) {
    isLoading.value = true
    error.value = null
    try {
      const updatedCart = await cartService.addItemToCart(item)
      cartId.value = updatedCart.id
      items.value = updatedCart.items || []
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add item to cart'
      error.value = errorMsg
      console.error('Error adding item to cart:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update item quantity
   */
  async function updateQuantity(productId: string, quantity: number) {
    isLoading.value = true
    error.value = null
    try {
      const updatedCart = await cartService.updateItemQuantity(productId, quantity)
      cartId.value = updatedCart.id
      items.value = updatedCart.items || []
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update item quantity'
      error.value = errorMsg
      console.error('Error updating quantity:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Remove item from cart
   */
  async function removeFromCart(productId: string) {
    isLoading.value = true
    error.value = null
    try {
      const updatedCart = await cartService.removeItemFromCart(productId)
      cartId.value = updatedCart.id
      items.value = updatedCart.items || []
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to remove item from cart'
      error.value = errorMsg
      console.error('Error removing item from cart:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Clear entire cart
   */
  async function clearCart() {
    isLoading.value = true
    error.value = null
    try {
      await cartService.clearCart()
      items.value = []
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to clear cart'
      error.value = errorMsg
      console.error('Error clearing cart:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    items,
    cartId,
    isLoading,
    error,
    // Getters
    itemCount,
    totalItems,
    subtotal,
    shipping,
    tax,
    total,
    // Actions
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }
})

