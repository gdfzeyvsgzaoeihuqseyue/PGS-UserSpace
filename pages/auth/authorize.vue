<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <!-- Loading State -->
      <div v-if="loading" class="card text-center">
        <div class="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
          <div class="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Connexion en cours...</h2>
        <p class="text-gray-600">{{ statusMessage }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="card">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div class="flex items-center">
            <IconInfoCircle class="w-5 h-5 text-red-600 mr-2" />
            <span class="text-sm text-red-800">{{ error }}</span>
          </div>
        </div>
        <button @click="retry" class="w-full btn btn-primary">
          Réessayer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconInfoCircle } from '@tabler/icons-vue'

definePageMeta({
  layout: 'default',
  middleware: []
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const loading = ref(true)
const error = ref<string | null>(null)
const statusMessage = ref('Vérification de votre authentification...')

const serviceId = route.query.serviceId as string
const action = (route.query.action as string) || 'login'
const returnUrl = route.query.returnUrl as string

interface SSOCallbackResponse {
  authenticated: boolean
  ssoToken?: string
  user?: any
  service: {
    id: string
    name: string
    domain: string
  }
  access?: any
  redirectUrl: string
  message?: string
}

const handleSSO = async () => {
  try {
    if (!serviceId) {
      throw new Error('Service ID manquant')
    }

    statusMessage.value = 'Vérification du service...'

    // Appeler l'endpoint SSO callback
    const response = await $fetch<SSOCallbackResponse>('/user/auth/authorize', {
      method: 'POST',
      baseURL: config.public.pgsBaseAPI,
      credentials: 'include',
      body: {
        serviceId,
        action
      }
    })

    if (!response.authenticated) {
      // Utilisateur non authentifié, rediriger vers login/register
      statusMessage.value = 'Redirection vers la page de connexion...'

      const redirectPath = action === 'register' ? '/auth/register' : '/auth/login'
      const queryParams = new URLSearchParams({
        serviceId,
        returnUrl: returnUrl || response.service.domain
      })

      await router.push(`${redirectPath}?${queryParams.toString()}`)
      return
    }

    // Utilisateur authentifié, créer l'URL de redirection avec le token SSO
    statusMessage.value = `Connexion à ${response.service.name}...`

    const redirectUrl = new URL(returnUrl || response.service.domain)
    redirectUrl.searchParams.set('sso_token', response.ssoToken!)
    redirectUrl.searchParams.set('user_id', response.user.id)
    redirectUrl.searchParams.set('email', response.user.email)

    // Attendre un peu pour que l'utilisateur voie le message
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Rediriger vers le service
    window.location.href = redirectUrl.toString()

  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Une erreur est survenue'
    loading.value = false
  }
}

const retry = () => {
  error.value = null
  loading.value = true
  handleSSO()
}

onMounted(() => {
  handleSSO()
})
</script>
