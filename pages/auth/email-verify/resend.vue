<template>
  <main class="min-h-screen auth-bg flex items-center justify-center py-12 px-4">
    <div
      class="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 md:p-14 text-center"
    >
      <div class="text-center mb-8">
        <h2 class="text-4xl font-extrabold text-gray-900 leading-tight">
          Renvoyer le lien de vérification
        </h2>
        <p class="mt-3 text-lg text-gray-600">
          Entrez votre adresse e-mail pour recevoir un nouveau lien de vérification.
        </p>
      </div>

      <form @submit.prevent="requestVerification" class="space-y-6">
        <div>
          <label for="email" class="sr-only">Adresse e-mail</label>
          <div class="relative">
            <input
              id="email"
              v-model="emailAddress"
              type="email"
              autocomplete="email"
              required
              class="w-full rounded-lg border px-3 py-2 pl-10 focus:ring-indigo-500 focus:border-indigo-500"
              :class="{ 'border-red-500': emailError }"
              placeholder="votre.email@exemple.com"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconMail class="h-5 w-5" />
            </span>
          </div>
          <p v-if="emailError" class="mt-2 text-sm text-red-600">
            {{ emailError }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl transition-colors"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <IconLoaderQuarter class="animate-spin h-5 w-5 mr-2 text-white" />
            Envoi en cours...
          </span>
          <span v-else>Renvoyer le lien</span>
        </button>

        <p v-if="message" :class="{ 'text-green-600': messageType === 'success', 'text-red-600': messageType === 'error' }"
          class="mt-4 text-center font-medium">
          {{ message }}
        </p>
      </form>

      <p class="mt-8 text-center text-sm text-gray-600">
        Retour à la
        <NuxtLink to="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
          page de connexion
        </NuxtLink>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PGSServices } from '~/services/PGSServices';
import { IconMail, IconLoaderQuarter } from '@tabler/icons-vue';

const { requestEmailVerification } = PGSServices();

const emailAddress = ref('');
const loading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error' | ''>('');
const emailError = ref('');

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const requestVerification = async () => {
  message.value = '';
  messageType.value = '';
  emailError.value = '';

  if (!emailAddress.value.trim()) {
    emailError.value = 'L\'adresse email est requise.';
    return;
  }
  if (!validateEmail(emailAddress.value)) {
    emailError.value = 'Veuillez entrer une adresse email valide.';
    return;
  }

  loading.value = true;
  try {
    const response = await requestEmailVerification(emailAddress.value);
    // Le backend renvoie toujours un succès avec un message générique pour des raisons de sécurité (énumération des utilisateurs)
    message.value = response.data?.message || 'Si un compte correspondant est trouvé, un e-mail de vérification a été envoyé à cette adresse.';
    messageType.value = 'success';
    emailAddress.value = ''; // Effacer le champ après succès
  } catch (err: any) {
    messageType.value = 'error';
    if (err.response?.status === 400 && err.response?.data?.message) {
      // Backend renvoie missingEmail
      emailError.value = err.response.data.message;
    } else if (err.response?.status === 429) {
      // Backend renvoie rateLimitExceeded
      message.value = err.response.data?.message || 'Trop de demandes. Veuillez réessayer plus tard.';
    } else {
      // Erreur générale du serveur
      message.value = err.response?.data?.message || 'Une erreur est survenue lors de l\'envoi du lien. Veuillez réessayer.';
    }
    console.error('Erreur lors de la demande de vérification email:', err);
  } finally {
    loading.value = false;
  }
};

useHead({
  title: 'Renvoyer Vérification Email - Mon Application'
});
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
