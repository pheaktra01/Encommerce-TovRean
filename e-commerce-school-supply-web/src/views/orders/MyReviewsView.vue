<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900 transition-colors min-h-screen">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-heading dark:text-white">{{ $t('reviews_page.title') }}</h1>
      <p class="text-body mt-2 dark:text-gray-400">{{ $t('reviews_page.subtitle') }}</p>
    </div>

    <div v-if="loading" class="text-center py-8">
      <spinner/>
    </div>

    <div v-else>
      <div v-if="sortedProducts.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center transition-colors">
        <div class="text-gray-500 dark:text-gray-400 mb-4">{{ $t('reviews_page.empty_title') }}</div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('reviews_page.empty_subtitle') }}
        </p>
        <router-link
          to="/products"
          class="inline-block px-6 py-3 bg-accent text-white rounded-base hover:bg-accent/90 dark:bg-[#1A535C] dark:hover:bg-[#2A7A8F]"
        >
          {{ $t('orders.start_shopping') }}
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="product in sortedProducts"
          :key="product.id"
          class="bg-white border border-default rounded-base p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition dark:bg-gray-800 dark:border-gray-700"
        >
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
            alt="product"
            class="w-16 h-16 object-cover rounded-sm"
          />
          <div
            v-else
            class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-sm flex items-center justify-center text-gray-400"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-heading truncate dark:text-gray-100">{{ product.name }}</div>
            <div class="text-xs text-body truncate dark:text-gray-300">{{ product.id }}</div>
          </div>
          <button
            @click="goToReview(product.id)"
            class="px-4 py-2 bg-accent text-white box-border border border-transparent focus:ring-4 focus:ring-neutral-tertiary font-medium rounded-base text-sm focus:outline-none hover:bg-accent/90 transition whitespace-nowrap dark:bg-[#1A535C] dark:hover:bg-[#2A7A8F]"
          >
            {{ $t('common.review') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import orderService from '@/services/orderService'
import Spinner from '@/components/ui/Spinner.vue'

type PurchasedProduct = {
  id: string
  name: string
  imageUrl?: string
}

const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_URL || ''
const products = ref<PurchasedProduct[]>([])
const loading = ref(false)

const extractOrderItems = (o: any): any[] => {
  if (Array.isArray(o?.orderItems)) return o.orderItems
  if (Array.isArray(o?.items)) return o.items
  if (Array.isArray(o?.orderDetails)) return o.orderDetails
  return []
}

const extractProductId = (it: any): string => {
  const raw = it?.productId ?? it?.sku ?? it?.product?.id ?? it?.product?.productId
  return String(raw ?? '').trim()
}

const extractProductName = (it: any): string => {
  return String(it?.name ?? it?.productName ?? it?.product?.name ?? 'Product').trim() || 'Product'
}

const extractProductImage = (it: any): string | undefined => {
  const listImage = Array.isArray(it?.images) && it.images.length > 0 ? it.images[0] : ''
  const raw = listImage ?? it?.imageUrl ?? it?.imageURL ?? it?.image ?? it?.productImage ?? it?.product?.imageUrl
  const s = String(raw ?? '').trim()
  if (!s) return undefined
  if (s.startsWith('/')) return `${String(API_BASE_URL).replace(/\/$/, '')}${s}`
  return s
}

const sortedProducts = computed(() => {
  return [...products.value].sort((a, b) => a.name.localeCompare(b.name))
})

const goToReview = (productId: string) => {
  router.push({ name: 'product-detail', params: { id: productId }, hash: '#review' })
}

onMounted(async () => {
  try {
    loading.value = true
    const baseOrders = await orderService.getOrders()
    const orders = Array.isArray(baseOrders) ? baseOrders : []
    const hydratedOrders = await Promise.all(
      orders.map(async (o: any) => {
        const items = extractOrderItems(o)
        const orderId = String(o?.id ?? o?.orderId ?? '').trim()
        if (items.length > 0 || !orderId) return o
        const full = await orderService.getOrder(orderId)
        return full ?? o
      })
    )
    const map = new Map<string, PurchasedProduct>()
    for (const o of hydratedOrders) {
      for (const it of extractOrderItems(o)) {
        const id = extractProductId(it)
        if (!id) continue
        if (!map.has(id)) {
          map.set(id, {
            id,
            name: extractProductName(it),
            imageUrl: extractProductImage(it),
          })
        }
      }
    }
    products.value = [...map.values()]
  } catch (e) {
    console.error('Failed to load purchased products for review', e)
    products.value = []
  } finally {
    loading.value = false
  }
})
</script>
