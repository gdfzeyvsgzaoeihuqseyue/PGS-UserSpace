<template>
  <div class="space-y-6">
    <div class="card">
      <div class="flex items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          🔒 Confidentialité et données</h2>
      </div>

      <p class="text-gray-600 mb-6">
        Contrôlez la façon dont vos données sont utilisées et partagées sur la plateforme PGS.
      </p>

      <div class="space-y-6">
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 class="font-semibold text-gray-900">Profil public</h3>
            <p class="text-sm text-gray-600">Permettre aux autres utilisateurs de voir votre profil</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              :checked="profilPublic"
              @change="handlePrivacyChange('profilPublic', $event.target.checked)"
              type="checkbox"
              class="sr-only peer"
              :disabled="loading"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Gestion de vos données</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button @click="handleDownloadData" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
          <div class="flex items-center mb-2">
            <IconDownload class="w-5 h-5 text-blue-600 mr-2" />
            <span class="font-medium text-gray-900">Télécharger mes données</span>
          </div>
          <p class="text-sm text-gray-600">Obtenez une copie de toutes vos données</p>
        </button>

        <button @click="handleCheckData" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
          <div class="flex items-center mb-2">
            <IconUserScreen class="w-5 h-5 text-green-600 mr-2" />
            <span class="font-medium text-gray-900">Vérifier mes données</span>
          </div>
          <p class="text-sm text-gray-600">Consultez les données que nous avons sur vous</p>
        </button>

        <button @click="handleDeleteData" class="p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-left">
          <div class="flex items-center mb-2">
            <IconTrash class="w-5 h-5 text-red-600 mr-2" />
            <span class="font-medium text-red-900">Supprimer mes données</span>
          </div>
          <p class="text-sm text-red-600">Supprimez définitivement toutes vos données</p>
        </button>

        <button @click="handleViewPrivacyPolicy" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
          <div class="flex items-center mb-2">
            <IconClipboardText class="w-5 h-5 text-purple-600 mr-2" />
            <span class="font-medium text-gray-900">Politique de confidentialité</span>
          </div>
          <p class="text-sm text-gray-600">Consultez notre politique de confidentialité</p>
        </button>
      </div>
    </div>
  </div>


  <!-- Messages -->
  <section class="fixed bottom-4 left-4 z-50 space-y-2 w-[300px]">
    <div v-if="loading" class="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded" role="alert">
      <span>Mise à jour des paramètres...</span>
    </div>

    <div v-if="successMessage" class="p-4 bg-green-100 border border-green-400 text-green-700 rounded relative"
      role="alert">
      <span class="block sm:inline">{{ successMessage }}</span>
      <span @click="successMessage = null" class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer">
        <IconX class="h-6 w-6 text-green-500" />
      </span>
    </div>

    <div v-if="errorMessage" class="p-4 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
      <span class="block sm:inline">{{ errorMessage }}</span>
      <span @click="errorMessage = null" class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer">
        <IconX class="h-6 w-6 text-red-500" />
      </span>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { IconX, IconDownload, IconUserScreen,   IconTrash, IconClipboardText } from '@tabler/icons-vue';

const authStore = useAuthStore();

// Variables réactives
const loading = ref(false);
const successMessage = ref(null);
const errorMessage = ref(null);

const profilPublic = ref(
  authStore.user?.privacySettings?.profilPublic ?? false
);

// Watcher pour synchroniser les paramètres locaux
watch(() => authStore.user?.privacySettings?.profilPublic, (newValue) => {
  profilPublic.value = newValue ?? false;
}, { immediate: true });

// Fonction pour gérer le changement de chaque paramètre de confidentialité
const handlePrivacyChange = async (value) => {
  loading.value = true;
  successMessage.value = null;
  errorMessage.value = null;

  try {
    const newSettings = { ...authStore.user?.privacySettings, profilPublic: value };
    await authStore.updatePrivacySettings(newSettings);
    profilPublic.value = value;

    successMessage.value = 'Paramètre de confidentialité mis à jour avec succès !';
    setTimeout(() => successMessage.value = null, 3000);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de profilPublic :', error);
    errorMessage.value = 'Échec de la mise à jour. Veuillez réessayer.';
    profilPublic.value = authStore.user?.privacySettings?.profilPublic ?? !value;
    setTimeout(() => errorMessage.value = null, 5000);
  } finally {
    loading.value = false;
  }
};

// --- Fonctions factices pour la gestion des données ---
const handleDownloadData = () => {
  alert('Fonctionnalité "Télécharger mes données" à implémenter. Un fichier JSON/CSV serait généré.');
  console.log('Demande de téléchargement des données');
};

const handleCheckData = () => {
  alert('Fonctionnalité "Vérifier mes données" à implémenter. Affichage détaillé des données utilisateur.');
  console.log('Demande de vérification des données');
};

const handleDeleteData = () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer définitivement toutes vos données ? Cette action est irréversible.')) {
    alert('Fonctionnalité "Supprimer mes données" à implémenter. Nécessite une confirmation forte et une logique backend.');
    console.log('Demande de suppression des données');
  }
};

const handleViewPrivacyPolicy = () => {
  window.open('/privacy-policy', '_blank'); 
};
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style>
