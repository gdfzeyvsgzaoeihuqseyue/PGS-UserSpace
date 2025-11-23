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

        <h2 class="text-3xl font-bold text-gray-900">Create your account</h2>
        <p class="mt-2 text-gray-600">Join the PGS ecosystem today</p>
      </div>

      <!-- Success Message -->
      <div v-if="registrationSuccess" class="card mb-6">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-start">
            <IconCircleCheck class="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <h3 class="text-sm font-medium text-green-800 mb-1">Registration successful!</h3>
              <p class="text-sm text-green-700">You can now sign in with your credentials.</p>
              <NuxtLink to="/auth/login" class="text-sm text-green-800 font-medium underline mt-2 inline-block">
                Go to Sign In →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Registration Form -->
      <div class="card" v-else>
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Error Message -->
          <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center">
              <IconAlertCircle class="w-5 h-5 text-red-600 mr-2" />
              <span class="text-sm text-red-800">{{ authStore.error }}</span>
            </div>
          </div>

          <!-- Name Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input id="firstName" v-model="form.firstName" type="text" required class="input" placeholder="John"
                :disabled="authStore.loading" />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input id="lastName" v-model="form.lastName" type="text" required class="input" placeholder="Doe"
                :disabled="authStore.loading" />
            </div>
          </div>

          <!-- Username Field (Optional) -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              Username <span class="text-gray-500 text-xs">(optional)</span>
            </label>
            <input id="username" v-model="form.username" type="text" class="input" placeholder="johndoe"
              :disabled="authStore.loading" />
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
            <input id="password" v-model="form.password" type="password" required minlength="8" class="input"
              placeholder="••••••••" :disabled="authStore.loading" />
            <p class="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="w-full btn btn-primary" :disabled="authStore.loading">
            <span v-if="!authStore.loading">Create Account</span>
            <span v-else class="flex items-center justify-center">
              <IconLoader2 class="animate-spin h-5 w-5 mr-2" />
              Creating account...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Already have an account?</span>
          </div>
        </div>

        <!-- Login Link -->
        <NuxtLink to="/auth/login" class="block text-center text-primaryn hover:text-secondaryn font-medium">
          Sign in instead
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RegisterData } from '~/types'
import { useSharedFiles } from '~/stores/sharedFiles';
import { IconAlertCircle, IconCircleCheck, IconLoader2 } from '@tabler/icons-vue';

const sharedFiles = useSharedFiles();

definePageMeta({
  layout: 'default',
  middleware: 'guest'
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive<RegisterData>({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: ''
})

const registrationSuccess = ref(false)
const serviceId = route.query.serviceId as string
const returnUrl = route.query.returnUrl as string

const handleRegister = async () => {
  try {
    await authStore.register(form)

    // Si un serviceId est présent, connecter automatiquement et rediriger
    if (serviceId) {
      // Connecter l'utilisateur automatiquement
      await authStore.login({
        email: form.email,
        password: form.password
      })

      // Rediriger vers le callback SSO
      const queryParams = new URLSearchParams({
        serviceId,
        action: 'login'
      })
      if (returnUrl) {
        queryParams.set('returnUrl', returnUrl)
      }
      await router.push(`/auth/authorize?${queryParams.toString()}`)
    } else {
      registrationSuccess.value = true
    }
  } catch (error) {
  }
}
</script>
