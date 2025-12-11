<template>
  <div class="min-h-screen">
    <HeroSection />
    <TrustedBySection />
    <FeaturesSection />
    <SolutionsSection v-if="!solutionsStore.loading && solutionsStore.activeSolutions.length > 0" />
    <StatsSection />
    <TestimonialsSection />
    <FaqSection />
    <CtaSection />
  </div>
</template>

<script setup lang="ts">
import { HeroSection, TrustedBySection, FeaturesSection, SolutionsSection, StatsSection, TestimonialsSection, FaqSection, CtaSection } from '~/components/landing'
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
