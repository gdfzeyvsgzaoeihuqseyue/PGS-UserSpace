<template>
  <div class="min-h-screen">
    <!-- Hero Section with Gradient Background -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-background/30 pt-20 pb-32">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"
          style="animation-delay: 1s"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-8 text-center lg:text-left">
            <!-- Badge -->
            <div
              class="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-primary/20">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span class="text-sm font-medium text-gray-700">{{ $t('indexPage.hero.badge') }}</span>
            </div>

            <!-- Title -->
            <div class="space-y-4">
              <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                {{ $t('indexPage.hero.welcome') }}
                <span
                  class="block text-primary font-heading bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mt-2">
                  {{ $t('indexPage.hero.title') }}
                </span>
              </h1>
              <p class="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                {{ $t('indexPage.hero.subtitle') }}
              </p>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <NuxtLink to="/auth/register"
                class="group relative btn btn-primary text-lg px-8 py-4 overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span class="relative z-10 flex items-center justify-center">
                  {{ $t('indexPage.hero.getStarted') }}
                  <IconArrowRight class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </NuxtLink>

              <NuxtLink to="/auth/login"
                class="group btn btn-outline text-lg px-8 py-4 backdrop-blur-sm bg-white/80 hover:bg-white transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                <span class="flex items-center justify-center">
                  {{ $t('indexPage.hero.signIn') }}
                  <IconLogin class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </NuxtLink>
            </div>

            <!-- Social Proof -->
            <div class="flex items-center space-x-4 justify-center lg:justify-start pt-4">
              <div class="flex -space-x-2">
                <template v-if="shuffledSolutions.length > 0">
                  <div v-for="solution in shuffledSolutions.slice(0, 3)" :key="solution.id"
                    class="w-10 h-10 rounded-full bg-white border-2 border-white flex items-center justify-center overflow-hidden relative group cursor-help"
                    :title="solution.name">
                    <img v-if="solution.logo" :src="solution.logo" :alt="solution.name"
                      class="w-full h-full object-cover" />
                    <div v-else
                      class="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                      {{ solution.name.charAt(0) }}
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div
                    class="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-400">
                    <IconFolders class="w-5 h-5" />
                  </div>
                </template>
              </div>
              <div class="text-sm text-gray-600">
                <span class="font-bold text-gray-900">
                  {{ Math.max(0, solutionsStore.activeSolutions.length - 3) }}+
                </span> {{ $t('indexPage.stats.integratedSolutions').toLowerCase() }}
              </div>
            </div>
          </div>

          <!-- Right Visual -->
          <div class="relative lg:block hidden">
            <div class="relative">
              <!-- Main Card -->
              <div
                class="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 transform hover:scale-105 transition-all duration-500">
                <div class="space-y-6">
                  <!-- Header -->
                  <div class="flex items-center justify-between pb-4 border-b">
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                        <IconShieldCheck class="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900">{{ $t('indexPage.visual.secureConnection') }}</h3>
                        <p class="text-sm text-gray-500">{{ $t('indexPage.visual.ssoAuth') }}</p>
                      </div>
                    </div>
                    <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>

                  <!-- Services Preview -->
                  <div class="space-y-3">
                    <div v-for="(service, index) in solutionsStore.authEnabledSolutions.slice(0, 3)" :key="service.id"
                      class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-primary/5 transition-all duration-300 transform hover:translate-x-2"
                      :style="{ animationDelay: `${index * 0.1}s` }">
                      <img v-if="service.logo" :src="service.logo" :alt="service.name"
                        class="w-10 h-10 rounded-lg object-cover" />
                      <div class="flex-1">
                        <p class="font-medium text-gray-900 text-sm">{{ service.name }}</p>
                        <p class="text-xs text-gray-500">{{ service.category }}</p>
                      </div>
                      <IconCheck class="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Floating Elements -->
              <div
                class="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl opacity-20 blur-xl animate-pulse">
              </div>
              <div
                class="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-secondary to-primary rounded-2xl opacity-20 blur-xl animate-pulse"
                style="animation-delay: 1.5s"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            {{ $t('indexPage.featuresHeader.badge') }}
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {{ $t('indexPage.featuresHeader.title') }}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ $t('indexPage.featuresHeader.subtitle') }}
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(feature, index) in features" :key="feature.title"
            class="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-primary/50 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
            :style="{ animationDelay: `${index * 0.1}s` }">
            <!-- Icon -->
            <div class="relative w-16 h-16 mb-6 transform group-hover:scale-110 transition-transform duration-300">
              <div
                class="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-10 group-hover:opacity-20 rounded-2xl transition-opacity">
              </div>
              <div
                class="relative w-full h-full flex items-center justify-center bg-white rounded-2xl shadow-md group-hover:shadow-lg transition-shadow">
                <component :is="feature.icon" class="w-8 h-8 text-primary" />
              </div>
            </div>

            <!-- Content -->
            <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ feature.description }}
            </p>

            <!-- Hover Effect -->
            <div
              class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Solutions Section -->
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

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0"
          style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;">
        </div>
      </div>

      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
          {{ $t('indexPage.cta.title') }}
        </h2>
        <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          {{ $t('indexPage.cta.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white border-t border-gray-100">
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
  </div>
</template>

<script setup lang="ts">
import { IconArrowRight, IconBolt, IconCheck, IconFolders, IconLayoutGridAdd, IconLock, IconLogin, IconShieldCheck } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

definePageMeta({
  layout: 'default'
})

const solutionsStore = useSolutionsStore()

// Randomize solutions for Social Proof section
const shuffledSolutions = ref<any[]>([])

watch(() => solutionsStore.activeSolutions, (newSolutions) => {
  if (newSolutions) {
    shuffledSolutions.value = [...newSolutions].sort(() => Math.random() - 0.5)
  }
}, { immediate: true })

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

const stats = computed(() => [
  {
    value: `${solutionsStore.totalSolutions}`,
    label: t('indexPage.stats.totalSolutions')
  },
  {
    value: `${solutionsStore.authEnabledSolutions.length}+`,
    label: t('indexPage.stats.integratedSolutions')
  },
  {
    value: `${solutionsStore.categories.length}`,
    label: t('indexPage.stats.categories')
  },
  {
    value: '24/7',
    label: t('indexPage.stats.support')
  }
])

onMounted(async () => {
  try {
    await solutionsStore.fetchSolutions({ disabled: false })
    // Reshuffle on mount to ensure randomness on every visit
    if (solutionsStore.activeSolutions.length) {
      shuffledSolutions.value = [...solutionsStore.activeSolutions].sort(() => Math.random() - 0.5)
    }
  } catch (error) {
    console.error('Failed to load solutions:', error)
  }
})

useHead({
  title: t('meta.indexPage.title')
})
</script>

<style scoped>
@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
