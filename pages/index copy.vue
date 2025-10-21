<template>
  <div v-if="authStore.isLoggedIn" class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-white shadow-md border-b border-gray-200 fixed w-full top-0 left-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <NuxtLink to="/"
            class="flex items-center gap-2 group transition-transform duration-200 hover:scale-105 hover:opacity-80">
            <img src="/img/logoDeskCol.png" alt="Logo" class="h-8 w-auto sm:h-10 hidden md:block" />
            <img src="/img/logoMobCol.png" alt="Logo" class="h-8 w-auto sm:h-10 block md:hidden" />
          </NuxtLink>
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
      </div>
    </header>

    <div class="flex flex-1" :class="{ 'mt-16': true }">
      <div :class="{
        'translate-x-0': isMobileSidebarOpen || isDesktopSidebarOpen,
        '-translate-x-full': !isMobileSidebarOpen && !isDesktopSidebarOpen && isMobile,
        'lg:w-64': isDesktopSidebarOpen,
        'lg:w-20': !isDesktopSidebarOpen && !isMobile,
      }" class="fixed inset-y-0 left-0 z-40 bg-white shadow-xl lg:static transition-all duration-300 ease-in-out">
        <Sidebar :activeTab="activeTab" @update:activeTab="activeTab = $event; isMobileSidebarOpen = false"
          :isSidebarOpen="isDesktopSidebarOpen" :isMobile="isMobile" @toggle-sidebar="toggleDesktopSidebar" />
      </div>

      <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50 transition-all duration-300">
        <Profil v-if="activeTab === 'profil'" />
        <Securite v-if="activeTab === 'securite'" />
        <Confidentialite v-if="activeTab === 'confidentialite'" />
        <Notifications v-if="activeTab === 'notifications'" />
        <Services v-if="activeTab === 'services'" />
        <Supprimer v-if="activeTab === 'supprimer'" />
      </main>
    </div>

    <div v-if="showLogoutModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      @click.self="cancelLogout">
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm transform transition-all duration-300 ease-out animate-scale-in">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
              </path>
            </svg>
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

  <div v-else
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white p-8 rounded-lg shadow-lg text-center">
      <p class="text-gray-700 text-lg mb-4 font-medium">Chargement de votre session...</p>
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
      <p class="text-gray-500 text-sm mt-3">Veuillez patienter pendant la vérification de votre authentification.</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Sidebar, Profil, Securite, Confidentialite, Notifications, Services, Supprimer } from '@/components/Dashboard';
import { IconMenu2, IconBell, IconLogout, IconX } from '@tabler/icons-vue';


// Variables
const authStore = useAuthStore();
const router = useRouter();
const activeTab = ref('profil');
const showNotificationsDropdown = ref(false);
const isMobileSidebarOpen = ref(false);
const isDesktopSidebarOpen = ref(true); // New state for desktop sidebar
const showLogoutModal = ref(false);
const isMobile = ref(false); // To determine if on mobile breakpoint

// --- Notification Mock Data ---
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
  activeTab.value = 'notifications';
  showNotificationsDropdown.value = false;
  isMobileSidebarOpen.value = false;
};

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
};

const toggleDesktopSidebar = () => {
  isDesktopSidebarOpen.value = !isDesktopSidebarOpen.value;
};

const greetingMessage = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Bonjour';
  if (hour >= 12 && hour < 17) return 'Bon après-midi';
  if (hour >= 17 && hour < 20) return 'Bonsoir';
  return 'Belle soirée';
});


// Fonctions pour le modal de déconnexion
const openLogoutModal = () => {
  showLogoutModal.value = true;
};

const cancelLogout = () => {
  showLogoutModal.value = false;
};

const confirmLogout = () => {
  authStore.logout(); // Appelle la fonction de déconnexion du store
  showLogoutModal.value = false; // Ferme le modal
};

// Fermer menu déroulant et sidebar sur clique extérieur
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024;
    // On desktop, keep sidebar open by default
    if (!isMobile.value) {
      isDesktopSidebarOpen.value = true;
      isMobileSidebarOpen.value = false; // Ensure mobile sidebar is closed on desktop
    } else {
      isDesktopSidebarOpen.value = false; // Ensure desktop sidebar is collapsed on mobile
    }
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);

  document.addEventListener('click', (e) => {
    // For notifications
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

// Avatar (Assurez-vous que 'authStore.user' est bien peuplé)
const profilePictureUrl = computed(() => {
  const user = authStore.user;
  if (user && user.profilePictureUrl) {
    return user.profilePictureUrl;
  }
  const name = user?.firstName || 'Utilisateur'; // Fallback for name
  return `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=007bff,ff9900&radius=50`;
});


// Authentication logic and redirection
onMounted(() => {
  if (!authStore.isLoggedIn) {
    authStore.fetchUser();
  }
});

watch(() => authStore.isLoggedIn, (newVal) => {
  if (!newVal) {
    router.push('/auth/login');
  }
}, { immediate: true });
</script>

<style scoped>
/* Animations */
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

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>
