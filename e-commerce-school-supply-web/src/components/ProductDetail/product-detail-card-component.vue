<template>
    <div class="rounded-md p-8 space-y-6 dark:bg-gray-800">

        <!-- Product Name -->
        <h1 class="text-[36px] font-bold leading-tight dark:text-white">
            {{ product.name }}
        </h1>

        <!-- Rating + Reviews + Stock -->
        <div class="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
            <div class="flex items-center mb-3 text-[#FF6B6B]">
                <span class="mr-2 font-semibold text-gray-800 dark:text-gray-200">{{ (averageRating ?? 0).toFixed(1) }}</span>
                <span class="text-[20px]">
                    <template v-for="n in 5" :key="n">
                        <span v-if="n <= Math.floor(averageRating ?? 0)">★</span>
                        <span v-else-if="n - (averageRating ?? 0) <= 0.9">⯪</span>
                        <span v-else>☆</span>
                    </template>
                </span>
                <span class="text-black dark:text-gray-300">{{$t("productDetailCard.reviews", {count: product.reviews})}}</span>
                <span class="mx-1 text-black dark:text-gray-300">|</span>
                <span v-if="product.stock > 0" class="text-green-500 font-medium">{{ $t("productDetailCard.in_stock", {count: product.stock}) }}</span>
                <span v-else class="text-red-500 font-medium">{{$t("productDetailCard.out_of_stock")}}</span>
            </div>
        </div>

        <!-- Price Section -->
        <div class="flex items-stretch ...">
            <div class="text-[48px] text-[#FF383C] leading-none">
                ${{ getDiscountedPrice(product) }}
            </div>
            <div class="flex items-center gap-2 text-gray-500 text-[14px] self-end ml-4 ">
                <span v-if="product.discount !== null && product.discount > 0" class="line-through">${{ product.price.toFixed(2) }}</span>
                <span v-if="product.discount !== null && product.discount > 0" class="text-[#FF383C] font-medium">(-{{product.discount}}%)</span>
            </div>
        </div>

        <div class="w-[90%] h-[1.5px] bg-gray-300 dark:bg-gray-700"></div>

        <!-- Product Info -->
        <ProductInfoComponent :info="productInfo" />

        <!-- Product Description -->
        <div class="space-y-1">
            <h2 class="text-[32px] dark:text-white">{{ $t("productDetailCard.description") }}</h2>
            <p class="text-[#5E5B5B] text-[20px] leading-relaxed text-balance break-normal dark:text-gray-300">
                {{ product.description }}
            </p>
        </div>

        <div class="w-[90%] h-[1.5px] bg-gray-300"></div>

        <!-- Colour Picker -->
        <div class="flex items-center space-x-3">
            <colour-picker-component :colors="productColors" />
        </div>

        <!-- Quantity + Favorite -->
        <div class="flex items-center w-[90%]">
            <div class="flex items-center">
                    <button
                    class="w-9 h-10 flex justify-center items-center border rounded-l-sm text-lg font-bold hover:bg-[#1A535C] hover:text-white hover:border-[#1A535C] dark:text-white dark:hover:border-white"
                    @click="decrease"
                    >-</button>
                    <span class="h-10 w-15 flex justify-center items-center border-y text-lg font-semibold dark:text-white">{{ quantity }}</span>
                    <button
                    class="w-9 h-10 flex justify-center items-center border rounded-r-sm text-lg font-bold hover:bg-[#1A535C] hover:text-white hover:border-[#1A535C] dark:text-white dark:hover:border-white"
                    @click="increase"
                    >+</button>
            </div>

            <!-- Favorite Button -->
            <button
                class="w-10 h-10 ml-5 border p-1 rounded-md flex justify-center items-center dark:bg-gray-300"
                @click="toggleFavorite"
            >
                <img v-if="!isFavorite" src="/src/assets/images/Heart.png" alt="Favorite" />
                <img v-else src="/src/assets/images/Heart-fill.png" alt="Favorite" />
            </button>
        </div>

        <!-- Add to Cart -->
        <button
            v-if="product.stock > 0"
            @click="addToCart"
            class="w-full h-15 text-white font-semibold rounded-lg text-lg"
            >
            <div v-if="!isInCart" class="bg-[#1A535C] w-full h-full flex justify-center items-center rounded-sm">{{ $t("productDetailCard.add_to_cart") }}</div>
            <div v-else class="bg-[#df6868] w-full h-full flex justify-center items-center rounded-sm">{{ $t("productDetailCard.add_another_cart") }}</div>
        </button>

        <!-- Buy Now -->
        <button v-if="product.stock > 0" class="w-full h-15 text-white font-semibold rounded-lg text-lg" @click="buyNow">
            <div class="bg-[#1A535C] w-full h-full flex justify-center items-center rounded-sm">{{ $t("productDetailCard.buy_now") }}</div>
        </button>

        <!-- Back to Products -->
        <button
            v-if="product.stock > 0"
            @click="goBackToProducts"
            class="w-full h-15 font-semibold rounded-lg text-lg"
        >
            <div class="w-full h-full flex justify-center items-center rounded-sm border border-[#1A535C] text-[#1A535C]">
                {{ $t("productDetailCard.back_to_products") }}
            </div>
        </button>

        <div v-if="product.stock === 0" class="w-full flex flex-col items-center text-[24px] mt-10 text-red-500">
            <h1>{{ $t("productDetailCard.out_of_stock") }}</h1>

            <button
                @click="goBackToProducts"
                class="mt-6 w-full max-w-xs h-12 font-semibold rounded-lg text-lg"
            >
                <div class="w-full h-full flex justify-center items-center rounded-sm border border-[#1A535C] text-[#1A535C]">
                    {{ $t("productDetailCard.back_to_products") }}
                </div>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import ColourPickerComponent from './colour-picker-component.vue'
    import ProductInfoComponent from './product-info-component.vue'
    import { useFavoriteStore } from '@/stores/favoriteStore'
    import { useAuthStore } from '@/stores/authStore'
    import { useCartStore } from '@/stores/cartStore'
    import type { Product as FavoriteProduct } from '@/types/product'

    export interface Product {
        id?: string
        name: string
        price: number
        rating: number
        reviews: number
        description: string
        discount: number | null
        stock: number
        images?: string[]
        imageUrl?: string
    }

    export default defineComponent({
        name: 'product-detail-card-component',
        components: { ColourPickerComponent, ProductInfoComponent },

        props: {
            product: { type: Object as () => Product, required: true },
            productInfo: { type: Array as () => { label: string; value: string }[], required: true },
            productColors: { type: Array as () => string[], required: true },
            averageRating: { type: Number, default: 0 }
        },

        setup(props) {
            const router = useRouter()
            const favStore = useFavoriteStore()
            const authStore = useAuthStore()
            const cartStore = useCartStore()

            const quantity = ref(1)
            const isInCart = ref(false)

            const resolveProductImage = () => {
                const raw = (props.product.images && props.product.images[0]) || props.product.imageUrl || ''
                const cleaned = typeof raw === 'string' ? raw.trim() : ''
                if (!cleaned) return ''
                if (cleaned.startsWith('/')) {
                    const base = import.meta.env.VITE_API_URL || ''
                    return `${String(base).replace(/\/$/, '')}${cleaned}`
                }
                return cleaned
            }

            const isFavorite = computed(() => favStore.isFavorited(props.product.id))

            const increase = () => {
                if (quantity.value < props.product.stock) quantity.value++
            }

            const decrease = () => {
                if (quantity.value > 1) quantity.value--
            }

            const getDiscountedPriceValue = (p: Product) => {
                if (!p.discount || p.discount <= 0) return Number(p.price)
                return Number(p.price) - (Number(p.price) * Number(p.discount)) / 100
            }

            const getDiscountedPrice = (p: Product) => {
                return getDiscountedPriceValue(p).toFixed(2)
            }

            const addToCart = async () => {
                if (!authStore.user) {
                    router.push({ name: 'signin' })
                    return
                }

                if (!props.product.id) {
                    console.error('Missing product id; cannot add to cart')
                    return
                }

                const brand = props.productInfo.find(info => info.label === 'Brand')?.value || ''
                const color = props.productColors[0] || ''

                try {
                    await cartStore.addToCart({
                        productId: props.product.id,
                        name: props.product.name,
                        itemNo: props.product.id,
                        brand,
                        color,
                        rating: Number(props.averageRating) || 0,
                        price: getDiscountedPriceValue(props.product),
                        quantity: quantity.value,
                        image: resolveProductImage(),
                        images: props.product.images && props.product.images.length > 0 ? props.product.images : [resolveProductImage()].filter(Boolean),
                    })
                    isInCart.value = true
                } catch (error) {
                    console.error('Failed to add to cart:', error)
                }
            }

            const buyNow = async () => {
                await addToCart()
                if (authStore.user) {
                    router.push({ name: 'checkout' })
                }
            }

            const toggleFavorite = async () => {
                if (!authStore.user) {
                    router.push({ name: 'signin' })
                    return
                }

                // Ensure product id exists before creating favorite payload
                if (!props.product.id) {
                    console.error('Missing product id; cannot add to favorites')
                    return
                }

                const favPayload: FavoriteProduct = {
                    id: props.product.id, // Now guaranteed to be non-null
                    name: props.product.name,
                    price: props.product.price,
                    rating: Number(props.averageRating) ?? 0,
                    averageRating: Number(props.averageRating) ?? 0,
                    discount: props.product.discount ?? null,
                    imageUrl: resolveProductImage() || undefined,
                    images: props.product.images,
                }

                await favStore.toggleFavorite(favPayload)
            }

            const goBackToProducts = () => {
                router.push('/products')
            }

            return {
                quantity, isInCart, isFavorite,
                increase, decrease, addToCart, buyNow, toggleFavorite,
                getDiscountedPrice,
                goBackToProducts,
                resolveProductImage,
            }
        }
    })
</script>
