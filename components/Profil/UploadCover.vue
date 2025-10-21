<template>
  <div class="relative flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200">
    <h3 class="text-lg font-medium text-gray-800 mb-4">Photo de Couverture</h3>
    <div
      class="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4 border border-gray-300">
      <img
        :src="currentPictureUrl || `https://placehold.co/600x400/E0F2FE/0284C7?text=${encodeURIComponent(userName || 'Couverture')}`"
        alt="Photo de couverture" class="w-full h-full object-cover">
      <button type="button"
        class="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors shadow-md"
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

const props = defineProps({
  coverPictureUrl: String,
  initialCoverPictureUrl: String,
  userName: String, // Pass username for consistent placeholder
});

const emit = defineEmits(['update:file', 'update:delete']);

const fileInput = ref(null);
const currentPictureUrl = ref(props.coverPictureUrl);
const isDeleted = ref(false);
const error = ref('');

// Watch for external changes to coverPictureUrl (e.g., when parent resets form)
watch(() => props.coverPictureUrl, (newUrl) => {
  currentPictureUrl.value = newUrl;
  // If the URL changes back to initial and no file is selected, reset delete flag
  if (newUrl === props.initialCoverPictureUrl && !fileInput.value?.files[0]) {
    isDeleted.value = false;
  }
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  error.value = ''; // Reset error on new attempt

  if (file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxFileSize = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(file.type)) {
      error.value = `Type de fichier non valide. Seuls JPG, PNG, GIF, WEBP sont autorisés.`;
      event.target.value = ''; // Clear file input
      return;
    }
    if (file.size > maxFileSize) {
      error.value = `Le fichier est trop grand (${(file.size / (1024 * 1024)).toFixed(2)} Mo). La taille maximale est de 5 Mo.`;
      event.target.value = ''; // Clear file input
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      currentPictureUrl.value = e.target.result;
      emit('update:file', { file, previewUrl: e.target.result });
      isDeleted.value = false; // If a new file is selected, it's not deleted
    };
    reader.readAsDataURL(file);
  } else {
    // If file input is cleared (e.g., user cancels dialog)
    currentPictureUrl.value = props.initialCoverPictureUrl; // Revert to original
    emit('update:file', { file: null, previewUrl: props.initialCoverPictureUrl });
    isDeleted.value = false; // Ensure delete is not checked
  }
};

const handleDeleteChange = (event) => {
  isDeleted.value = event.target.checked;
  emit('update:delete', isDeleted.value);
  error.value = ''; // Reset error
  if (isDeleted.value) {
    currentPictureUrl.value = ''; // Clear preview if marked for deletion
    if (fileInput.value) fileInput.value.value = ''; // Clear file input
  } else {
    currentPictureUrl.value = props.initialCoverPictureUrl; // Restore original preview
  }
};
</script>
