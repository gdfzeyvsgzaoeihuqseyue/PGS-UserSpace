<template>
  <section class="py-20 bg-gradient-to-br from-gray-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold mb-4">
          {{ $t('indexPage.solutions.badge') }}
        </span>
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {{ $t('indexPage.solutions.title') }}
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          {{ $t('indexPage.solutions.subtitle') }}
        </p>
      </div>

      <!-- Solutions Grid -->
      <div v-if="!solutionsStore.loading && solutionsStore.authEnabledSolutions.length > 0">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div v-for="(solution, index) in solutionsStore.authEnabledSolutions.slice(0, 6)" :key="solution.id"
            class="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary/50 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2">
            <!-- Solution Header -->
            <div class="flex items-start space-x-4 mb-4">
              <div
                class="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <img v-if="solution.logo" :src="solution.logo" :alt="solution.name"
                  class="w-full h-full object-cover" />
                <div v-else
                  class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                  <span class="text-white font-bold text-xl">{{ solution.name.charAt(0) }}</span>
                </div>
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {{ solution.name }}
                </h3>
                <p class="text-xs text-gray-500">{{ solution.category }}</p>
              </div>
              <span class="badge badge-success text-xs">
                <IconShieldCheck class="w-3 h-3" />
              </span>
            </div>

            <!-- Description -->
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">
              {{ solution.description }}
            </p>

            <!-- Footer -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <a :href="solution.ctaLink" target="_blank" rel="noopener noreferrer"
                class="text-sm font-medium text-primary hover:text-secondary transition-colors flex items-center">
                {{ solution.ctaText }}
                <IconArrowRight class="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <!-- View All Link -->
        <div class="text-center">
          <p class="text-gray-600 mb-4">
            {{ $t('indexPage.solutions.available', { count: solutionsStore.authEnabledSolutions.length },
              solutionsStore.authEnabledSolutions.length) }}
          </p>
          <NuxtLink to="/me/solutions" class="inline-flex items-center btn btn-outline">
            {{ $t('indexPage.solutions.viewAll') }}
            <IconArrowRight class="ml-2 w-5 h-5" />
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="solutionsStore.loading" class="flex justify-center py-12">
        <div class="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <IconFolders class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600">{{ $t('indexPage.solutions.empty') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconArrowRight, IconFolders, IconShieldCheck } from '@tabler/icons-vue'

const solutionsStore = useSolutionsStore()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
