import { defineStore } from 'pinia'
import type { Solution } from '~/types'

interface SolutionsState {
  solutions: Solution[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const useSolutionsStore = defineStore('solutions', {
  state: (): SolutionsState => ({
    solutions: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  }),

  getters: {
    authEnabledSolutions: (state) => state.solutions.filter((s) => s.allowAuth && !s.disabled),
    activeSolutions: (state) => state.solutions.filter((s) => !s.disabled),
    categories: (state) => {
      const categories = new Set(state.solutions.map((s) => s.category))
      return Array.from(categories)
    },
    totalSolutions: (state) => state.pagination.total,
    totalPages: (state) => state.pagination.totalPages,
    currentPage: (state) => state.pagination.page,
  },

  actions: {
    async fetchSolutions(params: any = {}) {
      this.loading = true
      this.error = null

      try {
        const { apiFetch } = useApi()
        const { data, error } = await apiFetch<any>('/solution/platform', {
          params,
        })

        if (error.value) {
          throw new Error(error.value.message || 'Error fetching solutions')
        }

        if (data.value) {
          this.solutions = Array.isArray(data.value) ? data.value : (data.value.data || [])

          if (data.value.meta) {
            this.pagination = data.value.meta
          } else {
            this.pagination = {
              page: params.page || 1,
              limit: params.limit || 10,
              total: this.solutions.length,
              totalPages: Math.ceil(this.solutions.length / (params.limit || 10)),
            }
          }
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch solutions'
        console.error('Error fetching solutions:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchAuthEnabledSolutions() {
      return this.fetchSolutions({ allowAuth: true, disabled: false })
    }
  },
})
