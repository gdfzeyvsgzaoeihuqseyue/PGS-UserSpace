<template>
  <Listbox v-model="currentLocale" @update:modelValue="switchLanguage">
    <div class="relative">
      <ListboxButton
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50"
        :title="$t('dashboard.preferences.language', 'Langue')">
        <template v-if="typeof currentLangIcon === 'string'">
          <span class="text-xl leading-none">{{ currentLangIcon }}</span>
        </template>
        <component v-else :is="currentLangIcon" class="w-5 h-5" />
      </ListboxButton>

      <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <ListboxOptions
          class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 focus:outline-none">
          <ListboxOption v-for="lang in locales" :key="lang.id" :value="lang.id" v-slot="{ active, selected }"
            as="template">
            <li :class="[
              active ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300',
              'cursor-pointer select-none relative py-2 pl-10 pr-4 flex items-center transition-colors'
            ]">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <template v-if="typeof lang.icon === 'string'">
                  <span class="text-lg">{{ lang.icon }}</span>
                </template>
                <component v-else :is="lang.icon" class="w-5 h-5" />
              </span>
              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                {{ lang.name }}
              </span>
              <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-primary">
                <IconCheck class="w-4 h-4" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { IconWorld, IconCheck } from '@tabler/icons-vue'

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

// Fonction de changement de langue
const switchLanguage = async (newVal) => {
  const langToUse = newVal === 'system'
    ? systemLanguage.value
    : newVal

  try {
    await setLocale(langToUse)
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
  currentLocale.value = newVal
})
</script>
