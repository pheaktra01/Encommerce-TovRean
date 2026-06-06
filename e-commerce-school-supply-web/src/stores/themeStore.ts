import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
	const isDark = ref(false)

	// Initialize from localStorage or system preference
	const initTheme = () => {
		const stored = localStorage.getItem('theme')
		if (stored) {
			isDark.value = stored === 'dark'
		} else {
			// Check system preference
			isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
		}
		applyTheme()
	}

	const applyTheme = () => {
		console.log('Applying theme, isDark:', isDark.value)
		if (isDark.value) {
			document.documentElement.classList.add('dark')
			console.log('Added dark class to:', document.documentElement)
		} else {
			document.documentElement.classList.remove('dark')
			console.log('Removed dark class from:', document.documentElement)
		}
		console.log('Current classes:', document.documentElement.className)
	}

	const toggleTheme = () => {
		isDark.value = !isDark.value
		localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
		applyTheme()
	}

	const setTheme = (dark: boolean) => {
		isDark.value = dark
		localStorage.setItem('theme', dark ? 'dark' : 'light')
		applyTheme()
	}

	return {
		isDark,
		initTheme,
		toggleTheme,
		setTheme,
	}
})
