<template>
  <div class="space-y-8 max-w-5xl mx-auto">
    <!-- Welcome Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">
        {{ $t(greetingKey) }}, {{ authStore.user?.firstName }}!
      </h1>
      <p class="mt-2 text-gray-600">{{ $t('dashboard.overview') }}</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Active Services -->
      <div class="card hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('dashboard.stats.activeServices.title') }}</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">
              {{ servicesStore.activeServiceCount }}
            </p>
          </div>
          <div class="relative w-12 h-12 flex items-center justify-center">
            <span class="absolute inset-0 bg-primary opacity-10 dark:opacity-20 rounded-lg"></span>
            <IconFolders class="w-6 h-6 text-primary" />
          </div>
        </div>
        <NuxtLink to="/me/services" class="mt-4 text-sm text-primary hover:text-secondary font-medium">
          {{ $t('dashboard.stats.activeServices.link') }}
        </NuxtLink>
      </div>

      <!-- Account Status -->
      <div class="card hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('dashboard.stats.accountStatus.title') }}</p>
            <div class="mt-2 flex items-center space-x-2">
              <span class="badge" :class="authStore.isEmailVerified ? 'badge-success' : 'badge-warning'">
                {{ authStore.isEmailVerified ? $t('dashboard.stats.accountStatus.verified') :
                  $t('dashboard.stats.accountStatus.unverified') }}
              </span>
            </div>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <IconShieldCheck class="w-6 h-6 text-green-600" />
          </div>
        </div>
        <NuxtLink to="/me/profile" class="mt-4 text-sm text-primary hover:text-secondary font-medium">
          {{ $t('dashboard.stats.accountStatus.link') }}
        </NuxtLink>
      </div>

      <!-- Last Login -->
      <div class="card hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('dashboard.stats.lastLogin.title') }}</p>
            <p class="mt-2 text-sm text-gray-900">
              {{ formatRelativeDate(authStore.user?.lastLogin, locale, t('common.never')) }}
            </p>
          </div>
          <div class="relative w-12 h-12 flex items-center justify-center">
            <span class="absolute inset-0 bg-secondary opacity-10 dark:opacity-20 rounded-lg"></span>
            <IconClock class="w-6 h-6 text-secondary" />
          </div>
        </div>
        <NuxtLink to="/me/sessions" class="mt-4 text-sm text-primary hover:text-secondary font-medium">
          {{ $t('dashboard.stats.lastLogin.link') }}
        </NuxtLink>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <h2 class="text-xl font-bold text-gray-900 mb-4">{{ $t('dashboard.quickActions.title') }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink to="/me/services"
          class="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
          <div class="relative w-10 h-10 flex items-center justify-center">
            <span class="absolute inset-0 bg-primary opacity-10 dark:opacity-20 rounded-lg"></span>
            <IconFolders class="w-5 h-5 text-primary" />
          </div>
          <span class="font-medium text-gray-900">{{ $t('dashboard.quickActions.browseServices') }}</span>
        </NuxtLink>

        <NuxtLink to="/me/profile"
          class="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <IconUser class="w-5 h-5 text-green-600" />
          </div>
          <span class="font-medium text-gray-900">{{ $t('dashboard.quickActions.editProfile') }}</span>
        </NuxtLink>

        <NuxtLink to="/me/sessions"
          class="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
          <div class="relative w-10 h-10 flex items-center justify-center">
            <span class="absolute inset-0 bg-secondary opacity-10 dark:opacity-20 rounded-lg"></span>
            <IconLock class="w-5 h-5 text-secondary" />
          </div>
          <span class="font-medium text-gray-900">{{ $t('dashboard.quickActions.manageSessions') }}</span>
        </NuxtLink>

        <button @click="handleLogout"
          class="flex items-center space-x-3 p-4 rounded-lg hover:bg-red-50 transition-colors border border-gray-200">
          <div class="relative w-10 h-10 flex items-center justify-center">
            <span class="absolute inset-0 bg-danger opacity-10 dark:opacity-20 rounded-lg"></span>
            <IconLogout class="w-5 h-5 text-danger" />
          </div>
          <span class="font-medium text-danger">{{ $t('dashboard.quickActions.signOut') }}</span>
        </button>
      </div>
    </div>

    <!-- Recent Services -->
    <div class="card" v-if="servicesStore.activeServices.length > 0">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900">{{ $t('dashboard.activeServices.title') }}</h2>
        <NuxtLink to="/me/services" class="text-sm text-primary hover:text-secondary font-medium">
          {{ $t('dashboard.activeServices.viewAll') }}
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="service in servicesStore.activeServices.slice(0, 4)" :key="service.serviceId"
          class="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">
                {{ service.serviceName.charAt(0) }}
              </span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">{{ service.serviceName }}</h3>
              <p class="text-sm text-gray-500">{{ service.domain }}</p>
            </div>
          </div>
          <a :href="service.domain" target="_blank" rel="noopener noreferrer" class="btn btn-secondary text-sm py-2">
            {{ $t('dashboard.activeServices.open') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconClock, IconFolders, IconLock, IconLogout, IconShieldCheck, IconUser } from '@tabler/icons-vue'
import { getGreetingKey } from '~/utils/greeting'
import { formatRelativeDate } from '~/utils/dateFormatter'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { locale, t } = useI18n()
const authStore = useAuthStore()
const servicesStore = useServicesStore()
const greetingKey = ref('greetings.morning.1') // Default

const handleLogout = async () => {
  await authStore.logout()
}

onMounted(() => {
  servicesStore.fetchServices()
  greetingKey.value = getGreetingKey()
})

useHead({
  title: t('navbar.db.dashboard')
})
</script>
