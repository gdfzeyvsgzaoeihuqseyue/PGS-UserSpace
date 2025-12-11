<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <!-- Loading State -->
      <div v-if="loading" class="card text-center">
        <div class="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
          <div class="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">{{ $t('auth.check.loadingTitle') }}</h2>
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
          {{ $t('auth.check.retry') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconInfoCircle } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n';

definePageMeta({
  layout: 'auth',
  middleware: []
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const loading = ref(true)
const error = ref<string | null>(null)
const statusMessage = ref(t('auth.check.statusChecking'))

const returnUrl = route.query.returnUrl as string

interface AuthCheckResponse {
  authenticated: boolean
  ssoToken?: string
  user?: {
    id: number
    firstName: string
    lastName: string
    email: string
    emailVerified: boolean
  }
  redirectUrl: string
  returnUrl?: string
  message?: string
}

const handleAuthCheck = async () => {
  try {
    if (!returnUrl) {
      throw new Error('URL de retour manquante')
    }

    statusMessage.value = t('auth.check.statusVerifying')

    // Appeler l'endpoint SSO check
    const response = await $fetch<AuthCheckResponse>('/user/auth/check', {
      method: 'POST',
      baseURL: config.public.pgsBaseAPI,
      credentials: 'include',
      body: {
        returnUrl
      }
    })

    if (!response.authenticated) {
      // Utilisateur non authentifié, rediriger vers login
      statusMessage.value = t('auth.check.statusRedirecting')

      const queryParams = new URLSearchParams({
        returnUrl: returnUrl
      })

      await router.push(`/auth/login?${queryParams.toString()}`)
      return
    }

    // Utilisateur authentifié, créer l'URL de redirection avec le token SSO
    statusMessage.value = t('auth.check.statusConnecting')

    const redirectUrl = new URL(returnUrl)
    redirectUrl.searchParams.set('sso_token', response.ssoToken!)
    redirectUrl.searchParams.set('user_id', String(response.user!.id))
    redirectUrl.searchParams.set('email', response.user!.email)

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
  handleAuthCheck()
}

onMounted(() => {
  handleAuthCheck()
})

useHead({
  title: t('auth.check.statusChecking')
})
</script>
