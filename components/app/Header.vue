<template>
  <header class="bg-white shadow-md border-b border-gray-200 fixed w-full top-0 left-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <button @click="emit('toggle-mobile-sidebar')"
          class="lg:hidden p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 rounded-md transition-colors duration-200 header-toggle-button">
          <IconX v-if="isMobileSidebarOpen" class="w-6 h-6" />
          <IconMenu2 v-else class="w-6 h-6" />
        </button>
        <h1 class="text-xl font-semibold text-gray-900 uppercase">{{ pageTitle }}</h1>
      </div>

      <div class="flex items-center space-x-4 sm:space-x-6">
        <div class="relative notification-dropdown-trigger">
          <button @click="toggleNotifications"
            class="p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 rounded-md transition-colors duration-200">
            <IconBell class="w-6 h-6" />
            <span v-if="unreadNotificationsCount > 0"
              class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {{ unreadNotificationsCount }}
            </span>
          </button>

          <div v-if="showNotificationsDropdown"
            class="notification-dropdown-content absolute right-0 mt-3 w-80 max-w-xs bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right transition-all duration-200 ease-out animate-fade-in-down"
            @click.stop>
            <div class="px-4 py-3 text-lg font-semibold text-gray-800 border-b border-gray-100">Notifications</div>
            <ul class="max-h-72 overflow-y-auto divide-y divide-gray-100">
              <li v-if="latestNotifications.length === 0" class="px-4 py-3 text-sm text-gray-500">
                Aucune nouvelle notification.
              </li>
              <li v-for="notification in latestNotifications" :key="notification.id">
                <a href="#" class="block px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                  @click.prevent="markNotificationAsRead(notification.id)">
                  <p class="font-medium text-gray-800" :class="{ 'text-gray-500': notification.read }">{{
                    notification.message }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
                </a>
              </li>
            </ul>
            <div class="border-t border-gray-100">
              <button @click="goToNotificationsPage"
                class="block w-full text-center px-4 py-3 text-sm font-medium text-blue-600 hover:bg-gray-50 rounded-b-lg transition-colors duration-150">
                Voir toutes les notifications
              </button>
            </div>
          </div>
        </div>

        <div class="hidden sm:block text-right">
          <p class="text-sm font-medium text-gray-900">
            {{ greetingMessage }}, <span class="font-semibold text-primary">{{ authStore.user?.firstName }}</span>
          </p>
          <p class="text-xs text-gray-500 capitalize">
            Compte <span class="font-medium text-secondary">{{ authStore.user?.status }}</span>
          </p>
        </div>
        <img :src="profilePictureUrl" :alt="`Photo de profil de ${authStore.user?.firstName}`"
          class="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm flex-shrink-0">

        <button @click="openLogoutModal"
          class="p-2 text-gray-600 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 rounded-md transition-colors duration-200"
          title="Se déconnecter">
          <IconLogout class="w-6 h-6" />
        </button>
      </div>


      <div v-if="showLogoutModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        @click.self="cancelLogout">
        <div
          class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm transform transition-all duration-300 ease-out animate-scale-in">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <IconAlertTriangle class="h-6 w-6 text-red-600" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Confirmer la déconnexion</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
              </p>
            </div>
          </div>
          <div class="mt-5 sm:mt-6 flex justify-end space-x-3">
            <button type="button" @click="cancelLogout"
              class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm transition-colors duration-200">
              Annuler
            </button>
            <button type="button" @click="confirmLogout"
              class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm transition-colors duration-200">
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { ref, onMounted, computed, watch } from 'vue';
import { IconMenu2, IconBell, IconLogout, IconX, IconAlertTriangle } from '@tabler/icons-vue';

const props = defineProps({
  activeTab: String,
  isMobileSidebarOpen: Boolean,
});

const emit = defineEmits(['toggle-mobile-sidebar']);
const showLogoutModal = ref(false);
const isMobile = ref(false);

const authStore = useAuthStore();
const showNotificationsDropdown = ref(false);

// Notification Mock Data
const mockNotifications = ref([
  { id: 1, message: 'Votre service SuitOps a été activé.', time: 'il y a 5 min', read: false },
  { id: 2, message: 'Nouvelle mise à jour disponible pour SkillUp.', time: 'il y a 30 min', read: false },
  { id: 3, message: 'Sauvegarde automatique terminée avec succès.', time: 'il y a 1 heure', read: true },
  { id: 4, message: 'Connexion depuis un nouvel appareil détectée.', time: 'il y a 2 heures', read: false },
  { id: 5, message: 'Votre abonnement expire dans 7 jours.', time: 'hier', read: true },
  { id: 6, message: 'Bienvenue sur PGS Mon Compte !', time: 'il y a 3 jours', read: true },
]);

const latestNotifications = computed(() => {
  return mockNotifications.value.slice(0, 5);
});

const unreadNotificationsCount = computed(() => {
  return mockNotifications.value.filter(n => !n.read).length;
});

const markNotificationAsRead = (id) => {
  const notification = mockNotifications.value.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
};

const toggleNotifications = () => {
  showNotificationsDropdown.value = !showNotificationsDropdown.value;
};

const goToNotificationsPage = () => {
  showNotificationsDropdown.value = false;
};

const greetingMessage = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Bonjour';
  if (hour >= 12 && hour < 17) return 'Bon après-midi';
  if (hour >= 17 && hour < 20) return 'Bonsoir';
  return 'Belle soirée';
});

// Map activeTab to a more readable title
const pageTitle = computed(() => {
  switch (props.activeTab) {
    case 'profil': return 'Mon profil';
    case 'securite': return 'Sécurité';
    case 'confidentialite': return 'Confidentialité';
    case 'notifications': return 'Notifications';
    case 'services': return 'Mes services';
    case 'supprimer': return 'Supprimer un service';
    default: return 'Tableau de bord';
  }
});

// Avatar (Assurez-vous que 'authStore.user' est bien peuplé)
const profilePictureUrl = computed(() => {
  const user = authStore.user;
  if (user && user.profilePictureUrl) {
    return user.profilePictureUrl;
  }
  const name = user?.firstName || 'Utilisateur'; // Fallback for name
  return `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=007bff,ff9900&radius=50`;
});

// Emit event to parent to open logout modal
const openLogoutModa = () => {
  // Assuming index.vue will catch this event and show the modal
  window.dispatchEvent(new CustomEvent('open-logout-modal'));
};

// Fonctions pour le modal de déconnexion
const openLogoutModal = () => {
  showLogoutModal.value = true;
};

const cancelLogout = () => {
  showLogoutModal.value = false;
};

const confirmLogout = () => {
  authStore.logout();
  showLogoutModal.value = false;
};

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (showNotificationsDropdown.value && !e.target.closest('.notification-dropdown-trigger') && !e.target.closest('.notification-dropdown-content')) {
      showNotificationsDropdown.value = false;
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && showLogoutModal.value) {
      cancelLogout();
    }
  });
});
</script>

<style scoped>
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.2s ease-out forwards;
}
</style>
