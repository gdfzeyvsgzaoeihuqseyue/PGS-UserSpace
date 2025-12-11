<template>
  <section class="py-16 bg-WtB border-t border-ash">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-wrap justify-center gap-8 md:gap-16">
        <div v-for="stat in stats" :key="stat.label" class="text-center min-w-[150px]">
          <div class="text-4xl md:text-5xl font-bold text-primary mb-2">
            {{ stat.value }}
          </div>
          <div class="text-sm text-gray-600">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const solutionsStore = useSolutionsStore()

const stats = computed(() => {
  const allStats = [
    {
      value: `${solutionsStore.totalSolutions}`,
      label: t('indexPage.stats.totalSolutions'),
      requiresData: true
    },
    {
      value: `${solutionsStore.authEnabledSolutions.length}+`,
      label: t('indexPage.stats.integratedSolutions'),
      requiresData: true
    },
    {
      value: `${solutionsStore.categories.length}`,
      label: t('indexPage.stats.categories'),
      requiresData: true
    },
    {
      value: '24/7',
      label: t('indexPage.stats.support'),
      requiresData: false
    }
  ]

  if (solutionsStore.loading || solutionsStore.activeSolutions.length === 0) {
    return allStats.filter(stat => !stat.requiresData)
  }

  return allStats
})
</script>
