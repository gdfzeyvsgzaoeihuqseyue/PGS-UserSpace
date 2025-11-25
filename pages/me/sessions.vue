<template>
  <div class="space-y-8 max-w-6xl mx-auto">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('sessions.title') }}</h1>
      <p class="mt-2 text-gray-600">{{ $t('sessions.subtitle') }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <IconLoader2 class="w-8 h-8 animate-spin text-primary" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card bg-red-50 border-red-200">
      <div class="flex items-center">
        <IconAlertCircle class="w-5 h-5 text-red-600 mr-3" />
        <span class="text-sm text-red-800 font-medium">{{ error }}</span>
      </div>
    </div>

    <!-- Sessions Content -->
    <div v-else class="space-y-6">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total des sessions</p>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ sessions.length }}</p>
            </div>
            <div class="relative w-12 h-12 flex items-center justify-center">
              <span class="absolute inset-0 bg-primary opacity-10 dark:opacity-20 rounded-lg"></span>
              <IconDevices class="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Sessions actives</p>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ activeSessions.length }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <IconShieldCheck class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Sessions révoquées</p>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ revokedSessions.length }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <IconX class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Current Session Alert -->
      <div v-if="currentSession" class="card bg-blue-50 border-blue-200">
        <div class="flex items-start">
          <IconInfoCircle class="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div class="flex-1">
            <p class="text-sm font-medium text-blue-900">Session actuelle</p>
            <p class="text-sm text-blue-700 mt-1">Vous êtes actuellement connecté depuis cet appareil. Vous ne pouvez
              pas révoquer cette session.</p>
          </div>
        </div>
      </div>

      <!-- Sessions List -->
      <div v-if="sessions.length > 0" class="space-y-4">
        <h2 class="text-xl font-bold text-gray-900">Vos sessions</h2>

        <div v-for="session in sortedSessions" :key="session.id" class="card hover:shadow-lg transition-shadow"
          :class="{ 'bg-gray-50': session.isRevoked, 'border-l-4 border-l-primary': isCurrentSession(session) }">
          <div class="flex items-start justify-between">
            <!-- Session Info -->
            <div class="flex-1">
              <!-- Header -->
              <div class="flex items-start gap-3 mb-4">
                <!-- Device Icon -->
                <div class="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <span class="absolute inset-0 rounded-lg"
                    :class="session.isRevoked ? 'bg-gray-200' : 'bg-primary opacity-10'"></span>
                  <IconDeviceDesktop v-if="!session.deviceInfo?.mobile" class="w-6 h-6"
                    :class="session.isRevoked ? 'text-gray-500' : 'text-primary'" />
                  <IconDeviceMobile v-else class="w-6 h-6"
                    :class="session.isRevoked ? 'text-gray-500' : 'text-primary'" />
                </div>

                <!-- Device Info -->
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold text-gray-900">
                      {{ getDeviceName(session) }}
                    </h3>
                    <span v-if="isCurrentSession(session)" class="badge badge-success text-xs">
                      Session actuelle
                    </span>
                    <span v-else-if="session.isRevoked" class="badge badge-danger text-xs">
                      Révoquée
                    </span>
                    <span v-else-if="isExpired(session)" class="badge badge-warning text-xs">
                      Expirée
                    </span>
                    <span v-else class="badge badge-success text-xs">
                      Active
                    </span>
                  </div>

                  <!-- User Agent -->
                  <p class="text-sm text-gray-600 mb-2">{{ session.userAgent || 'Unknown Browser' }}</p>

                  <!-- Details Grid -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <!-- IP Address -->
                    <div class="flex items-center text-gray-600">
                      <IconMapPin class="w-4 h-4 mr-2 text-gray-400" />
                      <span>{{ session.ipAddress || 'Unknown IP' }}</span>
                    </div>

                    <!-- Platform -->
                    <div v-if="session.deviceInfo?.platform" class="flex items-center text-gray-600">
                      <IconDevices class="w-4 h-4 mr-2 text-gray-400" />
                      <span>{{ session.deviceInfo.platform }}</span>
                    </div>

                    <!-- Created At -->
                    <div class="flex items-center text-gray-600">
                      <IconClock class="w-4 h-4 mr-2 text-gray-400" />
                      <span>Créée: {{ formatRelativeDate(session.createdAt, locale, 'N/A') }}</span>
                    </div>

                    <!-- Expires At -->
                    <div class="flex items-center" :class="isExpired(session) ? 'text-red-600' : 'text-gray-600'">
                      <IconClockHour4 class="w-4 h-4 mr-2"
                        :class="isExpired(session) ? 'text-red-400' : 'text-gray-400'" />
                      <span>Expire: {{ formatRelativeDate(session.expiresAt, locale, 'N/A') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="ml-4 flex-shrink-0">
              <button v-if="!isCurrentSession(session) && !session.isRevoked" @click="confirmRevoke(session)"
                class="btn btn-danger text-sm py-2 px-3" :disabled="revokingSession === session.id">
                <IconTrash class="w-4 h-4 mr-2" />
                <span v-if="revokingSession === session.id">Révocation...</span>
                <span v-else>Révoquer</span>
              </button>
              <span v-else-if="isCurrentSession(session)" class="text-sm text-gray-500 italic">
                Session actuelle
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Revoke All Button -->
      <div v-if="otherSessions.length > 0" class="card bg-red-50 border-red-200">
        <div class="flex items-start justify-between">
          <div class="flex items-start">
            <IconAlertTriangle class="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-sm font-medium text-red-900">Révoquer toutes les autres sessions</p>
              <p class="text-sm text-red-700 mt-1">Déconnectez-vous de tous les autres appareils en un clic.</p>
            </div>
          </div>
          <button @click="confirmRevokeAll" class="btn btn-danger text-sm py-2" :disabled="revokingAll">
            <IconShieldX class="w-4 h-4 mr-2" />
            <span v-if="revokingAll">Révocation...</span>
            <span v-else>Tout révoquer</span>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="sessions.length === 0" class="card">
        <div class="text-center py-12">
          <IconDevices class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune session trouvée</h3>
          <p class="mt-1 text-sm text-gray-500">Vous n'avez aucune session active pour le moment.</p>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showConfirmModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="cancelRevoke">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="flex items-start mb-4">
            <div class="flex-shrink-0">
              <IconAlertCircle class="h-6 w-6 text-red-600" />
            </div>
            <div class="ml-3 flex-1">
              <h3 class="text-lg font-medium text-gray-900">
                {{ confirmAction === 'revoke' ? 'Révoquer cette session ?' : 'Révoquer toutes les autres sessions ?' }}
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                {{ confirmAction === 'revoke'
                  ? 'Cette action déconnectera cet appareil. Cette action est irréversible.'
                  : 'Cette action déconnectera tous vos autres appareils. Cette action est irréversible.' }}
              </p>
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button @click="cancelRevoke" class="btn btn-secondary">
              Annuler
            </button>
            <button @click="executeRevoke" class="btn btn-danger">
              Révoquer
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Session } from '~/types'
import { formatRelativeDate } from '~/utils/dateFormatter'
import {
  IconLoader2,
  IconAlertCircle,
  IconDevices,
  IconShieldCheck,
  IconX,
  IconInfoCircle,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconMapPin,
  IconClock,
  IconClockHour4,
  IconTrash,
  IconAlertTriangle,
  IconShieldX
} from '@tabler/icons-vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { locale } = useI18n()
const config = useRuntimeConfig()

const sessions = ref<Session[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const revokingSession = ref<string | null>(null)
const revokingAll = ref(false)
const currentSessionToken = ref<string | null>(null)
const showConfirmModal = ref(false)
const sessionToRevoke = ref<Session | null>(null)
const confirmAction = ref<'revoke' | 'revokeAll'>('revoke')

const activeSessions = computed(() =>
  sessions.value.filter(s => !s.isRevoked && !isExpired(s))
)

const revokedSessions = computed(() =>
  sessions.value.filter(s => s.isRevoked || isExpired(s))
)

const currentSession = computed(() =>
  sessions.value.find(s => s.token === currentSessionToken.value)
)

const otherSessions = computed(() =>
  sessions.value.filter(s => s.token !== currentSessionToken.value && !s.isRevoked && !isExpired(s))
)

const sortedSessions = computed(() => {
  return [...sessions.value].sort((a, b) => {
    // Current session first
    if (isCurrentSession(a)) return -1
    if (isCurrentSession(b)) return 1

    // Active sessions before revoked
    if (!a.isRevoked && b.isRevoked) return -1
    if (a.isRevoked && !b.isRevoked) return 1

    // Most recent first
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  })
})

const isCurrentSession = (session: Session) => {
  return session.token === currentSessionToken.value
}

const isExpired = (session: Session) => {
  return new Date(session.expiresAt) < new Date()
}

const getDeviceName = (session: Session) => {
  if (session.deviceInfo?.mobile) {
    return 'Appareil mobile'
  }

  const ua = session.userAgent || ''
  if (ua.includes('Windows')) return 'Ordinateur Windows'
  if (ua.includes('Mac')) return 'Ordinateur Mac'
  if (ua.includes('Linux')) return 'Ordinateur Linux'
  if (ua.includes('Android')) return 'Appareil Android'
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'Appareil iOS'

  return 'Appareil inconnu'
}

const fetchSessions = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await $fetch<{ sessions: Session[], currentToken: string }>('/user/sessions', {
      method: 'GET',
      baseURL: config.public.pgsBaseAPI,
      credentials: 'include'
    })

    sessions.value = response.sessions
    currentSessionToken.value = response.currentToken
  } catch (err: any) {
    error.value = err.data?.message || 'Erreur lors de la récupération des sessions'
    console.error('Error fetching sessions:', err)
  } finally {
    loading.value = false
  }
}

