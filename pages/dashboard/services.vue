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
      <IconFolders class="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
                <div class="w-12 h-12 bg-primaryn rounded-lg flex items-center justify-center flex-shrink-0">
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
                <IconWorld class="w-4 h-4 mr-2" />
                <a :href="service.domain" target="_blank" rel="noopener noreferrer"
                  class="hover:text-primaryn truncate">
                  {{ service.domain }}
                </a>
              </div>
              <div v-if="service.lastAccess" class="flex items-center text-sm text-gray-600">
                <IconClock class="w-4 h-4 mr-2" />
                Last accessed: {{ formatDate(service.lastAccess) }}
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <a :href="service.domain" target="_blank" rel="noopener noreferrer"
                class="flex-1 btn btn-primary text-center">
                Open Service
              </a>
              <button @click="viewServiceDetails(service)" class="btn btn-secondary" title="View details">
                <IconAlertCircle class="w-5 h-5" />
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
                <IconWorld class="w-4 h-4 mr-2" />
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
            <IconX class="w-6 h-6" />
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
import { IconClock, IconFolders, IconWorld, IconX } from '@tabler/icons-vue'
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
