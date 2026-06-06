<template>
    <div class="flex flex-col h-full gap-4">
        <!-- Main Image Display -->
        <div
            class="flex-1 bg-white rounded-md overflow-hidden flex items-center justify-center dark:bg-gray-700 cursor-zoom-in"
            role="button"
            tabindex="0"
            @click="openModal"
            @keydown.enter.prevent="openModal"
            @keydown.space.prevent="openModal"
        >
            <img
                :src="images[selectedIndex]"
                alt="Selected product image"
                class="w-full h-full object-contain"
            />
        </div>

        <!-- Thumbnail Images (Bottom Row) -->
        <div v-if="images.length > 1" class="flex flex-wrap gap-2 md:gap-3 justify-start">
            <button
                v-for="(image, index) in images"
                :key="index"
                type="button"
                @click="selectImage(index)"
                class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 cursor-pointer border rounded-md overflow-hidden hover:border-[#1A535C] transition bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A535C]"
                :class="{ 'border-[#1A535C] border-2': selectedIndex === index }"
                :aria-pressed="selectedIndex === index"
            >
                <img :src="image" :alt="`Product image ${index + 1}`" class="w-full h-full object-cover" />
            </button>
        </div>

        <!-- Lightbox modal teleported to body to avoid parent stacking/overflow issues -->
        <Teleport to="body">
            <div
                v-if="showModal"
                class="fixed inset-0 bg-black/80 z-12000 flex items-center justify-center p-4"
                @click="closeModal"
                @keydown.escape.prevent="closeModal"
                tabindex="-1"
                role="dialog"
                aria-modal="true"
            >
                <div class="relative max-w-5xl w-full flex justify-center">
                    <button
                        type="button"
                        class="absolute -top-1 -right-1 rounded-md p-2 shadow focus:outline-none"
                        @click.stop="closeModal"
                        aria-label="Close image"
                    >
                        
                    </button>
                    <img
                        :src="images[selectedIndex]"
                        alt="Selected product image enlarged"
                        class="max-h-[80vh] max-w-full object-contain bg-white rounded"
                        @click.stop
                    />
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onBeforeUnmount } from 'vue'

export default defineComponent({
    name: 'product-image-component',
    props: {
        images: {
            type: Array as () => string[],
            required: true,
            default: () => []
        }
    },
    setup(props) {
        const selectedIndex = ref(0)
        const showModal = ref(false)
        const images = computed(() => props.images || [])

        const selectImage = (index: number) => {
            selectedIndex.value = index
        }

        const openModal = () => {
            if (!images.value || images.value.length === 0) return
            showModal.value = true
        }

        const closeModal = () => {
            showModal.value = false
        }

        // Prevent background scroll when modal is open
        const toggleBodyScroll = (disable: boolean) => {
            if (typeof document === 'undefined') return
            document.body.style.overflow = disable ? 'hidden' : ''
        }

        watch(showModal, (val) => {
            toggleBodyScroll(val)
        })

        onBeforeUnmount(() => toggleBodyScroll(false))

        return {
            selectedIndex,
            selectImage,
            showModal,
            openModal,
            closeModal,
            images,
        }
    }
})
</script>

<style scoped>
/* Additional styling if needed */
</style>
