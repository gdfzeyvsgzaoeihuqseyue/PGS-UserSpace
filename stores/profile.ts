import { defineStore } from 'pinia'
import type { UpdateProfileData, User } from '~/types'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    loading: false,
    error: null as string | null,
    updateSuccess: false
  }),

  actions: {
    async updateProfile(data: UpdateProfileData) {
      this.loading = true
      this.error = null
      this.updateSuccess = false

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ message: string; user: User }>('/user/profile', {
          method: 'PUT',
          baseURL: config.public.apiUrl,
          credentials: 'include',
          body: data
        })

        // Update user in auth store
        const authStore = useAuthStore()
        if (authStore.user) {
          authStore.user = { ...authStore.user, ...response.user }
        }

        this.updateSuccess = true
        return response
      } catch (err: any) {
        this.error = err.data?.message || 'Failed to update profile'
        throw err
      } finally {
        this.loading = false
      }
    },

    resetUpdateStatus() {
      this.error = null
      this.updateSuccess = false
    }
  }
})
