<template>
  <div class="relative flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200">
    <h3 class="text-lg font-medium text-gray-800 mb-4">Photo de Profil</h3>
    <div class="relative w-28 h-28 mb-4">
      <img
        :src="currentPictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(userFirstName || 'Profil')}&backgroundColor=007bff,ff9900&radius=50`"
        :alt="userFirstName + ' ' + userLastName"
        class="w-full h-full rounded-full object-cover border-4 border-white shadow-md">
      <button type="button"
        class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors shadow-md"
        @click="triggerFileInput">
        <IconCamera class="w-5 h-5" />
      </button>
    </div>
    <p class="text-sm text-gray-600 mb-3 text-center">Cliquez sur l'icône ou glissez-déposez pour changer.</p>
    <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="hidden">
    <label class="inline-flex items-center text-sm text-gray-700 cursor-pointer hover:text-red-600">
      <input type="checkbox" :checked="isDeleted" @change="handleDeleteChange" class="mr-2 rounded">
      Supprimer la photo actuelle
    </label>
    <p v-if="error" class="text-red-500 text-sm mt-2 text-center">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { IconCamera } from '@tabler/icons-vue';
import { validateImageFile, compressImage } from '@/utils/fileValidation';

const props = defineProps({
  profilePictureUrl: String,
  initialProfilePictureUrl: String,
  userFirstName: String,
  userLastName: String,
});

const emit = defineEmits(['update:file', 'update:delete']);

const fileInput = ref(null);
const currentPictureUrl = ref(props.profilePictureUrl);
const isDeleted = ref(false);
const error = ref('');

// Watch for external changes to profilePictureUrl (e.g., when parent resets form)
watch(() => props.profilePictureUrl, (newUrl) => {
  currentPictureUrl.value = newUrl;
  // If the URL changes back to initial and no file is selected, reset delete flag
  if (newUrl === props.initialProfilePictureUrl && !fileInput.value?.files[0]) {
    isDeleted.value = false;
  }
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  error.value = '';

  if (file) {
    // Valider le fichier
    const validation = await validateImageFile(file);

    if (!validation.valid) {
      error.value = validation.errors.join(' ');
      event.target.value = '';
      return;
    }

    // Compresser l'image si elle est trop grande
    let processedFile = file;
    if (file.size > 1024 * 1024) { // Si > 1MB
      try {
        processedFile = await compressImage(file);
        console.log(`Image compressée: ${(file.size / 1024).toFixed(0)}KB → ${(processedFile.size / 1024).toFixed(0)}KB`);
      } catch (err) {
        console.warn('Compression failed, using original file', err);
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      currentPictureUrl.value = e.target.result;
      emit('update:file', { file: processedFile, previewUrl: e.target.result });
      isDeleted.value = false;
    };
    reader.readAsDataURL(processedFile);
  }
};

const handleDeleteChange = (event) => {
  isDeleted.value = event.target.checked;
  emit('update:delete', isDeleted.value);
  error.value = '';
  if (isDeleted.value) {
    currentPictureUrl.value = '';
    if (fileInput.value) fileInput.value.value = '';
  } else {
    currentPictureUrl.value = props.initialProfilePictureUrl;
  }
};
</script>
