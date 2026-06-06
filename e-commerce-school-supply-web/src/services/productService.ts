import apiClient from './apiClient'
import type { Product } from '@/types/product'

export const productService = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    const response = await apiClient.get('/api/products')
    return response.data
  },

  // Get a product by id
  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get(`/api/products/${id}`)
    return response.data
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    // The backend returns: { "url": "/uploads/products/..." }
    const response = await apiClient.post<{ url: string }>('/api/products/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Explicitly tell Axios this is a file upload
      },
    });
    return response.data.url;
  },  
  // Create a new product
  async createProduct(product: Partial<Product>): Promise<Product> {
    const response = await apiClient.post('/api/products', product)
    return response.data
  },

  // Update a product
  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const response = await apiClient.patch(`/api/products/${id}`, product)
    return response.data
  },

  // Delete a product
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/api/products/${id}`)
  },

  // Get all reviews for a product
  async getProductReviews(productId: string): Promise<any[]> {
    const response = await apiClient.get(`/api/reviews/product/${productId}`)
    return response.data
  },

  // Get user's review for a specific product
  async getUserReviewForProduct(productId: string, userId: string): Promise<any> {
    const response = await apiClient.get(`/api/reviews/product/${productId}/user/${userId}`)
    return response.data
  },

  // Create or update a review
  async submitReview(productId: string, review: any): Promise<any> {
    const response = await apiClient.post(`/api/reviews/product/${productId}`, review)
    return response.data
  },

  // Delete a review
  async deleteReview(reviewId: string): Promise<void> {
    await apiClient.delete(`/api/reviews/${reviewId}`)
  },

  // Get all reviews by a user
  async getUserReviews(userId: string): Promise<any[]> {
    const response = await apiClient.get(`/api/reviews/user/${userId}`)
    return response.data
  },
}
