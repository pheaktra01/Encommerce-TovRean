<template>
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
  <!-- Product grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
    <div
      v-for="(product, index) in products"
      :key="product.id || index"
      class="bg-white dark:bg-gray-800 rounded-[20px] overflow-hidden border border-gray-400 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg transition cursor-pointer"
      @click="goToDetail(product.id)"
    >
    <!-- Image Section -->
    <div class="relative flex justify-center items-center h-40">
      <img
        :src="resolveProductImage(product)"
        :alt="product.name"
        class="w-full max-h-40 object-contain"
      />

      <!-- Discount -->
      <div
        v-if="product.discount"
        class="absolute top-4 left-4 w-[50px] h-[30px] bg-[#FF6B6B] rounded-[5px] flex justify-center items-center text-white text-[12px]"
      >
        -{{ product.discount }}%
      </div>

      <!-- Out of stock badge -->
      <div v-if="(product.stockQuantity ?? 0) <= 0"
           class="absolute bottom-4 left-4 bg-red-600 text-white text-[12px] px-2 py-1 rounded">
        {{ $t('home.out_of_stock') }}
      </div>

      <!-- Heart Icon -->
      <button @click.stop="toggleLike(product)" class="absolute top-4 right-4 bg-white dark:bg-gray-500 rounded-full p-2 hover:shadow-md transition">
        <img v-if="!isFavorited(product.id)" src="/src/assets/images/Heart.png" class="w-[27px] h-6" />
        <img v-else src="/src/assets/images/Heart-fill.png" class="w-[27px] h-6" />
      </button>
    </div>

    <!-- Info Section -->
    <div class="p-4 bg-[#F5F5F5] dark:bg-gray-700 m-2 rounded-[20px]">
      <!-- Product Name -->
      <h1 class="w-full max-w-sm text-[14px] font-bold text-gray-900 dark:text-white truncate">{{ product.name }}</h1>

      <!-- Rating -->
      <StarRating :rating="product.averageRating" :showNumber="true" class="mb-3" />

      <!-- Price and Add to Cart -->
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-sm text-gray-500 dark:text-gray-400">{{ $t('productCard.price') }}</h2>
          <div class="flex items-end">
            <p class="font-bold text-[24px] text-gray-900 dark:text-white">${{ getDiscountedPrice(product) }}</p>
            <p v-if="product.discount" class="font-bold text-[12px] ml-2 line-through text-gray-500 dark:text-gray-400">
              ${{ product.price.toFixed(2) }}
            </p>
          </div>
        </div>

        <button
          @click.stop="btnLink(index)"
          :disabled="(product.stockQuantity ?? 0) <= 0"
          class="text-white w-28 h-9 rounded-md text-[12px] font-semibold"
        >
          <div
            v-if="(product.stockQuantity ?? 0) <= 0"
            class="w-full h-full flex justify-center items-center rounded-sm bg-gray-400 opacity-60 cursor-not-allowed"
          >
            {{ $t('home.out_of_stock') }}
          </div>
          <div
            v-else-if="!linkBtn[index]"
            class="bg-[#1A535C] w-full h-full flex justify-center items-center rounded-sm hover:bg-[#15444a]"
          >
            {{ $t('home.add_to_cart') }}
          </div>
          <div
            v-else
            class="bg-[#C3C3C3] w-full h-full flex justify-center items-center rounded-sm"
          >
            {{ $t('productCard.added_quantity', { count: addedQuantity[index] }) }}
          </div>
        </button>
      </div>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { defineComponent, ref, watch, computed, onMounted } from 'vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useToastStore } from '@/stores/toastStore'
import StarRating from '../ui/StarRating.vue'
import { useI18n } from 'vue-i18n'


