<template>
  <main class="min-h-screen auth-bg flex items-center justify-center py-12 px-4">
    <div class="max-w-xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 md:p-14 text-center flex flex-col justify-center items-center">
      <div class="text-center mb-6">
        <h2 class="text-4xl font-extrabold text-gray-900 leading-tight">
          Vérification de votre adresse e-mail
        </h2>
        <p v-if="verificationStatus === 'loading'" class="mt-3 text-lg text-gray-600">
          Veuillez patienter pendant que nous vérifions votre e-mail...
        </p>
      </div>

      <div v-if="verificationStatus === 'loading'" class="mt-8">
        <div class="animate-spin inline-block text-indigo-600">
          <IconLoader class="w-16 h-16" />
        </div>
        <p class="mt-4 text-xl text-gray-700">Vérification en cours...</p>
      </div>

      <div v-else-if="verificationStatus === 'success'" class="mt-8 text-green-600">
        <IconCircleCheck class="mx-auto h-24 w-24 text-green-500" />
        <p class="mt-4 text-2xl font-semibold">Email vérifié avec succès !</p>
        <p class="mt-2 text-lg text-gray-700">Vous pouvez maintenant vous connecter à votre compte.</p>
        <NuxtLink to="/auth/login" class="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
          Se connecter
        </NuxtLink>
      </div>

      <div v-else-if="verificationStatus === 'error'" class="mt-8 text-red-600">
        <IconCircleX class="mx-auto h-24 w-24 text-red-500" />
        <p class="mt-4 text-2xl font-semibold">Échec de la vérification de l'email.</p>
        <p class="mt-2 text-lg text-gray-700">{{ errorMessage }}</p>
        <p class="mt-4 text-base text-gray-600">Si le problème persiste, vous pouvez demander un nouveau lien.</p>
        <NuxtLink to="/auth/email-verify/resend" class="mt-6 inline-block text-indigo-600 hover:text-indigo-700 font-medium">
          Renvoyer le lien de vérification
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { PGSServices } from '~/services/PGSServices';
import { IconLoader, IconCircleCheck, IconCircleX } from '@tabler/icons-vue';

const route = useRoute();
const { verifyEmail } = PGSServices();

const verificationStatus = ref<'loading' | 'success' | 'error'>('loading');
const errorMessage = ref<string | null>(null);

onMounted(async () => {
  const token = route.query.token as string;

  if (!token) {
    verificationStatus.value = 'error';
    errorMessage.value = 'Aucun jeton de vérification fourni dans l\'URL.';
    return;
  }

  try {
    const response = await verifyEmail(token);
    
    if (response.status === 200) {
      verificationStatus.value = 'success';
    } else {
      verificationStatus.value = 'error';
      errorMessage.value = response.data?.message || 'Une erreur inattendue est survenue lors de la vérification.';
    }
  } catch (err: any) {
    verificationStatus.value = 'error';
    errorMessage.value = err.response?.data?.message || 'Jeton de vérification invalide ou expiré.';
    console.error('Erreur lors de la vérification de l\'email :', err);
  }
});

useHead({
  title: 'Vérification Email - Mon Application'
})
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
