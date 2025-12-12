import { defineStore } from 'pinia'
import type { Faq, FaqTopic, FaqResponse, FaqTopicResponse } from '~/types/faq'

interface FaqState {
  faqs: Faq[]
  topics: FaqTopic[]
  loading: boolean
  error: string | null
  activeTopic: FaqTopic | null
}

export const useFaqStore = defineStore('faq', {
  state: (): FaqState => ({
    faqs: [],
    topics: [],
    loading: false,
    error: null,
    activeTopic: null,
  }),

  getters: {
    // Get distinct platforms from the loaded topics
    availablePlatforms: (state) => {
      const platforms = new Map()
      state.topics.forEach(topic => {
        if (topic.platform) {
          platforms.set(topic.platform.id, topic.platform)
        }
      })
      return Array.from(platforms.values())
    }
  },

  actions: {
    async fetchTopics() {
      this.loading = true
      this.error = null
      try {
        const { apiFetch } = useApi()
        const { data, error } = await apiFetch<FaqTopicResponse>('/solution/faq-topic', {
          params: {
            limit: 100,
            status: 'active'
          }
        })

        if (error.value) throw new Error(error.value.message || 'Failed to fetch topics')
        if (data.value && data.value.data) {
          this.topics = data.value.data
        }
      } catch (err: any) {
        this.error = err.message
        console.error('Error fetching FAQ topics:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchFaqsByTopic(topicId: string) {
      this.loading = true
      this.error = null
      try {
        const { apiFetch } = useApi()
        const { data, error } = await apiFetch<FaqResponse>('/solution/faq', {
          params: {
            topicId,
            limit: 100,
            status: 'active'
          }
        })

        if (error.value) throw new Error(error.value.message || 'Failed to fetch FAQs')
        if (data.value && data.value.data) {
          this.faqs = data.value.data
        }
      } catch (err: any) {
        this.error = err.message
        console.error('Error fetching FAQs:', err)
      } finally {
        this.loading = false
      }
    },

    // Ftch and slice 4 FAQs
    async loadRandomFaqs() {
      if (this.topics.length === 0) {
        await this.fetchTopics()
      }

      if (this.topics.length === 0) return

      // 1. Filter topics that have FAQs (if we can know count, otherwise try our best)
      const validTopics = this.topics.filter(t => (t.faqCount || 0) > 0)

      if (validTopics.length === 0) return

      // 2. Group by Platform to select a random platform first
      const topicsByPlatform: Record<string, FaqTopic[]> = {}
      validTopics.forEach(t => {
        const pid = t.platform?.id || 'unknown'
        if (!topicsByPlatform[pid]) topicsByPlatform[pid] = []
        topicsByPlatform[pid].push(t)
      })

      const platformIds = Object.keys(topicsByPlatform)
      if (platformIds.length === 0) return

      // Pick Random Platform
      const randomPlatformId = platformIds[Math.floor(Math.random() * platformIds.length)]
      const platformTopics = topicsByPlatform[randomPlatformId]

      // Pick Random Topic from that Platform
      const randomTopic = platformTopics[Math.floor(Math.random() * platformTopics.length)]
      this.activeTopic = randomTopic

      // 3. Fetch FAQs for this topic
      await this.fetchFaqsByTopic(randomTopic.id)

      // 4. Randomize FAQs and take 4
      // Fisher-Yates shuffle
      const shuffled = [...this.faqs]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      this.faqs = shuffled.slice(0, 4)
    }
  }
})
