<template>
  <div class="space-y-6">
    <div class="card">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
       🔐 Paramètres de sécurité
      </h2>

      <section class="space-y-6">
        <!-- Mot de passe -->
        <div class="pb-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Mot de passe</h3>
              <p class="text-gray-600">Dernière modification : <span class="font-medium">Il y a 3 mois (mock)</span></p>
            </div>
            <button @click="handleChangePassword" class="btn-primary">
              Changer le mot de passe
            </button>
          </div>
        </div>

        <!-- Authentification à deux facteurs (2FA) -->
        <div class="pb-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Authentification à deux facteurs (2FA)</h3>
              <p class="text-gray-600">
                Sécurisez davantage votre compte. Actuellement :
                <span
                  :class="{ 'text-green-600 font-semibold': authStore.isTwoFactorActiveGlobally, 'text-red-600 font-semibold': !authStore.isTwoFactorActiveGlobally }">
                  {{ authStore.isTwoFactorActiveGlobally ? 'Activé' : 'Désactivé' }}
                </span>
                <span v-if="authStore.isTwoFactorTemporarilyDisabled" class="text-yellow-600 text-sm italic">
                  (Temporairement désactivé)</span>
                <span v-if="authStore.twoFactorNeedsAppConfiguration" class="text-blue-600 text-sm italic">
                  (Configuration requise)</span>
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input :checked="authStore.user?.twoFactorEnabled" @change="handleTwoFactorToggle" type="checkbox"
                class="sr-only peer" :disabled="loadingTwoFactor">
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
              </div>
            </label>
          </div>
          <div v-if="loadingTwoFactor" class="text-blue-600 text-sm mt-2">Mise à jour 2FA...</div>
          <div v-if="twoFactorError" class="text-red-600 text-sm mt-2">{{ twoFactorError }}</div>
          <div v-if="twoFactorSuccess" class="text-green-600 text-sm mt-2">{{ twoFactorSuccess }}</div>

          <div
            v-if="authStore.user?.twoFactorEnabled && !authStore.user?.twoFactorSecretConfigured && !authStore.user?.twoFactorTemporarilyDisabled"
            class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            Votre authentification à deux facteurs est activée mais nécessite une configuration via l'application.
            Veuillez vous rendre dans la section "Configuration 2FA" pour finaliser.
            <button @click="navigateTo('/#2fa-setup')" class="text-blue-600 hover:underline ml-2">Configurer
              now</button>
          </div>
        </div>

        <!-- Paramètres de sécurité additionnels -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900">Notifications de sécurité</p>
              <p class="text-sm text-gray-600">Recevoir des alertes pour les activités suspectes</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="securityNotifications" type="checkbox" class="sr-only peer"
                @change="handleSecurityNotificationsChange">
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
              </div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900">Déconnexion automatique</p>
              <p class="text-sm text-gray-600">Se déconnecter après 30 minutes d'inactivité</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="autoLogout" type="checkbox" class="sr-only peer" @change="handleAutoLogoutChange">
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
              </div>
            </label>
          </div>
        </div>
      </section>
    </div>

    <!-- Sessions actives -->
    <section class="card">
      <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <IconDevices class="w-7 h-7 text-gray-700 mr-2" /> Sessions actives
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SessionCard v-for="session in recentSessions" :key="session.id" :session="session"
          @endSession="handleEndSession" />
      </div>

      <div v-if="activeSessions.length > 4" class="mt-4 text-center">
        <button class="text-blue-600 hover:text-blue-700 font-medium" @click="handleViewAllSessions">
          Voir toutes les sessions
        </button>
      </div>
    </section>

    <!-- Journal d'activité récente -->
    <section class="card">
      <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <IconListDetails class="w-7 h-7 text-gray-700 mr-2" /> Journal d'activité récente
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivityLogCard v-for="log in recentActivityLogs" :key="log.id" :log="log" />
      </div>

      <div v-if="activityLogs.length > 4" class="mt-4 text-center">
        <button class="text-blue-600 hover:text-blue-700 font-medium" @click="handleViewAllActivity">
          Voir tout le journal d'activité
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router'; 
import { useAuthStore } from '~/stores/auth';
import { SessionCard, ActivityLogCard} from '@/components/Security'
import { IconDevices, IconListDetails } from '@tabler/icons-vue';

