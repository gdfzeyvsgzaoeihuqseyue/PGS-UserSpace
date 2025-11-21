<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Connected Services</h1>
        <p class="mt-2 text-gray-600">
          Manage your access to PGS ecosystem applications
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <div class="badge badge-info text-base">
          {{ servicesStore.activeServiceCount }} Active
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="servicesStore.loading" class="card">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
        <span class="ml-3 text-gray-600">Loading services...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="servicesStore.services.length === 0" class="card text-center py-12">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No services connected</h3>
      <p class="text-gray-600">You don't have access to any services yet.</p>
    </div>

    <!-- Services Grid -->
    <div v-else class="space-y-6">
      <!-- Active Services -->
      <div v-if="servicesStore.activeServices.length > 0">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Active Services</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="service in servicesStore.activeServices" :key="service.serviceId"
            class="card hover:shadow-lg transition-shadow">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-xl">
                    {{ service.serviceName.charAt(0) }}
                  </span>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ service.serviceName }}</h3>
                  <span class="badge" :class="getRoleBadgeClass(service.role)">
                    {{ service.role }}
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <a :href="service.domain" target="_blank" rel="noopener noreferrer"
                  class="hover:text-primary-600 truncate">
                  {{ service.domain }}
                </a>
              </div>
              <div v-if="service.lastAccess" class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last accessed: {{ formatDate(service.lastAccess) }}
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <a :href="service.domain" target="_blank" rel="noopener noreferrer"
                class="flex-1 btn btn-primary text-center">
                Open Service
              </a>
              <button @click="viewServiceDetails(service)" class="btn btn-secondary" title="View details">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Inactive Services -->
      <div v-if="servicesStore.inactiveServices.length > 0">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Inactive Services</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="service in servicesStore.inactiveServices" :key="service.serviceId" class="card opacity-60">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-xl">
                    {{ service.serviceName.charAt(0) }}
                  </span>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ service.serviceName }}</h3>
                  <span class="badge badge-danger">Inactive</span>
                </div>
              </div>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span class="truncate">{{ service.domain }}</span>
              </div>
            </div>

            <p class="text-sm text-gray-600">
              This service is currently inactive. Contact support to reactivate.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Service Details Modal -->
    <div v-if="selectedService" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="selectedService = null">
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Service Details</h3>
          <button @click="selectedService = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-600">Service Name</label>
            <p class="text-gray-900 font-medium">{{ selectedService.serviceName }}</p>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-600">Domain</label>
            <p class="text-gray-900">{{ selectedService.domain }}</p>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-600">Role</label>
            <div class="mt-1">
              <span class="badge" :class="getRoleBadgeClass(selectedService.role)">
                {{ selectedService.role }}
              </span>
            </div>
          </div>

          <div v-if="selectedService.lastAccess">
            <label class="text-sm font-medium text-gray-600">Last Access</label>
            <p class="text-gray-900">{{ formatDate(selectedService.lastAccess) }}</p>
          </div>

          <div v-if="Object.keys(selectedService.permissions).length > 0">
            <label class="text-sm font-medium text-gray-600">Permissions</label>
            <div class="mt-2 bg-gray-50 rounded-lg p-3">
              <pre
                class="text-xs text-gray-700 overflow-auto">{{ JSON.stringify(selectedService.permissions, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <div class="mt-6 flex space-x-3">
          <a :href="selectedService.domain" target="_blank" rel="noopener noreferrer"
            class="flex-1 btn btn-primary text-center">
            Open Service
          </a>
          <button @click="selectedService = null" class="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '~/types'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const servicesStore = useServicesStore()
const selectedService = ref<Service | null>(null)

const getRoleBadgeClass = (role: string) => {
  const classes: Record<string, string> = {
    admin: 'badge-danger',
    moderator: 'badge-warning',
    user: 'badge-info'
  }
  return classes[role] || 'badge-info'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewServiceDetails = (service: Service) => {
  selectedService.value = service
}

onMounted(() => {
  servicesStore.fetchServices()
})
</script>
