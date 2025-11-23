<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span class="text-primaryn">PGS MY SPACE</span>
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your centralized Single Sign-On platform for seamless access to all PGS ecosystem services
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/auth/register" class="btn btn-primary text-lg px-8 py-3">
            Get Started
          </NuxtLink>
          <NuxtLink to="/auth/login" class="btn btn-outline text-lg px-8 py-3">
            Sign In
          </NuxtLink>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <div class="card text-center hover:shadow-lg transition-shadow">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconLock class="w-8 h-8 text-primaryn" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Secure Authentication</h3>
          <p class="text-gray-600">Industry-standard security with HTTP-only cookies and JWT tokens</p>
        </div>

        <div class="card text-center hover:shadow-lg transition-shadow">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconLayoutGridAdd class="w-8 h-8 text-primaryn" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Multiple Services</h3>
          <p class="text-gray-600">Access Templix, Suitops, EQT, Hire, and more with one account</p>
        </div>

        <div class="card text-center hover:shadow-lg transition-shadow">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconBolt class="w-8 h-8 text-primaryn" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
          <p class="text-gray-600">Instant authentication and seamless service switching</p>
        </div>
      </div>

      <!-- Solutions Showcase -->
      <div class="space-y-8">
        <!-- Header -->
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-3">Solutions de l'Écosystème PGS</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos solutions innovantes avec authentification SSO intégrée
          </p>
        </div>

        <!-- Solutions Grid -->
        <SolutionsGrid :solutions="solutionsStore.authEnabledSolutions" :loading="solutionsStore.loading"
          :error="solutionsStore.error" :show-features="false"
          empty-message="Aucune solution avec SSO n'est actuellement disponible." />

        <!-- View All Link -->
        <div v-if="solutionsStore.authEnabledSolutions.length > 0" class="text-center">
          <p class="text-sm text-gray-600">
            {{ solutionsStore.authEnabledSolutions.length }} solution{{ solutionsStore.authEnabledSolutions.length > 1 ?
              's' : '' }} disponible{{ solutionsStore.authEnabledSolutions.length > 1 ? 's' : '' }} avec authentification
            unique
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconBolt,IconLayoutGridAdd, IconLock } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

definePageMeta({
  layout: 'default',
  middleware: 'guest'
})

const solutionsStore = useSolutionsStore()

// Charger les solutions au montage
onMounted(async () => {
  try {
    await solutionsStore.fetchAuthEnabledSolutions()
  } catch (error) {
    console.error('Failed to load solutions:', error)
  }
})

useHead({
  title: t('contactPage.heroTitle')
})
</script>
