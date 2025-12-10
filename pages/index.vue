<template>
  <div class="min-h-screen">
    <HeroSection />
    <FeaturesSection />
    <SolutionsSection />
    <StatsSection />
    <CtaSection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '~/components/landing/HeroSection.vue'
import FeaturesSection from '~/components/landing/FeaturesSection.vue'
import SolutionsSection from '~/components/landing/SolutionsSection.vue'
import CtaSection from '~/components/landing/CtaSection.vue'
import StatsSection from '~/components/landing/StatsSection.vue'
import { useSolutionsStore } from '~/stores/solutions'

const { t } = useI18n()
const solutionsStore = useSolutionsStore()

definePageMeta({
  layout: 'default'
})

useHead({
  title: t('meta.indexPage.title')
})

onMounted(async () => {
  try {
    await solutionsStore.fetchSolutions({ disabled: false })
  } catch (error) {
    console.error('Failed to load solutions:', error)
  }
})
</script>

<style scoped>
/* Page specific styles */
</style>
