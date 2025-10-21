<template>
  <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
    <div class="flex items-center">
      <!-- Icône basée sur l'action -->
      <component :is="getActionIcon(log.type)" class="w-5 h-5 text-blue-600 mr-3" />
      <div>
        <p class="font-medium text-gray-900">{{ log.action }}</p>
        <p class="text-sm text-gray-600">{{ log.date }} • IP: {{ log.ip }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconLogin, IconAlertTriangle, IconKey, IconUser, IconSettings, IconCircleCheck,  IconCircleX,  IconInfoCircle } from '@tabler/icons-vue';

const props = defineProps({
  log: {
    type: Object,
    required: true,
    validator: (value) => {
      return 'id' in value && 'action' in value && 'date' in value && 'ip' in value && 'type' in value;
    },
  },
});

// Fonction pour choisir l'icône en fonction du type d'action
const getActionIcon = (logType) => {
  switch (logType) {
    case 'login_success':
      return IconLogin;
    case 'login_fail':
      return IconAlertTriangle;
    case 'password_change':
      return IconKey;
    case 'profile_update':
      return IconUser;
    case '2fa_enable':
    case '2fa_disable':
      return IconSettings;
    case 'email_verify':
      return IconCircleCheck;
    default:
      return IconInfoCircle;
  }
};
</script>
