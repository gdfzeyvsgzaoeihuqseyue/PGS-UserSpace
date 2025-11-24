<template>
  <button @click="cycleLanguage"
    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50"
    :title="$t('dashboard.preferences.language', 'Langue')">
    <template v-if="typeof currentLangIcon === 'string'">
      <span class="text-xl leading-none">{{ currentLangIcon }}</span>
    </template>
    <component v-else :is="currentLangIcon" class="w-5 h-5" />
  </button>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { IconWorld } from '@tabler/icons-vue'

const { locale, setLocale } = useI18n()
const router = useRouter()
const route = useRoute()

const currentLocale = ref(locale.value)

// Langue système
const systemLanguage = ref('fr')
if (process.client) {
  systemLanguage.value = navigator.language.startsWith('fr') ? 'fr' : 'en'
}

// Liste des langues disponibles
const locales = [
  { id: 'system', name: 'Système', icon: IconWorld },
  { id: 'fr', name: 'Français', icon: '🇫🇷' },
  { id: 'en', name: 'English', icon: '🇬🇧' },
]

const currentLangIcon = computed(() => {
  const lang = locales.find(l => l.id === currentLocale.value)
  return lang ? lang.icon : IconWorld
})

// Fonction de changement de langue (cycle)
const cycleLanguage = async () => {
  const currentIndex = locales.findIndex(l => l.id === currentLocale.value)
  const nextIndex = (currentIndex + 1) % locales.length
  const nextLang = locales[nextIndex]

  await switchLanguage(nextLang.id)
}

const switchLanguage = async (newVal) => {
  const langToUse = newVal === 'system'
    ? systemLanguage.value
    : newVal

  try {
    await setLocale(langToUse)
    // Update current locale ref immediately for UI feedback
    currentLocale.value = newVal

    let newPath = '/'

    // Si pas page d'accueil, construire le chemin
    if (route.path && route.path !== '/') {
      const pathWithoutLocale = route.path.replace(/^\/(fr|en)/, '') || '/'
      newPath = langToUse === 'fr' ? pathWithoutLocale : `/en${pathWithoutLocale}`
    } else {
      newPath = langToUse === 'fr' ? '/' : '/en'
    }

    // Redirection
    await router.push(newPath)
  } catch (error) {
    console.warn('Erreur lors du changement de langue:', error)
    const fallbackPath = langToUse === 'fr' ? '/' : '/en'
    await router.push(fallbackPath)
  }
}

// Mise à jour quand la locale change
watch(() => locale.value, (newVal) => {
  // We need to map the resolved locale back to our 'system' logic if needed, 
  // but for simplicity, if the locale matches 'fr' or 'en', we show that.
  // If we want to persist 'system' selection, we might need a store, but here we just show the active one.
  // However, to keep the cycle working correctly, we should try to match the current selection.
  if (currentLocale.value !== 'system' && currentLocale.value !== newVal) {
    currentLocale.value = newVal
  }
})
</script>
