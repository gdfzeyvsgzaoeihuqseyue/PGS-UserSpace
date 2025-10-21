<template>
  <div :class="[
    'flex items-center justify-between p-4 border rounded-lg',
    session.isCurrent ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:bg-gray-50 transition-colors'
  ]">
    <div class="flex items-center">
      <!-- Icône basée sur le type d'appareil -->
      <component :is="getDeviceIcon(session.deviceType)" class="w-6 h-6 text-gray-600 mr-3" />
      <div>
        <p class="font-medium text-gray-900">{{ session.device }}</p>
        <p class="text-sm text-gray-600">{{ session.location }} • {{ session.time }}</p>
      </div>
    </div>
    <div class="flex items-center space-x-3">
      <span v-if="session.isCurrent" class="text-sm text-green-700 font-medium flex items-center">
        <IconCircleFilled class="w-3 h-3 text-green-500 mr-1" /> Actuelle
      </span>
      <button v-else @click="$emit('endSession', session.id)"
        class="text-red-500 hover:text-red-700 text-sm font-medium flex items-center">
        <IconLogout class="w-4 h-4 mr-1" /> Déconnecter
      </button>
    </div>
  </div>
</template>

<script setup>
import { IconDeviceDesktop, IconDeviceMobile, IconBrandApple, IconCircleFilled, IconLogout, IconQuestionMark } from '@tabler/icons-vue';

const props = defineProps({
  session: {
    type: Object,
    required: true,
    validator: (value) => {
      return 'id' in value && 'device' in value && 'location' in value && 'time' in value && 'isCurrent' in value && 'deviceType' in value;
    },
  },
});

const emit = defineEmits(['endSession']);

// Fonction pour choisir l'icône de l'appareil
const getDeviceIcon = (deviceType) => {
  switch (deviceType) {
    case 'desktop':
      return IconDeviceDesktop;
    case 'mobile':
      return IconDeviceMobile;
    case 'tablet':
      return IconBrandApple;
    default:
      return IconQuestionMark;
  }
};
</script>
