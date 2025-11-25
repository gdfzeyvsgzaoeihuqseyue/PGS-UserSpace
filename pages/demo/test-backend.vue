<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">🔧 Test Backend Endpoints</h1>

      <div class="space-y-6">
        <!-- Test /user/auth/session -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4">📡 GET /user/auth/session</h2>
          <button @click="testSessionEndpoint" class="btn btn-primary mb-4" :disabled="loadingSession">
            {{ loadingSession ? 'Chargement...' : '🚀 Tester l\'endpoint' }}
          </button>

          <div v-if="sessionResponse" class="space-y-3">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <p class="text-sm font-medium text-green-800">✅ Réponse reçue</p>
            </div>

            <div>
              <p class="font-bold mb-2">🔍 lastLogin présent ?</p>
              <span v-if="sessionResponse.user?.lastLogin" class="badge badge-success">
                ✅ OUI - {{ sessionResponse.user.lastLogin }}
              </span>
              <span v-else class="badge badge-danger">
                ❌ NON - Le champ est absent
              </span>
            </div>

            <div>
              <p class="font-bold mb-2">📦 Données complètes :</p>
              <pre
                class="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">{{ JSON.stringify(sessionResponse, null, 2) }}</pre>
            </div>
          </div>

          <div v-if="sessionError" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-sm font-medium text-red-800">❌ Erreur: {{ sessionError }}</p>
          </div>
        </div>

        <!-- Test /user/profile -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4">📡 GET /user/profile</h2>
          <button @click="testProfileEndpoint" class="btn btn-primary mb-4" :disabled="loadingProfile">
            {{ loadingProfile ? 'Chargement...' : '🚀 Tester l\'endpoint' }}
          </button>

          <div v-if="profileResponse" class="space-y-3">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <p class="text-sm font-medium text-green-800">✅ Réponse reçue</p>
            </div>

            <div>
              <p class="font-bold mb-2">🔍 lastLogin présent ?</p>
              <span v-if="profileResponse.user?.lastLogin" class="badge badge-success">
                ✅ OUI - {{ profileResponse.user.lastLogin }}
              </span>
              <span v-else class="badge badge-danger">
                ❌ NON - Le champ est absent
              </span>
            </div>

            <div>
              <p class="font-bold mb-2">📦 Données complètes :</p>
              <pre
                class="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">{{ JSON.stringify(profileResponse, null, 2) }}</pre>
            </div>
          </div>

          <div v-if="profileError" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-sm font-medium text-red-800">❌ Erreur: {{ profileError }}</p>
          </div>
        </div>

        <!-- Comparaison -->
        <div v-if="sessionResponse && profileResponse" class="card bg-blue-50 border-blue-200">
          <h2 class="text-xl font-bold mb-4">🔬 Comparaison</h2>

          <div class="space-y-3">
            <div>
              <p class="font-medium">GET /user/auth/session - lastLogin:</p>
              <code class="bg-white px-3 py-1 rounded">{{ sessionResponse.user?.lastLogin || 'undefined' }}</code>
            </div>

            <div>
              <p class="font-medium">GET /user/profile - lastLogin:</p>
              <code class="bg-white px-3 py-1 rounded">{{ profileResponse.user?.lastLogin || 'undefined' }}</code>
            </div>

            <div v-if="sessionResponse.user?.lastLogin !== profileResponse.user?.lastLogin"
              class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p class="text-sm font-medium text-yellow-800">
                ⚠️ Les deux endpoints ne retournent pas la même valeur !
              </p>
            </div>

            <div v-else-if="!sessionResponse.user?.lastLogin && profileResponse.user?.lastLogin"
              class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <p class="text-sm font-medium text-red-800">
                ❌ Le endpoint /user/auth/session ne retourne PAS lastLogin, mais /user/profile OUI.
              </p>
              <p class="text-sm text-red-600 mt-2">
                🔧 Solution : Modifiez le backend pour que /user/auth/session retourne aussi lastLogin.
              </p>
            </div>

            <div v-else-if="sessionResponse.user?.lastLogin && profileResponse.user?.lastLogin"
              class="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p class="text-sm font-medium text-green-800">
                ✅ Les deux endpoints retournent correctement lastLogin !
              </p>
            </div>
          </div>
        </div>

        <!-- État du store -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4">💾 État actuel du store</h2>
          <div class="space-y-2">
            <p><strong>User ID:</strong> {{ authStore.user?.id }}</p>
            <p><strong>Email:</strong> {{ authStore.user?.email }}</p>
            <p>
              <strong>lastLogin (store):</strong>
              <code class="bg-gray-100 px-2 py-1 rounded ml-2">{{ authStore.user?.lastLogin || 'undefined' }}</code>
            </p>
            <p>
              <strong>lastLogin (formaté):</strong>
              <code
                class="bg-gray-100 px-2 py-1 rounded ml-2">{{ formatDate(authStore.user?.lastLogin, locale, t('common.never')) }}</code>
            </p>
          </div>
        </div>

        <!-- Instructions -->
        <div class="card bg-purple-50 border-purple-200">
          <h2 class="text-xl font-bold mb-4">📋 Instructions</h2>
          <div class="prose prose-sm">
            <ol class="space-y-2">
              <li>Testez les deux endpoints en cliquant sur les boutons ci-dessus</li>
              <li>Vérifiez si <code>lastLogin</code> est présent dans les réponses</li>
              <li>Si <code>/user/profile</code> retourne <code>lastLogin</code> mais pas
                <code>/user/auth/session</code>, alors le backend doit être modifié</li>
              <li>Une fois le backend modifié, rafraîchissez cette page et testez à nouveau</li>
            </ol>
          </div>
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
const config = useRuntimeConfig()

const loadingSession = ref(false)
const loadingProfile = ref(false)
const sessionResponse = ref<any>(null)
const profileResponse = ref<any>(null)
const sessionError = ref<string | null>(null)
const profileError = ref<string | null>(null)

const testSessionEndpoint = async () => {
  loadingSession.value = true
  sessionError.value = null
  sessionResponse.value = null

  try {
    console.log('🧪 Test de /user/auth/session')
    const response = await $fetch('/user/auth/session', {
      method: 'GET',
      baseURL: config.public.pgsBaseAPI,
      credentials: 'include'
    })

    sessionResponse.value = response
    console.log('✅ Réponse /user/auth/session:', response)
    console.log('📅 lastLogin présent ?', response.user?.lastLogin ? 'OUI' : 'NON')
  } catch (err: any) {
    console.error('❌ Erreur /user/auth/session:', err)
    sessionError.value = err.data?.message || err.message || 'Erreur inconnue'
  } finally {
    loadingSession.value = false
  }
}

const testProfileEndpoint = async () => {
  loadingProfile.value = true
  profileError.value = null
  profileResponse.value = null

  try {
    console.log('🧪 Test de /user/profile')
    const response = await $fetch('/user/profile', {
      method: 'GET',
      baseURL: config.public.pgsBaseAPI,
      credentials: 'include'
    })

    profileResponse.value = response
    console.log('✅ Réponse /user/profile:', response)
    console.log('📅 lastLogin présent ?', response.user?.lastLogin ? 'OUI' : 'NON')
  } catch (err: any) {
    console.error('❌ Erreur /user/profile:', err)
    profileError.value = err.data?.message || err.message || 'Erreur inconnue'
  } finally {
    loadingProfile.value = false
  }
}
</script>
