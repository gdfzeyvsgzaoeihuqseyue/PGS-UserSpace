<template>
  <div class="space-y-8 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('sessions.title') }}</h1>
        <p class="mt-2 text-gray-600">{{ $t('sessions.subtitle') }}</p>
      </div>
      <div class="w-full sm:w-72">
        <SearchInput v-model="searchQuery" :placeholder="$t('common.search')" @clear="clearSearch" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="sessionsStore.loading && sessionsStore.sessions.length === 0"
      class="flex justify-center items-center py-12">
      <IconLoader2 class="w-8 h-8 animate-spin text-primary" />
    </div>

    <!-- Error State -->
    <div v-else-if="sessionsStore.error" class="card bg-red-50 border-red-200">
      <div class="flex items-center">
        <IconAlertCircle class="w-5 h-5 text-red-600 mr-3" />
        <span class="text-sm text-red-800 font-medium">{{ sessionsStore.error }}</span>
      </div>
    </div>

    <!-- Sessions Content -->
    <div v-else class="space-y-6">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('sessions.stats.total') }}</p>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ sessionsStore.sessions.length }}</p>
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
              <p class="text-sm font-medium text-gray-600">{{ $t('sessions.stats.active') }}</p>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ sessionsStore.activeSessions.length }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <IconShieldCheck class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('sessions.stats.revoked') }}</p>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ sessionsStore.revokedSessions.length }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <IconX class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Current Session Alert -->
      <div v-if="sessionsStore.currentSession" class="card bg-blue-50 border-blue-200">
        <div class="flex items-start">
          <IconInfoCircle class="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div class="flex-1">
            <p class="text-sm font-medium text-blue-900">{{ $t('sessions.current.title') }}</p>
            <p class="text-sm text-blue-700 mt-1">{{ $t('sessions.current.description') }}</p>
          </div>
        </div>
      </div>

      <!-- Sessions List -->
      <div v-if="filteredSessions.length > 0" class="space-y-4">
        <h2 class="text-xl font-bold text-gray-900">{{ $t('sessions.list.title') }}</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="session in filteredSessions" :key="session.id"
            class="card border-l-4 hover:shadow-lg transition-shadow h-full" :class="{
              'bg-red-50 border-l-danger': session.isRevoked,
              'bg-yellow-50 border-l-warning': isExpired(session) && !session.isRevoked,
              'bg-blue-50 border-l-primary': isCurrentSession(session) && !session.isRevoked && !isExpired(session),
            }">
            <div class="flex items-start justify-between h-full flex-col">
              <!-- Session Info -->
              <div class="w-full">
                <!-- Header -->
                <div class="flex items-start gap-3 mb-4">
                  <!-- Device Icon -->
                  <div class="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <span class="absolute inset-0 rounded-lg" :class="{
                      'bg-danger opacity-10': session.isRevoked,
                      'bg-warning opacity-10': isExpired(session) && !session.isRevoked,
                      'bg-primary opacity-10': !session.isRevoked && !isExpired(session),
                    }"></span>
                    <IconDeviceDesktop v-if="!session.deviceInfo?.mobile" class="w-6 h-6" :class="{
                      'text-danger': session.isRevoked,
                      'text-warning': isExpired(session) && !session.isRevoked,
                      'text-primary': !session.isRevoked && !isExpired(session),
                    }" />
                    <IconDeviceMobile v-else class="w-6 h-6" :class="{
                      'text-danger': session.isRevoked,
                      'text-warning': isExpired(session) && !session.isRevoked,
                      'text-primary': !session.isRevoked && !isExpired(session),
                    }" />
                  </div>

                  <!-- Device Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 class="font-semibold text-gray-900 truncate">
                        {{ getDeviceName(session) }}
                      </h3>
                      <span v-if="isCurrentSession(session)" class="badge badge-success text-xs whitespace-nowrap">
                        {{ $t('sessions.badges.current') }}
                      </span>
                      <span v-else-if="session.isRevoked" class="badge badge-danger text-xs whitespace-nowrap">
                        {{ $t('sessions.badges.revoked') }}
                      </span>
                      <span v-else-if="isExpired(session)" class="badge badge-warning text-xs whitespace-nowrap">
                        {{ $t('sessions.badges.expired') }}
                      </span>
                      <span v-else class="badge badge-success text-xs whitespace-nowrap">
                        {{ $t('sessions.badges.active') }}
                      </span>
                    </div>

                    <!-- User Agent -->
                    <p class="text-sm text-gray-600 mb-2 truncate" :title="session.userAgent">{{ session.userAgent ||
                      $t('sessions.device.unknownBrowser') }}</p>

                    <!-- Details Grid -->
                    <div class="grid grid-cols-1 gap-2 text-sm">
                      <!-- IP Address -->
                      <div class="flex items-center text-gray-600">
                        <IconMapPin class="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span class="truncate">{{ session.ipAddress || $t('sessions.device.unknownIP') }}</span>
                      </div>

                      <!-- Platform -->
                      <div v-if="session.deviceInfo?.platform" class="flex items-center text-gray-600">
                        <IconDevices class="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span class="truncate">{{ session.deviceInfo.platform }}</span>
                      </div>

                      <!-- Created At -->
                      <div class="flex items-center text-gray-600">
                        <IconClock class="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span class="truncate">{{ $t('sessions.list.created') }}: {{
                          formatRelativeDate(session.createdAt, locale, 'N/A') }}</span>
                      </div>

                      <div class="flex items-center" :class="{
                        'text-danger': session.isRevoked,
                        'text-warning': isExpired(session) && !session.isRevoked,
                        'text-gray-600': !session.isRevoked && !isExpired(session)
                      }">
                        <IconClockX class="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span class="truncate">{{ $t('sessions.list.expires') }}: {{
                          formatRelativeDate(session.expiresAt, locale, 'N/A') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="w-full flex justify-end mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button v-if="!isCurrentSession(session) && !session.isRevoked" @click="confirmRevoke(session)"
                  class="flex items-center btn btn-danger text-sm py-2 px-3 w-full sm:w-auto"
                  :disabled="revokingSession === session.id">
                  <IconTrash class="w-4 h-4 mr-2" />
                  <span v-if="revokingSession === session.id">{{ $t('sessions.actions.revoking') }}</span>
                  <span v-else>{{ $t('sessions.actions.revoke') }}</span>
                </button>
                <span v-else-if="isCurrentSession(session)" class="text-sm text-gray-500 italic">
                  {{ $t('sessions.current.badge') }}
                </span>
                <span v-else-if="session.isRevoked" class="text-sm text-red-500 italic">
                  {{ $t('sessions.badges.revoked') }}
                </span>
                <span v-else-if="isExpired(session)" class="text-sm text-yellow-500 italic">
                  {{ $t('sessions.badges.expired') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Revoke All Button -->
      <div v-if="otherSessions.length > 0" class="card bg-red-50 border-red-200">
        <div class="flex items-start justify-between flex-col sm:flex-row gap-4">
          <div class="flex items-start">
            <IconAlertTriangle class="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-sm font-medium text-red-900">{{ $t('sessions.revokeAll.title') }}</p>
              <p class="text-sm text-red-700 mt-1">{{ $t('sessions.revokeAll.description') }}</p>
            </div>
          </div>
          <button @click="confirmRevokeAll" class="flex items-center btn btn-danger text-sm py-2 w-full sm:w-auto"
            :disabled="revokingAll">
            <IconShieldX class="w-4 h-4 mr-2" />
            <span v-if="revokingAll">{{ $t('sessions.actions.revokingAll') }}</span>
            <span v-else>{{ $t('sessions.actions.revokeAll') }}</span>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredSessions.length === 0" class="card">
        <div class="text-center py-12">
          <IconDevices class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('sessions.empty.title') }}</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ hasActiveSearch ? $t('sessions.empty.noResults') : $t('sessions.empty.noSessions') }}
          </p>
          <button v-if="hasActiveSearch" @click="clearSearch" class="mt-4 btn btn-secondary">
            {{ $t('sessions.empty.clearSearch') }}
          </button>
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
                {{ confirmAction === 'revoke' ? $t('sessions.modal.revokeTitle') : $t('sessions.modal.revokeAllTitle')
                }}
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                {{ confirmAction === 'revoke'
                  ? $t('sessions.modal.revokeDescription')
                  : $t('sessions.modal.revokeAllDescription') }}
              </p>
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button @click="cancelRevoke" class="btn btn-secondary">
              {{ $t('sessions.modal.cancel') }}
            </button>
            <button @click="executeRevoke" class="btn btn-danger">
              {{ $t('sessions.modal.confirm') }}
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
import SearchInput from '~/components/SearchInput.vue'
import { IconLoader2, IconAlertCircle, IconDevices, IconShieldCheck, IconX, IconInfoCircle, IconDeviceDesktop, IconDeviceMobile, IconMapPin, IconClock, IconClockX, IconTrash, IconAlertTriangle, IconShieldX } from '@tabler/icons-vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t, locale } = useI18n()
const sessionsStore = useSessionsStore()

