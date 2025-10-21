<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 p-8">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Modifier votre Profil</h2>
      <button @click="$emit('cancel-edit')"
        class="text-gray-500 hover:text-gray-700 transition-colors flex items-center">
        <IconX class="w-5 h-5 mr-1" /> Annuler
      </button>
    </div>

    <!-- Informations personnelles -->
    <form @submit.prevent="handleSubmitInfo" class="space-y-8">
      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">Informations Personnelles</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="firstName" class="form-label">Prénom</label>
            <input id="firstName" v-model="formData.firstName" type="text" class="form-input" required>
          </div>
          <div>
            <label for="lastName" class="form-label">Nom de famille</label>
            <input id="lastName" v-model="formData.lastName" type="text" class="form-input" required>
          </div>
          <div>
            <label for="username" class="form-label">Nom d'utilisateur</label>
            <input id="username" v-model="formData.username" type="text" class="form-input">
          </div>
          <div>
            <label for="dateOfBirth" class="form-label">Date de naissance</label>
            <input id="dateOfBirth" v-model="formData.dateOfBirth" type="date" class="form-input">
          </div>
          <div>
            <label for="placeOfBirth" class="form-label">Lieu de naissance</label>
            <input id="placeOfBirth" v-model="formData.placeOfBirth" type="text" class="form-input">
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">Coordonnées</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="phoneNumber" class="form-label">Téléphone</label>
            <input id="phoneNumber" v-model="formData.phoneNumber" type="tel" class="form-input">
          </div>
          <div class="md:col-span-2">
            <label for="address" class="form-label">Adresse</label>
            <input id="address" v-model="formData.address" type="text" class="form-input">
          </div>
          <div>
            <label for="postalCode" class="form-label">Code postal</label>
            <input id="postalCode" v-model="formData.postalCode" type="text" class="form-input">
          </div>
          <div>
            <label for="city" class="form-label">Ville</label>
            <input id="city" v-model="formData.city" type="text" class="form-input">
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">Informations Professionnelles</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="jobTitle" class="form-label">Poste actuel</label>
            <input id="jobTitle" v-model="formData.jobTitle" type="text" class="form-input">
          </div>
          <div>
            <label for="company" class="form-label">Entreprise</label>
            <input id="company" v-model="formData.company" type="text" class="form-input">
          </div>
          <div class="md:col-span-2">
            <label for="skills" class="form-label">Compétences</label>
            <textarea id="skills" v-model="skillsText" rows="3" class="form-input"
              placeholder="JavaScript, Vue.js, Node.js"></textarea>
            <p class="text-xs text-gray-500 mt-1">Séparez les compétences par des virgules.</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4 pt-6 border-t border-gray-100">
        <button type="button" @click="$emit('cancel-edit')"
          class="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          Annuler
        </button>
        <button type="submit" :disabled="loadingInfo"
          class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
          {{ loadingInfo ? 'Sauvegarde...' : 'Sauvegarder les informations' }}
        </button>
      </div>
    </form>

    <!-- Photos -->
    <form @submit.prevent="handleSubmitPhotos" class="space-y-8 mt-8 pt-8 border-t border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UploadProfile :profilePictureUrl="formData.profilePictureUrl"
          :initialProfilePictureUrl="originalProfilePictureUrl" :userFirstName="user.firstName"
          :userLastName="user.lastName" @update:file="handleProfileFileUpdate" @update:delete="handleProfileDelete" />
        <UploadCover :coverPictureUrl="formData.coverPictureUrl" :initialCoverPictureUrl="originalCoverPictureUrl"
          :userName="user.username" @update:file="handleCoverFileUpdate" @update:delete="handleCoverDelete" />
      </div>

      <div class="flex justify-end space-x-4 pt-6 border-t border-gray-100">
        <button type="button" @click="resetPhotos"
          class="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          Réinitialiser
        </button>
        <button type="submit" :disabled="loadingPhotos"
          class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
          {{ loadingPhotos ? 'Sauvegarde...' : 'Mettre à jour les photos' }}
        </button>
      </div>
    </form>

    <!-- Changement d'email (dans un modal séparé) -->

    <!-- Afficher un indicateur visuel -->
    <div v-if="hasUnsavedChanges"
      class="fixed top-20 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
      <IconAlertTriangle class="w-5 h-5" />
      <span class="text-sm font-medium">Modifications non sauvegardées</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onBeforeUnmount } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { IconX, IconAlertTriangle } from '@tabler/icons-vue';
import { UploadProfile, UploadCover } from '@/components/Profil';
import { useAuthStore } from '~/stores/auth';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['submit-info', 'submit-photos', 'cancel-edit', 'success', 'error']);

const authStore = useAuthStore();
const loadingInfo = ref(false);
const loadingPhotos = ref(false);

const formData = ref({});
const skillsText = ref('');
const selectedProfileFile = ref(null);
const selectedCoverFile = ref(null);
const deleteProfilePicture = ref(false);
const deleteCoverPicture = ref(false);

