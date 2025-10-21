<template>
  <div v-if="message"
    :class="[
      'p-4 rounded-lg shadow-lg flex items-center justify-between animate-fade-in-up',
      type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-800' : 'bg-red-50 border-l-4 border-red-500 text-red-800'
    ]"
    role="alert">
    <div class="flex items-center">
      <IconCircleCheck v-if="type === 'success'" class="h-6 w-6 mr-3 text-green-600" />
      <IconCircleX v-else class="h-6 w-6 mr-3 text-red-600" />
      <span class="block text-sm font-medium">{{ message }}</span>
    </div>
    <button @click="$emit('dismiss')" class="text-gray-500 hover:text-gray-700">
      <IconX class="h-5 w-5" />
    </button>
  </div>
</template>

<script setup>
import { IconCircleCheck, IconCircleX, IconX } from '@tabler/icons-vue';

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success', 
    validator: (value) => ['success', 'error'].includes(value),
  },
});

const emit = defineEmits(['dismiss']);
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out forwards;
}
</style>