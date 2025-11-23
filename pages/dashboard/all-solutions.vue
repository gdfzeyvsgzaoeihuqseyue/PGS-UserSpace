<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Toutes les Solutions</h1>
      <p class="mt-2 text-gray-600">
        Explorez l'ensemble des solutions de l'écosystème PGS
      </p>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
            Rechercher
          </label>
          <input id="search" v-model="searchQuery" type="text" placeholder="Nom ou description..." class="input"
            @input="debouncedSearch" />
        </div>

        <!-- Category Filter -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <select id="category" v-model="selectedCategory" class="input" @change="applyFilters">
            <option value="">Toutes</option>
            <option v-for="category in solutionsStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Auth Filter -->
        <div>
          <label for="authFilter" class="block text-sm font-medium text-gray-700 mb-2">
            Authentification
          </label>
          <select id="authFilter" v-model="authFilter" class="input" @change="applyFilters">
            <option value="">Toutes</option>
            <option value="true">SSO Activé</option>
            <option value="false">SSO Désactivé</option>
          </select>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="mt-4 flex items-center flex-wrap gap-2">
        <span class="text-sm text-gray-600">Filtres actifs:</span>

        <button v-if="searchQuery" @click="clearSearch" class="badge badge-info flex items-center space-x-1">
          <span>Recherche: {{ searchQuery }}</span>
          <IconX class="w-3 h-3" />
        </button>

        <button v-if="selectedCategory" @click="clearCategory" class="badge badge-info flex items-center space-x-1">
          <span>Catégorie: {{ selectedCategory }}</span>
          <IconX class="w-3 h-3" />
        </button>

        <button v-if="authFilter" @click="clearAuthFilter" class="badge badge-info flex items-center space-x-1">
          <span>SSO: {{ authFilter === 'true' ? 'Activé' : 'Désactivé' }}</span>
          <IconX class="w-3 h-3" />
        </button>

        <button @click="clearAllFilters" class="text-sm text-primaryn hover:text-secondaryn font-medium">
          Tout effacer
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total</p>
            <p class="text-2xl font-bold text-gray-900">{{ solutionsStore.totalSolutions }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <IconFolders class="w-5 h-5 text-primaryn" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Actives</p>
            <p class="text-2xl font-bold text-green-600">{{ solutionsStore.activeSolutions.length }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <IconCircleCheck class="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Avec SSO</p>
            <p class="text-2xl font-bold text-primaryn">{{ solutionsStore.authEnabledSolutions.length }}</p>
          </div>
          <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <IconLock class="w-5 h-5 text-primaryn" />
          </div>
        </div>
      </div>
    </div>

    <!-- Solutions Grid -->
    <SolutionsGrid :solutions="solutionsStore.solutions" :loading="solutionsStore.loading" :error="solutionsStore.error"
      :show-features="true" />

    <!-- Pagination -->
    <div v-if="solutionsStore.totalPages > 1" class="card">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Page {{ solutionsStore.currentPage }} sur {{ solutionsStore.totalPages }}
        </div>
        <div class="flex items-center space-x-2">
          <button @click="previousPage" :disabled="solutionsStore.currentPage === 1"
            class="btn btn-secondary text-sm py-2"
            :class="{ 'opacity-50 cursor-not-allowed': solutionsStore.currentPage === 1 }">
            <IconArrowLeft class="w-4 h-4" />
            Précédent
          </button>
          <button @click="nextPage" :disabled="solutionsStore.currentPage === solutionsStore.totalPages"
            class="btn btn-secondary text-sm py-2"
            :class="{ 'opacity-50 cursor-not-allowed': solutionsStore.currentPage === solutionsStore.totalPages }">
            Suivant
            <IconArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft, IconArrowRight, IconCircleCheck, IconFolders, IconLock, IconX } from '@tabler/icons-vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const solutionsStore = useSolutionsStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const authFilter = ref('')
const currentPage = ref(1)

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || selectedCategory.value || authFilter.value)
})

// Debounced search
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

const applyFilters = async () => {
  currentPage.value = 1
  await fetchSolutions()
}

const fetchSolutions = async () => {
  const params: any = {
    page: currentPage.value,
    limit: 9,
    disabled: false
  }

  if (searchQuery.value) params.search = searchQuery.value
  if (selectedCategory.value) params.category = selectedCategory.value
  if (authFilter.value) params.allowAuth = authFilter.value === 'true'

  await solutionsStore.fetchSolutions(params)
}

const clearSearch = () => {
  searchQuery.value = ''
  applyFilters()
}

const clearCategory = () => {
  selectedCategory.value = ''
  applyFilters()
}

const clearAuthFilter = () => {
  authFilter.value = ''
  applyFilters()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  authFilter.value = ''
  applyFilters()
}

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await fetchSolutions()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = async () => {
  if (currentPage.value < solutionsStore.totalPages) {
    currentPage.value++
    await fetchSolutions()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  fetchSolutions()
})
</script>
