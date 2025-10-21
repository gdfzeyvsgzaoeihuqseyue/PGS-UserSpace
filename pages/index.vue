<template>
  <div v-if="authStore.isLoggedIn" class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader :activeTab="activeTab" @toggle-mobile-sidebar="toggleMobileSidebar"
      :isMobileSidebarOpen="isMobileSidebarOpen" />

    <div class="flex flex-1" :class="{ 'mt-16': !isMobileSidebarOpen || isMobile }">
      <div :class="{
        'translate-x-0': isMobileSidebarOpen,
        '-translate-x-full': !isMobileSidebarOpen && isMobile,
        'lg:translate-x-0': !isMobile,
        'lg:w-64': isDesktopSidebarOpen,
        'lg:w-20': !isDesktopSidebarOpen && !isMobile,
      }"
        class="fixed inset-y-0 left-0 z-40 bg-white shadow-xl lg:static transition-all duration-300 ease-in-out">
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
import AppHeader from '@/components/app/Header.vue'; 

// Variables
const authStore = useAuthStore();
const router = useRouter();
const activeTab = ref('profil');
const isMobileSidebarOpen = ref(false);
const isDesktopSidebarOpen = ref(true); 
const isMobile = ref(false); 

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
};

const toggleDesktopSidebar = () => {
  isDesktopSidebarOpen.value = !isDesktopSidebarOpen.value;
};

// Fermer menu déroulant et sidebar sur clique extérieur
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024;
    if (!isMobile.value) {
      isDesktopSidebarOpen.value = true;
      isMobileSidebarOpen.value = false; 
    } else {
      isDesktopSidebarOpen.value = false; 
    }
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);

  document.addEventListener('click', (e) => {
    // For notifications (now handled in AppHeader)
    // For sidebar on mobile: close if clicked outside
    if (isMobile.value && isMobileSidebarOpen.value && !e.target.closest('.fixed.inset-y-0.left-0.z-40') && !e.target.closest('.header-toggle-button')) {
      isMobileSidebarOpen.value = false;
    }
  });
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
