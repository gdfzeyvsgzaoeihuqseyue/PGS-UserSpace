<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">
          {{ $t('indexPage.hero.welcome') }} <span class="text-primary font-heading">{{ $t('indexPage.hero.title') }}</span>
        </h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          {{ $t('indexPage.hero.subtitle') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/auth/register" class="btn btn-primary text-lg px-8 py-3">
            {{ $t('indexPage.hero.getStarted') }}
          </NuxtLink>
          <NuxtLink to="/auth/login" class="btn btn-outline text-lg px-8 py-3">
            {{ $t('indexPage.hero.signIn') }}
          </NuxtLink>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <div v-for="feature in features" :key="feature.title"
          class="card text-center hover:shadow-lg transition-shadow">
          <div class="relative w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span class="absolute inset-0 bg-primary opacity-10 dark:opacity-20 rounded-full"></span>
            <component :is="feature.icon" class="w-8 h-8 text-primary" />
          </div>
          <h3 class="text-xl font-bold mb-2">{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>

      <!-- Solutions -->
      <div class="space-y-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold mb-3">{{ $t('indexPage.solutions.title') }}</h2>
          <p class="max-w-2xl mx-auto">
            {{ $t('indexPage.solutions.subtitle') }}
          </p>
        </div>

        <!-- Solutions Grid -->
        <SolutionsGrid :solutions="solutionsStore.authEnabledSolutions" :loading="solutionsStore.loading"
          :error="solutionsStore.error" :show-features="false" :empty-message="$t('indexPage.solutions.empty')" />

        <!-- View All Link -->
        <div v-if="solutionsStore.authEnabledSolutions.length > 0" class="text-center">
          <p class="text-sm text-gray-600">
            {{ $t('indexPage.solutions.available', { count: solutionsStore.authEnabledSolutions.length },
              solutionsStore.authEnabledSolutions.length) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconBolt, IconLayoutGridAdd, IconLock } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

definePageMeta({
  layout: 'default',
  middleware: 'guest'
})

const solutionsStore = useSolutionsStore()

const features = computed(() => [
  {
    icon: IconLock,
    title: t('indexPage.features.secureAuth.title'),
    description: t('indexPage.features.secureAuth.description')
  },
  {
    icon: IconLayoutGridAdd,
    title: t('indexPage.features.multipleServices.title'),
    description: t('indexPage.features.multipleServices.description')
  },
  {
    icon: IconBolt,
    title: t('indexPage.features.lightningFast.title'),
    description: t('indexPage.features.lightningFast.description')
  }
])

// Charger les solutions au montage
onMounted(async () => {
  try {
    await solutionsStore.fetchAuthEnabledSolutions()
  } catch (error) {
    console.error('Failed to load solutions:', error)
  }
})

useHead({
  title: t('meta.indexPage.title')
})
</script>
