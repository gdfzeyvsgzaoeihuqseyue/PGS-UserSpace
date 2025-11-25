<template>
  <header
    class="fixed top-0 left-0 right-0 shadow-sm z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo avec Badge Beta -->
        <NuxtLink :to="localePath('/')"
          class="flex items-center gap-2 hover:scale-105 overflow-hidden transition-all duration-300">
          <div class="hidden lg:block">
            <img :src="sharedFiles.paths.logo.dc" alt="Logo" class="h-8 w-auto sm:h-16 dark:hidden" />
            <img :src="sharedFiles.paths.logo.dw" alt="Logo" class="h-8 w-auto sm:h-16 hidden dark:block" />
          </div>
          <div class="lg:hidden flex-shrink-0 mr-3">
            <img :src="sharedFiles.paths.logo.mc" alt="Logo" class="h-8 w-auto sm:h-16 dark:hidden" />
            <img :src="sharedFiles.paths.logo.mw" alt="Logo" class="h-8 w-auto sm:h-16 hidden dark:block" />
          </div>
          <!-- Badge Beta -->
          <span v-if="config.public.betaMode"
            class="relative inline-flex items-center px-2.5 py-0.5 text-xs font-semibold text-primary">
            <span class="absolute inset-0 bg-primary opacity-10 dark:opacity-20 rounded-full"></span>
            {{ $t('navbar.beta') }}
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center space-x-4">
          <template v-if="!authStore.isAuthenticated">
            <NuxtLink :to="localePath('/auth/login')" class="hover:text-primary transition-colors font-medium">
              {{ $t('navbar.signIn') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/auth/register')" class="btn btn-primary">
              {{ $t('navbar.signUp') }}
            </NuxtLink>
          </template>

          <template v-else>
            <div class="relative">
              <button @click="toggleUserMenu"
                class="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors">
                <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-sm">
                  <span class="text-white text-sm font-medium">
                    {{ getInitials(authStore.user?.firstName || '', authStore.user?.lastName || '') }}
                  </span>
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ authStore.fullName }}</p>
                </div>
                <IconChevronDown class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              <!-- User Dropdown -->
              <div v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <NuxtLink :to="localePath('/me')"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  @click="showUserMenu = false">
                  {{ $t('dashboard.menu.dashboard') }}
                </NuxtLink>
                <NuxtLink :to="localePath('/me/profile')"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  @click="showUserMenu = false">
                  {{ $t('dashboard.userMenu.profileSettings') }}
                </NuxtLink>
                <button @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  {{ $t('dashboard.userMenu.signOut') }}
                </button>
              </div>
            </div>
          </template>

          <prefSettings />
        </div>

        <!-- Mobile Menu Button -->
        <div class="lg:hidden flex items-center">
          <button @click="toggleMobileMenu"
            class="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none">
            <IconMenu v-if="!isMobileMenuOpen" class="h-6 w-6" />
            <IconX v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <Transition enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in" leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0">
      <div v-show="isMobileMenuOpen" ref="mobileMenuRef"
        class="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg z-40">
        <div class="px-4 pt-2 pb-4 space-y-3">
          <template v-if="!authStore.isAuthenticated">
            <NuxtLink :to="localePath('/auth/login')"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              @click="isMobileMenuOpen = false">
              {{ $t('navbar.signIn') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/auth/register')"
              class="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary/90"
              @click="isMobileMenuOpen = false">
              {{ $t('navbar.signUp') }}
            </NuxtLink>
          </template>
          <template v-else>
            <div class="px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
              <p class="font-medium text-gray-900 dark:text-white">{{ authStore.fullName }}</p>
              <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
            </div>
            <NuxtLink :to="localePath('/me')"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              @click="isMobileMenuOpen = false">
              {{ $t('dashboard.menu.dashboard') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/me/profile')"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              @click="isMobileMenuOpen = false">
              {{ $t('dashboard.userMenu.profileSettings') }}
            </NuxtLink>
            <button @click="handleLogout"
              class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              {{ $t('dashboard.userMenu.signOut') }}
            </button>
          </template>

          <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div class="px-3 py-2">
              <prefSettings />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { useSharedFiles } from '~/stores/sharedFiles';
import { IconMenu, IconX, IconChevronDown } from '@tabler/icons-vue';
import { prefSettings } from '~/components/pref'

const config = useRuntimeConfig();
const sharedFiles = useSharedFiles();
const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);
const mobileMenuRef = ref(null);
const localePath = useLocalePath();
const showUserMenu = ref(false);

const toggleMobileMenu = (event) => {
  event.stopPropagation();
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
}

const closeMobileMenu = (event) => {
  if (isMobileMenuOpen.value && mobileMenuRef.value && !mobileMenuRef.value.contains(event.target)) {
    isMobileMenuOpen.value = false;
  }
  // Close user menu if clicking outside
  if (showUserMenu.value && !event.target.closest('.relative')) {
    showUserMenu.value = false;
  }
};

const getInitials = (firstName, lastName) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

const handleLogout = async () => {
  showUserMenu.value = false;
  isMobileMenuOpen.value = false;
  await authStore.logout();
}

onMounted(() => {
  document.addEventListener('click', closeMobileMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMobileMenu);
});

// Close mobile menu when route changes
const route = useRoute();
watch(() => route.path, () => {
  isMobileMenuOpen.value = false;
  showUserMenu.value = false;
});
</script>
