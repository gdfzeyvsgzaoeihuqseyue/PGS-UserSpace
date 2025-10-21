<template>
  <main class="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 flex items-center justify-center py-12 px-4">
    <div class="max-w-xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 md:p-14">
      <div class="text-center md:text-left mb-6">
        <h2 class="text-4xl font-extrabold text-gray-900 leading-tight">
          Réinitialiser votre mot de passe
        </h2>
        <p class="mt-3 text-lg text-gray-600">
          Entrez votre nouveau mot de passe.
        </p>
      </div>

      <div v-if="tokenStatus === 'loading'" class="text-center mt-4">
          <div class="animate-spin inline-block text-indigo-600">
              <svg class="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
          </div>
          <p class="mt-2 text-gray-700">Vérification du jeton...</p>
      </div>
      <div v-else-if="tokenStatus === 'invalid'" class="text-center mt-4 text-red-600">
          <p class="font-semibold text-lg">Jeton invalide ou expiré.</p>
          <p class="text-gray-700">Veuillez demander un nouveau lien de réinitialisation.</p>
          <NuxtLink to="/auth/forgot-password" class="mt-4 inline-block text-indigo-600 hover:text-indigo-700 font-medium">
              Demander un nouveau lien
          </NuxtLink>
      </div>

      <form @submit.prevent="handleResetPassword" class="space-y-5" novalidate v-if="tokenStatus === 'valid'">
        <div class="relative">
          <label for="newPassword" class="block font-medium text-gray-700 mb-1">Nouveau mot de passe <span class="text-red-500">*</span></label>
          <input
            id="newPassword"
            :type="showPassword ? 'text' : 'password'"
            v-model="form.newPassword"
            class="w-full rounded-lg border px-3 py-2 pr-10 focus:ring-indigo-500 focus:border-indigo-500"
            :class="{ 'border-red-500': errors.newPassword }"
            required
          />
          <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-9 text-gray-500 hover:text-indigo-600">
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-3.5-9-7s4-7 9-7c1.433 0 2.799.42 4.008 1.164M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M9.879 9.879a3 3 0 104.242 4.242M9.88 9.88L3 3m18 18l-6-6" />
            </svg>
          </button>
          <p v-if="errors.newPassword" class="text-red-600 text-sm mt-1">{{ errors.newPassword }}</p>
        </div>

        <div class="relative">
          <label for="confirmPassword" class="block font-medium text-gray-700 mb-1">Confirmer le mot de passe <span class="text-red-500">*</span></label>
          <input
            id="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            v-model="form.confirmPassword"
            class="w-full rounded-lg border px-3 py-2 pr-10 focus:ring-indigo-500 focus:border-indigo-500"
            :class="{ 'border-red-500': errors.confirmPassword }"
            required
          />
          <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-9 text-gray-500 hover:text-indigo-600">
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-3.5-9-7s4-7 9-7c1.433 0 2.799.42 4.008 1.164M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M9.879 9.879a3 3 0 104.242 4.242M9.88 9.88L3 3m18 18l-6-6" />
            </svg>
          </button>
          <p v-if="errors.confirmPassword" class="text-red-600 text-sm mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl">
          <span v-if="loading" class="animate-spin inline-block mr-2">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </span>
          Définir un nouveau mot de passe
        </button>

        <p v-if="message" :class="{'text-green-600': message.type === 'success', 'text-red-600': message.type === 'error'}" class="text-center font-medium">
          {{ message.text }}
        </p>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600" v-if="tokenStatus === 'valid'">
        Retour à la <NuxtLink to="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-700">page de connexion</NuxtLink>.
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const tokenStatus = ref<'loading' | 'valid' | 'invalid'>('loading');
const form = reactive({
  newPassword: '',
  confirmPassword: '',
});

const errors = reactive({
  newPassword: '',
  confirmPassword: '',
});

const message = ref<{ type: 'success' | 'error'; text: string } | null>(null);
const loading = ref(false);
const showPassword = ref(false);

// Removed all carousel-related imports, reactive variables, and functions.

onMounted(() => {
  // --- Logic for Token Verification ---
  const token = route.query.token as string;
  if (token) {
    // Simulate API call to verify token (replace with actual backend call)
    setTimeout(() => {
        // Example: const res = await someService.verifyResetToken(token);
        if (token === 'valid_reset_token_for_demo') { // Replace with actual token validation
            tokenStatus.value = 'valid';
        } else {
           tokenStatus.value = 'invalid';
        }
    }, 1500); // Simulate 1.5 seconds loading for token verification
  } else {
    tokenStatus.value = 'invalid';
  }
});

// onUnmounted is no longer needed for carousel cleanup but kept for potential future use if logic dictates.
onUnmounted(() => {
  // Any cleanup specific to this component can go here.
});

function clearErrors() {
  Object.keys(errors).forEach(k => (errors[k as keyof typeof errors] = ''));
}

async function handleResetPassword() {
  clearErrors();
  message.value = null;

  let valid = true;
  if (form.newPassword.length < 8) { errors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères.'; valid = false; }
  if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas.'; valid = false;
  }
  if (!valid) return;

  loading.value = true;
  try {
    const token = route.query.token as string;
    // --- Placeholder for actual API call ---
    // await yourResetPasswordAPI(token, form.newPassword);
    message.value = { type: 'success', text: 'Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter.' };
    form.newPassword = '';
    form.confirmPassword = '';
    // Optionally redirect to login after a short delay
    setTimeout(() => {
        router.push('/auth/login');
    }, 3000);
  } catch (err: any) {
    message.value = { type: 'error', text: err.response?.data?.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe.' };
    console.error("Reset password error:", err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Only spin animation is relevant now */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
/* Removed carousel-specific styles */
</style>