import apiClient from './apiClient'

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

interface Cart {
  id: string
  userId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

const CART_BASE = '/api/cart'

const cartService = {
  /**
   * Get the current user's cart
   */
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<Cart>(CART_BASE)
    return response.data
  },

  /**
   * Add item to cart
   */
  async addItemToCart(item: CartItem): Promise<Cart> {
    const response = await apiClient.post<Cart>(`${CART_BASE}/add`, item)
    return response.data
  },

  /**
   * Update item quantity in cart
   */
  async updateItemQuantity(productId: string, quantity: number): Promise<Cart> {
    const response = await apiClient.put<Cart>(`${CART_BASE}/update/${productId}`, {
      quantity,
    })
    return response.data
  },

  /**
   * Remove item from cart
   */
  async removeItemFromCart(productId: string): Promise<Cart> {
    const response = await apiClient.delete<Cart>(`${CART_BASE}/remove/${productId}`)
    return response.data
  },

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`${CART_BASE}/clear`)
    return response.data
  },
}

export default cartService
