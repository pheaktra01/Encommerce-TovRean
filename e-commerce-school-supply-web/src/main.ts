import './assets/main.css'
import 'flowbite'
import 'primeicons/primeicons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useThemeStore } from './stores/themeStore'

const app = createApp(App)

app.use(createPinia())

// Initialize theme before mounting
const themeStore = useThemeStore()
themeStore.initTheme()

app.use(router)

app.use(i18n)
app.mount('#app')
