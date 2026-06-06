<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 bg-white dark:bg-gray-900 transition-colors min-h-screen">
        <!-- Body -->
        <div>
            <div>
                <h1 class="text-[20px] my-5 text-gray-900 dark:text-white">
                    {{ breadcrumbText }}
                </h1>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <!-- Left side product (image) -->
                <div class="bg-white dark:bg-gray-800 rounded-md p-4 h-[520px] lg:h-[600px] lg:sticky lg:top-24">
                    <ProductImageComponent :images="productImages" />
                </div>

                <!-- Right side product (details) -->
                <div class="bg-[#F5F5F5] dark:bg-gray-800 rounded-md">
                    <product-detail-card-component
                        :product="detailProduct"
                        :product-info="productInfo"
                        :product-colors="productColors"
                        :average-rating="averageRating"
                    />
                </div>
            </div>

            <!-- Review Section -->
            <div id="review" class="my-10">
                <h1 class="text-[36px] text-gray-900 dark:text-white">{{ $t('productDetail.review_title') }}</h1>
                <h3 class="text-[14px] text-gray-600 dark:text-gray-400">{{ $t('productDetail.review_subtitle') }}</h3>
            </div>


            <!-- Mobile View: Stack Vertically -->
            <div class="flex flex-col gap-4 lg:hidden">
                <!-- 1. Overall Rating & Graph -->
                <div class="bg-[#F5F5F5] dark:bg-gray-800 rounded-md p-4">
                    <ProductRatingComponent :rating="averageRating" :reviews="productReviews.length" :recommend="recommendCount" />
                </div>
                <div class="bg-[#1A535C] rounded-md p-4 text-white dark:text-gray-100">
                    <rating-graph-component :ratings="ratingData"/>
                </div>

                <!-- 2. Comment Input -->
                <div v-if="canWriteReview" class="bg-[#F5F5F5] dark:bg-gray-800 w-full rounded-md p-4 space-y-5">
                    <write-review-component
                        :userReview="userReview"
                        :currentUserName="currentUserName"
                        :profilePic="currentUserAvatar"
                        @submit-review="handleSubmitReview"
                        @delete-review="handleDeleteReview"
                        @cancel-edit="handleCancelEdit"
                        @edit-review="handleEditReview"
                    />
                </div>
                <div v-else class="bg-[#F5F5F5] dark:bg-gray-800 w-full rounded-md p-4">
                    <div v-if="!authStore.user" class="text-sm text-gray-700 dark:text-gray-300">
                        {{ $t('productDetail.signin_to_review') }}
                    </div>
                    <div v-else>
                        <div class="text-sm text-gray-700 dark:text-gray-300">
                            {{ $t('productDetail.buy_to_review') }}
                        </div>
                        <router-link
                            :to="{ name: 'profile', query: { tab: 'reviews' } }"
                            class="inline-block mt-3 font-medium text-[#1A535C] dark:text-cyan-300 hover:underline"
                        >
                            {{ $t('productDetail.see_bought_products') }}
                        </router-link>
                    </div>
                </div>

                <!-- 3. Show All Comments -->
                <div>
                    <ReviewsComponent :reviews="reviewsForList" :initial-visible-count="6"/>
                </div>
            </div>

            <!-- Desktop View: Side by Side Grid -->
            <div class="hidden lg:grid grid-cols-6 gap-4 relative">

                <!-- left side review =========================================================================================== -->
                <div class="grid grid-flow-col grid-rows-4 grid-cols-8 col-start-1 col-end-3 h-[600px] sticky top-50">

                    <!-- Top Review Summary -->
                    <div class="row-span-2 row-start-1 col-start-1 col-end-9 bg-[#F5F5F5] dark:bg-gray-800 rounded-t-md p-6 ">
                        <ProductRatingComponent :rating="averageRating" :reviews="productReviews.length" :recommend="recommendCount" />
                    </div>

                    <!-- Bottom Rating Distribution Section -->
                    <div class="row-span-2 row-start-3 col-start-1 col-end-9 bg-[#1A535C] rounded-b-md p-6 text-white dark:text-gray-100 ">
                        <rating-graph-component :ratings="ratingData"/>
                    </div>
                </div>


                <!-- right side review -->
                <div class="col-start-3 col-end-7 grid gap-4 ...">
                    <!-- TOP: Write a Review -->
                    <div v-if="canWriteReview" class="bg-[#F5F5F5] dark:bg-gray-800 w-full rounded-md p-6 space-y-5">
                        <write-review-component
                            :userReview="userReview"
                            :currentUserName="currentUserName"
                            :profilePic="currentUserAvatar"
                            @submit-review="handleSubmitReview"
                            @delete-review="handleDeleteReview"
                            @cancel-edit="handleCancelEdit"
                            @edit-review="handleEditReview"
                        />
                    </div>
                    <div v-else class="bg-[#F5F5F5] dark:bg-gray-800 w-full rounded-md p-6">
                        <div v-if="!authStore.user" class="text-sm text-gray-700 dark:text-gray-300">
                            {{ $t('productDetail.signin_to_review') }}
                        </div>
                        <div v-else>
                            <div class="text-sm text-gray-700 dark:text-gray-300">
                                {{ $t('productDetail.buy_to_review') }}
                            </div>
                            <router-link
                                :to="{ name: 'profile', query: { tab: 'reviews' } }"
                                class="inline-block mt-3 font-medium text-[#1A535C] dark:text-cyan-300 hover:underline"
                            >
                                {{ $t('productDetail.see_bought_products') }}
                            </router-link>
                        </div>
                    </div>

                    <!-- User comment-->
                    <div>
                        <ReviewsComponent :reviews="reviewsForList" :initial-visible-count="6"/>
                    </div>

                </div>
            </div>

            <div>
                <div class="flex justify-between items-baseline text-[20px]">
                    <h1 class="text-[36px] my-15 text-gray-900 dark:text-white">{{ $t('productDetail.more_products_title') }}</h1>
                    <button @click="goToProductList" class="text-[#1A535C] dark:text-cyan-300 hover:underline">{{ $t('productDetail.see_all') }}</button>
                </div>
                <div v-if="moreProducts.length > 0" class="flex flex-wrap gap-2">
                    <product-card-component :products="moreProducts" />
                </div>
                <div v-else class="text-gray-500 dark:text-gray-400 text-center">{{ $t('productDetail.no_similar_products') }}</div>

            </div>

            <!-- Contact -->
            <div class="flex flex-col items-center my-20 ...">
                <h1 class="text-[24px] text-[#1A535C] dark:text-cyan-300 mb-10">{{ $t('productDetail.problem_prompt') }}</h1>
                <button @click="goToContact" class="w-[216px] h-[60px] bg-[#1A535C] dark:bg-[#1A535C] rounded-sm text-white dark:text-gray-100 text-[16px] hover:bg-[#15444a] dark:hover:bg-[#2A7A8F] transition cursor-pointer">
                    {{ $t('productDetail.contact_button') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, onMounted, ref, watch } from "vue";
    import { useRoute, useRouter } from 'vue-router'
    import type { Product } from '@/types/product';
    import { productService } from '@/services/productService'
    import orderService from '@/services/orderService'
    import { useProductStore } from '@/stores/productStore'
    import { useAuthStore } from '@/stores/authStore'
    import BlankProfile from '@/assets/images/pfp_blank.jpeg'

    import productCardComponent from '@/components/product/product-card-component.vue';
    import productImageComponent from '@/components/ProductDetail/product-image-component.vue';
    import productDetailCardComponent from '@/components/ProductDetail/product-detail-card-component.vue';
    import productRatingComponent from '@/components/ProductDetail/product-rating-component.vue';
    import ratingGraphComponent, { type RatingItem } from '@/components/ProductDetail/rating-graph-component.vue';
    import writeReviewComponent from '@/components/ProductDetail/write-review-component.vue';
    import reviewsComponent from '@/components/ProductDetail/reviews-component.vue';
import { useI18n } from "vue-i18n";

    interface Review {
        id: number;
        profile: string;
        name: string;
        title: string;
        body: string;
        rating: number;
        recommend: boolean;
        verified: boolean;
        date: string;
    }

    export default {
        name: "product-detail-view",
        components: {
            ProductCardComponent: productCardComponent,
            ProductImageComponent: productImageComponent,
            ProductDetailCardComponent: productDetailCardComponent,
            ProductRatingComponent: productRatingComponent,
            RatingGraphComponent: ratingGraphComponent,
            WriteReviewComponent: writeReviewComponent,
            ReviewsComponent: reviewsComponent,
        },

        setup(){
            const route = useRoute()
            const router = useRouter()
            const productStore = useProductStore()
            const authStore = useAuthStore()

            const { t } = useI18n();

            const products = computed<Product[]>(() => productStore.products)

            const backendProduct = ref<Product | null>(null)

            const selectImages = (p: Product | null | undefined) => {
                const list = Array.isArray(p?.images) ? p!.images.filter(Boolean) : []
                const legacy = typeof p?.imageUrl === 'string' && p.imageUrl.trim() ? [p.imageUrl] : []
                return list.length > 0 ? list : legacy
            }

            const detailProduct = computed(() => {
                const p = backendProduct.value
                const stock = Number(p?.stockQuantity ?? 0)
                const images = selectImages(p)
                const firstImage = resolveBackendUrl(images[0])
                return {
                    id: p?.id ?? '',
                    name: p?.name ?? '',
                    price: Number(p?.price ?? 0),
                    averageRating: p?.averageRating ?? 0,
                    rating: p?.averageRating ?? 0,
                    reviews: productReviews.value.length,
                    description: p?.description ?? '',
                    discount: (p?.discount ?? null) as number | null,
                    stock,
                    imageUrl: firstImage,
                }
            })

            const productInfo = computed(() => {
                const p = backendProduct.value
                const info: { label: string; value: string }[] = []
                if (p?.brandName) info.push({ label: t("productDetailCard.info_brand"), value: p.brandName })
                if (p?.mainCategory) info.push({ label: t("productDetailCard.info_category"), value: p.mainCategory })
                if (p?.subCategory) info.push({ label: t("productDetailCard.info_sub_category"), value: p.subCategory })
                if (p?.type) info.push({ label: t("productDetailCard.info_type"), value: p.type })
                if (p?.size) info.push({ label: t("productDetailCard.info_size"), value: p.size })
                if (p?.material) info.push({ label: t("productDetailCard.info_material"), value: p.material })
                if (p?.color) info.push({ label: t("productDetailCard.info_color"), value: p.color })
                if (p?.status) info.push({ label: t("productDetailCard.info_status"), value: p.status })
                return info
            })

            const productColors = computed(() => {
                const p = backendProduct.value
                const colorString = p?.color || ''
                // Split comma-separated color string into array
                return colorString.split(',').map(c => c.trim()).filter(Boolean)
            })

            function resolveBackendUrl(maybeUrl: unknown): string {
                if (typeof maybeUrl !== 'string') return ''
                const s = maybeUrl.trim()
                if (!s) return ''
                // If API returns relative paths like "/avatars/..." or "/images/...", prefix API base.
                if (s.startsWith('/')) {
                    const base = import.meta.env.VITE_API_URL || ''
                    return `${String(base).replace(/\/$/, '')}${s}`
                }
                return s
            }

            const goToProductList = () => {
                router.push({ name: 'Product List' })
            }

            const goToContact = () => {
                router.push({ name: 'Contact us' })
            }

            const productImages = computed(() => {
                const p = backendProduct.value
                const imgs = selectImages(p)
                // Deduplicate while preserving order to avoid showing the first image twice
                const seen = new Set<string>()
                const resolved = imgs
                    .map(resolveBackendUrl)
                    .filter((url) => {
                        if (!url) return false
                        if (seen.has(url)) return false
                        seen.add(url)
                        return true
                    })
                return resolved.length > 0 ? resolved : ['']
            })

            // Show up to 12 products in the "More product you may like" section
            const moreProducts = computed<Product[]>(() => {
                const list = productStore.products || []
                const currentCategory = backendProduct.value?.mainCategory
                
                if (!currentCategory) {
                    return list.slice(0, 8)
                }
                
                // Filter products with the same mainCategory and exclude the current product
                const currentProductId = String(route.params.id || '').trim()
                const similarProducts = list.filter(
                    product => product.mainCategory === currentCategory && product.id !== currentProductId
                )
                
                return similarProducts.slice(0, 8)
            })

            // Rating Graph - computed from actual reviews
            const ratingData = computed<RatingItem[]>(() => {
                const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

                // Count ratings
                productReviews.value.forEach(review => {
                    const rating = review.rating
                    if (rating >= 1 && rating <= 5) {
                        counts[rating as keyof typeof counts]++
                    }
                })

                const total = productReviews.value.length || 1 // Avoid division by zero

                return [
                    { stars: 5, count: counts[5], percentage: Math.round((counts[5] / total) * 100) },
                    { stars: 4, count: counts[4], percentage: Math.round((counts[4] / total) * 100) },
                    { stars: 3, count: counts[3], percentage: Math.round((counts[3] / total) * 100) },
                    { stars: 2, count: counts[2], percentage: Math.round((counts[2] / total) * 100) },
                    { stars: 1, count: counts[1], percentage: Math.round((counts[1] / total) * 100) },
                ]
            })

            // Reviews (start empty until backed by DB)
            const productReviews = ref<Review[]>([])

            const purchaseLoading = ref(false)
            const purchasedProductIds = ref<Set<string>>(new Set())

            const extractOrderItems = (o: any): any[] => {
                if (Array.isArray(o?.items)) return o.items
                if (Array.isArray(o?.orderItems)) return o.orderItems
                return []
            }

            const extractProductId = (it: any): string => {
                const raw = it?.productId ?? it?.sku ?? it?.product?.id ?? it?.product?.productId
                return String(raw ?? '').trim()
            }

            async function loadPurchasedProducts() {
                if (!authStore.user) {
                    purchasedProductIds.value = new Set()
                    return
                }

                purchaseLoading.value = true
                try {
                    const baseOrders = await orderService.getOrders()
                    const orders = Array.isArray(baseOrders) ? baseOrders : []

                    const hydratedOrders = await Promise.all(
                        orders.map(async (o: any) => {
                            const items = extractOrderItems(o)
                            const orderId = String(o?.id ?? o?.orderId ?? '').trim()
                            if (items.length > 0 || !orderId) return o
                            const full = await orderService.getOrder(orderId)
                            return full ?? o
                        }),
                    )

                    const next = new Set<string>()
                    for (const o of hydratedOrders) {
                        for (const it of extractOrderItems(o)) {
                            const pid = extractProductId(it)
                            if (pid) next.add(pid)
                        }
                    }
                    purchasedProductIds.value = next
                } catch (e) {
                    console.error('Failed to load purchased products', e)
                    purchasedProductIds.value = new Set()
                } finally {
                    purchaseLoading.value = false
                }
            }

            const canWriteReview = computed(() => {
                if (!authStore.user) return false
                const id = String(route.params.id || '').trim()
                if (!id) return false
                return purchasedProductIds.value.has(id)
            })
            const currentUserName = computed(() => authStore.user?.username || authStore.user?.email || 'User')
            const currentUserAvatar = computed(() => {
                const candidate = authStore.user?.avatarUrl
                const s = typeof candidate === 'string' ? candidate.trim() : ''
                if (!s) return BlankProfile
                // Prefix API base for relative paths like "/avatars/..."
                if (s.startsWith('/')) return resolveBackendUrl(s)
                if (/^(https?:\/\/|data:image\/|blob:|\.{1,2}\/)/.test(s)) return s
                return BlankProfile
            })

            const breadcrumbText = computed(() => {
                const p = backendProduct.value
                if (p?.mainCategory && p?.subCategory) return `${t('productDetail.home')} / ${p.mainCategory} / ${p.subCategory}`
                if (p?.mainCategory) return `${t('productDetail.home')} / ${p.mainCategory}`
                return t('productDetail.home')
            })

            const averageRating = computed(() => {
                if (productReviews.value.length === 0) return 0
                const sum = productReviews.value.reduce((acc, r) => acc + Number(r.rating || 0), 0)
                return Math.round((sum / productReviews.value.length) * 10) / 10
            })

            const recommendCount = computed(() => {
                return productReviews.value.filter(r => !!r.recommend).length
            })

            const userReview = ref<Review | null>(null);
            const originalUserReview = ref<Review | null>(null);
            const reviewsLoading = ref(false);

            // Editing state: true when userReview is hidden and we have an original copy
            const isEditing = computed(() => !!originalUserReview.value && !userReview.value)

            // Ensure the user's comment remains visible in the list while editing
            const reviewsForList = computed(() => {
                const list = [...productReviews.value]
                if (isEditing.value && originalUserReview.value) {
                    const exists = list.some(r => r.id === originalUserReview.value?.id)
                    if (!exists) list.unshift(originalUserReview.value)
                }
                return list
            })

            const handleSubmitReview = async (review: Review) => {
                try {
                    const productId = String(route.params.id || '').trim()
                    if (!productId) return

                    const payload = {
                        title: review.title,
                        body: review.body,
                        rating: review.rating,
                        recommend: review.recommend,
                        userName: currentUserName.value,
                        userAvatar: currentUserAvatar.value,
                        verified: canWriteReview.value,
                    }

                    console.log('📝 Submitting review for product:', productId)
                    const savedReview = await productService.submitReview(productId, payload)
                    console.log('✅ Review saved by backend:', savedReview)

                    // Update local state
                    userReview.value = {
                        id: savedReview.id,
                        profile: savedReview.userAvatar || currentUserAvatar.value,
                        name: savedReview.userName || currentUserName.value,
                        title: savedReview.title,
                        body: savedReview.body,
                        rating: savedReview.rating,
                        recommend: savedReview.recommend,
                        verified: savedReview.verified || canWriteReview.value,
                        date: savedReview.createdAt || new Date().toISOString(),
                    }
                    console.log('✅ Local review state updated')

                    // Small delay to ensure backend has persisted the review
                    await new Promise(resolve => setTimeout(resolve, 500))

                    // Reload reviews and product to update rating
                    console.log('🔄 Reloading reviews and product data...')
                    await Promise.all([
                        loadReviews(true),  // Skip user review fetch since we just submitted
                        loadProductByRoute(),
                    ])
                    console.log('✅ Reviews and product data reloaded')

                    // Update ProductStore so ProductListView sees the new rating
                    if (backendProduct.value) {
                        await productStore.updateProduct(productId, {
                            ...backendProduct.value,
                            averageRating: backendProduct.value.averageRating,
                        })
                        console.log('✅ ProductStore updated with new rating')
                    }
                } catch (e) {
                    console.error('Failed to submit review', e)
                }
            };

            const handleDeleteReview = async () => {
                try {
                    if (!userReview.value?.id) return

                    await productService.deleteReview(String(userReview.value.id))
                    userReview.value = null

                    // Reload reviews and product to update rating
                    await Promise.all([
                        loadReviews(),
                        loadProductByRoute(),
                    ])

                    // Update ProductStore so ProductListView sees the new rating
                    const productId = String(route.params.id || '').trim()
                    if (backendProduct.value && productId) {
                        await productStore.updateProduct(productId, {
                            ...backendProduct.value,
                            averageRating: backendProduct.value.averageRating,
                        })
                        console.log('✅ ProductStore updated after review deletion')
                    }
                } catch (e) {
                    console.error('Failed to delete review', e)
                }
            };

            const handleEditReview = () => {
                                console.log('🔄 handleEditReview called, current userReview:', userReview.value);
                // Store the original review before editing (for cancel)
                if (userReview.value) {
                    originalUserReview.value = { ...userReview.value };
                    // Temporarily hide the review card by setting to null
                    userReview.value = null;
                                    console.log('✅ userReview set to null, form should show');
                }
            };

            const handleCancelEdit = (review: any) => {
                // Restore the review that was being edited
                userReview.value = originalUserReview.value;
                originalUserReview.value = null;
            };

            async function loadReviews(skipUserReviewLoad = false) {
                const productId = String(route.params.id || '').trim()
                if (!productId) return

                reviewsLoading.value = true
                try {
                    const reviews = await productService.getProductReviews(productId)

                    // Convert backend reviews to frontend format
                    productReviews.value = reviews.map((r: any) => ({
                        id: r.id,
                        profile: resolveBackendUrl(r.userAvatar),
                        name: r.userName || 'User',
                        title: r.title,
                        body: r.body,
                        rating: r.rating,
                        recommend: r.recommend,
                        verified: r.verified || false,
                        date: r.createdAt || r.updatedAt || new Date().toISOString(),
                    }))

                    // Skip loading user's review if just submitted (already set locally)
                    if (skipUserReviewLoad) {
                        console.log('⏭️ Skipping user review fetch (just submitted)')
                        return
                    }

                    // Load user's review if logged in - backend expects username from JWT
                    const userId = authStore.user?.username || authStore.user?.email || authStore.user?.id
                    if (userId) {
                        try {
                            console.log('🔍 Loading user review for:', { productId, userId })
                            const userReviewData = await productService.getUserReviewForProduct(
                                productId,
                                userId
                            )
                            console.log('✅ User review loaded:', userReviewData)
                            userReview.value = {
                                id: userReviewData.id,
                                profile: resolveBackendUrl(userReviewData.userAvatar),
                                name: userReviewData.userName || currentUserName.value,
                                title: userReviewData.title,
                                body: userReviewData.body,
                                rating: userReviewData.rating,
                                recommend: userReviewData.recommend,
                                verified: userReviewData.verified || false,
                                date: userReviewData.createdAt || new Date().toISOString(),
                            }
                        } catch (e: any) {
                            // 404 means user hasn't written a review yet
                            // BUT also check if the review exists in the productReviews list
                            // (in case GET endpoint is broken but POST worked)
                            if (e.status === 404) {
                                console.log('ℹ️ GET endpoint returned 404, checking product reviews list...')
                                
                                // Find user's review in the loaded reviews list
                                const userReviewInList = reviews.find((r: any) => 
                                    r.userId === userId || 
                                    r.userId === authStore.user?.username ||
                                    r.userId === authStore.user?.email ||
                                    r.userId === authStore.user?.id
                                )
                                
                                if (userReviewInList) {
                                    console.log('✅ Found user review in product reviews list:', userReviewInList)
                                    userReview.value = {
                                        id: userReviewInList.id,
                                        profile: resolveBackendUrl(userReviewInList.userAvatar),
                                        name: userReviewInList.userName || currentUserName.value,
                                        title: userReviewInList.title,
                                        body: userReviewInList.body,
                                        rating: userReviewInList.rating,
                                        recommend: userReviewInList.recommend,
                                        verified: userReviewInList.verified || false,
                                        date: userReviewInList.createdAt || new Date().toISOString(),
                                    }
                                } else {
                                    console.log('ℹ️ No review found - user can write new review')
                                    userReview.value = null
                                }
                            } else {
                                console.error('❌ Failed to load user review:', e)
                                userReview.value = null
                            }
                        }
                    } else {
                        console.log('ℹ️ User not logged in, skipping review load')
                    }
                } catch (e) {
                    console.error('Failed to load reviews', e)
                    productReviews.value = []
                } finally {
                    reviewsLoading.value = false
                }
            }

            async function loadProductByRoute() {
                const id = String(route.params.id || '').trim()
                if (!id) return
                try {
                    backendProduct.value = await productService.getProductById(id)
                } catch (e) {
                    console.error('Failed to load product', e)
                    backendProduct.value = null
                }
            }

            onMounted(async () => {
                await Promise.all([
                    productStore.fetchProducts(),
                    loadProductByRoute(),
                    loadPurchasedProducts(),
                    loadReviews(),
                ])
            })

            watch(
                () => route.params.id,
                async (newId) => {
                    if (newId) {
                        await Promise.all([
                            loadProductByRoute(),
                            loadReviews(),
                            loadPurchasedProducts(),
                        ])
                    }
                },
                { flush: 'post' }
            )

            return {
                products,
                moreProducts,
                goToProductList,
                goToContact,
                detailProduct,
                productInfo,
                productColors,
                productImages,
                ratingData,
                productReviews,
                handleSubmitReview,
                handleDeleteReview,
                canWriteReview,
                authStore,
                currentUserName,
                currentUserAvatar,
                breadcrumbText,
                recommendCount,
                averageRating,
                userReview,
                originalUserReview,
                handleEditReview,
                handleCancelEdit,
                reviewsForList
            }
        }
    }
</script>
