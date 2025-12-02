<template>
  <div class="relative w-full max-w-md" ref="searchContainer">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IconSearch class="h-5 w-5 text-gray-400" />
      </div>
      <input type="text" v-model="searchQuery" @focus="isOpen = true"
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200 ease-in-out shadow-sm"
        :placeholder="$t('dashboard.search.placeholder', 'Rechercher...')" />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span
          class="text-gray-400 text-xs border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 hidden sm:block">Ctrl
          K</span>
      </div>
    </div>

    <!-- Results Dropdown -->
    <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
      <div v-if="isOpen && (filteredResults.length > 0 || searchQuery)"
        class="absolute mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-96 overflow-y-auto">

        <div v-if="filteredResults.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          {{ $t('dashboard.search.noResults', 'Aucun résultat trouvé') }}
        </div>

        <div v-else class="py-2">
          <div v-for="(group, groupName) in groupedResults" :key="groupName">
            <div
              class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700/50">
              {{ groupName }}
            </div>
            <ul>
              <li v-for="item in group" :key="item.path">
                <NuxtLink :to="item.path"
                  class="flex items-center px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer group"
                  @click="closeSearch">
                  <component :is="item.icon"
                    class="h-5 w-5 text-gray-400 group-hover:text-primary mr-3 transition-colors" />
                  <div>
                    <p
                      class="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                      {{ item.title }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {{ item.description }}
                    </p>
                  </div>
                  <IconChevronRight
                    class="ml-auto h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { IconSearch, IconHome, IconLayout2, IconLayoutGridAdd, IconLock, IconUser, IconSettings, IconChevronRight, } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const searchQuery = ref('')
const isOpen = ref(false)
const searchContainer = ref<HTMLElement | null>(null)

// Define searchable items
// In a real app, this could come from a store or be dynamically generated
const searchItems = computed(() => [
  {
    title: t('dashboard.menu.dashboard', 'Tableau de bord'),
    description: t('dashboard.menu.dashboardDesc', 'Vue d\'ensemble de votre activité'),
    path: '/me',
    icon: IconHome,
    category: t('dashboard.search.category.navigation', 'Navigation')
  },
  {
    title: t('dashboard.menu.services', 'Services'),
    description: t('dashboard.menu.servicesDesc', 'Gérer vos services actifs'),
    path: '/me/services',
    icon: IconLayout2,
    category: t('dashboard.search.category.navigation', 'Navigation')
  },
  {
    title: t('dashboard.menu.solutions', 'Solutions'),
    description: t('dashboard.menu.solutionsDesc', 'Explorer les solutions disponibles'),
    path: '/me/solutions',
    icon: IconLayoutGridAdd,
    category: t('dashboard.search.category.navigation', 'Navigation')
  },
  {
    title: t('dashboard.menu.sessions', 'Sessions'),
    description: t('dashboard.menu.sessionsDesc', 'Historique et sécurité'),
    path: '/me/sessions',
    icon: IconLock,
    category: t('dashboard.search.category.navigation', 'Navigation')
  },
  {
    title: t('dashboard.menu.profile', 'Profil'),
    description: t('dashboard.menu.profileDesc', 'Gérer vos informations personnelles'),
    path: '/me/profile',
    icon: IconUser,
    category: t('dashboard.search.category.settings', 'Paramètres')
  },
  {
    title: t('dashboard.menu.settings', 'Paramètres'),
    description: t('dashboard.menu.settingsDesc', 'Préférences de l\'application'),
    path: '/me/setting',
    icon: IconSettings,
    category: t('dashboard.search.category.settings', 'Paramètres')
  }
])

const filteredResults = computed(() => {
  if (!searchQuery.value) return searchItems.value

  const query = searchQuery.value.toLowerCase()
  return searchItems.value.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  )
})

const groupedResults = computed(() => {
  const groups: Record<string, typeof searchItems.value> = {}
  filteredResults.value.forEach(item => {
    if (!groups[item.category]) {
      groups[item.category] = []
    }
    groups[item.category].push(item)
  })
  return groups
})

const closeSearch = () => {
  isOpen.value = false
  searchQuery.value = ''
}

// Handle click outside
const handleClickOutside = (event: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    isOpen.value = true
    // Focus input logic would go here if we had a direct ref to input
    const input = searchContainer.value?.querySelector('input')
    if (input) input.focus()
  }
  if (event.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>
