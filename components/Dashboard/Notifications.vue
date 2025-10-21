<template>
  <div class="space-y-6">
    <div class="card">
      <div class="flex items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          🔔 Notifications</h2>
      </div>

      <p class="text-gray-600 mb-6">
        Gérez vos préférences de notification pour rester informé de ce qui vous intéresse.
      </p>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 class="font-semibold text-gray-900">Notifications par email</h3>
            <p class="text-sm text-gray-600">Recevoir des notifications importantes par email</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input :checked="localNotificationSettings.email"
              @change="handleNotificationChange('email', $event.target.checked)" type="checkbox" class="sr-only peer"
              :disabled="loading">
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
            </div>
          </label>
        </div>

        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 class="font-semibold text-gray-900">Notifications SMS</h3>
            <p class="text-sm text-gray-600">Recevoir des alertes urgentes par SMS</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input :checked="localNotificationSettings.sms"
              @change="handleNotificationChange('sms', $event.target.checked)" type="checkbox" class="sr-only peer"
              :disabled="loading">
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
            </div>
          </label>
        </div>

        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 class="font-semibold text-gray-900">Notifications push</h3>
            <p class="text-sm text-gray-600">Recevoir des notifications sur vos appareils</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input :checked="localNotificationSettings.push"
              @change="handleNotificationChange('push', $event.target.checked)" type="checkbox" class="sr-only peer"
              :disabled="loading">
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
            </div>
          </label>
        </div>

        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 class="font-semibold text-gray-900">Toutes les notifications</h3>
            <p class="text-sm text-gray-600">Configugurer toutes les options</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input :checked="localNotificationSettings.push"
              @change="handleNotificationChange('push', $event.target.checked)" type="checkbox" class="sr-only peer"
              :disabled="loading">
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
            </div>
          </label>
        </div>
      </section>
    </div>

    <section class="card">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Types de notifications</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Sécurité du compte -->
        <div class="p-4 border border-gray-200 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium text-gray-900">Sécurité du compte</h4>
            <label class="relative inline-flex items-center cursor-pointer">
              <input :checked="localNotificationTypes.security"
                @change="handleNotificationTypeChange('security', $event.target.checked)" type="checkbox"
                class="sr-only peer" :disabled="loading">
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
              </div>
            </label>
          </div>
          <p class="text-sm text-gray-600">Connexions suspectes, changements de mot de passe, etc.</p>
        </div>

        <!-- Facturation -->
        <div class="p-4 border border-gray-200 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium text-gray-900">Facturation</h4>
            <label class="relative inline-flex items-center cursor-pointer">
              <input :checked="localNotificationTypes.billing"
                @change="handleNotificationTypeChange('billing', $event.target.checked)" type="checkbox"
                class="sr-only peer" :disabled="loading">
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
              </div>
            </label>
          </div>
          <p class="text-sm text-gray-600">Factures, paiements, renouvellements d'abonnement</p>
        </div>

        <!-- Mises à jour de services -->
        <div class="p-4 border border-gray-200 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium text-gray-900">Mises à jour de services</h4>
            <label class="relative inline-flex items-center cursor-pointer">
              <input :checked="localNotificationTypes.serviceUpdates"
                @change="handleNotificationTypeChange('serviceUpdates', $event.target.checked)" type="checkbox"
                class="sr-only peer" :disabled="loading">
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
              </div>
            </label>
          </div>
          <p class="text-sm text-gray-600">Nouvelles fonctionnalités, maintenance programmée</p>
        </div>

        <!-- Promotionet marketin -->
        <div class="p-4 border border-gray-200 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium text-gray-900">Promotion et marketing</h4>
            <label class="relative inline-flex items-center cursor-pointer">
              <input :checked="localNotificationTypes.marketing"
                @change="handleNotificationTypeChange('marketing', $event.target.checked)" type="checkbox"
                class="sr-only peer" :disabled="loading">
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
              </div>
            </label>
          </div>
          <p class="text-sm text-gray-600">Recevoir des informations sur nos nouveautés et offres</p>
        </div>
      </div>
    </section>
  </div>

  <!-- Messages -->
  <section class="fixed bottom-4 left-4 z-50 space-y-2 w-[300px]">
    <div v-if="loading" class="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded" role="alert">
      <span>Mise à jour des préférences...</span>
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
import { IconX } from '@tabler/icons-vue';