const confirmRevoke = (session: Session) => {
  sessionToRevoke.value = session
  confirmAction.value = 'revoke'
  showConfirmModal.value = true
}

const confirmRevokeAll = () => {
  confirmAction.value = 'revokeAll'
  showConfirmModal.value = true
}

const cancelRevoke = () => {
  showConfirmModal.value = false
  sessionToRevoke.value = null
}

const executeRevoke = async () => {
  if (confirmAction.value === 'revoke' && sessionToRevoke.value) {
    await revokeSession(sessionToRevoke.value)
  } else if (confirmAction.value === 'revokeAll') {
    await revokeAllOtherSessions()
  }
  showConfirmModal.value = false
  sessionToRevoke.value = null
}

const revokeSession = async (session: Session) => {
  revokingSession.value = session.id

  try {
    await $fetch(`/user/sessions/${session.id}/revoke`, {
      method: 'POST',
      baseURL: config.public.pgsBaseAPI,
      credentials: 'include'
    })

    // Update local state
    const index = sessions.value.findIndex(s => s.id === session.id)
    if (index !== -1) {
      sessions.value[index].isRevoked = true
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Erreur lors de la révocation de la session'
    console.error('Error revoking session:', err)
  } finally {
    revokingSession.value = null
  }
}

const revokeAllOtherSessions = async () => {
  revokingAll.value = true

  try {
    await $fetch('/user/sessions/revoke-all', {
      method: 'POST',
      baseURL: config.public.pgsBaseAPI,
      credentials: 'include'
    })

    // Refresh sessions list
    await fetchSessions()
  } catch (err: any) {
    error.value = err.data?.message || 'Erreur lors de la révocation des sessions'
    console.error('Error revoking all sessions:', err)
  } finally {
    revokingAll.value = false
  }
}

onMounted(() => {
  fetchSessions()
})
</script>