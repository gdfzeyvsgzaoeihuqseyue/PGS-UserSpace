<template>
  <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <!-- Logo -->
        <div class="flex justify-center">
          <img :src="sharedFiles.paths.logo.mc" alt="Logo" class="h-12 w-auto sm:h-16 dark:hidden" />
          <img :src="sharedFiles.paths.logo.mw" alt="Logo" class="h-12 w-auto sm:h-16 hidden dark:block" />
        </div>

        <h2 class="text-3xl font-bold text-gray-900">{{ $t('auth.register.title') }}</h2>
        <p class="mt-2 text-gray-600">{{ $t('auth.register.subtitle') }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="registrationSuccess" class="card mb-6">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-start">
            <IconCircleCheck class="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <h3 class="text-sm font-medium text-green-800 mb-1">{{ $t('auth.register.successTitle') }}</h3>
              <p class="text-sm text-green-700">{{ $t('auth.register.successMessage') }}</p>
              <NuxtLink to="/auth/login" class="text-sm text-green-800 font-medium underline mt-2 inline-block">
                {{ $t('auth.register.goToLogin') }}
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
                {{ $t('auth.register.firstNameLabel') }}
              </label>
              <input id="firstName" v-model="form.firstName" type="text" required class="input"
                :placeholder="$t('auth.register.firstNamePlaceholder')" :disabled="authStore.loading" />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('auth.register.lastNameLabel') }}
              </label>
              <input id="lastName" v-model="form.lastName" type="text" required class="input"
                :placeholder="$t('auth.register.lastNamePlaceholder')" :disabled="authStore.loading" />
            </div>
          </div>

          <!-- Username Field (Optional) -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.register.usernameLabel') }} <span class="text-gray-500 text-xs">({{ $t('common.optional')
              }})</span>
            </label>
            <input id="username" v-model="form.username" type="text" class="input"
              :placeholder="$t('auth.register.usernamePlaceholder')" :disabled="authStore.loading" />
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.register.emailLabel') }}
            </label>
            <input id="email" v-model="form.email" type="email" required class="input"
              :placeholder="$t('auth.register.emailPlaceholder')" :disabled="authStore.loading" />
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.register.passwordLabel') }}
            </label>
            <div class="relative">
              <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                minlength="8" class="input pr-10" :placeholder="$t('auth.register.passwordPlaceholder')"
                :disabled="authStore.loading" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                <IconEye v-if="!showPassword" class="h-5 w-5" />
                <IconEyeOff v-else class="h-5 w-5" />
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500">{{ $t('auth.register.minChars') }}</p>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="w-full btn btn-primary" :disabled="authStore.loading">
            <span v-if="!authStore.loading">{{ $t('auth.register.submitButton') }}</span>
            <span v-else class="flex items-center justify-center">
              <IconLoader2 class="animate-spin h-5 w-5 mr-2" />
              {{ $t('auth.register.submittingButton') }}
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">{{ $t('auth.register.hasAccount') }}</span>
          </div>
        </div>

        <!-- Login Link -->
        <NuxtLink to="/auth/login" class="block text-center text-primary hover:text-secondary font-medium">
          {{ $t('auth.register.signIn') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RegisterData } from '~/types'
import { useSharedFiles } from '~/stores/sharedFiles';
import { IconAlertCircle, IconCircleCheck, IconLoader2, IconEye, IconEyeOff } from '@tabler/icons-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
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

const showPassword = ref(false)

const registrationSuccess = ref(false)
const serviceId = route.query.serviceId as string
const returnUrl = route.query.returnUrl as string

const handleRegister = async () => {
  try {
    await authStore.register(form)

    // Si un serviceId est présent, connecter automatiquement et rediriger vers le callback
    if (serviceId) {
      // Connecter l'utilisateur automatiquement
      await authStore.login({
        email: form.email,
        password: form.password
      })

      // Rediriger vers le callback
      const queryParams = new URLSearchParams({
        serviceId,
        action: 'login'
      })
      if (returnUrl) {
        queryParams.set('returnUrl', returnUrl)
      }
      await router.push(`/auth/authorize?${queryParams.toString()}`)
    }
    // Si returnUrl est présent sans serviceId, connecter et rediriger vers le check
    else if (returnUrl) {
      // Connecter l'utilisateur automatiquement
      await authStore.login({
        email: form.email,
        password: form.password
      })

      // Rediriger vers le callback
      const queryParams = new URLSearchParams({
        returnUrl
      })
      await router.push(`/auth/check?${queryParams.toString()}`)
    }
    // Sinon afficher le succès
    else {
      registrationSuccess.value = true
    }
  } catch (error) {
  }
}

useHead({
  title: t('auth.register.subtitle')
})
</script>