const originalProfilePictureUrl = computed(() => props.user.profilePictureUrl);
const originalCoverPictureUrl = computed(() => props.user.coverPictureUrl);

// Initialiser le formulaire
const initializeFormData = () => {
  const u = props.user;
  formData.value = {
    firstName: u.firstName || '',
    lastName: u.lastName || '',
    username: u.username || '',
    phoneNumber: u.phoneNumber || '',
    dateOfBirth: u.dateOfBirth ? u.dateOfBirth.split('T')[0] : '',
    placeOfBirth: u.placeOfBirth || '',
    address: u.address || '',
    postalCode: u.postalCode || '',
    city: u.city || '',
    jobTitle: u.jobTitle || '',
    company: u.company || '',
    profilePictureUrl: u.profilePictureUrl || '',
    coverPictureUrl: u.coverPictureUrl || '',
  };
  skillsText.value = Array.isArray(u.skills) ? u.skills.join(', ') : '';
};

watch(() => props.user, initializeFormData, { immediate: true, deep: true });

// Gestion des fichiers photos
const handleProfileFileUpdate = ({ file, previewUrl }) => {
  selectedProfileFile.value = file;
  formData.value.profilePictureUrl = previewUrl;
  deleteProfilePicture.value = false;
};

const handleCoverFileUpdate = ({ file, previewUrl }) => {
  selectedCoverFile.value = file;
  formData.value.coverPictureUrl = previewUrl;
  deleteCoverPicture.value = false;
};

const handleProfileDelete = (isDeleted) => {
  deleteProfilePicture.value = isDeleted;
  if (isDeleted) {
    selectedProfileFile.value = null;
    formData.value.profilePictureUrl = '';
  } else {
    formData.value.profilePictureUrl = originalProfilePictureUrl.value;
  }
};

const handleCoverDelete = (isDeleted) => {
  deleteCoverPicture.value = isDeleted;
  if (isDeleted) {
    selectedCoverFile.value = null;
    formData.value.coverPictureUrl = '';
  } else {
    formData.value.coverPictureUrl = originalCoverPictureUrl.value;
  }
};

const resetPhotos = () => {
  selectedProfileFile.value = null;
  selectedCoverFile.value = null;
  deleteProfilePicture.value = false;
  deleteCoverPicture.value = false;
  formData.value.profilePictureUrl = originalProfilePictureUrl.value;
  formData.value.coverPictureUrl = originalCoverPictureUrl.value;
};

// Soumission pour les infos
const handleSubmitInfo = async () => {
  loadingInfo.value = true;

  try {
    // Préparer les compétences
    const skills = skillsText.value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const data = {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      username: formData.value.username,
      phoneNumber: formData.value.phoneNumber || null,
      dateOfBirth: formData.value.dateOfBirth || null,
      placeOfBirth: formData.value.placeOfBirth || null,
      address: formData.value.address || null,
      postalCode: formData.value.postalCode || null,
      city: formData.value.city || null,
      jobTitle: formData.value.jobTitle || null,
      company: formData.value.company || null,
      skills: JSON.stringify(skills),
    };

    const result = await authStore.updateUserProfileInfo(data);

    if (result.success) {
      emit('success', result.message);
    } else {
      emit('error', result.message);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations:', error);
    emit('error', 'Une erreur inattendue est survenue.');
  } finally {
    loadingInfo.value = false;
  }
};

// Soumission pour les photos
const handleSubmitPhotos = async () => {
  loadingPhotos.value = true;

  try {
    const photoFormData = new FormData();

    if (selectedProfileFile.value) {
      photoFormData.append('profilePicture', selectedProfileFile.value);
    }

    if (selectedCoverFile.value) {
      photoFormData.append('coverPicture', selectedCoverFile.value);
    }

    if (deleteProfilePicture.value) {
      photoFormData.append('deleteProfilePicture', 'true');
    }

    if (deleteCoverPicture.value) {
      photoFormData.append('deleteCoverPicture', 'true');
    }

    // Vérifier qu'il y a des changements
    if (!selectedProfileFile.value && !selectedCoverFile.value &&
      !deleteProfilePicture.value && !deleteCoverPicture.value) {
      emit('error', 'Aucune modification de photo à sauvegarder.');
      return;
    }

    const result = await authStore.updateUserProfilePhoto(photoFormData);

    if (result.success) {
      emit('success', result.message);
      resetPhotos();
    } else {
      emit('error', result.message);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des photos:', error);
    emit('error', 'Une erreur inattendue est survenue.');
  } finally {
    loadingPhotos.value = false;
  }
};

const hasUnsavedChanges = computed(() => {
  return JSON.stringify(formData.value) !== JSON.stringify(originalFormData.value);
});

// Avertir avant de quitter la page
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?');
    if (answer) {
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

// Avertir avant de fermer l'onglet
onBeforeUnmount(() => {
  if (hasUnsavedChanges.value) {
    window.onbeforeunload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
  }
});
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800;
}

.form-input:disabled {
  @apply bg-gray-100 text-gray-500 cursor-not-allowed;
}
</style>
