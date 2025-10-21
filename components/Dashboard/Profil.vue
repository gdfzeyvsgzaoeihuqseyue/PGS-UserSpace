<template>
  <div class="relative min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <!-- <div v-if="loading" class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-10 w-10 text-blue-600 mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8RéessayerSContinuer8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <p class="text-lg text-gray-700">Mise à jour du profil...</p>
      </div>
    </div> -->

    <SkeletonLoader v-if="authStore.loading" type="profile-card" />

    <ProfileCard v-if="!modeEdition && authStore.user" :user="authStore.user" @edit-profile="toggleEditMode" />

    <EditForm v-else-if="modeEdition && authStore.user" :user="authStore.user" @submit-info="handleInfoSuccess"
      @submit-photos="handlePhotosSuccess" @success="handleInfoSuccess" @error="handleInfoError"
      @cancel-edit="cancelEdit" />

    <div class="fixed bottom-6 right-6 z-50 space-y-3 w-80">
      <NotificationToast v-if="successMessage" :message="successMessage" type="success"
        @dismiss="successMessage = null" />
      <NotificationToast v-if="errorMessage" :message="errorMessage" type="error" @dismiss="errorMessage = null" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { ProfileCard, EditForm } from '@/components/Profil';
import { NotificationToast } from '@/components/Dashboard';

const authStore = useAuthStore();
const modeEdition = ref(false);
const loading = ref(false);
const successMessage = ref(null);
const errorMessage = ref(null);

// Mode édition
const toggleEditMode = () => {
  modeEdition.value = !modeEdition.value;
  successMessage.value = null;
  errorMessage.value = null;
};

// Annuler l'édition
const cancelEdit = () => {
  modeEdition.value = false;
  successMessage.value = null;
  errorMessage.value = null;
};

// Gérer les événements
const handleInfoSuccess = (message) => {
  successMessage.value = message;
  setTimeout(() => successMessage.value = null, 5000);
};

const handleInfoError = (message) => {
  errorMessage.value = message;
  setTimeout(() => errorMessage.value = null, 5000);
};

const handlePhotosSuccess = (message) => {
  successMessage.value = message;
  setTimeout(() => successMessage.value = null, 5000);
  authStore.fetchUser();
};

// Initialisation du formulaire
onMounted(() => {
  if (!authStore.user) {
    authStore.fetchUser().catch(err => console.error("Erreur de chargement de l'utilisateur:", err));
  }
});
</script>
