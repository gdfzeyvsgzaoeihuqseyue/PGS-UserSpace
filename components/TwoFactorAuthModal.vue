<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
      <h3 class="text-2xl font-bold mb-4 text-center">Vérification en deux étapes</h3>
      <p class="text-gray-700 mb-6 text-center">
        {{ method === 'email'
          ? 'Un code a été envoyé à votre adresse email.'
          : 'Utilisez votre application d\'authentification pour obtenir le code.'
        }}
      </p>

      <!-- Message si un nouveau code a été envoyé -->
      <div v-if="newCodeSent" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-800 text-sm flex items-center">
          <IconCircleCheck class="w-5 h-5 mr-2" />
          Un nouveau code a été envoyé à votre email.
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="twoFactorCode" class="block font-medium mb-1">
            Code 2FA <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input id="twoFactorCode" v-model="twoFactorCode" type="text" maxlength="6"
              class="w-full rounded-lg border px-3 py-2 pl-10 focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': error }" required @input="cleanTwoFactorCode" />
            <span class="absolute left-3 top-1/2 -translate-y-1/2">
              <IconKey class="h-5 w-5" />
            </span>
          </div>
          <p v-if="error" class="text-red-600 text-sm mt-1">{{ error }}</p>
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-primary hover:bg-secondary disabled:opacity-80 text-white font-bold py-3 rounded-xl">
          <span v-if="loading" class="animate-spin inline-block mr-2">
            <IconLoaderQuarter class="w-5 h-5 text-white" />
          </span>
          {{ loading ? 'Vérification en cours...' : 'Vérifier le code' }}
        </button>
      </form>

      <!-- Bouton pour renvoyer le code -->
      <div v-if="method === 'email'" class="mt-4 text-center">
        <button @click="handleRequestNewCode" type="button" class="text-primary hover:underline text-sm"
          :disabled="loading || requestingNewCode">
          {{ requestingNewCode ? 'Envoi en cours...' : 'Renvoyer le code' }}
        </button>
      </div>

      <p class="mt-4 text-center text-sm">
        <button @click="handleCancel" type="button" class="text-gray-600 hover:text-gray-800">
          Annuler
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IconKey, IconLoaderQuarter, IconCircleCheck } from '@tabler/icons-vue';

const props = defineProps<{
  isVisible: boolean;
  method: 'email' | 'app' | null;
  loading: boolean;
  errorMessage: string | null;
  newCodeSent?: boolean; // ✅ Nouveau prop
}>();

const emit = defineEmits(['submit', 'cancel', 'update:errorMessage', 'request-new-code']);

const twoFactorCode = ref('');
const error = ref<string | null>(null);
const requestingNewCode = ref(false);

watch(() => props.errorMessage, (newVal) => {
  error.value = newVal;
});

watch(() => props.newCodeSent, (newVal) => {
  if (newVal) {
    // Réinitialiser après 3 secondes
    setTimeout(() => {
      // Le parent doit gérer la réinitialisation de newCodeSent
    }, 3000);
  }
});

function cleanTwoFactorCode() {
  twoFactorCode.value = twoFactorCode.value.replace(/[^0-9]/g, '');
  if (error.value) {
    error.value = null;
    emit('update:errorMessage', null);
  }
}

function handleSubmit() {
  if (!twoFactorCode.value.trim()) {
    error.value = 'Le code 2FA est requis.';
    return;
  }
  emit('submit', twoFactorCode.value);
}

// ✅ CORRECTION: Émettre un événement pour demander un nouveau code
function handleRequestNewCode() {
  requestingNewCode.value = true;
  emit('request-new-code');
  // Le parent doit gérer la requête et réinitialiser requestingNewCode
  setTimeout(() => {
    requestingNewCode.value = false;
  }, 2000);
}

function handleCancel() {
  twoFactorCode.value = '';
  error.value = null;
  emit('cancel');
}

watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    twoFactorCode.value = '';
    error.value = null;
    emit('update:errorMessage', null);
  }
});
</script>
