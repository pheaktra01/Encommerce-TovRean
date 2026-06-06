<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import orderService from '@/services/orderService'

type PurchasedProduct = {
  id: string
  name: string
  imageUrl?: string
}

const router = useRouter()
const products = ref<PurchasedProduct[]>([])
const loading = ref(false)
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

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

<template>
  <div class="border border-default border-dashed rounded-base p-5 bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors">
    <h1 class="mb-5 dark:text-white">Review</h1>
    <div v-if="loading" class="text-sm text-gray-500 dark:text-gray-400">Loading purchased products...</div>
    <div v-else>
      <div v-if="sortedProducts.length === 0" class="text-sm text-gray-500 dark:text-gray-400">No purchased products found.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="p in sortedProducts"
          :key="p.id"
          class="bg-white dark:bg-gray-700 border border-default dark:border-gray-600 rounded-base p-4 flex gap-4 items-center transition-colors"
        >
          <img v-if="p.imageUrl" :src="p.imageUrl" alt="product" class="w-16 h-16 object-cover rounded-sm" />
          <div class="flex-1 min-w-0">
            <div class="font-medium text-heading truncate dark:text-gray-100">{{ p.name }}</div>
            <div class="text-xs text-body truncate dark:text-gray-400">{{ p.id }}</div>
          </div>
          <button
            @click="goToReview(p.id)"
            class="px-4 py-2 bg-neutral-primary box-border border border-transparent focus:ring-4 focus:ring-neutral-tertiary font-medium rounded-base text-sm focus:outline-none hover:bg-accent/70 hover:text-white dark:bg-[#1A535C] dark:hover:bg-[#2A7A8F] transition"
          >
            Review
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