const router = useRouter(); 

const authStore = useAuthStore();

// --- 2FA Logic ---
const loadingTwoFactor = ref(false);
const twoFactorError = ref(null);
const twoFactorSuccess = ref(null);

const handleTwoFactorToggle = async (event) => {
  const isChecked = event.target.checked;
  loadingTwoFactor.value = true;
  twoFactorError.value = null;
  twoFactorSuccess.value = null;

  try {
    if (isChecked) {
      const response = await authStore.enableTwoFactor();
      if (response.success) {
        if (response.requiresTwoFactor) {
          twoFactorSuccess.value = '2FA activé. Veuillez configurer votre application d\'authentification.';
        } else {
          twoFactorSuccess.value = 'Authentification à deux facteurs activée avec succès !';
        }
      } else {
        throw new Error(response.message || 'Échec de l\'activation du 2FA.');
      }

    } else {
      const password = prompt('Veuillez saisir votre mot de passe pour désactiver le 2FA :');
      if (!password) {
        event.target.checked = !isChecked;
        loadingTwoFactor.value = false;
        return;
      }
      const response = await authStore.disableTwoFactor(password);
      if (response.success) {
        twoFactorSuccess.value = 'Authentification à deux facteurs désactivée.';
      } else {
        throw new Error(response.message || 'Échec de la désactivation du 2FA.');
      }
    }
  } catch (err) {
    twoFactorError.value = err.message || 'Une erreur est survenue lors de la mise à jour du 2FA.';
    event.target.checked = !isChecked; 
  } finally {
    loadingTwoFactor.value = false;
  }
};

// --- Password Change (Mockup) ---
const handleChangePassword = () => {
  alert('Fonctionnalité de changement de mot de passe à implémenter (modale ou redirection).');
};

// --- Active Sessions (Mockup Data) ---
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

const recentSessions = computed(() => activeSessions.value.slice(0, 4));

const handleEndSession = (sessionId) => {
  if (confirm(`Voulez-vous vraiment déconnecter la session ${sessionId}?`)) {
    console.log(`Déconnexion de la session : ${sessionId}`);
    activeSessions.value = activeSessions.value.filter(session => session.id !== sessionId);
    alert(`Session ${sessionId} déconnectée (simulé).`);
  }
};

const handleViewAllSessions = () => {
  router.push('/settings/sessions'); 
};

// --- Activity Log (Mockup Data) ---
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

const recentActivityLogs = computed(() => activityLogs.value.slice(0, 4));

const handleViewAllActivity = () => {
  router.push('/settings/activity-log'); 
};

// --- Security Settings (Mockup Data) ---
const securityNotifications = ref(true);
const autoLogout = ref(true);

const handleSecurityNotificationsChange = (event) => {
  const isChecked = event.target.checked;
  console.log(`Notifications de sécurité : ${isChecked ? 'Activées' : 'Désactivées'} (simulé)`);
  alert(`Notifications de sécurité ${isChecked ? 'activées' : 'désactivées'} (simulé).`);
};

const handleAutoLogoutChange = (event) => {
  const isChecked = event.target.checked;
  console.log(`Déconnexion automatique : ${isChecked ? 'Activée' : 'Désactivée'} (simulé)`);
  alert(`Déconnexion automatique ${isChecked ? 'activée' : 'désactivée'} (simulé).`);
};

// Watcher pour réagir aux changements de l'état 2FA du store
watch(() => authStore.user, (newUser) => {
  if (!newUser) {
    twoFactorSuccess.value = null;
    twoFactorError.value = null;
  }
}, { immediate: true });
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors;
}
</style>
