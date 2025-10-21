<template>
  <div class="card">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">📦 Mes Services</h2>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="service in authStore.allServices" :key="service.name"
        class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <IconBuildingSkyscraper v-if="service.name === 'SuitOps'" class="w-6 h-6 text-blue-600" />
              <IconBook2 v-else-if="service.name === 'SkillUp'" class="w-6 h-6 text-blue-600" />
              <IconCamera v-else-if="service.name === 'Studio'" class="w-6 h-6 text-blue-600" />
              <IconShoppingCart v-else-if="service.name === 'DropShop'" class="w-6 h-6 text-blue-600" />
              <IconCube v-else class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ service.name }}</h3>
              <p class="text-sm text-gray-600">{{ service.description }}</p>
            </div>
          </div>

          <div class="flex items-center">
            <span :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              isServiceActive(service.name)
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            ]">
              {{ isServiceActive(service.name) ? '✅ Actif' : '❌ Inactif' }}
            </span>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">
            {{ isServiceActive(service.name) ? 'Service en cours d\'utilisation' : 'Service non activé' }}
          </div>

          <button @click="toggleServiceStatus(service.name)" :disabled="loading" :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            loading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' :
              isServiceActive(service.name)
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
          ]">
            {{ isServiceActive(service.name) ? 'Désactiver' : 'Activer' }}
          </button>
        </div>
      </div>
    </section>

    <section class="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-start">
        <IconInfoCircle class="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
        <div>
          <h4 class="font-semibold text-blue-900 mb-2">Besoin d'aide ?</h4>
          <p class="text-blue-800 text-sm mb-3">
            Découvrez comment tirer le meilleur parti de vos services PGS ou contactez notre équipe support.
          </p>
          <div class="flex space-x-3">
            <button class="text-blue-700 hover:text-blue-800 font-medium text-sm">
              Documentation
            </button>
            <button class="text-blue-700 hover:text-blue-800 font-medium text-sm">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
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
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

// Import des icônes Tabler spécifiques
import { IconX, IconBuildingSkyscraper, IconBook2, IconCamera, IconShoppingCart, IconInfoCircle, IconCube } from '@tabler/icons-vue';

const authStore = useAuthStore();

// États pour les messages de feedback
const loading = ref(false);
const successMessage = ref(null);
const errorMessage = ref(null);

// Initialisation des services et de l'utilisateur pour le mockup
onMounted(() => {
  if (!authStore.user) {
    authStore.user = {
      services: ['SuitOps'],
    };
  }

  // Définition des services mockups disponibles
  authStore.allServices = [
    { name: 'SuitOps', description: 'Gestion d\'entreprise complète' },
    { name: 'SkillUp', description: 'Formation et développement professionnel' },
    { name: 'Studio', description: 'Création et gestion de contenu multimédia' },
    { name: 'DropShop', description: 'Solutions e-commerce et gestion de boutique en ligne' },
    { name: 'ConnectHub', description: 'Réseautage professionnel et communication' },
    { name: 'DataInsight', description: 'Analyse de données et rapports personnalisés' },
  ];
});

// Détermine si un service est actif pour l'utilisateur courant
const isServiceActive = (serviceName) => {
  return authStore.user?.services?.includes(serviceName) || false;
};

// Gère l'activation/désactivation d'un service
const toggleServiceStatus = async (serviceName) => {
  if (loading.value) return;

  loading.value = true;
  successMessage.value = null;
  errorMessage.value = null;

  const wasActive = isServiceActive(serviceName);

  try {
    // Simuler un appel API avec un délai
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!authStore.user) {
      throw new Error('User not authenticated.');
    }

    let updatedServices = [...(authStore.user.services || [])];

    if (wasActive) {
      // Désactiver le service : le retirer du tableau
      updatedServices = updatedServices.filter(s => s !== serviceName);
    } else {
      // Activer le service : l'ajouter au tableau
      updatedServices.push(serviceName);
    }

    // Mettre à jour les services de l'utilisateur dans le store (simulation)
    authStore.user.services = updatedServices;

    successMessage.value = wasActive
      ? `${serviceName} a été désactivé avec succès.`
      : `${serviceName} a été activé avec succès.`;
  } catch (error) {
    console.error(`Erreur lors de l'activation/désactivation de ${serviceName}:`, error);
    errorMessage.value = `Une erreur est survenue pour ${serviceName}. Veuillez réessayer.`;
  } finally {
    loading.value = false;
    // Les messages disparaissent après 3 secondes
    setTimeout(() => {
      successMessage.value = null;
      errorMessage.value = null;
    }, 3000);
  }
};
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
</style>
