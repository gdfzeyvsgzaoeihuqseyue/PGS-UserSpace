<template>
  <div class="space-y-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('solutionsPage.title') }}</h1>
      <p class="mt-2 text-gray-600">
        {{ $t('solutionsPage.subtitle') }}
      </p>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('solutionsPage.filters.search') }}
          </label>
          <SearchInput id="search" v-model="searchQuery" :placeholder="$t('solutionsPage.filters.searchPlaceholder')"
            @update:model-value="debouncedSearch" @clear="clearSearch" />
        </div>

        <!-- Category Filter -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('solutionsPage.filters.category') }}
          </label>
          <select id="category" v-model="selectedCategory" class="input" @change="applyFilters">
            <option value="">{{ $t('solutionsPage.filters.all') }}</option>
            <option v-for="category in solutionsStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Auth Filter -->
        <div>
          <label for="authFilter" class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('solutionsPage.filters.auth') }}
          </label>
          <select id="authFilter" v-model="authFilter" class="input" @change="applyFilters">
            <option value="">{{ $t('solutionsPage.filters.all') }}</option>
            <option value="true">{{ $t('solutionsPage.filters.ssoEnabled') }}</option>
            <option value="false">{{ $t('solutionsPage.filters.ssoDisabled') }}</option>
          </select>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="mt-4 flex items-center flex-wrap gap-2">
        <span class="text-sm text-gray-600">{{ $t('solutionsPage.filters.active') }}</span>

        <button v-if="searchQuery" @click="clearSearch" class="badge badge-info flex items-center space-x-1">
          <span>{{ $t('solutionsPage.filters.activeSearch') }} {{ searchQuery }}</span>
          <IconX class="w-3 h-3" />
        </button>

        <button v-if="selectedCategory" @click="clearCategory" class="badge badge-info flex items-center space-x-1">
          <span>{{ $t('solutionsPage.filters.activeCategory') }} {{ selectedCategory }}</span>
          <IconX class="w-3 h-3" />
        </button>

        <button v-if="authFilter" @click="clearAuthFilter" class="badge badge-info flex items-center space-x-1">
          <span>{{ $t('solutionsPage.filters.activeSso') }} {{ authFilter === 'true' ?
            $t('solutionsPage.filters.enabled') : $t('solutionsPage.filters.disabled') }}</span>
          <IconX class="w-3 h-3" />
        </button>

        <button @click="clearAllFilters" class="text-sm text-primary hover:text-secondary font-medium">
          {{ $t('solutionsPage.filters.clearAll') }}
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">{{ $t('solutionsPage.stats.total') }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ solutionsStore.totalSolutions }}</p>
          </div>
          <div class="relative w-10 h-10 flex items-center justify-center">
            <span class="absolute inset-0 bg-primary opacity-10 dark:opacity-20 rounded-lg"></span>
            <IconFolders class="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">{{ $t('solutionsPage.stats.active') }}</p>
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
            <p class="text-sm text-gray-600">{{ $t('solutionsPage.stats.withSso') }}</p>
            <p class="text-2xl font-bold text-primary">{{ solutionsStore.authEnabledSolutions.length }}</p>
          </div>
          <div class="relative w-10 h-10 flex items-center justify-center">
            <span class="absolute inset-0 bg-secondary opacity-10 dark:opacity-20 rounded-lg"></span>
            <IconLock class="w-5 h-5 text-secondary" />
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
          {{ $t('solutionsPage.pagination.info', {
            current: solutionsStore.currentPage, total: solutionsStore.totalPages
          }) }}
        </div>
        <div class="flex items-center space-x-2">
          <button @click="previousPage" :disabled="solutionsStore.currentPage === 1"
            class="btn btn-secondary text-sm py-2"
            :class="{ 'opacity-50 cursor-not-allowed': solutionsStore.currentPage === 1 }">
            <IconArrowLeft class="w-4 h-4" />
            {{ $t('solutionsPage.pagination.prev') }}
          </button>
          <button @click="nextPage" :disabled="solutionsStore.currentPage === solutionsStore.totalPages"
            class="btn btn-secondary text-sm py-2"
            :class="{ 'opacity-50 cursor-not-allowed': solutionsStore.currentPage === solutionsStore.totalPages }">
            {{ $t('solutionsPage.pagination.next') }}
            <IconArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft, IconArrowRight, IconCircleCheck, IconFolders, IconLock, IconX } from '@tabler/icons-vue'
import SearchInput from '~/components/SearchInput.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t, locale } = useI18n()
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

useHead({
  title: t('solutionsPage.title')
})
</script>
