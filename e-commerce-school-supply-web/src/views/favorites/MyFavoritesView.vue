<template>
  <div class="favorites-page max-w-8xl mx-auto bg-white dark:bg-gray-900 transition-colors min-h-screen">
    <div class="container">
      <div class="page-header dark:text-white">
        <h1 class="dark:text-white">{{ $t('favorites.title') }}</h1>
        <p class="subtitle dark:text-gray-400">{{ $t('favorites.items_count', { count: favorites.length }) }}</p>
      </div>
      <div v-if="loading" class="loading">
        <Spinner/>
      </div>
      <div v-else-if="favorites.length === 0" class="empty-state dark:bg-gray-800 dark:text-white">
        <i class="pi pi-heart" style="font-size: 4rem; color: #ccc; opacity: 0.5"></i>
        <h2 class="dark:text-white">{{ $t('favorites.empty_title') }}</h2>
        <p class="dark:text-gray-400">{{ $t('favorites.empty_subtitle') }}</p>
        <button @click="goToProducts" class="btn-primary dark:bg-[#1A535C] dark:hover:bg-[#2A7A8F]">{{ $t('favorites.browse_products') }}</button>
      </div>
      <div v-else >
        
          <!-- <div class="product-image" @click="goToProductDetail(product.id)">
            <img :src="product.imageUrl || product.imageURL || (product as any).image || '/Photo/ourproduct.png'" :alt="product.name" />
            <button @click.stop="removeFromFavorites(product.id)" class="remove-btn">
              <i class="pi pi-times"></i>
            </button>
          </div>
          <div class="product-info">
            <h3 @click="goToProductDetail(product.id)">{{ product.name }}</h3>
            <div class="product-rating">
              <div class="stars">
                <i v-for="star in 5" :key="star" class="pi" :class="star <= product.rating ? 'pi-star-fill' : 'pi-star'"></i>
              </div>
              <span class="rating-count">({{ product.reviewCount || 0 }})</span>
            </div>
            <div class="product-price">
              <span v-if="product.discount" class="original-price">${{ product.price }}</span>
              <span class="current-price">${{ calculateDiscountedPrice(product) }}</span>
            </div>
            <button @click="addToCart(product)" class="btn-add-cart">
              <i class="pi pi-shopping-cart"></i>
              {{ $t('home.add_to_cart') }}
            </button>
          </div> -->
          <ProductCardComponent :products="favorites"/>
     
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useCartStore } from '@/stores/cartStore'
import { useToastStore } from '@/stores/toastStore'
import type { Product } from '@/types/product'
import Spinner from '@/components/ui/Spinner.vue'
import ProductCardComponent from '@/components/product/product-card-component.vue'

const router = useRouter()
const { t } = useI18n()
const favoriteStore = useFavoriteStore()
const cartStore = useCartStore()
const toastStore = useToastStore()
const favorites = ref<Product[]>([])
const loading = ref(true)
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const resolveProductImage = (product: Product) => {
  const raw = (product.images && product.images[0]) || (product as any).image || product.imageUrl || product.imageURL || '/Photo/ourproduct.png'
  const cleaned = typeof raw === 'string' ? raw.trim() : ''
  if (!cleaned) return '/Photo/ourproduct.png'
  if (cleaned.startsWith('/')) return `${String(API_BASE_URL).replace(/\/$/, '')}${cleaned}`
  return cleaned
}

onMounted(async () => {
  await loadFavorites()
})

const loadFavorites = async () => {
  try {
    loading.value = true
    await favoriteStore.fetchFavorite()
    favorites.value = favoriteStore.favProduct.map(p => ({
      ...p,
      imageUrl: resolveProductImage(p),
    }))
  } catch (error) {
    console.error('Error loading favorites:', error)
    toastStore.showToast('Failed to load favorites', 'error')
  } finally {
    loading.value = false
  }
}

const removeFromFavorites = async (productId?: string) => {
  if (!productId) return
  try {
    await favoriteStore.deleteFavorite(productId)
    favorites.value = favorites.value.filter((p) => p.id !== productId)
    toastStore.showToast(t('favorites.removed_success'), 'success')
  } catch (error) {
    console.error('Error removing from favorites:', error)
    toastStore.showToast(t('favorites.removed_error'), 'error')
  }
}

const addToCart = async (product: Product) => {
  try {
    const image = resolveProductImage(product)
    const price = product.discount
      ? Number(product.price) * (1 - Number(product.discount) / 100)
      : Number(product.price)

    await cartStore.addToCart({
      productId: product.id || '',
      name: product.name,
      itemNo: product.id || '',
      brand: product.brandName || '',
      color: (product as any).color || '',
      rating: Number(product.rating) || 0,
      price,
      quantity: 1,
      image,
      images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [image].filter(Boolean),
    })

    toastStore.showToast(t('favorites.add_to_cart_success'), 'success')
  } catch (error) {
    console.error('Error adding to cart:', error)
    toastStore.showToast(t('favorites.add_to_cart_error'), 'error')
  }
}

const calculateDiscountedPrice = (product: Product) => {
  if (product.discount) {
    return (product.price * (1 - product.discount / 100)).toFixed(2)
  }
  return product.price.toFixed(2)
}

const goToProductDetail = (productId?: string) => {
  if (!productId) return
  router.push({ name: 'product-detail', params: { id: productId } })
}

const goToProducts = () => {
  router.push({ name: 'Product List' })
}
</script>

<style scoped>
.favorites-page { min-height: 100vh; padding: 2rem 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.page-header { margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; font-weight: 600; margin-bottom: 0.5rem; }
.subtitle { font-size: 1rem; }
.loading { text-align: center; padding: 4rem 0; color: #666; }
.empty-state { text-align: center; padding: 4rem 2rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.empty-state h2 { font-size: 1.5rem; color: #333; margin: 1rem 0 0.5rem; }
.empty-state p { color: #666; margin-bottom: 1.5rem; }
.btn-primary { background-color: #007bff; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; font-size: 1rem; cursor: pointer; transition: background-color 0.3s; }
.btn-primary:hover { background-color: #0056b3; }
.favorites-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
.product-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.product-image { position: relative; width: 100%; height: 250px; overflow: hidden; cursor: pointer; }
.product-image img { width: 100%; height: 100%; object-fit: cover; }
.remove-btn { position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.3s; }
.remove-btn:hover { background: rgba(255,0,0,0.9); color: white; }
.product-info { padding: 1rem; }
.product-info h3 { font-size: 1rem; font-weight: 600; color: #333; margin-bottom: 0.5rem; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.product-info h3:hover { color: #007bff; }
.product-rating { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
.stars { display: flex; gap: 2px; }
.stars i { font-size: 0.875rem; color: #ffc107; }
.rating-count { font-size: 0.875rem; color: #666; }
.product-price { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.original-price { text-decoration: line-through; color: #999; font-size: 0.875rem; }
.current-price { font-size: 1.25rem; font-weight: 600; color: #e74c3c; }
.btn-add-cart { width: 100%; background-color: #28a745; color: white; border: none; padding: 0.75rem; border-radius: 4px; font-size: 0.875rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: background-color 0.3s; }
.btn-add-cart:hover { background-color: #218838; }
@media (max-width: 768px) {
  .favorites-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }
  .product-image { height: 180px; }
  .page-header h1 { font-size: 1.5rem; }
}
</style>
