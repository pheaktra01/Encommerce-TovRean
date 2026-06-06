<template>
  <div class="product-list-view w-full flex justify-center items-center bg-white dark:bg-gray-900 transition-colors">

    <div class="w-full lg:w-10/12 relative p-4 md:p-0">
      <div class="flex justify-between items-center">
        <h1 class="text-lg md:text-xl my-5 md:my-10 text-gray-900 dark:text-white ...">{{ $t('productList.breadcrumb') }}</h1>
        <button
          class="md:hidden text-gray-900 dark:text-white"
          type="button"
          data-drawer-target="drawer-filter"
          data-drawer-show="drawer-filter"
          aria-controls="drawer-filter"
        >
          <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
          </svg>
        </button>
      </div>

      <!-- Drawer -->
      <div
        id="drawer-filter"
        class="fixed top-0 left-0 z-999  h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white w-80 dark:bg-gray-800"
        tabindex="-1"
        aria-labelledby="drawer-filter-label"
        data-drawer-backdrop="true"
      >
        <h5 id="drawer-filter-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
          <svg class="w-4 h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          {{ $t('productList.filters') }}
        </h5>
        <button
          type="button"
          data-drawer-hide="drawer-filter"
          aria-controls="drawer-filter"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close menu</span>
        </button>
        <div class="col-span-1 mb-10 md:mb-20 ...">
          <div class="md:sticky top-32">
            <h1 class="text-[20px] font-semibold mb-5 text-gray-900 dark:text-white">{{ $t('productList.category') }}</h1>

            <div class="text-base/8 text-[15px] text-gray-700 dark:text-gray-300">
              <div
                v-for="cat in categories"
                :key="cat"
                class="flex items-center cursor-pointer select-none mb-2"
                @click="selectCategory(cat)"
              >
                <div
                  class="h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center"
                  :class="selectedCategory === cat ? 'border-[#1A535C] dark:border-[#4EB8D4]' : 'border-black dark:border-gray-400'"
                >
                  <div v-if="selectedCategory === cat" class="h-2.5 w-2.5 rounded-full bg-[#1A535C] dark:bg-cyan-300"></div>
                </div>
                <p class="ml-2 text-[15px]">{{ cat }}</p>
              </div>
            </div>

            <div class="pr-0 md:pr-20">
              <h1 class="text-[20px] font-semibold my-5 text-gray-900 dark:text-white">{{ $t('productList.price') }}</h1>

              <div class="flex justify-between text-gray-700 dark:text-gray-300">
                <p>{{ $t('productList.range') }}</p>
                <p>${{ Math.round(priceMin) }}-{{ Math.round(priceMax) }}</p>
              </div>

              <div class="my-3 relative h-6">
                <div class="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-[#E6E6E6] dark:bg-gray-700 rounded-full"></div>
                <div
                  class="absolute top-1/2 -translate-y-1/2 h-3 bg-black dark:bg-cyan-300 rounded-full"
                  :style="{ left: minPercent + '%', width: Math.max(0, maxPercent - minPercent) + '%' }"
                ></div>

                <div
                  class="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black dark:bg-cyan-300 z-10"
                  :style="{ left: 'calc(' + minPercent + '% - 10px)' }"
                ></div>
                <div
                  class="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black dark:bg-cyan-300 z-10"
                  :style="{ left: 'calc(' + maxPercent + '% - 10px)' }"
                ></div>

                <input
                  type="range"
                  class="absolute inset-0 w-full opacity-0 cursor-pointer"
                  :min="priceMinLimit"
                  :max="priceMaxLimit"
                  v-model.number="priceMin"
                  @input="onPriceMinInput"
                />
                <input
                  type="range"
                  class="absolute inset-0 w-full opacity-0 cursor-pointer"
                  :min="priceMinLimit"
                  :max="priceMaxLimit"
                  v-model.number="priceMax"
                  @input="onPriceMaxInput"
                />
              </div>
            </div>

            <div class="mb-10 mt-5">
              <h1 class="text-[20px] font-semibold mb-5 text-gray-900 dark:text-white">{{ $t('productList.customer_review') }}</h1>
              <div class="text-base/8 text-[15px] text-gray-700 dark:text-gray-300">
                <div
                  v-for="r in ratingOptions"
                  :key="r"
                  class="flex items-center cursor-pointer select-none mb-2"
                  @click="selectMinRating(r)"
                >
                  <div
                    class="h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center"
                    :class="selectedMinRating === r ? 'border-[#1A535C] dark:border-[#4EB8D4] ring-[#1A535C] dark:ring-[#4EB8D4] dark:ring-offset-gray-900' : 'border-black dark:border-gray-400'"
                  >
                    <div v-if="selectedMinRating === r" class="h-2.5 w-2.5 rounded-full bg-[#1A535C] dark:bg-cyan-300"></div>
                  </div>
                  <div class="ml-2 text-[#FF6B6B] text-[24px] flex items-baseline">
                    <template v-for="n in 5" :key="n">
                      <span>{{ n <= r ? '★' : '☆' }}</span>
                    </template>
                    <p class="ml-2 text-black dark:text-white text-[16px] font-light">{{ r.toFixed(1) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 ...">
        <!-- Category -->
        <div class="hidden md:block col-span-1 mb-10 md:mb-20 ...">
          <div class="md:sticky top-32">
            <h1 class="text-[20px] font-semibold mb-5 text-gray-900 dark:text-white">{{ $t('productList.category') }}</h1>

            <div class="text-base/8 text-[15px] text-gray-700 dark:text-gray-300">
              <div
                v-for="cat in categories"
                :key="cat"
                class="flex items-center cursor-pointer select-none mb-2"
                @click="selectCategory(cat)"
              >
                <div
                  class="h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center"
                  :class="selectedCategory === cat ? 'border-[#1A535C] dark:border-[#4EB8D4]' : 'border-black dark:border-gray-400'"
                >
                  <div v-if="selectedCategory === cat" class="h-2.5 w-2.5 rounded-full bg-[#1A535C] dark:bg-cyan-300"></div>
                </div>
                <p class="ml-2 text-[15px]">{{ cat }}</p>
              </div>
            </div>

            <div class="pr-0 md:pr-20">
              <h1 class="text-[20px] font-semibold my-5 text-gray-900 dark:text-white">{{ $t('productList.price') }}</h1>

              <div class="flex justify-between text-gray-700 dark:text-gray-300">
                <p>{{ $t('productList.range') }}</p>
                <p>${{ Math.round(priceMin) }}-{{ Math.round(priceMax) }}</p>
              </div>

              <div class="my-3 relative h-6">
                <div class="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-[#E6E6E6] dark:bg-gray-700 rounded-full"></div>
                <div
                  class="absolute top-1/2 -translate-y-1/2 h-3 bg-black dark:bg-cyan-300 rounded-full"
                  :style="{ left: minPercent + '%', width: Math.max(0, maxPercent - minPercent) + '%' }"
                ></div>

                <div
                  class="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black dark:bg-cyan-300 z-10"
                  :style="{ left: 'calc(' + minPercent + '% - 10px)' }"
                ></div>
                <div
                  class="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black dark:bg-cyan-300 z-10"
                  :style="{ left: 'calc(' + maxPercent + '% - 10px)' }"
                ></div>

                <input
                  type="range"
                  class="absolute inset-0 w-full opacity-0 cursor-pointer"
                  :min="priceMinLimit"
                  :max="priceMaxLimit"
                  v-model.number="priceMin"
                  @input="onPriceMinInput"
                />
                <input
                  type="range"
                  class="absolute inset-0 w-full opacity-0 cursor-pointer"
                  :min="priceMinLimit"
                  :max="priceMaxLimit"
                  v-model.number="priceMax"
                  @input="onPriceMaxInput"
                />
              </div>
            </div>

            <div class="mb-10 mt-5">
              <h1 class="text-[20px] font-semibold mb-5 text-gray-900 dark:text-white">{{ $t('productList.customer_review') }}</h1>
              <div class="text-base/8 text-[15px] text-gray-700 dark:text-gray-300">
                <div
                  v-for="r in ratingOptions"
                  :key="r"
                  class="flex items-center cursor-pointer select-none mb-2"
                  @click="selectMinRating(r)"
                >
                  <div
                    class="h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center"
                    :class="selectedMinRating === r ? 'border-[#1A535C] dark:border-[#4EB8D4] ring-[#1A535C] dark:ring-[#4EB8D4] dark:ring-offset-gray-900' : 'border-black dark:border-gray-400'"
                  >
                    <div v-if="selectedMinRating === r" class="h-2.5 w-2.5 rounded-full bg-[#1A535C] dark:bg-cyan-300"></div>
                  </div>
                  <div class="ml-2 text-[#FF6B6B] text-[24px] flex items-baseline">
                    <template v-for="n in 5" :key="n">
                      <span>{{ n <= r ? '★' : '☆' }}</span>
                    </template>
                    <p class="ml-2 text-black dark:text-white text-[16px] font-light">{{ r.toFixed(1) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product List -->
        <div class="col-span-1 md:col-span-4 ...">
          <div class="flex justify-between mb-10 items-baseline">
            <h1 class="text-[20px] text-gray-900 dark:text-white">{{ selectedCategory ? `'${selectedCategory}'` : $t('productList.school_products') }}</h1>
            <p class="text-[16px] font-light text-gray-600 dark:text-gray-400">{{ $t('productList.items_count', { count: filteredAllProducts.length }) }}</p>
          </div>
          <div v-if="loading">
            <Spinner/>
          </div>
          <div v-else-if ="filteredAllProducts.length === 0" class="text-center">
              <img src="/src/assets/images/empty.png" alt="No products" class="mx-auto w-[280px] h-[280px] md:w-[430px] md:h-[430px] mb-4" />
              <p class="text-[24px] font-medium text-[#BFBFBF]">{{ $t('productList.no_items') }}</p>
          </div>
          <div v-else class="flex flex-wrap gap-5 justify-center md:justify-start">
            <product-card-component :products="products" />
          </div>

          <div v-if="totalPages() > 0" class="flex justify-center md:justify-end my-20 items-center gap-2 md:gap-6 text-[16px] text-gray-700 dark:text-gray-300">
            <!-- Previous -->
            <div
              @click="previousPage"
              :class="currentPage === 1 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-[#757575] dark:text-gray-400 cursor-pointer hover:text-black dark:hover:text-white'"
              class="hidden md:block"
            >
              &larr; {{ $t('productList.previous') }}
            </div>
             <div
              @click="previousPage"
              :class="currentPage === 1 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-[#757575] dark:text-gray-400 cursor-pointer hover:text-black dark:hover:text-white'"
              class="block md:hidden text-2xl"
            >
              &larr;
            </div>

            <!-- Page Numbers -->
            <div class="flex items-center gap-2">
              <div
                v-for="page in totalPages()"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'h-10 w-10 rounded-lg flex items-center justify-center cursor-pointer transition-colors',
                  currentPage === page
                    ? 'text-white bg-[#2C2C2C] dark:bg-[#1A535C] dark:text-gray-100'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
              >
                {{ page }}
              </div>
            </div>

            <!-- Next -->
            <div
              @click="nextPage"
              :class="currentPage === totalPages() ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'cursor-pointer hover:text-black dark:hover:text-white'"
              class="hidden md:block"
            >
              {{ $t('productList.next') }} &rarr;
            </div>
            <div
              @click="nextPage"
              :class="currentPage === totalPages() ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'cursor-pointer hover:text-black dark:hover:text-white'"
              class="block md:hidden text-2xl"
            >
              &rarr;
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-0 lg:w-1/20"></div>
  </div>
</template>

<script lang="ts">
import ProductCardComponent from '@/components/product/product-card-component.vue'
import { useAuthStore } from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'
import { onMounted, ref, computed, watch } from 'vue'
import { initFlowbite } from 'flowbite'
import Spinner from '@/components/ui/Spinner.vue'
import { storeToRefs } from 'pinia'
import type { Product } from '@/types/product'
import { useRoute } from 'vue-router'

export default {
  name: 'product-list-view',

  components: {
    ProductCardComponent,
    Spinner,
  },

  data() {
    return {
      authStore: useAuthStore(),
    }
  },

  computed: {},
  methods: {},

  setup() {
    const productStore = useProductStore()
    const route = useRoute()
    const currentPage = ref(1)
    const itemsPerPage = 12
    const searchQuery = ref('')
    
    const categories = ref<string[]>([
      'Writing Instruments',
      'Paper Products',
      'Art & Craft Supplies',
      'Organization & Storage',
      'School Bags & Carriers',
      'Classroom & Teaching Supplies',
      'Books & Learning Materials',
    ])

    const selectedCategory = ref<string | null>(null)

    const priceMinLimit = 0
    const priceMaxLimit = ref(100)
    const priceMin = ref(0)
    const priceMax = ref(100)

    const ratingOptions = ref<number[]>([5, 4, 3, 2, 1])
    const selectedMinRating = ref<number | null>(null)

    const minPercent = computed(() => {
      const max = priceMaxLimit.value || 1
      return (priceMin.value / max) * 100
    })

    const maxPercent = computed(() => {
      const max = priceMaxLimit.value || 1
      return (priceMax.value / max) * 100
    })

    const {loading, error} = storeToRefs(productStore);

    const resolveProductImage = (product: Product) => {
      const raw = (product.images && product.images[0]) || product.imageUrl || (product as any).imageURL || ''
      const cleaned = typeof raw === 'string' ? raw.trim() : ''
      const placeholder = 'https://via.placeholder.com/300x300?text=No+Image'
      if (!cleaned) return placeholder
      if (cleaned.startsWith('/')) {
        const base = import.meta.env.VITE_API_URL || ''
        return `${String(base).replace(/\/$/, '')}${cleaned}`
      }
      return cleaned
    }

    // Map backend products - now reactive to store changes
    const allProducts = computed(() => {
      return productStore.products.map((product) => ({
        ...product,
        imageUrl: resolveProductImage(product),
        averageRating: Number(product.averageRating ?? 0),
        rating: Number(product.averageRating ?? 0),
        status: ((product.stockQuantity ?? 0) > 0 ? 'In Stock' : 'Out of stock') as 'In Stock' | 'Out of stock',
      }))
    })

    const filteredAllProducts = computed(() => {
      const selected = selectedCategory.value?.toLowerCase() || null
      const search = searchQuery.value.toLowerCase().trim()
      
      return allProducts.value.filter((p) => {
        // Search filter
        if (search) {
          const name = String(p?.name ?? '').toLowerCase()
          const brand = String(p?.mainCategory ?? '').toLowerCase()
          const subCat = String(p?.subCategory ?? '').toLowerCase()
          const matchSearch = name.includes(search) || brand.includes(search) || subCat.includes(search)
          if (!matchSearch) return false
        }
        
        if (selected) {
          const main = String(p?.mainCategory ?? '').toLowerCase()
          const sub = String(p?.subCategory ?? '').toLowerCase()
          const type = String(p?.type ?? '').toLowerCase()
          const matchCategory = main === selected || sub === selected || type === selected
          if (!matchCategory) return false
        }

        const price = Number(p.price ?? 0)
        if (price < priceMin.value || price > priceMax.value) return false

        if (selectedMinRating.value != null) {
          const rating = Number(p.averageRating ?? 0)
          if (rating < selectedMinRating.value) return false
        }

        return true
      })
    })

    const products = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredAllProducts.value.slice(start, end)
    })

    const totalPages = () => {
      return Math.ceil(filteredAllProducts.value.length / itemsPerPage)
    }

    const loadProducts = async () => {
      productStore.loading = true
      try {
        await productStore.fetchProducts()
        // allProducts (computed) will automatically update from productStore.products
        // Update price limits based on new products
        if (productStore.products.length > 0) {
          const computedMax = Math.max(
            100,
            ...productStore.products.map((p) => Number(p.price ?? 0)),
          )
          priceMaxLimit.value = Math.ceil(computedMax)
        }
        priceMin.value = 0
        priceMax.value = priceMaxLimit.value

        currentPage.value = 1
      } catch (err: unknown) {
        console.error('Failed to load products:', err)
        const message = err instanceof Error ? err.message : 'Failed to Fetch Data.'
        productStore.error = message
      } finally {
        productStore.loading = false;
      }
    }

    const selectCategory = (category: string) => {
      selectedCategory.value = selectedCategory.value === category ? null : category
      currentPage.value = 1
    }

    const onPriceMinInput = () => {
      if (priceMin.value > priceMax.value) priceMin.value = priceMax.value
    }

    const onPriceMaxInput = () => {
      if (priceMax.value < priceMin.value) priceMax.value = priceMin.value
    }

    const selectMinRating = (rating: number) => {
      selectedMinRating.value = selectedMinRating.value === rating ? null : rating
    }

    watch([selectedCategory, priceMin, priceMax, selectedMinRating, searchQuery], () => {
      currentPage.value = 1
    })

    // Watch for search query from route
    watch(
      () => route.query.search,
      (newSearch) => {
        searchQuery.value = typeof newSearch === 'string' ? newSearch : ''
      },
      { immediate: true }
    )

    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages()) {
        currentPage.value = page
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        goToPage(currentPage.value - 1)
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages()) {
        goToPage(currentPage.value + 1)
      }
    }

    onMounted(() => {
      initFlowbite()
      loadProducts()
    })

    return {
      products,
      loading,
      error,
      currentPage,
      totalPages,
      goToPage,
      previousPage,
      nextPage,
      allProducts,
      filteredAllProducts,
      categories,
      selectedCategory,
      selectCategory,
      priceMinLimit,
      priceMaxLimit,
      priceMin,
      priceMax,
      minPercent,
      maxPercent,
      onPriceMinInput,
      onPriceMaxInput,
      ratingOptions,
      selectedMinRating,
      selectMinRating,
    }
  },
}
</script>
