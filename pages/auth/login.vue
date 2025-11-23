<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <!-- Logo -->
        <div class="flex justify-center">
          <img :src="sharedFiles.paths.logo.mc" alt="Logo" class="h-12 w-auto sm:h-16 dark:hidden" />
          <img :src="sharedFiles.paths.logo.mw" alt="Logo" class="h-12 w-auto sm:h-16 hidden dark:block" />
        </div>

        <h2 class="text-3xl font-bold text-gray-900">Welcome back</h2>
        <p class="mt-2 text-gray-600">Sign in to access your account</p>
      </div>

      <!-- Login Form -->
      <div class="card">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Error Message -->
          <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center">
              <IconAlertCircle class="w-5 h-5 text-red-600 mr-2" />
              <span class="text-sm text-red-800">{{ authStore.error }}</span>
            </div>
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input id="email" v-model="form.email" type="email" required class="input" placeholder="you@example.com"
              :disabled="authStore.loading" />
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input id="password" v-model="form.password" type="password" required class="input" placeholder="••••••••"
              :disabled="authStore.loading" />
          </div>

          <!-- Submit Button -->
          <button type="submit" class="w-full btn btn-primary" :disabled="authStore.loading">
            <span v-if="!authStore.loading">Sign In</span>
            <span v-else class="flex items-center justify-center">
              <IconLoader2 class="animate-spin h-5 w-5 mr-2" />
              Signing in...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Don't have an account?</span>
          </div>
        </div>

        <!-- Register Link -->
        <NuxtLink to="/auth/register" class="block text-center text-primary hover:text-secondary font-medium">
          Create a new account
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoginData } from '~/types'
import { useSharedFiles } from '~/stores/sharedFiles';
import { IconAlertCircle, IconLoader2 } from '@tabler/icons-vue';

const sharedFiles = useSharedFiles();

definePageMeta({
  layout: 'default',
  middleware: 'guest'
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive<LoginData>({
  email: '',
  password: ''
})

// Récupérer les paramètres SSO de l'URL
const serviceId = route.query.serviceId as string
const returnUrl = route.query.returnUrl as string

const handleLogin = async () => {
  try {
    await authStore.login(form)

    // Si un serviceId est présent, rediriger vers le callback SSO
    if (serviceId) {
      const queryParams = new URLSearchParams({
        serviceId,
        action: 'login'
      })
      if (returnUrl) {
        queryParams.set('returnUrl', returnUrl)
      }
      await router.push(`/auth/authorize?${queryParams.toString()}`)
    } else {
      await router.push('/dashboard')
    }
  } catch (error) {
    // Error is handled in the store
  }
}
</script>
