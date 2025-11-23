<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card animate-pulse">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 bg-gray-300 rounded-lg"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div class="space-y-2">
          <div class="h-3 bg-gray-300 rounded"></div>
          <div class="h-3 bg-gray-300 rounded"></div>
          <div class="h-3 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card bg-red-50 border-red-200">
      <div class="flex items-center">
        <IconInfoCircle class="w-5 h-5 text-red-600 mr-3" />
        <div>
          <p class="text-sm text-red-800 font-medium">Erreur de chargement</p>
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="solutions.length === 0" class="card text-center py-12">
      <IconInbox class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium mb-2">Aucune solution trouvée</h3>
      <p>
        {{ emptyMessage || 'Aucune solution ne correspond à vos critères de recherche.' }}
      </p>
    </div>

    <!-- Solutions Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SolutionCard v-for="solution in solutions" :key="solution.id" :solution="solution"
        :show-features="showFeatures" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconInbox, IconInfoCircle } from '@tabler/icons-vue'
import type { Solution } from '~/types'

interface Props {
  solutions: Solution[]
  loading?: boolean
  error?: string | null
  showFeatures?: boolean
  emptyMessage?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  showFeatures: false,
  emptyMessage: ''
})
</script>