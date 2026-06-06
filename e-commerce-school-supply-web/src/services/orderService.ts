import apiClient from './apiClient'

interface OrderPayload {
  cartId: string | null
  address: any
  payment: any
  shipping: string
}
// Note: backend may accept additional fields like `paymentMethod` and `status`.

const ORDER_BASE = '/api/orders'

const orderService = {
  async createOrder(payload: OrderPayload) {
    const response = await apiClient.post(ORDER_BASE, payload)
    return response.data
  },
  async getOrders() {
    try {
      const response = await apiClient.get(ORDER_BASE)
      return response.data
    } catch (err) {
      console.error('Failed to fetch orders', err)
      return []
    }
  },
  async getOrder(id: string) {
    try {
      const response = await apiClient.get(`${ORDER_BASE}/${id}`)
      return response.data
    } catch (err) {
      console.error('Failed to fetch order', err)
      return null
    }
  },
}

export default orderService
