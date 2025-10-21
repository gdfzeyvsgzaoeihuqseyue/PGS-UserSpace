<template>
  <main class="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 flex items-center justify-center py-12 px-4">
    <div class="max-w-xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 md:p-14">
      <div class="text-center md:text-left mb-6">
        <h2 class="text-4xl font-extrabold text-gray-900 leading-tight">
          Réinitialiser le mot de passe
        </h2>
        <p class="mt-3 text-lg text-gray-600">
          Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <form @submit.prevent="handleForgotPassword" class="space-y-5" novalidate>
        <div>
          <label for="emailAddress" class="block font-medium text-gray-700 mb-1">Adresse e-mail <span class="text-red-500">*</span></label>
          <input
            id="emailAddress"
            v-model="form.emailAddress"
            type="email"
            class="w-full rounded-lg border px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            :class="{ 'border-red-500': errors.emailAddress }"
            required
          />
          <p v-if="errors.emailAddress" class="text-red-600 text-sm mt-1">{{ errors.emailAddress }}</p>
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl">
          <span v-if="loading" class="animate-spin inline-block mr-2">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </span>
          Envoyer le lien de réinitialisation
        </button>

        <p v-if="message" :class="{'text-green-600': message.type === 'success', 'text-red-600': message.type === 'error'}" class="text-center font-medium">
          {{ message.text }}
        </p>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Retour à la <NuxtLink to="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">page de connexion</NuxtLink>.
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const form = reactive({
  emailAddress: '',
});

const errors = reactive({
  emailAddress: '',
});

const message = ref<{ type: 'success' | 'error'; text: string } | null>(null);
const loading = ref(false);

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function clearErrors() {
  Object.keys(errors).forEach(k => (errors[k as keyof typeof errors] = ''));
}

async function handleForgotPassword() {
  clearErrors();
  message.value = null;

  let valid = true;
  if (!form.emailAddress.trim()) {
    errors.emailAddress = 'L\'adresse e-mail est requise.'; valid = false;
  } else if (!validateEmail(form.emailAddress)) {
    errors.emailAddress = 'Format d\'adresse e-mail invalide.'; valid = false;
  }
  if (!valid) return;

  loading.value = true;
  try {
    // --- Placeholder for actual API call ---
    // await yourForgotPasswordAPI(form.emailAddress);
    message.value = { type: 'success', text: 'Si cette adresse e-mail est enregistrée chez nous, un lien de réinitialisation vous a été envoyé.' };
    form.emailAddress = ''; // Clear the field after sending
  } catch (err: any) {
    message.value = { type: 'error', text: 'Une erreur est survenue. Veuillez réessayer plus tard.' };
    console.error("Forgot password error:", err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Pas d'animations de carrousel ici car il n'y a pas de carrousel */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>