const revokingSession = ref<string | null>(null)
const revokingAll = ref(false)
const showConfirmModal = ref(false)
const sessionToRevoke = ref<Session | null>(null)
const confirmAction = ref<'revoke' | 'revokeAll'>('revoke')

// Search logic
const sortedSessions = computed(() => {
  return [...sessionsStore.sessions].sort((a, b) => {
    // Current session first
    if (isCurrentSession(a)) return -1
    if (isCurrentSession(b)) return 1

    // Active sessions before revoked or expired
    if (!a.isRevoked && !isExpired(a) && (b.isRevoked || isExpired(b))) return -1
    if ((a.isRevoked || isExpired(a)) && !b.isRevoked && !isExpired(b)) return 1

    // Expired sessions before revoked
    if (isExpired(a) && !a.isRevoked && b.isRevoked) return -1
    if (isRevoked(a) && isExpired(b) && !b.isRevoked) return 1

    // Most recent first
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  })
})

const { searchQuery, filteredItems: filteredSessions, clearSearch, hasActiveSearch } = useSearch(
  sortedSessions,
  ['userAgent', 'ipAddress']
)

const isRevoked = (session: Session) => session.isRevoked

const otherSessions = computed(() =>
  sessionsStore.sessions.filter(s => s.token !== sessionsStore.currentSessionToken && !s.isRevoked && !isExpired(s))
)

