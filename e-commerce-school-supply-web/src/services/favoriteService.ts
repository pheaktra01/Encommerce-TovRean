import type { Product } from "@/types/product"
import apiClient from "./apiClient"

const BASE_URL = '/api/wishlist'

export const favoriteService = {
  // Get all products
  async getAllFavorite(): Promise<Product[]> {
    const response = await apiClient.get(BASE_URL)
    return response.data
  },

  async addToFavorite(productId: string): Promise<void> {
    const response = await apiClient.post(`${BASE_URL}/${productId}`);
  },

  async deleteFavorite(productId: string): Promise<void> {
    const response = await apiClient.delete(`${BASE_URL}/${productId}`);
  },
}