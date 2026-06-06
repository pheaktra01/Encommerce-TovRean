<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { initFlowbite } from 'flowbite'
import { useAuthStore } from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useToastStore } from '@/stores/toastStore'
import { useRouter } from 'vue-router'
import Spinner from '@/components/ui/Spinner.vue'
import { useI18n } from 'vue-i18n' // Import i18n
import ColourPickerComponent from '@/components/ProductDetail/colour-picker-component.vue'

// --- STORES & ROUTER ---
const authStore = useAuthStore()
const productStore = useProductStore()
const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()
const toastStore = useToastStore()
const router = useRouter()
const { t } = useI18n() // Destructure t function
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

// --- STATE ---
const cartCount = ref(0)
const wishlistCount = ref(0)
const activeFilter = ref('All')
const footerEmail = ref('')
const selectedFeaturedColorIndex = ref(0)

// Auth Modal State
const showAuthPrompt = ref(false)
const activeAuthTab = ref<'signin' | 'signup'>('signin')

// Products State
const salesProducts = ref<any[]>([])
const carouselProducts = ref<any[]>([])
const loading = ref(false)
const error = ref();

// --- COMPUTED ---
const isAuthenticated = computed(() => !!authStore.user)

const featuredProduct = computed(() => {
  // Get product with most reviews (highest sales indicator)
  if (!productStore.products || productStore.products.length === 0) return null
  
  const topSalesProduct = [...productStore.products].sort((a: any, b: any) => {
    const rcA = Number(a.reviewCount || 0)
    const rcB = Number(b.reviewCount || 0)
    if (rcB !== rcA) return rcB - rcA
    const priceA = Number(a.price || 0)
    const priceB = Number(b.price || 0)
    return priceB - priceA
  })[0]

  if (!topSalesProduct) return null

  return mapProductToViewModel(topSalesProduct, 0, 'sales', [])
})

// --- ACTIONS: AUTH & NAVIGATION ---
const goToAuthPage = (tab: 'signin' | 'signup' = 'signin') => {
  activeAuthTab.value = tab
  router.push({ name: tab })
}

const closeAuthPrompt = () => {
  showAuthPrompt.value = false
}

const goToProductDetail = (productId: any) => {
  router.push({ name: 'product-detail', params: { id: productId } })
}

// --- ACTIONS: CART & WISHLIST ---
const addToCart = async (product: any) => {
  if (!isAuthenticated.value) {
    activeAuthTab.value = 'signin'
    showAuthPrompt.value = true
    return
  }

  try {
    await cartStore.addToCart({
      productId: product.id,
      name: product.name,
      itemNo: product.id,
      brand: product.brand || 'TovRean',
      color: 'Standard',
      rating: product.rating || 4.5,
      price: parseFloat(product.price.replace('$', '')),
      quantity: 1,
      image: resolveProductImage(product),
      images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [resolveProductImage(product)],
    })
    cartCount.value++
    // Use t() for alert
    alert(t('home.item_added'))
  } catch (error) {
    console.error('Error adding to cart:', error)
  }
}

