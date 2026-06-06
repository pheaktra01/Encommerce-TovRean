import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { productService } from '@/services/productService'
import type { Product } from '@/types/product'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)


// GETTER
  const getPopularProducts = computed(() => {
    return products.value.filter(product => product.averageRating >= 4.5)
  })

  const getAllProducts = computed(() => {
    return products.value;
  })

// ACTION
  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      products.value = await productService.getAllProducts()
    } catch (err) {
      error.value = 'Failed to fetch products'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function addProduct(product: Partial<Product>) {
    try {
      const newProduct = await productService.createProduct(product)
      products.value.unshift(newProduct)
      return newProduct
    } catch (err) {
      error.value = 'Failed to add product'
      console.error(err)
      throw err
    }
  }

  async function removeProduct(id: string) {
    try {
      await productService.deleteProduct(id)
      products.value = products.value.filter(p => p.id !== id)
    } catch (err) {
      error.value = 'Failed to delete product'
      console.error(err)
      throw err
    }
  }

  async function updateProduct(id: string, product: Partial<Product>) {
    try {
      const updated = await productService.updateProduct(id, product)
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = updated
      }
      return updated
    } catch (err) {
      error.value = 'Failed to update product'
      console.error(err)
      throw err
    }
  }

  return {
    products,
    loading,
    error,
    getPopularProducts,
    getAllProducts,
    fetchProducts,
    addProduct,
    removeProduct,
    updateProduct,
  }
})
