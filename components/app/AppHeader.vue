<template>
  <header
    class="fixed top-0 left-0 right-0 shadow-sm z-50 bg-WtB/70 border-b border-gray-200 backdrop-blur-md  supports-[backdrop-filter]:bg-white/60 transition-colors duration-300">
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
            {{ $t('navbar.home.beta') }}
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center space-x-6">
          <!-- Navigation Links -->
          <a v-for="link in NavLink" :key="link.label" :href="link.url" :target="link.external ? '_blank' : '_self'"
            :rel="link.external ? 'noopener noreferrer' : ''"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium">
            {{ $t(link.label) }}
          </a>

          <!-- Divider -->
          <div class="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

          <!-- Auth Section -->
          <template v-if="!authStore.isAuthenticated">
            <NuxtLink :to="localePath('/auth/login')" class="hover:text-primary transition-colors font-medium">
              {{ $t('navbar.home.signIn') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/auth/register')" class="btn btn-primary">
              {{ $t('navbar.home.signUp') }}
            </NuxtLink>
          </template>

          <template v-else>
            <div class="relative">
              <button @click="toggleUserMenu"
                class="flex items-center space-x-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 rounded-lg px-3 py-2 transition-all duration-300 group">
                <div
                  class="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/40 transition-all duration-300">
                  <span class="text-white text-sm font-bold">
                    {{ getInitials(authStore.user?.firstName || '', authStore.user?.lastName || '') }}
                  </span>
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ authStore.fullName }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
                </div>
                <IconChevronDown class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300"
                  :class="{ 'rotate-180': showUserMenu }" />
              </button>

              <!-- User Dropdown -->
              <Transition enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <div v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-50 backdrop-blur-xl">
                  <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ authStore.fullName }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ authStore.user?.email }}</p>
                  </div>

                  <NuxtLink :to="localePath('/me')"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary dark:hover:text-primary transition-all duration-200"
                    @click="showUserMenu = false">
                    <IconDashboard class="w-4 h-4" />
                    {{ $t('navbar.db.dashboard') }}
                  </NuxtLink>

                  <NuxtLink :to="localePath('/me/profile')"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary dark:hover:text-primary transition-all duration-200"
                    @click="showUserMenu = false">
                    <IconUser class="w-4 h-4" />
                    {{ $t('navbar.db.profile') }}
                  </NuxtLink>

                  <NuxtLink :to="localePath('/me/setting')"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary dark:hover:text-primary transition-all duration-200"
                    @click="showUserMenu = false">
                    <IconSettings class="w-4 h-4" />
                    {{ $t('navbar.db.settings') }}
                  </NuxtLink>

                  <div class="my-1 border-t border-gray-200 dark:border-gray-700"></div>

                  <button @click="handleLogout"
                    class="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200">
                    <IconLogout class="w-4 h-4" />
                    {{ $t('navbar.db.signOut') }}
                  </button>
                </div>
              </Transition>
            </div>
          </template>

          <PGSAppSwitcher container-id="header-app-switcher" :on-app-click="handleAppClick" />

          <prefSettings />
        </div>

        <!-- Mobile Menu Button -->
        <div class="lg:hidden flex items-center gap-2">
          <PGSAppSwitcher container-id="mobile-app-switcher" :on-app-click="handleAppClick" />
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
        class="lg:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-2xl z-40">
        <div class="px-4 pt-2 pb-4 space-y-2">
          <!-- Navigation Links (when not authenticated) -->
          <template v-if="!authStore.isAuthenticated">
            <a v-for="link in NavLink" :key="link.label" :href="link.url" :target="link.external ? '_blank' : '_self'"
              :rel="link.external ? 'noopener noreferrer' : ''"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              @click="isMobileMenuOpen = false">
              {{ $t(link.label) }}
            </a>

            <div class="pt-2 border-t border-gray-200 dark:border-gray-700"></div>

            <NuxtLink :to="localePath('/auth/login')"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              @click="isMobileMenuOpen = false">
              {{ $t('navbar.home.signIn') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/auth/register')"
              class="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg hover:shadow-primary/30"
              @click="isMobileMenuOpen = false">
              {{ $t('navbar.home.signUp') }}
            </NuxtLink>
          </template>
          <template v-else>
            <!-- User Profile Card -->
            <div
              class="px-3 py-3 border-b border-gray-200 dark:border-gray-700 mb-2 bg-gradient-to-r from-primary/5 to-transparent rounded-lg">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                  <span class="text-white text-sm font-bold">
                    {{ getInitials(authStore.user?.firstName || '', authStore.user?.lastName || '') }}
                  </span>
                </div>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">{{ authStore.fullName }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ authStore.user?.email }}</p>
                </div>
              </div>
            </div>

            <!-- Navigation Links Section -->
            <div class="pb-2 mb-2 border-b border-gray-200 dark:border-gray-700">
              <p class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Navigation
              </p>
              <a v-for="link in NavLink" :key="link.label" :href="link.url" :target="link.external ? '_blank' : '_self'"
                :rel="link.external ? 'noopener noreferrer' : ''"
                class="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 transition-all duration-200"
                @click="isMobileMenuOpen = false">
                <span class="w-5 h-5 flex items-center justify-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6">
                    </path>
                  </svg>
                </span>
                {{ $t(link.label) }}
              </a>
            </div>

            <!-- User Menu Section -->
            <div class="pb-2 mb-2">
              <p class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Mon Compte
              </p>
              <NuxtLink :to="localePath('/me')"
                class="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 transition-all duration-200"
                @click="isMobileMenuOpen = false">
                <IconDashboard class="w-5 h-5" />
                {{ $t('navbar.db.dashboard') }}
              </NuxtLink>
              <NuxtLink :to="localePath('/me/profile')"
                class="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 transition-all duration-200"
                @click="isMobileMenuOpen = false">
                <IconUser class="w-5 h-5" />
                {{ $t('navbar.db.profile') }}
              </NuxtLink>
              <NuxtLink :to="localePath('/me/setting')"
                class="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 transition-all duration-200"
                @click="isMobileMenuOpen = false">
                <IconSettings class="w-5 h-5" />
                {{ $t('navbar.db.settings') }}
              </NuxtLink>
            </div>

            <!-- Logout Section -->
            <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
              <button @click="handleLogout"
                class="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200">
                <IconLogout class="w-5 h-5" />
                {{ $t('navbar.db.signOut') }}
              </button>
            </div>
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
import { IconMenu, IconX, IconChevronDown, IconDashboard, IconUser, IconSettings, IconLogout } from '@tabler/icons-vue';
import { prefSettings } from '~/components/pref'

const config = useRuntimeConfig();
const sharedFiles = useSharedFiles();
const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);
const mobileMenuRef = ref(null);
const localePath = useLocalePath();
const showUserMenu = ref(false);

// Navigation Links
const NavLink = [
  {
    label: 'navbar.home.solutions',
    url: 'https://progestionsoft.netlify.app/apps',
    external: true
  },
  {
    label: 'navbar.home.about',
    url: 'https://progestionsoft.netlify.app/about',
    external: true
  },
  {
    label: 'navbar.home.contact',
    url: 'https://progestionsoft.netlify.app/contact',
    external: true
  }
];

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

// Handle app click from App Switcher
const handleAppClick = (app) => {
  console.log('🚀 Application sélectionnée:', app.name)
  if (window.gtag) window.gtag('event', 'app_click', { app_name: app.name })
}

</script>
