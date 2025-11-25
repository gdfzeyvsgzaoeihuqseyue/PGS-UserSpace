import { defineStore } from 'pinia'
import type { Session } from '~/types'

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: [] as Session[],
    loading: false,
    error: null as string | null,
    currentSessionToken: null as string | null
  }),

  getters: {
    activeSessions: (state) => {
      return state.sessions.filter(s => !s.isRevoked && new Date(s.expiresAt) > new Date())
    },

    revokedSessions: (state) => {
      return state.sessions.filter(s => s.isRevoked || new Date(s.expiresAt) <= new Date())
    },

    activeSessionCount: (state) => {
      return state.sessions.filter(s => !s.isRevoked && new Date(s.expiresAt) > new Date()).length
    },

    currentSession: (state) => {
      return state.sessions.find(s => s.token === state.currentSessionToken)
    }
  },

  actions: {
    async fetchSessions() {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ sessions: Session[], currentToken: string }>('/user/sessions', {
          method: 'GET',
          baseURL: config.public.pgsBaseAPI,
          credentials: 'include'
        })

        this.sessions = response.sessions
        this.currentSessionToken = response.currentToken
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la récupération des sessions'
        console.error('Error fetching sessions:', err)
      } finally {
        this.loading = false
      }
    },

    async revokeSession(sessionId: string) {
      try {
        const config = useRuntimeConfig()
        await $fetch(`/user/sessions/${sessionId}/revoke`, {
          method: 'POST',
          baseURL: config.public.pgsBaseAPI,
          credentials: 'include'
        })

        // Update local state
        const index = this.sessions.findIndex(s => s.id === sessionId)
        if (index !== -1) {
          this.sessions[index].isRevoked = true
        }
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la révocation de la session'
        throw err
      }
    },

    async revokeAllOtherSessions() {
      try {
        const config = useRuntimeConfig()
        await $fetch('/user/sessions/revoke-all', {
          method: 'POST',
          baseURL: config.public.pgsBaseAPI,
          credentials: 'include'
        })

        // Refresh sessions list
        await this.fetchSessions()
      } catch (err: any) {
        this.error = err.data?.message || 'Erreur lors de la révocation des sessions'
        throw err
      }
    }
  }
})
