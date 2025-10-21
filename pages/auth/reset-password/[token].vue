<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Nouveau mot de passe</h1>

      <form @submit.prevent="onSubmit">
        <div class="mb-4 relative">
          <IconLock class="absolute left-3 top-3 text-gray-400" />
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Mot de passe"
            class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            @click="showPassword = !showPassword"
          >
            <IconEye v-if="showPassword" />
            <IconEyeOff v-else />
          </button>
        </div>

        <div class="mb-6 relative">
          <IconLockCheck class="absolute left-3 top-3 text-gray-400" />
          <input
            v-model="passwordConfirm"
            :type="showPasswordConfirm ? 'text' : 'password'"
            placeholder="Mot de passe"
            class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            @click="showPasswordConfirm = !showPasswordConfirm"
          >
            <IconEye v-if="showPasswordConfirm" />
            <IconEyeOff v-else />
          </button>
        </div>

        <PasswordStrength v-if="password" :password="password" />

        <p v-if="passwordConfirm && !passwordMatch" class="text-red-500 text-sm mb-4 text-center">
          Les mots de passe ne correspondent pas
        </p>

        <button
          type="submit"
          :disabled="!isFormValid || isLoading"
          class="w-full py-2 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Traitement...' : 'Réinitialiser le mot de passe' }}
        </button>

        <p v-if="feedbackMessage" :class="`mt-4 text-center text-sm ${isSuccess ? 'text-green-600' : 'text-red-500'}`">
          {{ feedbackMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from '#app'
import { IconLock, IconLockCheck, IconEye, IconEyeOff } from '@tabler/icons-vue'

const route = useRoute()
const router = useRouter()

const password = ref('')
const passwordConfirm = ref('')
const isLoading = ref(false)
const feedbackMessage = ref('')
const isSuccess = ref(false)

const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const passwordMatch = computed(() => password.value === passwordConfirm.value)
const isFormValid = computed(() => password.value && passwordConfirm.value && passwordMatch.value)

async function onSubmit() {
  if (!isFormValid.value) return
  isLoading.value = true
  feedbackMessage.value = ''

  try {
    const res = await fetch(
      `${useRuntimeConfig().public.pgsApiBase}/supa/auth/reset-password/${route.params.token}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: password.value })
      }
    )
    const data = await res.json()
    if (!data.success) throw new Error(data.message)

    isSuccess.value = true
    feedbackMessage.value = 'Mot de passe mis à jour avec succès ! Redirection...'
    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
  } catch (err: any) {
    isSuccess.value = false
    feedbackMessage.value = err.message || 'Erreur lors de la réinitialisation'
  } finally {
    isLoading.value = false
  }
}
</script>
