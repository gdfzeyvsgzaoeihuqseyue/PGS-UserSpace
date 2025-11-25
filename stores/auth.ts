import { defineStore } from 'pinia'
import type { User, LoginData, RegisterData, LoginResponse, SessionResponse } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null
  }),

  getters: {
    fullName: (state) => {
      if (!state.user) return ''
      return `${state.user.firstName} ${state.user.lastName}`
    },

    isEmailVerified: (state) => {
      return state.user?.emailVerified || false
    }
  },

  actions: {
    async register(data: RegisterData) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ message: string; user: User }>('/user/auth/register', {
          method: 'POST',
          baseURL: config.public.pgsBaseAPI,
          credentials: 'include',
          body: data
        })

        return response
      } catch (err: any) {
        this.error = err.data?.message || 'Registration failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async login(data: LoginData) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<LoginResponse>('/user/auth/login', {
          method: 'POST',
          baseURL: config.public.pgsBaseAPI,
          credentials: 'include',
          body: data
        })

        this.user = response.user
        this.isAuthenticated = true

        // Store services in services store
        const servicesStore = useServicesStore()
        servicesStore.setServices(response.services)

        return response
      } catch (err: any) {
        this.error = err.data?.message || 'Login failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch('/user/auth/logout', {
          method: 'POST',
          baseURL: config.public.pgsBaseAPI,
          credentials: 'include'
        })

        this.user = null
        this.isAuthenticated = false

        // Clear services
        const servicesStore = useServicesStore()
        servicesStore.clearServices()

        // Redirect to login
        await navigateTo('/auth/login')
      } catch (err: any) {
        this.error = err.data?.message || 'Logout failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async checkSession() {
      this.loading = true

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<SessionResponse>('/user/auth/session', {
          method: 'GET',
          baseURL: config.public.pgsBaseAPI,
          credentials: 'include'
        })

        this.user = response.user
        this.isAuthenticated = true

        // Store services
        const servicesStore = useServicesStore()
        servicesStore.setServices(response.services)

        // ⚠️ WORKAROUND: Si lastLogin est manquant, le récupérer depuis /user/profile
        if (!this.user.lastLogin) {
          try {
            const profileResponse = await $fetch<{ user: User }>('/user/profile', {
              method: 'GET',
              baseURL: config.public.pgsBaseAPI,
              credentials: 'include'
            })

            if (profileResponse.user.lastLogin) {
              this.user.lastLogin = profileResponse.user.lastLogin
              console.log('✅ lastLogin récupéré depuis /user/profile:', this.user.lastLogin)
            }
          } catch (profileErr) {
            console.warn('⚠️ Impossible de récupérer lastLogin depuis /user/profile:', profileErr)
          }
        }

        return response
      } catch (err: any) {
        this.user = null
        this.isAuthenticated = false
        throw err
      } finally {
        this.loading = false
      }
    },

    async refreshToken() {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ message: string; accessToken: string; expiresIn: number }>('/user/auth/refresh-token', {
          method: 'POST',
          baseURL: config.public.pgsBaseAPI,
          credentials: 'include'
        })

        return response
      } catch (err: any) {
        this.user = null
        this.isAuthenticated = false
        throw err
      }
    }
  }
})
