import { defineStore } from 'pinia'
import type { Faq, FaqResponse } from '~/types'
import { useSolutionsStore } from './solutions'

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
    },

    async fetchRandomFaqs() {
      this.loading = true
      this.error = null

      try {
        // 1. Fetch Platforms (Solutions)
        const solutionsStore = useSolutionsStore()
        if (solutionsStore.activeSolutions.length === 0) {
          await solutionsStore.fetchSolutions({ disabled: false })
        }

        const platforms = solutionsStore.activeSolutions
        if (platforms.length === 0) {
          this.faqs = []
          return
        }

        // 2. Pick random platform
        const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)]

        // 3. Fetch Topics for that platform
        const config = useRuntimeConfig()
        const topicsResponse = await $fetch<any>('/solution/get-topics-platform', {
          baseURL: config.public.pgsBaseAPI,
          params: {
            platformId: randomPlatform.id,
            includeFaqs: true,
            status: 'active'
          }
        })

        if (!topicsResponse.success || !topicsResponse.data || topicsResponse.data.length === 0) {
          // Fallback or retry? For now, empty.
          this.faqs = []
          return
        }

        // 4. Pick random topic
        const topics = topicsResponse.data
        const randomTopic = topics[Math.floor(Math.random() * topics.length)]

        // 5. Pick 4 random FAQs
        const allFaqs = randomTopic.faqs || []
        if (allFaqs.length === 0) {
          this.faqs = []
          return
        }

        const shuffled = [...allFaqs].sort(() => 0.5 - Math.random())
        this.faqs = shuffled.slice(0, 4)

      } catch (err: any) {
        this.error = err.data?.message || 'Failed to load random FAQs'
        console.error('Error in fetchRandomFaqs:', err)
      } finally {
        this.loading = false
      }
    },

    async voteUseful(id: string) {
      const config = useRuntimeConfig()
      try {
        await $fetch(`/solution/vote-useful/${id}`, {
          method: 'PATCH',
          baseURL: config.public.pgsBaseAPI
        })
        // Update local state if needed
        const faq = this.faqs.find(f => f.id === id)
        if (faq) faq.isUseful++
      } catch (err) {
        console.error('Vote useful failed', err)
      }
    },

    async voteUseless(id: string) {
      const config = useRuntimeConfig()
      try {
        await $fetch(`/solution/vote-useless/${id}`, {
          method: 'PATCH',
          baseURL: config.public.pgsBaseAPI
        })
        // Update local state
        const faq = this.faqs.find(f => f.id === id)
        if (faq) faq.isUseless++
      } catch (err) {
        console.error('Vote useless failed', err)
      }
    }
  }
})
