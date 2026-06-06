<template>
    <div class="flex items-center space-x-3">
        <span class="text-[20px] font-medium dark:text-white">Colour:</span>
        <div v-if="parsedColors.length === 0" class="text-grey-300 dark:text-gray-400">
            No colours available
        </div>
        <div v-else class="flex gap-2 items-center">
            <button
                v-for="(colorItem, index) in parsedColors"
                :key="index"
                @click="selectColor(index)"
                class="w-6 h-6 rounded-full border-2 transition-all hover:scale-110 relative overflow-hidden"
                :style="colorItem.isMulticolor ? '' : { backgroundColor: colorItem.hex, borderColor: colorItem.hex === '#FFFFFF' || colorItem.hex === '#ffffff' ? '#e5e7eb' : colorItem.hex }"
                :class="{ 'ring-2 ring-offset-2 ring-[#1A535C] dark:ring-offset-gray-900': selectedColorIndex === index }"
                :title="colorItem.name"
            >
                <span v-if="colorItem.isMulticolor" class="absolute inset-0" style="background: linear-gradient(to right, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7)"></span>
            </button>
            <span v-if="parsedColors[selectedColorIndex]" class="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {{ parsedColors[selectedColorIndex]?.name }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'

// Color name to hex mapping
const COLOR_MAP: Record<string, string> = {
    // Basic colors
    'black': '#000000',
    'white': '#FFFFFF',
    'red': '#FF0000',
    'blue': '#0000FF',
    'green': '#008000',
    'yellow': '#FFFF00',
    'orange': '#FFA500',
    'purple': '#800080',
    'pink': '#FFC0CB',
    'brown': '#A52A2A',
    'gray': '#808080',
    'grey': '#808080',
    
    // Extended colors
    'navy': '#000080',
    'cyan': '#00FFFF',
    'magenta': '#FF00FF',
    'lime': '#00FF00',
    'maroon': '#800000',
    'olive': '#808000',
    'teal': '#008080',
    'silver': '#C0C0C0',
    'gold': '#FFD700',
    'beige': '#F5F5DC',
    'coral': '#FF7F50',
    'khaki': '#F0E68C',
    'lavender': '#E6E6FA',
    'mint': '#98FF98',
    'peach': '#FFDAB9',
    'rose': '#FF007F',
    'salmon': '#FA8072',
    'turquoise': '#40E0D0',
    'violet': '#EE82EE',
    'indigo': '#4B0082',
    'cream': '#FFFDD0',
    'ivory': '#FFFFF0',
}

// Words that should NOT be treated as colors
const NON_COLOR_WORDS = new Set([
    'no', 'yes', 'none', 'n/a', 'na', 'null', 'undefined',
    'unknown', 'other', 'any', 'all', 'mixed', 'various',
    'assorted', 'default', 'standard', 'regular', 'normal',
    'true', 'false'
])

interface ColorItem {
    name: string
    hex: string
    isMulticolor?: boolean
}

export default defineComponent({
    name: 'colour-picker-component',
    props: {
        colors: {
            type: [Array, String] as any,
            required: true,
            default: () => []
        },
        modelValue: {
            type: Number,
            default: 0
        }
    },
    emits: ['update:modelValue', 'colorSelected'],
    setup(props, { emit }) {
        const selectedColorIndex = ref(props.modelValue)

        // Parse colors from database format (e.g., "Black,Blue" or ["Black", "Blue"])
        const parsedColors = computed<ColorItem[]>(() => {
            let colorArray: string[] = []
            
            // Handle string format: "Black,Blue"
            if (typeof props.colors === 'string') {
                const trimmed = props.colors.trim().toLowerCase()
                // Handle special cases for "no color" values
                if (!trimmed || trimmed === 'no' || trimmed === 'none' || trimmed === 'n/a' || trimmed === 'null') {
                    return []
                }
                colorArray = props.colors.split(',').map(c => c.trim()).filter(Boolean)
            } 
            // Handle array format: ["Black", "Blue"]
            else if (Array.isArray(props.colors)) {
                colorArray = props.colors.filter(Boolean)
            }

            // Filter out non-color words
            colorArray = colorArray.filter(colorName => {
                const normalized = colorName.toLowerCase().trim()
                return !NON_COLOR_WORDS.has(normalized)
            })

            // Convert color names to hex codes
            return colorArray.map(colorName => {
                const normalizedName = colorName.toLowerCase().trim()
                
                // Handle special "Multicolor" value
                if (normalizedName === 'multicolor' || normalizedName === 'multi-color' || normalizedName === 'rainbow') {
                    return {
                        name: 'Multicolor',
                        hex: '',
                        isMulticolor: true
                    }
                }
                
                // If it's already a hex code, use it
                if (/^#[0-9A-Fa-f]{6}$/.test(colorName)) {
                    return {
                        name: colorName,
                        hex: colorName
                    }
                }
                
                // Look up color name in the map
                const hex = COLOR_MAP[normalizedName]
                
                // Only return valid colors; skip unknown ones
                if (hex) {
                    return {
                        name: colorName.charAt(0).toUpperCase() + colorName.slice(1),
                        hex: hex
                    }
                }
                
                // Return null for invalid colors and filter them out
                return null
            }).filter((item): item is ColorItem => item !== null)
        })

        // Watch for external changes to modelValue
        watch(() => props.modelValue, (newValue) => {
            selectedColorIndex.value = newValue
        })

        const selectColor = (index: number) => {
            selectedColorIndex.value = index
            const selectedColor = parsedColors.value[index]
            if (selectedColor) {
                emit('update:modelValue', index)
                emit('colorSelected', {
                    index,
                    color: selectedColor.name,
                    hex: selectedColor.hex
                })
            }
        }

        return {
            selectedColorIndex,
            selectColor,
            parsedColors
        }
    }
})
</script>

<style scoped>
/* Additional styling if needed */
</style>
