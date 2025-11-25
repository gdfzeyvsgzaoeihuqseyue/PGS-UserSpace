<template>
  <div class="space-y-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('services.title') }}</h1>
        <p class="mt-2 text-gray-600">
          {{ $t('services.subtitle') }}
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div class="w-full sm:w-64">
          <SearchInput v-model="searchQuery" :placeholder="$t('common.search')" @clear="clearSearch" />
        </div>
        <div class="badge badge-info text-base whitespace-nowrap">
          {{ servicesStore.activeServiceCount }} {{ $t('services.active') }}
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="servicesStore.loading" class="card">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
        <span class="ml-3 text-gray-600">{{ $t('services.loading') }}</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="servicesStore.services.length === 0" class="card text-center py-12">
      <IconFolders class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('services.empty.title') }}</h3>
      <p class="text-gray-600">{{ $t('services.empty.description') }}</p>
    </div>

    <!-- Services Grid -->
    <div v-else class="space-y-6">
      <!-- Active Services -->
      <div v-if="filteredActiveServices.length > 0">
        <h2 class="text-xl font-bold text-gray-900 mb-4">{{ $t('services.activeServices') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="service in filteredActiveServices" :key="service.serviceId"
            class="card hover:shadow-lg transition-shadow">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
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
                <a :href="service.domain" target="_blank" rel="noopener noreferrer" class="hover:text-primary truncate">
                  {{ service.domain }}
                </a>
              </div>
              <div v-if="service.lastAccess" class="flex items-center text-sm text-gray-600">
                <IconClock class="w-4 h-4 mr-2" />
                {{ $t('services.lastAccessed') }} {{ formatDate(service.lastAccess) }}
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <a :href="service.domain" target="_blank" rel="noopener noreferrer"
                class="flex-1 btn btn-primary text-center">
                {{ $t('services.openService') }}
              </a>
              <button @click="viewServiceDetails(service)" class="btn btn-secondary" title="View details">
                <IconAlertCircle class="w-5 h-5" />
              </button>
              <button @click="confirmRevokeAccess(service)" class="btn btn-danger"
                :title="$t('services.actions.revoke')">
                <IconX class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Inactive Services -->
      <div v-if="filteredInactiveServices.length > 0">
        <h2 class="text-xl font-bold text-gray-900 mb-4">{{ $t('services.inactiveServices') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="service in filteredInactiveServices" :key="service.serviceId" class="card opacity-60">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-xl">
                    {{ service.serviceName.charAt(0) }}
                  </span>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ service.serviceName }}</h3>
                  <span class="badge badge-danger">{{ $t('services.inactive') }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm text-gray-600">
                <IconWorld class="w-4 h-4 mr-2" />
                <span class="truncate">{{ service.domain }}</span>
              </div>
            </div>

            <button @click="confirmReactivateAccess(service)" class="btn btn-primary w-full"
              :disabled="reactivatingServiceId === service.serviceId">
              {{ reactivatingServiceId === service.serviceId ? $t('services.actions.reactivating') :
                $t('services.actions.reactivate') }}
            </button>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="hasActiveSearch && filteredActiveServices.length === 0 && filteredInactiveServices.length === 0"
        class="text-center py-12">
        <p class="text-gray-500">{{ $t('sessions.empty.noResults') }}</p>
        <button @click="clearSearch" class="mt-4 btn btn-secondary">{{ $t('sessions.empty.clearSearch') }}</button>
      </div>
    </div>

    <!-- Service Details Modal -->
    <div v-if="selectedService" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="selectedService = null">
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">{{ $t('services.details.title') }}</h3>
          <button @click="selectedService = null" class="text-gray-400 hover:text-gray-600">
            <IconX class="w-6 h-6" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-600">{{ $t('services.details.name') }}</label>
            <p class="text-gray-900 font-medium">{{ selectedService.serviceName }}</p>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-600">{{ $t('services.details.domain') }}</label>
            <p class="text-gray-900">{{ selectedService.domain }}</p>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-600">{{ $t('services.details.role') }}</label>
            <div class="mt-1">
              <span class="badge" :class="getRoleBadgeClass(selectedService.role)">
                {{ selectedService.role }}
              </span>
            </div>
          </div>

          <div v-if="selectedService.lastAccess">
            <label class="text-sm font-medium text-gray-600">{{ $t('services.details.lastAccess') }}</label>
            <p class="text-gray-900">{{ formatDate(selectedService.lastAccess) }}</p>
          </div>

          <div v-if="Object.keys(selectedService.permissions).length > 0">
            <label class="text-sm font-medium text-gray-600">{{ $t('services.details.permissions') }}</label>
            <div class="mt-2 bg-gray-50 rounded-lg p-3">
              <pre
                class="text-xs text-gray-700 overflow-auto">{{ JSON.stringify(selectedService.permissions, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <div class="mt-6 flex space-x-3">
          <a :href="selectedService.domain" target="_blank" rel="noopener noreferrer"
            class="flex-1 btn btn-primary text-center">
            {{ $t('services.openService') }}
          </a>
          <button @click="selectedService = null" class="btn btn-secondary">
            {{ $t('services.details.close') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Revoke Access Confirmation Modal -->
    <div v-if="serviceToRevoke" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="cancelRevokeModal">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">{{ $t('services.modal.revokeTitle') }}</h3>

        <!-- Success Message -->
        <div v-if="revokeSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-800 font-medium">✓ {{ $t('services.success.revoked') }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="revokeError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800 font-medium">✗ {{ revokeError }}</p>
        </div>

        <p class="text-gray-600 mb-6">
          {{ $t('services.modal.revokeDescription', { serviceName: serviceToRevoke.serviceName }) }}
        </p>
        <div class="flex space-x-3">
          <button @click="cancelRevokeModal" class="flex-1 btn btn-secondary" :disabled="revokingServiceId !== null">
            {{ $t('services.modal.cancel') }}
          </button>
          <button @click="revokeAccess" class="flex-1 btn btn-danger" :disabled="revokingServiceId !== null">
            {{ revokingServiceId ? $t('services.actions.revoking') : $t('services.modal.confirm') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reactivate Access Confirmation Modal -->
    <div v-if="serviceToReactivate"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="cancelReactivateModal">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">{{ $t('services.modal.reactivateTitle') }}</h3>

        <!-- Success Message -->
        <div v-if="reactivateSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-800 font-medium">✓ {{ $t('services.success.reactivated') }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="reactivateError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800 font-medium">✗ {{ reactivateError }}</p>
        </div>

        <p class="text-gray-600 mb-6">
          {{ $t('services.modal.reactivateDescription', { serviceName: serviceToReactivate.serviceName }) }}
        </p>
        <div class="flex space-x-3">
          <button @click="cancelReactivateModal" class="flex-1 btn btn-secondary"
            :disabled="reactivatingServiceId !== null">
            {{ $t('services.modal.cancel') }}
          </button>
          <button @click="reactivateAccess" class="flex-1 btn btn-primary" :disabled="reactivatingServiceId !== null">
            {{ reactivatingServiceId ? $t('services.actions.reactivating') : $t('services.modal.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconAlertCircle, IconClock, IconFolders, IconWorld, IconX } from '@tabler/icons-vue'
import type { Service } from '~/types'
import SearchInput from '~/components/SearchInput.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const servicesStore = useServicesStore()
const { t, locale } = useI18n()

const selectedService = ref<Service | null>(null)
const serviceToRevoke = ref<Service | null>(null)
const serviceToReactivate = ref<Service | null>(null)
const revokingServiceId = ref<string | null>(null)
const reactivatingServiceId = ref<string | null>(null)

// Success and error states
const revokeSuccess = ref(false)
const revokeError = ref<string | null>(null)
const reactivateSuccess = ref(false)
const reactivateError = ref<string | null>(null)

// Search Logic
const allServices = computed(() => servicesStore.services)
const { searchQuery, filteredItems: filteredServices, clearSearch, hasActiveSearch } = useSearch(
  allServices,
  ['serviceName', 'domain', 'role']
)

const filteredActiveServices = computed(() => filteredServices.value.filter(s => s.isActive))
const filteredInactiveServices = computed(() => filteredServices.value.filter(s => !s.isActive))

const getRoleBadgeClass = (role: string) => {
  const classes: Record<string, string> = {
    admin: 'badge-danger',
    moderator: 'badge-warning',
    user: 'badge-info'
  }
  return classes[role] || 'badge-info'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(locale.value, {
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

const confirmRevokeAccess = (service: Service) => {
  serviceToRevoke.value = service
  revokeSuccess.value = false
  revokeError.value = null
}

const confirmReactivateAccess = (service: Service) => {
  serviceToReactivate.value = service
  reactivateSuccess.value = false
  reactivateError.value = null
}

const cancelRevokeModal = () => {
  serviceToRevoke.value = null
  revokeSuccess.value = false
  revokeError.value = null
}

const cancelReactivateModal = () => {
  serviceToReactivate.value = null
  reactivateSuccess.value = false
  reactivateError.value = null
}

const revokeAccess = async () => {
  if (!serviceToRevoke.value) return

  // Reset states
  revokeSuccess.value = false
  revokeError.value = null

  try {
    revokingServiceId.value = serviceToRevoke.value.serviceId
    await servicesStore.revokeServiceAccess(serviceToRevoke.value.serviceId)

    // Show success message
    revokeSuccess.value = true

    // Close modal after 1.5 seconds
    setTimeout(() => {
      serviceToRevoke.value = null
      revokeSuccess.value = false
    }, 1500)
  } catch (error: any) {
    // Show error message
    revokeError.value = error.data?.message || 'Failed to revoke access'
  } finally {
    revokingServiceId.value = null
  }
}

const reactivateAccess = async () => {
  if (!serviceToReactivate.value) return

  // Reset states
  reactivateSuccess.value = false
  reactivateError.value = null

  try {
    reactivatingServiceId.value = serviceToReactivate.value.serviceId
    await servicesStore.reactivateServiceAccess(serviceToReactivate.value.serviceId)

    // Show success message
    reactivateSuccess.value = true

    // Close modal after 1.5 seconds
    setTimeout(() => {
      serviceToReactivate.value = null
      reactivateSuccess.value = false
    }, 1500)
  } catch (error: any) {
    // Show error message
    reactivateError.value = error.data?.message || 'Failed to reactivate access'
  } finally {
    reactivatingServiceId.value = null
  }
}

onMounted(() => {
  servicesStore.fetchServices()
})
</script>
