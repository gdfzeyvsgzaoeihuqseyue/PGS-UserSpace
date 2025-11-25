<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">🔍 Debug Session</h1>

      <div class="space-y-6">
        <!-- Bouton pour forcer le rechargement -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4">Actions</h2>
          <button @click="forceReloadSession" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Chargement...' : '🔄 Forcer le rechargement de la session' }}
          </button>
        </div>

        <!-- Données de la session -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4">📦 Données du store</h2>
          <div class="space-y-2">
            <p><strong>isAuthenticated:</strong> {{ authStore.isAuthenticated }}</p>
            <p><strong>User ID:</strong> {{ authStore.user?.id }}</p>
            <p><strong>Email:</strong> {{ authStore.user?.email }}</p>
            <p><strong>LastLogin (brut):</strong> {{ authStore.user?.lastLogin }}</p>
            <p><strong>LastLogin (type):</strong> {{ typeof authStore.user?.lastLogin }}</p>
            <p><strong>LastLogin (formaté):</strong> {{ formattedLastLogin }}</p>
          </div>
        </div>

        <!-- Données brutes -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4">🔬 Données brutes (JSON)</h2>
          <pre
            class="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">{{ JSON.stringify(authStore.user, null, 2) }}</pre>
        </div>

        <!-- Réponse de la dernière requête -->
        <div v-if="lastResponse" class="card">
          <h2 class="text-xl font-bold mb-4">📡 Dernière réponse API</h2>
          <pre
            class="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">{{ JSON.stringify(lastResponse, null, 2) }}</pre>
        </div>

        <!-- Erreurs -->
        <div v-if="error" class="card bg-red-50 border-red-200">
          <h2 class="text-xl font-bold mb-4 text-red-700">❌ Erreur</h2>
          <p class="text-red-600">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/dateFormatter'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const { locale, t } = useI18n()

const loading = ref(false)
const error = ref<string | null>(null)
const lastResponse = ref<any>(null)

const formattedLastLogin = computed(() => {
  return formatDate(authStore.user?.lastLogin, locale.value, t('common.never'))
})

const forceReloadSession = async () => {
  loading.value = true
  error.value = null
  lastResponse.value = null

  try {
    console.log('🔄 Forçage du rechargement de la session...')

    const response = await authStore.checkSession()
    lastResponse.value = response

    console.log('✅ Session rechargée avec succès:', response)
    console.log('👤 User après rechargement:', authStore.user)
    console.log('📅 LastLogin après rechargement:', authStore.user?.lastLogin)
  } catch (err: any) {
    console.error('❌ Erreur lors du rechargement:', err)
    error.value = err.message || 'Erreur inconnue'
  } finally {
    loading.value = false
  }
}

// Charger au montage
onMounted(() => {
  console.log('🚀 Page de debug montée')
  console.log('👤 User actuel:', authStore.user)
  console.log('📅 LastLogin actuel:', authStore.user?.lastLogin)
})
</script>
