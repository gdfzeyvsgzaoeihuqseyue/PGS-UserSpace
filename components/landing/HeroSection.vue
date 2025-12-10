<template>
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
            <template v-if="authStore.isAuthenticated && authStore.user">
              <div class="flex flex-col items-center lg:items-start gap-3">
                <div class="text-xl font-medium text-gray-700">
                  <i18n-t keypath="indexPage.hero.welcomeUser" tag="span">
                    <template #name>
                      <span class="text-primary font-bold">{{ authStore.user.firstName }}</span>
                    </template>
                  </i18n-t>
                </div>
                <NuxtLink to="/dashboard"
                  class="group relative btn btn-primary text-lg px-8 py-3 overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <span class="relative z-10 flex items-center justify-center">
                    {{ $t('indexPage.hero.goToDashboard') }}
                    <IconArrowRight class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </NuxtLink>
              </div>
            </template>
            <template v-else>
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
            </template>
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
</template>

<script setup lang="ts">
import { IconArrowRight, IconCheck, IconFolders, IconLogin, IconShieldCheck } from '@tabler/icons-vue'

const authStore = useAuthStore()
const solutionsStore = useSolutionsStore()

// Randomize solutions for Social Proof section
const shuffledSolutions = ref<any[]>([])

watch(() => solutionsStore.activeSolutions, (newSolutions) => {
  if (newSolutions) {
    shuffledSolutions.value = [...newSolutions].sort(() => Math.random() - 0.5)
  }
}, { immediate: true })

onMounted(() => {
  // If solutions are already loaded, ensure we shuffle
  if (solutionsStore.activeSolutions.length > 0) {
    shuffledSolutions.value = [...solutionsStore.activeSolutions].sort(() => Math.random() - 0.5)
  }
})
</script>
