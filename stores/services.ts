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
    }
  }
})