const isCurrentSession = (session: Session) => {
  return session.token === sessionsStore.currentSessionToken
}

const isExpired = (session: Session) => {
  return new Date(session.expiresAt) < new Date()
}

const getDeviceName = (session: Session) => {
  const { t } = useI18n()

  if (session.deviceInfo?.mobile) {
    return t('sessions.device.mobile')
  }

  const ua = session.userAgent || ''
  if (ua.includes('Windows')) return t('sessions.device.windowsPC')
  if (ua.includes('Mac')) return t('sessions.device.macPC')
  if (ua.includes('Linux')) return t('sessions.device.linuxPC')
  if (ua.includes('Android')) return t('sessions.device.android')
  if (ua.includes('iPhone') || ua.includes('iPad')) return t('sessions.device.ios')

  return t('sessions.device.unknown')
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
    await sessionsStore.revokeSession(session.id)
  } catch (err) {
    // Error handled in store
  } finally {
    revokingSession.value = null
  }
}

const revokeAllOtherSessions = async () => {
  revokingAll.value = true
  try {
    await sessionsStore.revokeAllOtherSessions()
  } catch (err) {
    // Error handled in store
  } finally {
    revokingAll.value = false
  }
}

onMounted(() => {
  sessionsStore.fetchSessions()
})

useHead({
  title: t('sessions.title')
})
</script>
