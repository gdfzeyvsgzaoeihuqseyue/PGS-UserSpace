import { defineStore } from 'pinia'
import type { Faq, FaqResponse } from '~/types'

export const useFaqStore = defineStore('faq', {
  state: () => ({
    faqs: [] as Faq[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    activeFaqs: (state) => state.faqs.filter(faq => faq.status === 'active'),
    hasFaqs: (state) => state.faqs.length > 0
  },

  actions: {
    async fetchFaqs(limit: number = 5) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<FaqResponse>('/solution/faq', {
          baseURL: config.public.pgsBaseAPI,
          params: {
            limit,
            status: 'active'
          }
        })

        if (response.success) {
          this.faqs = response.data
        }
      } catch (err: any) {
        this.error = err.data?.message || 'Failed to load FAQs'
        console.error('Error fetching FAQs:', err)
      } finally {
        this.loading = false
      }
    }
  }
})
