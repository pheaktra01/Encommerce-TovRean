import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/product'
import { favoriteService } from '@/services/favoriteService'
import { useAuthStore } from './authStore'



export const useFavoriteStore = defineStore('favorite', () => {
  const favProduct = ref<Product[]>([]);
  const isLoading = ref(false)
  const error = ref<string | null>(null);
  const authStore = useAuthStore()

  const count = computed(() => favProduct.value.length)

  // Helper to check if a product is already liked
  function isFavorited(productId: string | undefined): boolean {
    if (!productId) return false
    return favProduct.value.some(p => p.id === productId)
  }
  // ACTION
  async function fetchFavorite() {
    if (!authStore.user) {
      favProduct.value = []
      return
    }
    
    isLoading.value = true
    try{
      const res = await favoriteService.getAllFavorite()
      favProduct.value = res || []
    } catch (err) {
      console.log(err);
      error.value = 'Failed to load favorites'
    } finally {
      isLoading.value = false;
    }
  }

  // Unified Toggle Action (Easier for UI)
  async function toggleFavorite(product: Product) {
    if (!authStore.user) {
      alert("Please login to manage favorites")
      return
    }

    const productId = product.id
    if (!productId) return

    if (isFavorited(productId)) {
      await deleteFavorite(productId)
    } else {
      await addFavorite(product)
    }
  }

  async function addFavorite(product: Product) {
    favProduct.value.push(product)

    try{
      await favoriteService.addToFavorite(product.id!);
    } catch (err: any) {
        console.error(err)
        error.value = err.message || 'Failed to add favorite'
        // Remove the item we just added
        favProduct.value = favProduct.value.filter(p => p.id !== product.id)
    }
  }

  async function deleteFavorite(productId: string) {
    // 1. Find item to revert later if needed
    const itemToRemove = favProduct.value.find(p => p.id === productId)
    
    // 2. Optimistic Update
    favProduct.value = favProduct.value.filter(p => p.id !== productId)
    
    // 3. Call API
    try {
      await favoriteService.deleteFavorite(productId)
    } catch (err: any) {
      // 4. Revert on failure
      console.error(err)
      error.value = err.message || 'Failed to remove favorite'
      if (itemToRemove) favProduct.value.push(itemToRemove)
    }
  }

  return {
    favProduct, isLoading, error, count,
    isFavorited, toggleFavorite,
    fetchFavorite, addFavorite, deleteFavorite,
  }
})
