import { defineStore } from 'pinia'
import type { Faq, FaqResponse } from '~/types'
import { useSolutionsStore } from '../stores/solutions'

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

        // 2. Try to find FAQs by iterating through random platforms
        const shuffledPlatforms = [...platforms].sort(() => 0.5 - Math.random())
        let foundData = false
        const config = useRuntimeConfig()

        for (const platform of shuffledPlatforms) {
          try {
            // Fetch Topics for that platform
            const topicsResponse = await $fetch<any>('/solution/get-topics-platform', {
              baseURL: config.public.pgsBaseAPI,
              params: {
                platformId: platform.id,
                includeFaqs: true,
                status: 'active'
              }
            })

            if (!topicsResponse.success || !topicsResponse.data || topicsResponse.data.length === 0) {
              continue
            }

            // 3. Shuffle topics to pick a random one that has FAQs
            const topics = topicsResponse.data
            const shuffledTopics = [...topics].sort(() => 0.5 - Math.random())

            for (const topic of shuffledTopics) {
              const allFaqs = topic.faqs || []
              if (allFaqs.length > 0) {
                // Found a topic with FAQs!
                const shuffledFaqs = [...allFaqs].sort(() => 0.5 - Math.random())
                this.faqs = shuffledFaqs.slice(0, 4)
                foundData = true
                break
              }
            }

            if (foundData) break

          } catch (innerErr) {
            console.warn(`Failed to fetch topics for platform ${platform.id}`, innerErr)
            continue
          }
        }

        if (!foundData) {
          this.faqs = []
        }

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
