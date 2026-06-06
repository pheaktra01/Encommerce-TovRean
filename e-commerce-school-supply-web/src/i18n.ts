import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import type { I18nOptions } from 'vue-i18n'

// 1. Import default locale directly (synchronous)
// This ensures the app has text to show immediately on load
import en from './locales/en.json'

// Type definition for your locale keys (optional, but good for TS)
export type Locale = 'en' | 'kh'

const STORAGE_KEY = 'user-locale'
const DEFAULT_LOCALE = 'en'

// 2. Determine startup locale
// Check LocalStorage -> Browser Preference -> Default
const getStartupLocale = (): string => {
  const cached = localStorage.getItem(STORAGE_KEY)
  if (cached) return cached
  return DEFAULT_LOCALE
}

const startupLocale = getStartupLocale()

const options: I18nOptions = {
  legacy: false, // Must be false for Composition API
  locale: DEFAULT_LOCALE, // Start with default, switch later if needed
  fallbackLocale: DEFAULT_LOCALE,
  globalInjection: true, // Allows using $t in template
  messages: {
    en: en as any // 'en' is loaded by default
  }
}

// 3. Create i18n instance
const i18n = createI18n(options)

// 4. Helper: Update HTML lang attribute and body class
function updateDocumentLanguage(locale: string) {
  document.querySelector('html')?.setAttribute('lang', locale)
  if (locale === 'kh') {
    document.body.classList.add('lang-kh')
  } else {
    document.body.classList.remove('lang-kh')
  }
}

// 5. Main Function: Lazy Load & Switch Language
export async function switchLanguage(newLocale: string) {
  // @ts-ignore: Accessing global scope in Vue I18n v9+ composition mode
  const currentLocale = i18n.global.locale.value 

  // If the language is already active, do nothing
  if (currentLocale === newLocale) return

  // If the language is already loaded in memory, just switch
  // @ts-ignore
  if (i18n.global.availableLocales.includes(newLocale)) {
    // @ts-ignore
    i18n.global.locale.value = newLocale
    updateDocumentLanguage(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
    return
  }

  // If not loaded, fetch the file
  try {
    // Vite dynamic import. Note: The extension .json is crucial!
    const messages = await import(`./locales/${newLocale}.json`)

    // Add the new locale messages to the instance
    // @ts-ignore
    i18n.global.setLocaleMessage(newLocale, messages.default)

    // Switch the language
    // @ts-ignore
    i18n.global.locale.value = newLocale
    
    // Update HTML & Storage
    updateDocumentLanguage(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
  } catch (e) {
    console.error(`Error loading locale: ${newLocale}`, e)
  }

  return nextTick()
}

// 6. Handle initial load if user has a saved preference other than English
if (startupLocale !== DEFAULT_LOCALE) {
  switchLanguage(startupLocale)
} else {
  updateDocumentLanguage(DEFAULT_LOCALE)
}

export default i18n