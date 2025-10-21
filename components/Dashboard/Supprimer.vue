<template>
  <div class="card">
    <div class="flex items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        🗑️ Supprimer un service</h2>
    </div>

    <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-start">
        <IconAlertTriangle class="w-5 h-5 text-red-600 mr-2 mt-0.5" />
        <div>
          <h3 class="font-semibold text-red-800 mb-1">Attention</h3>
          <p class="text-red-700 text-sm">
            La suppression d'un service est définitive. Toutes les données associées seront perdues.
          </p>
        </div>
      </div>
    </div>

    <div v-if="servicesActifs.length > 0">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Services activés à supprimer :</h3>

      <div class="space-y-3 mb-6">
        <div
          v-for="service in servicesActifs"
          :key="service"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center">
            <input
              :id="`service-${service}`"
              v-model="servicesToDelete"
              :value="service"
              type="checkbox"
              class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
              :disabled="loading"
            >
            <label :for="`service-${service}`" class="ml-3 flex items-center cursor-pointer">
              <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <IconBuildingSkyscraper v-if="service === 'SuitOps'" class="w-5 h-5 text-red-600" />
                <IconBook2 v-else-if="service === 'SkillUp'" class="w-5 h-5 text-red-600" />
                <IconCamera v-else-if="service === 'Studio'" class="w-5 h-5 text-red-600" />
                <IconShoppingCart v-else-if="service === 'DropShop'" class="w-5 h-5 text-red-600" />
                <IconCube v-else class="w-5 h-5 text-red-600" /> </div>
              <div>
                <p class="font-medium text-gray-900">{{ service }}</p>
                <p class="text-sm text-gray-600">{{ getServiceDescription(service) }}</p>
              </div>
            </label>
          </div>

          <span class="text-sm text-red-600 font-medium">À supprimer</span>
        </div>
      </div>

      <div v-if="servicesToDelete.length > 0" class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h4 class="font-semibold text-gray-900 mb-2">Confirmation requise</h4>
        <p class="text-gray-700 text-sm mb-3">
          Pour confirmer la suppression, veuillez taper <span class="font-mono bg-gray-200 px-1 rounded">{{ confirmationPrompt }}</span> dans le champ ci-dessous :
        </p>
        <input
          v-model="confirmationText"
          type="text"
          :placeholder="`Tapez ${confirmationPrompt}`"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          :disabled="loading"
        >
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="resetForm"
          class="btn-secondary"
          :disabled="loading"
        >
          Annuler
        </button>
        <button
          @click="deleteServices"
          :disabled="!canDelete || loading"
          :class="[
            'px-6 py-2 rounded-lg font-medium transition-colors',
            canDelete && !loading
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          Supprimer définitivement
        </button>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <IconMoodEmpty class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun service à supprimer</h3>
      <p class="text-gray-600">Vous n'avez actuellement aucun service activé.</p>
    </div>
  </div>

  <!-- Messages -->
  <section class="fixed bottom-4 left-4 z-50 space-y-2 w-[300px]">
    <div v-if="loading" class="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded" role="alert">
      <span>Mise à jour du service...</span>
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
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

// Import des icônes Tabler spécifiques
import { IconAlertTriangle, IconX, IconBuildingSkyscraper, IconBook2, IconCamera, IconShoppingCart, IconCube, IconMoodEmpty } from '@tabler/icons-vue';

const authStore = useAuthStore();

const servicesToDelete = ref([]);
const confirmationText = ref('');
const loading = ref(false);
const successMessage = ref(null);
const errorMessage = ref(null);

// Initialisation des services mockups (à supprimer ou adapter si vos services viennent d'une API)
onMounted(() => {
  // Simule l'existence de l'utilisateur et de ses services actifs
  if (!authStore.user) {
    authStore.user = {
      services: ['SuitOps', 'SkillUp'], // Exemple : SuitOps et SkillUp sont actifs par défaut
    };
  }
  // Définition des descriptions des services (peut venir du backend en réel)
  authStore.allServices = [ // Ceci est un mockup pour les descriptions
    { name: 'SuitOps', description: 'Gestion d\'entreprise complète' },
    { name: 'SkillUp', description: 'Formation et développement professionnel' },
    { name: 'Studio', description: 'Création et gestion de contenu multimédia' },
    { name: 'DropShop', description: 'Solutions e-commerce et gestion de boutique en ligne' },
  ];
});

const servicesActifs = computed(() => {
  return authStore.user?.services || [];
});

// Texte de confirmation requis
const confirmationPrompt = computed(() => {
  if (servicesToDelete.value.length === 1) {
    return `SUPPRIMER ${servicesToDelete.value[0].toUpperCase()}`;
  } else if (servicesToDelete.value.length > 1) {
    return 'SUPPRIMER SELECTION';
  }
  return 'SUPPRIMER'; 
});

// La validation du bouton "Supprimer définitivement"
const canDelete = computed(() => {
  return servicesToDelete.value.length > 0 && confirmationText.value === confirmationPrompt.value;
});

function getServiceDescription(serviceName) {
  const service = authStore.allServices.find(s => s.name === serviceName);
  return service ? service.description : 'Service PGS';
}

const deleteServices = async () => {
  if (!canDelete.value || loading.value) return;

  loading.value = true;
  successMessage.value = null;
  errorMessage.value = null;

  try {
    // Simuler un appel API avec un délai
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!authStore.user) {
      throw new Error('User not authenticated.');
    }

    let updatedServices = [...(authStore.user.services || [])];
    const servicesSuccessfullyDeleted = [];

    servicesToDelete.value.forEach(serviceToRemove => {
      const initialLength = updatedServices.length;
      updatedServices = updatedServices.filter(s => s !== serviceToRemove);
      if (updatedServices.length < initialLength) {
        servicesSuccessfullyDeleted.push(serviceToRemove);
      }
    });

    // Mettre à jour les services de l'utilisateur dans le store (simulation)
    authStore.user.services = updatedServices;

    if (servicesSuccessfullyDeleted.length > 0) {
      successMessage.value = `Les services suivants ont été supprimés : ${servicesSuccessfullyDeleted.join(', ')}.`;
    } else {
      errorMessage.value = 'Aucun service sélectionné n\'a pu être supprimé.';
    }
    resetForm();
  } catch (error) {
    console.error('Erreur lors de la suppression des services:', error);
    errorMessage.value = 'Une erreur inattendue est survenue lors de la suppression des services. Veuillez réessayer.';
  } finally {
    loading.value = false;
    setTimeout(() => {
      successMessage.value = null;
      errorMessage.value = null;
    }, 5000);
  }
};

function resetForm() {
  servicesToDelete.value = [];
  confirmationText.value = '';
}

// Réinitialiser les messages si les services actifs changent (ex: si l'utilisateur navigue et revient)
watch(servicesActifs, () => {
  resetForm();
  successMessage.value = null;
  errorMessage.value = null;
}, { deep: true }); // Utiliser deep: true pour surveiller les changements à l'intérieur du tableau
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors;
}
</style>
