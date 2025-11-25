import { defineStore } from 'pinia'
import type { Service } from '~/types'

export const useServicesStore = defineStore('services', {
  state: () => ({
    services: [] as Service[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    activeServices: (state) => {
      return state.services.filter(s => s.isActive)
    },

    inactiveServices: (state) => {
      return state.services.filter(s => !s.isActive)
    },

    adminServices: (state) => {
      return state.services.filter(s => s.role === 'admin' && s.isActive)
    },

    serviceCount: (state) => {
      return state.services.length
    },

    activeServiceCount: (state) => {
      return state.services.filter(s => s.isActive).length
    }
  },

  actions: {
    setServices(services: Service[]) {
      this.services = services
    },

    clearServices() {
      this.services = []
    },

    async fetchServices() {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ user: any; services: Service[] }>('/user/profile', {
          method: 'GET',
          baseURL: config.public.pgsBaseAPI,
          credentials: 'include'
        })

        this.services = response.services
        return response.services
      } catch (err: any) {
        this.error = err.data?.message || 'Failed to fetch services'
        throw err
      } finally {
        this.loading = false
      }
    },

    getServiceByDomain(domain: string): Service | undefined {
      return this.services.find(s => s.domain === domain)
    },

    getServiceById(id: string): Service | undefined {
      return this.services.find(s => s.serviceId === id)
    },

    async revokeServiceAccess(serviceId: string) {
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()

        if (!authStore.user?.id) {
          throw new Error('User not authenticated')
        }

        await $fetch('/user/service/revoke-access', {
          method: 'POST',
          baseURL: config.public.pgsBaseAPI,
          credentials: 'include',
          body: {
            userId: authStore.user.id,
            serviceId
          }
        })

        // Mettre à jour le service localement
        const service = this.services.find(s => s.serviceId === serviceId)
        if (service) {
          service.isActive = false
        }

        return true
      } catch (err: any) {
        throw err
      }
    },

    async reactivateServiceAccess(serviceId: string) {
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()

        if (!authStore.user?.id) {
          throw new Error('User not authenticated')
        }

        await $fetch('/user/service/grant-access', {
          method: 'POST',
          baseURL: config.public.pgsBaseAPI,
          credentials: 'include',
          body: {
            userId: authStore.user.id,
            serviceId
          }
        })

        // Mettre à jour le service localement
        const service = this.services.find(s => s.serviceId === serviceId)
        if (service) {
          service.isActive = true
        }

        return true
      } catch (err: any) {
        throw err
      }
    }
  }
})
