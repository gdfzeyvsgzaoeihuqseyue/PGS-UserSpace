<template>
  <div class="mx-auto w-full max-w-sm lg:w-96">
    <!-- Logo & Header -->
    <div class="mb-10">
      <div class="flex justify-start mb-8">
        <img :src="sharedFiles.paths.logo.mc" alt="Logo" class="h-10 w-auto sm:h-12 request-logo dark:hidden" />
        <img :src="sharedFiles.paths.logo.mw" alt="Logo" class="h-10 w-auto sm:h-12 request-logo hidden" />
      </div>
      <h2 class="text-3xl font-bold tracking-tight text-gray-900">{{ $t('auth.login.welcome') }}
      </h2>
      <p class="mt-2 text-base text-gray-500">{{ $t('auth.login.subtitle') }}</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleLogin" class="space-y-6">
      <!-- Error -->
      <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 transition-all duration-300">
        <div class="flex items-start">
          <IconAlertCircle class="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <span class="text-sm text-red-800">{{ authStore.error }}</span>
        </div>
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">{{
          $t('auth.login.emailLabel') }}</label>
        <div>
          <input id="email" v-model="form.email" type="email" required
            class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-secondary sm:text-sm py-2.5 px-3 transition-colors"
            :placeholder="$t('auth.login.emailPlaceholder')" :disabled="authStore.loading" />
        </div>
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">{{
          $t('auth.login.passwordLabel') }}</label>
        <div class="relative rounded-lg shadow-sm">
          <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required
            class="block w-full rounded-lg border-gray-300 focus:border-primary focus:ring-secondary sm:text-sm py-2.5 px-3 pr-10 transition-colors"
            :placeholder="$t('auth.login.passwordPlaceholder')" :disabled="authStore.loading" />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer">
            <IconEye v-if="!showPassword" class="h-5 w-5" />
            <IconEyeOff v-else class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Button -->
      <div class="pt-2">
        <button type="submit"
          class="flex w-full justify-center rounded-lg border border-transparent bg-primary py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:translate-y-px active:translate-y-0"
          :disabled="authStore.loading">
          <span v-if="!authStore.loading">{{ $t('auth.login.submitButton') }}</span>
          <span v-else class="flex items-center">
            <IconLoader2 class="animate-spin h-5 w-5 mr-2" />
            {{ $t('auth.login.submittingButton') }}
          </span>
        </button>
      </div>
    </form>

    <!-- Divider & Register -->
    <div class="mt-8">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="bg-white px-2 text-gray-500">{{ $t('auth.login.noAccount') }}</span>
        </div>
      </div>

      <div class="mt-6">
        <NuxtLink to="/auth/register"
          class="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-primary shadow-sm hover:bg-gray-50 transition-colors">
          {{ $t('auth.login.createAccount') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoginData } from '~/types'
import { useSharedFiles } from '~/stores/sharedFiles';
import { IconAlertCircle, IconLoader2, IconEye, IconEyeOff } from '@tabler/icons-vue';

const { t } = useI18n()
const sharedFiles = useSharedFiles();

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive<LoginData>({
  email: '',
  password: ''
})

const showPassword = ref(false)

// Récupérer les paramètres SSO de l'URL
const serviceId = route.query.serviceId as string
const returnUrl = route.query.returnUrl as string

const handleLogin = async () => {
  try {
    await authStore.login(form)

    // Si un serviceId est présent, rediriger vers le callback
    if (serviceId) {
      const queryParams = new URLSearchParams({
        serviceId,
        action: 'login'
      })
      if (returnUrl) {
        queryParams.set('returnUrl', returnUrl)
      }
      await router.push(`/auth/authorize?${queryParams.toString()}`)
    }
    // Si returnUrl est présent sans serviceId, rediriger vers le check
    else if (returnUrl) {
      const queryParams = new URLSearchParams({
        returnUrl
      })
      await router.push(`/auth/check?${queryParams.toString()}`)
    }
    // Sinon redirection par défaut
    else {
      await router.push('/me')
    }
  } catch (error) {
  }
}

useHead({
  title: t('auth.login.subtitle')
})
</script>
