<template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="flex items-center mb-6">
      <button @click="router.back()" class="p-2 mr-3 text-gray-600 hover:text-gray-900 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
        <IconArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="text-3xl font-bold text-gray-900">Journal d'activité complet</h1>
    </div>

    <p v-if="activityLogs.length === 0" class="text-gray-600 text-center py-10">
      Aucune activité enregistrée.
    </p>
    <div v-else class="space-y-4">
      <ActivityLogCard
        v-for="log in activityLogs"
        :key="log.id"
        :log="log"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IconArrowLeft } from '@tabler/icons-vue';
import { ActivityLogCard} from '@/components/Security'

const router = useRouter();

// Données de maquette pour toutes les activités
const activityLogs = ref([
  { id: 1, action: 'Connexion réussie', date: '16/07/2025 à 14:30', ip: '192.168.1.1', type: 'login_success' },
  { id: 2, action: 'Tentative de connexion échouée', date: '16/07/2025 à 14:28', ip: '203.0.113.45', type: 'login_fail' },
  { id: 3, action: 'Mot de passe modifié', date: '15/04/2025 à 10:00', ip: '192.168.1.1', type: 'password_change' },
  { id: 4, action: 'Mise à jour du profil', date: '01/03/2025 à 09:15', ip: '192.168.1.1', type: 'profile_update' },
  { id: 5, action: 'Activation 2FA', date: '28/02/2025 à 11:00', ip: '192.168.1.1', type: '2fa_enable' },
  { id: 6, action: 'Vérification email', date: '25/02/2025 à 08:00', ip: '192.168.1.1', type: 'email_verify' },
  { id: 7, action: 'Déconnexion', date: '24/02/2025 à 17:00', ip: '192.168.1.1', type: 'logout' },
  { id: 8, action: 'Connexion réussie', date: '23/02/2025 à 09:00', ip: '192.168.1.5', type: 'login_success' },
  { id: 9, action: 'Changement d\'adresse IP', date: '22/02/2025 à 14:00', ip: '10.0.0.10', type: 'info' },
  { id: 10, action: 'Désactivation 2FA', date: '20/02/2025 à 16:00', ip: '192.168.1.1', type: '2fa_disable' },
]);

// SEO
useHead({
  title: 'Journal d\'activité'
});
</script>