export default defineComponent({
  name: 'product-card-component',
  components: {
    StarRating,
  },
  props: {
    products: {
      type: Array as () => Product[],
      required: true,
    },
  },

  setup(props) {
    const router = useRouter()
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    const favStore = useFavoriteStore()
    const toast = useToastStore();
    const isAuthenticated = computed(() => !!authStore.user)

    // Auth Modal State
    const showAuthPrompt = ref(false)
    const activeAuthTab = ref<'signin' | 'signup'>('signin')

    const { t } = useI18n();
    // Create reactive arrays to track like and add-to-cart states for each product
    const linkBtn = ref<boolean[]>([])
    const addedQuantity = ref<number[]>([])

    const isFavorited = (productId: string | undefined) => {
      if (!productId) return false
      // If your store uses 'favorites' instead of 'favProduct', change this line
      return favStore.favProduct.some((p: Product) => p.id === productId)
    }
// --- ACTIONS: AUTH & NAVIGATION ---
    const goToAuthPage = (tab: 'signin' | 'signup' = 'signin') => {
      activeAuthTab.value = tab
      router.push({ name: tab })
    }

    const closeAuthPrompt = () => {
      showAuthPrompt.value = false
    }
    const toggleLike = async (product: Product) => {
      if (!isAuthenticated.value) {
        activeAuthTab.value = 'signin'
        showAuthPrompt.value = true
        return
      }
  
      if (!product.id) return

      if (isFavorited(product.id)) {
        toast.showToast(t('productCard.toast_favorite_deleted'), 'error')
        await favStore.deleteFavorite(product.id)
      } else {
        await favStore.addFavorite(product) // Ensure backend expects ID
        toast.showToast(t('productCard.toast_favorite_saved'), 'success')
      }
    }
    // Initialize arrays when products prop changes
    watch(
      () => props.products,
      (newProducts) => {
        linkBtn.value = newProducts.map(() => false)
        addedQuantity.value = newProducts.map(() => 0)
      },
      { immediate: true },
    )

    const getDiscountedPrice = (product: Product) => {
      const discount = product.discount ?? 0
      const priceAfterDiscount = product.price - (product.price * discount) / 100
      return (Math.floor(priceAfterDiscount * 100) / 100).toFixed(2)
    }



    const goToDetail = (productId: string | undefined) => {
      if (productId) {
        router.push({ name: 'product-detail', params: { id: productId } })
      }
    }

    const resolveProductImage = (product: Product) => {
      const raw = (product.images && product.images[0]) || product.imageUrl || (product as any).imageURL || (product as any).image || '/Photo/ourproduct.png'
      if (typeof raw !== 'string') return '/Photo/ourproduct.png'
      const trimmed = raw.trim()
      if (!trimmed) return '/Photo/ourproduct.png'
      if (trimmed.startsWith('/')) {
        const base = import.meta.env.VITE_API_URL || ''
        return `${String(base).replace(/\/$/, '')}${trimmed}`
      }
      return trimmed
    }

    const btnLink = async (index: number) => {
      if (!isAuthenticated.value) {
        activeAuthTab.value = 'signin'
        showAuthPrompt.value = true
        return
      }

      const product = props.products[index]
      if (!product) return
      
      try {
        const image = resolveProductImage(product)
        // Add item to cart - map product fields correctly
        await cartStore.addToCart({
          productId: product?.id || `product-${index}`,
          name: product?.name || 'Unknown Product',
          itemNo: product?.id || `P${index}`,
          brand: product?.brandName || 'TovRean',
          color: product?.color || 'Standard',
          rating: product?.averageRating || 0,
          price: product?.price || 0,
          quantity: 1,
          image,
          images: Array.isArray(product?.images) && product.images.length > 0 ? product.images : [image].filter(Boolean),
        })
        linkBtn.value[index] = true
        addedQuantity.value[index] = (addedQuantity.value[index] || 0) + 1
      } catch (error) {
        console.error('Error adding to cart:', error)
      }
    }
    onMounted(() => {
      if (isAuthenticated.value) {
        favStore.fetchFavorite()
      }
    })

    return {
      linkBtn,
      addedQuantity,
      toggleLike,
      isFavorited,
      btnLink,
      goToDetail,
      getDiscountedPrice,
      resolveProductImage,
      activeAuthTab,
      showAuthPrompt,
      goToAuthPage,
      closeAuthPrompt,
    }
  },
})
</script>
