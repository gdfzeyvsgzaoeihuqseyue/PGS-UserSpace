<template>
  <div class="space-y-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('sessions.title') }}</h1>
      <p class="mt-2 text-gray-600">
        {{ $t('sessions.subtitle') }}
      </p>
    </div>

    <!-- Current Session Info -->
    <div class="relative card border-primary">
      <span class="absolute inset-0 bg-primary opacity-10 dark:opacity-20"></span>
      <div class="flex items-start">
        <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <IconShieldCheck class="w-6 h-6 text-white" />
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-bold text-primary">{{ $t('sessions.current.title') }}</h3>
          <p class="text-sm text-secondary mt-1">
            {{ $t('sessions.current.description') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Session Management Info -->
    <div class="card">
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <IconInfoCircle class="w-5 h-5 text-primary" />
        </div>
        <div class="flex-1">
          <h3 class="font-medium text-gray-900 mb-1">{{ $t('sessions.about.title') }}</h3>
          <p class="text-sm text-gray-600">
            {{ $t('sessions.about.description') }}
          </p>
          <ul class="mt-2 space-y-1 text-sm text-gray-600">
            <li class="flex items-center">
              <IconCheck class="w-4 h-4 mr-2 text-green-600" />
              {{ $t('sessions.about.accessToken') }}
            </li>
            <li class="flex items-center">
              <IconCheck class="w-4 h-4 mr-2 text-green-600" />
              {{ $t('sessions.about.refreshToken') }}
            </li>
            <li class="flex items-center">
              <IconCheck class="w-4 h-4 mr-2 text-green-600" />
              {{ $t('sessions.about.autoRefresh') }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Security Recommendations -->
    <div class="card">
      <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('sessions.security.title') }}</h3>
      <div class="space-y-3">
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <IconCheck class="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ $t('sessions.security.logout.title') }}</p>
            <p class="text-sm text-gray-600">{{ $t('sessions.security.logout.description') }}</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <IconCheck class="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ $t('sessions.security.password.title') }}</p>
            <p class="text-sm text-gray-600">{{ $t('sessions.security.password.description') }}</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <IconCheck class="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ $t('sessions.security.browser.title') }}</p>
            <p class="text-sm text-gray-600">{{ $t('sessions.security.browser.description') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Actions -->
    <div class="card">
      <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('sessions.actions.title') }}</h3>
      <div class="space-y-3">
        <button @click="handleLogout"
          class="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <IconLogout class="w-5 h-5 text-red-600" />
            </div>
            <div class="text-left">
              <p class="font-medium text-gray-900">{{ $t('sessions.actions.signOut') }}</p>
              <p class="text-sm text-gray-600">{{ $t('sessions.actions.signOutDesc') }}</p>
            </div>
          </div>
          <IconChevronRight class="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>

    <!-- Technical Details -->
    <div class="card bg-gray-50">
      <details class="cursor-pointer">
        <summary class="font-medium text-gray-900">{{ $t('sessions.technical.title') }}</summary>
        <div class="mt-4 space-y-2 text-sm text-gray-600">
          <p><strong>{{ $t('sessions.technical.authMethod') }}</strong> {{ $t('sessions.technical.authMethodValue') }}
          </p>
          <p><strong>{{ $t('sessions.technical.tokenType') }}</strong> {{ $t('sessions.technical.tokenTypeValue') }}</p>
          <p><strong>{{ $t('sessions.technical.securityFeatures') }}</strong></p>
          <ul class="list-disc list-inside ml-4 space-y-1">
            <li>{{ $t('sessions.technical.feature1') }}</li>
            <li>{{ $t('sessions.technical.feature2') }}</li>
            <li>{{ $t('sessions.technical.feature3') }}</li>
            <li>{{ $t('sessions.technical.feature4') }}</li>
            <li>{{ $t('sessions.technical.feature5') }}</li>
          </ul>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCheck, IconChevronRight, IconInfoCircle, IconLogout, IconShieldCheck } from '@tabler/icons-vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const authStore = useAuthStore()
const { t } = useI18n()

const handleLogout = async () => {
  if (confirm(t('sessions.confirmLogout'))) {
    await authStore.logout()
  }
}
</script>