const addToWishlist = async (product: any) => {
  if (!isAuthenticated.value) {
    activeAuthTab.value = 'signin'
    showAuthPrompt.value = true
    return
  }

  if (!product?.id) return

  try {
    if (isFavorited(product.id)) {
      await favoriteStore.deleteFavorite(product.id)
      toastStore.showToast(t('productCard.toast_favorite_deleted') || 'Removed from favorites', 'error')
      wishlistCount.value--
    } else {
      await favoriteStore.addFavorite(product)
      toastStore.showToast(t('productCard.toast_favorite_saved') || 'Added to favorites!', 'success')
      wishlistCount.value++
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}

const isFavorited = (productId: string | undefined) => {
  if (!productId) return false
  return favoriteStore.favProduct.some((p: any) => p.id === productId)
}

// --- HELPERS ---
const isMongoId = (id: any) => typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id)
const getObjectIdTime = (id: string) => (isMongoId(id) ? parseInt(id.substring(0, 8), 16) * 1000 : 0)

const resolveProductImage = (product: any) => {
  const raw = (Array.isArray(product?.images) && product.images[0]) || product?.imageUrl || product?.imageURL || product?.image || '/Photo/ourproduct.png'
  const cleaned = typeof raw === 'string' ? raw.trim() : ''
  if (!cleaned) return '/Photo/ourproduct.png'
  if (cleaned.startsWith('/')) return `${String(API_BASE_URL).replace(/\/$/, '')}${cleaned}`
  return cleaned
}

// --- ACTIONS: DATA FETCHING ---
const mapProductToViewModel = (product: any, index: number, type: 'sales' | 'carousel', tags?: string[]) => {
  const isFeatured = type === 'sales' && index === 2
  const priceFormatted = `$${Number(product.price).toFixed(2)}`
  const image = resolveProductImage(product)

  return {
    id: product.id || (100 + index),
    name: product.name,
    brand: product.brandName || 'TovRean',
    priceValue: Number(product.price) || 0,
    price: priceFormatted,
    oldPrice: product.discount
      ? `$${(product.price / (1 - product.discount / 100)).toFixed(2)}`
      : null,
    image,
    images: Array.isArray(product.images) ? product.images : undefined,
    stockQuantity: product.stockQuantity ?? 0,
    status: product.status || (product.stockQuantity > 0 ? 'In Stock' : 'Out of stock'),
    reviewCount: Number(product.reviewCount || 0),

    // Type specific fields
    ...(type === 'sales' && {
      type: isFeatured ? 'featured' : 'grid',
      desc: isFeatured ? product.description : undefined
    }),
    ...(type === 'carousel' && {
      rating: Number(product.averageRating ?? product.rating ?? 0),
      tags: tags ?? []
    })
  }
}

const loadProducts = async () => {
  loading.value = true
  try {
    await productStore.fetchProducts()
    const backendProducts = productStore.products || []

    // Best sale = highest discount percentage
    const saleSorted = [...backendProducts]
      .filter(p => Number(p.discount || 0) > 0)
      .sort((a, b) => {
        const dA = Number(a.discount || 0)
        const dB = Number(b.discount || 0)
        if (dB !== dA) return dB - dA
        const saveA = Number(a.price) * dA
        const saveB = Number(b.price) * dB
        return saveB - saveA
      })

    const salesSource = saleSorted.length > 0 ? saleSorted : backendProducts
    salesProducts.value = salesSource.slice(0, 5).map((p, i) => mapProductToViewModel(p, i, 'sales'))

    // Prepare Latest/Popular
    const latestSorted = [...backendProducts]
      .sort((a: any, b: any) => getObjectIdTime(String(b.id)) - getObjectIdTime(String(a.id)))

    const popularSorted = [...backendProducts]
      .sort((a: any, b: any) => {
        const rcA = Number(a.reviewCount || 0)
        const rcB = Number(b.reviewCount || 0)
        if (rcB !== rcA) return rcB - rcA
        const arA = Number(a.averageRating || a.rating || 0)
        const arB = Number(b.averageRating || b.rating || 0)
        return arB - arA
      })

    const latestSet = new Set(latestSorted.slice(0, 24).map(p => p.id))
    const popularSet = new Set(popularSorted.slice(0, 24).map(p => p.id))

    carouselProducts.value = backendProducts.slice(0, 48).map((p, i) => {
      const tags: string[] = []
      if (p && p.id) {
        if (latestSet.has(p.id)) tags.push('latest')
        if (popularSet.has(p.id)) tags.push('popular')
      }
      return mapProductToViewModel(p, i, 'carousel', tags)
    })

  } catch (err) {
    console.error('Failed to load products:', err)
    error.value = err || 'Failed to Fetch Data.'
  } finally {
    loading.value = false
  }
}

// --- ACTIONS: SUBSCRIPTION ---
const handleFooterSubscribe = () => {
  if (!footerEmail.value || !footerEmail.value.includes('@')) {
    alert(t('home.invalid_email'))
    return
  }
  alert(t('home.subscribed', { email: footerEmail.value }))
  footerEmail.value = ''
}

// --- UI HELPERS ---
const setFilter = (filterName: string) => {
  activeFilter.value = filterName
}

const filteredProducts = computed(() => {
  const list = carouselProducts.value
  if (!list || list.length === 0) return []

  if (activeFilter.value === 'All') {
    return [...list].sort((a: any, b: any) => Number(b.priceValue || 0) - Number(a.priceValue || 0))
  }
  if (activeFilter.value === 'Latest') {
    return [...list]
      .filter((p: any) => p.tags?.includes('latest'))
      .sort((a: any, b: any) => getObjectIdTime(String(b.id)) - getObjectIdTime(String(a.id)))
  }
  if (activeFilter.value === 'Popular') {
    return [...list]
      .filter((p: any) => p.tags?.includes('popular'))
      .sort((a: any, b: any) => {
        const rcDiff = Number(b.reviewCount || 0) - Number(a.reviewCount || 0)
        if (rcDiff !== 0) return rcDiff
        return Number(b.rating || 0) - Number(a.rating || 0)
      })
  }
  return list
})

// Carousel Scrolling
const productScrollContainer = ref<HTMLElement | null>(null)
const scrollLeft = () => productScrollContainer.value?.scrollBy({ left: -320, behavior: 'smooth' })
const scrollRight = () => productScrollContainer.value?.scrollBy({ left: 320, behavior: 'smooth' })

onMounted(() => {
  initFlowbite()
  loadProducts()
  if (isAuthenticated.value) {
    favoriteStore.fetchFavorite().catch(() => {
      // ignore
    })
  }
})
</script>

<template>
  <div class="antialiased text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 transition-colors">

    <section class="bg-gray-50 dark:bg-gray-800 py-4 lg:py-9 overflow-hidden relative transition-colors">
      <div class="grid max-w-7xl px-4 mx-auto lg:gap-16 xl:gap-24 lg:grid-cols-12 items-center">
        <div class="mr-auto place-self-center lg:col-span-6 z-10 text-center lg:text-left">
          <h1 class="max-w-2xl mb-4 text-3xl font-extrabold tracking-tight leading-tight md:text-3xl xl:text-4xl text-[#114B5F] dark:text-[#4EB8D4]">
            {{ $t('home.hero_title') }}
          </h1>
          <p class="max-w-xl mb-6 font-light text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed mx-auto lg:mx-0">
            {{ $t('home.hero_subtitle') }}
          </p>
          <router-link
            to="/product-list"
            class="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-center text-white rounded-lg bg-[#114B5F] hover:bg-[#0d3a4b] focus:ring-4 focus:ring-blue-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
          >
            {{ $t('home.hero_btn') }}
          </router-link>
        </div>
        <div class="mt-0 col-span-6 flex justify-end relative">
          <div class="absolute bg-white rounded-full h-[500px] w-[500px] -z-10 top-1/2 right-0 transform -translate-y-1/2 scale-90 opacity-50 shadow-sm"></div>
          <img src="/Photo/Logo.JPG" alt="School Supplies" class="relative z-10 w-full max-w-lg object-contain drop-shadow-2xl rounded-xl">
        </div>
      </div>
    </section>

    <section class="pt-12 pb-8 bg-white dark:bg-gray-900 transition-colors">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-[#114B5F] dark:text-[#4EB8D4] mb-3">{{ $t('home.section_sale') }}</h2>
        <div class="w-20 h-1 bg-[#EF4444] mx-auto rounded-full"></div>
      </div>
    </section>

    <section v-if="loading">
        <Spinner/>
    </section>
    <section v-else-if="error">
        <p>{{ error }}</p>
    </section>
    <section v-else class="pb-16 bg-white dark:bg-gray-900 transition-colors">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

          <div class="space-y-6 flex flex-col justify-between">
            <div v-for="product in salesProducts.slice(0, 2)" :key="product.id" :id="'product-'+product.id" class="relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition border border-gray-100 dark:border-gray-700 cursor-pointer" @click="goToProductDetail(product.id)">
              <div v-if="(product.stockQuantity ?? 0) <= 0" class="absolute top-3 left-3 bg-red-600 text-white text-[12px] px-2 py-1 rounded">
                {{ $t('home.out_of_stock') }}
              </div>
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mb-4 flex justify-center">
                <img :src="product.image" :alt="product.name" class="h-32 object-contain mix-blend-multiply dark:mix-blend-normal">
              </div>
              <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-1 hover:text-[#114B5F] dark:hover:text-[#4EB8D4]">{{ product.name }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ product.brand }}</p>
              <p class="font-bold text-gray-900 dark:text-white text-sm">{{ product.price }}</p>
            </div>
          </div>

          <div v-if="salesProducts[2]" :id="'product-'+salesProducts[2].id" class="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-blue-400 dark:border-blue-500 flex flex-col h-full cursor-pointer hover:shadow-xl transition" @click="goToProductDetail(salesProducts[2].id)">
            <div v-if="(salesProducts[2].stockQuantity ?? 0) <= 0" class="absolute top-4 left-4 bg-red-600 text-white text-[12px] px-3 py-1 rounded">
               {{ $t('home.out_of_stock') }}
            </div>
            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 mb-6 grow flex items-center justify-center">
              <img :src="salesProducts[2].image" :alt="salesProducts[2].name" class="h-64 object-contain mix-blend-multiply dark:mix-blend-normal transform -rotate-12">
            </div>
            <div class="mt-auto">
              <h3 class="font-bold text-gray-900 dark:text-white text-lg mb-1 hover:text-[#114B5F] dark:hover:text-[#4EB8D4]">{{ salesProducts[2].name }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">{{ salesProducts[2].brand }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{{ salesProducts[2].desc }}</p>
              <div class="flex items-center gap-2">
                <span class="font-bold text-xl text-gray-900 dark:text-white">{{ salesProducts[2].price }}</span>
                <span class="text-sm text-gray-400 dark:text-gray-500 line-through">{{ salesProducts[2].oldPrice }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-6 flex flex-col justify-between">
            <div v-for="product in salesProducts.slice(3, 5)" :key="product.id" :id="'product-'+product.id" class="relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition border border-gray-100 dark:border-gray-700 cursor-pointer" @click="goToProductDetail(product.id)">
              <div v-if="(product.stockQuantity ?? 0) <= 0" class="absolute top-3 left-3 bg-red-600 text-white text-[12px] px-2 py-1 rounded">
                {{ $t('home.out_of_stock') }}
              </div>
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mb-4 flex justify-center">
                <img :src="product.image" :alt="product.name" class="h-32 object-contain mix-blend-multiply dark:mix-blend-normal">
              </div>
              <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-1 hover:text-[#114B5F] dark:hover:text-[#4EB8D4]">{{ product.name }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ product.brand }}</p>
              <p class="font-bold text-gray-900 dark:text-white text-sm">{{ product.price }}</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <section class="bg-gray-50 dark:bg-gray-800 py-16 lg:py-20 transition-colors">
      <div class="max-w-7xl mx-auto px-4">
        <div v-if="featuredProduct" class="bg-[#F9FAFB] dark:bg-gray-700 rounded-2xl p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div class="w-full md:w-1/2 flex justify-center relative cursor-pointer" @click="goToProductDetail(featuredProduct.id)">
            <div class="absolute bg-gray-200 rounded-full h-80 w-80 md:h-[450px] md:w-[450px] -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <img :src="featuredProduct.image" :alt="featuredProduct.name" class="relative z-10 h-80 md:h-[450px] object-contain drop-shadow-xl transform hover:scale-105 transition duration-500">
          </div>
          <div class="w-full md:w-1/2 text-center md:text-left">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 cursor-pointer hover:text-[#114B5F] dark:hover:text-[#4EB8D4] transition" @click="goToProductDetail(featuredProduct.id)">{{ featuredProduct.name }}</h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">{{ featuredProduct.desc || $t('home.feature_desc') }}</p>
            <p class="font-medium text-gray-800 dark:text-gray-200 mb-4">{{ featuredProduct.brand }}</p>
            <div class="mb-8">
              <ColourPickerComponent 
                v-model="selectedFeaturedColorIndex"
                :colors="['Standard', 'Black', 'Gray']"
              />
            </div>
            <div class="flex flex-col md:flex-row items-center gap-6">
              <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ featuredProduct.price }}</span>
              <button
                v-if="(featuredProduct.stockQuantity ?? 0) > 0"
                @click="addToCart(featuredProduct)"
                class="inline-block px-8 py-3 bg-[#114B5F] dark:bg-[#1A535C] text-white font-semibold rounded-lg hover:bg-[#0d3a4b] dark:hover:bg-[#2A7A8F] transition shadow-md cursor-pointer"
              >
                {{ $t('home.feature_btn') }}
              </button>
              <button v-else disabled class="inline-block px-8 py-3 bg-gray-400 dark:bg-gray-600 text-white font-semibold rounded-lg opacity-60 cursor-not-allowed">
                {{ $t('home.out_of_stock') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="loading">
        <Spinner/>
    </section>
    <section v-else-if="error">
        <p>{{ error }}</p>
    </section>
    
    <section v-else class="py-16 bg-white dark:bg-gray-900 relative transition-colors" id="carousel-section">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">{{ $t('home.our_products') }}</h2>

        <div class="flex justify-center gap-4 mb-10">
          <button @click="setFilter('All')" :class="activeFilter === 'All' ? 'bg-[#114B5F] dark:bg-[#1A535C] text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-[#114B5F] dark:hover:border-cyan-300 hover:text-[#114B5F] dark:hover:text-cyan-300'" class="px-6 py-2 rounded-md font-medium transition-colors">{{ $t('home.filter_all') }}</button>
          <button @click="setFilter('Latest')" :class="activeFilter === 'Latest' ? 'bg-[#114B5F] dark:bg-[#1A535C] text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-[#114B5F] dark:hover:border-cyan-300 hover:text-[#114B5F] dark:hover:text-cyan-300'" class="px-6 py-2 rounded-md font-medium transition-colors">{{ $t('home.filter_latest') }}</button>
          <button @click="setFilter('Popular')" :class="activeFilter === 'Popular' ? 'bg-[#114B5F] dark:bg-[#1A535C] text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-[#114B5F] dark:hover:border-cyan-300 hover:text-[#114B5F] dark:hover:text-cyan-300'" class="px-6 py-2 rounded-md font-medium transition-colors">{{ $t('home.filter_popular') }}</button>
        </div>

        <div class="relative group px-4 md:px-8">
          <button @click="scrollLeft" class="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none">
            <svg class="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>

          <div ref="productScrollContainer" class="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2" style="scrollbar-width: none; -ms-overflow-style: none;">
            <div v-for="product in filteredProducts" :key="product.id" :id="'product-'+product.id" class="min-w-[280px] md:min-w-[300px] snap-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition relative cursor-pointer" @click="goToProductDetail(product.id)">
              <div class="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-4 h-64 flex items-center justify-center">
                <div v-if="(product.stockQuantity ?? 0) <= 0" class="absolute top-3 left-3 bg-red-600 text-white text-[12px] px-2 py-1 rounded">
                  {{ $t('home.out_of_stock') }}
                </div>
                <button @click.stop="addToWishlist(product)" class="absolute top-3 right-3 bg-white dark:bg-gray-700 rounded-full p-2 hover:shadow-md transition">
                  <svg class="w-5 h-5" :class="isFavorited(product.id) ? 'text-red-500 fill-current' : 'text-gray-400 dark:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
                <img :src="product.image" :alt="product.name" class="h-48 object-contain mix-blend-multiply dark:mix-blend-normal">
              </div>
              <div class="text-left">
                <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-1 truncate hover:text-[#114B5F] dark:hover:text-[#4EB8D4]">{{ product.name }}</h3>
                <div class="flex text-yellow-400 text-xs mb-3">
                  <span v-for="n in 5" :key="n" :class="n <= product.rating ? 'text-yellow-400' : 'text-gray-300'">★</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-lg text-gray-900 dark:text-white">{{ product.price }}</span>
                  <button
                    v-if="(product.stockQuantity ?? 0) > 0"
                    @click.stop="addToCart(product)"
                    class="px-3 py-1.5 bg-[#114B5F] dark:bg-[#1A535C] text-white text-xs font-bold rounded hover:bg-[#0d3a4b] dark:hover:bg-[#2A7A8F] active:scale-95 transition-transform"
                  >
                    {{ $t('home.add_to_cart') }}
                  </button>
                  <button v-else disabled class="px-3 py-1.5 bg-gray-400 dark:bg-gray-600 text-white text-xs font-bold rounded opacity-60 cursor-not-allowed">
                    {{ $t('home.out_of_stock') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button @click="scrollRight" class="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none">
            <svg class="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </section>

    <div v-if="showAuthPrompt" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" @click.self="closeAuthPrompt">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="flex border-b dark:border-gray-700">
          <button class="flex-1 py-3 text-sm font-semibold" :class="activeAuthTab === 'signin' ? 'text-[#114B5F] dark:text-[#4EB8D4] border-b-2 border-[#114B5F] dark:border-[#4EB8D4]' : 'text-gray-500 dark:text-gray-400'" @click="activeAuthTab = 'signin'">
            {{ $t('modal.tab_signin') }}
          </button>
          <button class="flex-1 py-3 text-sm font-semibold" :class="activeAuthTab === 'signup' ? 'text-[#114B5F] dark:text-[#4EB8D4] border-b-2 border-[#114B5F] dark:border-[#4EB8D4]' : 'text-gray-500 dark:text-gray-400'" @click="activeAuthTab = 'signup'">
            {{ $t('modal.tab_signup') }}
          </button>
        </div>
        <div class="p-6 space-y-4 text-center">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
             {{ activeAuthTab === 'signup' ? $t('modal.title_signup') : $t('modal.title_signin') }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">{{ $t('modal.desc') }}</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button @click="goToAuthPage(activeAuthTab)" class="flex-1 px-4 py-2.5 rounded-lg text-white bg-[#114B5F] dark:bg-[#1A535C] hover:bg-[#0d3a4b] dark:hover:bg-[#2A7A8F] font-semibold">
              {{ activeAuthTab === 'signup' ? $t('modal.go_signup') : $t('modal.go_signin') }}
            </button>
            <button @click="closeAuthPrompt" class="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold">
              {{ $t('modal.maybe_later') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <section>
      <div class="relative bg-gray-900 py-24 md:py-32 px-4 overflow-hidden">
        <div class="absolute inset-0 z-0">
          <img src="/Photo/footerphoto.png" alt="School Supplies Background" class="w-full h-full object-cover opacity-40 mix-blend-overlay">
        </div>
        <div class="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="text-center md:text-left shrink-0">
            <h2 class="text-3xl md:text-5xl font-bold text-white mb-3">{{ $t('home.questions_title') }}</h2>
            <h2 class="text-3xl md:text-5xl font-bold text-white">{{ $t('home.contact_us') }}</h2>
          </div>
          <div class="flex w-full max-w-xl gap-3">
            <input type="email" v-model="footerEmail" :placeholder="$t('home.email_placeholder')" class="w-full px-5 py-3 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#114B5F] dark:focus:ring-[#4EB8D4] shadow-lg text-sm placeholder-gray-500 dark:placeholder-gray-400">
            <button @click="handleFooterSubscribe" class="bg-[#114B5F] dark:bg-[#1A535C] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#0d3a4b] dark:hover:bg-[#2A7A8F] transition shadow-lg whitespace-nowrap text-sm">
              {{ $t('home.submit') }}
            </button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>