const authStore = useAuthStore();

// États pour les messages de feedback
const loading = ref(false);
const successMessage = ref(null);
const errorMessage = ref(null);

// Copie locale des préférences de notification générales
const localNotificationSettings = ref({
  email: authStore.user?.notificationSettings?.email ?? true,
  sms: authStore.user?.notificationSettings?.sms ?? false,
  push: authStore.user?.notificationSettings?.push ?? true,
});

// Copie locale des préférences de type de notification
const localNotificationTypes = ref({
  security: authStore.user?.notificationTypes?.security ?? true,
  billing: authStore.user?.notificationTypes?.billing ?? true,
  serviceUpdates: authStore.user?.notificationTypes?.serviceUpdates ?? true, 
  marketing: authStore.user?.notificationTypes?.marketing ?? true, 
});


// Watcher pour synchroniser les paramètres locaux avec le store si authStore.user.notificationSettings change
watch(() => authStore.user?.notificationSettings, (newSettings) => {
  if (newSettings) {
    localNotificationSettings.value = {
      email: newSettings.email ?? true,
      sms: newSettings.sms ?? false,
      push: newSettings.push ?? true,
    };
  }
}, { immediate: true });

// Watcher pour synchroniser les types de notifications locaux avec le store
watch(() => authStore.user?.notificationTypes, (newTypes) => {
  if (newTypes) {
    localNotificationTypes.value = {
      security: newTypes.security ?? true,
      billing: newTypes.billing ?? true,
      serviceUpdates: newTypes.serviceUpdates ?? true,
      marketing: newTypes.marketing ?? true,
    };
  }
}, { immediate: true });


// Fonction pour gérer le changement de chaque paramètre de notification générale
const handleNotificationChange = async (settingKey, value) => {
  loading.value = true;
  successMessage.value = null;
  errorMessage.value = null;

  try {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mettre à jour l'état local
    localNotificationSettings.value[settingKey] = value;

    // Simuler la mise à jour dans le store (vous remplacerez ceci par un appel API réel)
    if (authStore.user) {
      authStore.user.notificationSettings = {
        ...authStore.user.notificationSettings,
        [settingKey]: value
      };
    }

    successMessage.value = 'Préférences de notification mises à jour avec succès !';
    setTimeout(() => successMessage.value = null, 3000);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de ${settingKey}:`, error);
    errorMessage.value = `Échec de la mise à jour de "${settingKey}". Veuillez réessayer.`;
    // Revert the checkbox if an error occurs
    localNotificationSettings.value[settingKey] = !value;
    setTimeout(() => errorMessage.value = null, 5000);
  } finally {
    loading.value = false;
  }
};

// Fonction pour gérer le changement de chaque type de notification
const handleNotificationTypeChange = async (typeKey, value) => {
  loading.value = true;
  successMessage.value = null;
  errorMessage.value = null;

  try {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mettre à jour l'état local
    localNotificationTypes.value[typeKey] = value;

    // Simuler la mise à jour dans le store (vous remplacerez ceci par un appel API réel)
    if (authStore.user) {
      authStore.user.notificationTypes = {
        ...authStore.user.notificationTypes,
        [typeKey]: value
      };
    }

    successMessage.value = `Type de notification "${typeKey}" mis à jour avec succès !`;
    setTimeout(() => successMessage.value = null, 3000);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du type de notification ${typeKey}:`, error);
    errorMessage.value = `Échec de la mise à jour du type de notification "${typeKey}". Veuillez réessayer.`;
    // Revert the checkbox if an error occurs
    localNotificationTypes.value[typeKey] = !value;
    setTimeout(() => errorMessage.value = null, 5000);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

.check {
  /* @apply w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 */
}
</style>
