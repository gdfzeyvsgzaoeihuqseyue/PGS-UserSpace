<template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="flex items-center mb-6">
      <button @click="router.back()" class="p-2 mr-3 text-gray-600 hover:text-gray-900 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
        <IconArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="text-3xl font-bold text-gray-900">Toutes les sessions actives</h1>
    </div>

    <p v-if="activeSessions.length === 0" class="text-gray-600 text-center py-10">
      Aucune session active trouvée.
    </p>
    <div v-else class="space-y-4">
      <SessionCard
        v-for="session in activeSessions"
        :key="session.id"
        :session="session"
        @endSession="handleEndSession"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IconArrowLeft } from '@tabler/icons-vue';
import { SessionCard } from '@/components/Security'

const router = useRouter();

// Données de maquette pour toutes les sessions (devraient idéalement venir d'un store ou d'une API)
const activeSessions = ref([
  { id: 'current', device: 'Chrome sur Windows', location: 'Cotonou, Bénin', time: 'Il y a 2 minutes', isCurrent: true, deviceType: 'desktop' },
  { id: 'session-1', device: 'Firefox sur macOS', location: 'Paris, France', time: 'Il y a 3 jours', isCurrent: false, deviceType: 'desktop' },
  { id: 'session-2', device: 'Safari sur iPhone', location: 'New York, USA', time: 'Il y a 1 semaine', isCurrent: false, deviceType: 'mobile' },
  { id: 'session-3', device: 'Android App', location: 'Berlin, Allemagne', time: 'Il y a 2 semaines', isCurrent: false, deviceType: 'mobile' },
  { id: 'session-4', device: 'Edge sur Windows', location: 'Londres, UK', time: 'Il y a 1 mois', isCurrent: false, deviceType: 'desktop' },
  { id: 'session-5', device: 'iPad App', location: 'Tokyo, Japon', time: 'Il y a 2 mois', isCurrent: false, deviceType: 'tablet' },
  { id: 'session-6', device: 'Chrome sur Linux', location: 'Montréal, Canada', time: 'Il y a 3 mois', isCurrent: false, deviceType: 'desktop' },
  { id: 'session-7', device: 'Firefox sur Android', location: 'Sydney, Australie', time: 'Il y a 4 mois', isCurrent: false, deviceType: 'mobile' },
]);

const handleEndSession = (sessionId) => {
  if (confirm(`Voulez-vous vraiment déconnecter la session ${sessionId}?`)) {
    console.log(`Déconnexion de la session : ${sessionId}`);
    // Simuler la suppression de la session
    activeSessions.value = activeSessions.value.filter(session => session.id !== sessionId);
    alert(`Session ${sessionId} déconnectée (simulé).`);
  }
};

// SEO
useHead({
  title: 'Toutes les sessions'
});
</script>
