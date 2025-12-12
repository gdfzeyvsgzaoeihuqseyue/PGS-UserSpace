<template>
  <header
    class="fixed top-0 left-0 right-0 shadow-sm z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo avec Badge Beta -->
        <NuxtLink :to="localePath('/')"
          class="flex items-center gap-2 hover:scale-105 overflow-hidden transition-all duration-300">
          <div class="hidden lg:block">
            <img :src="sharedFiles.paths.logo.dc" alt="Logo" class="h-8 w-auto sm:h-10 dark:hidden" />
            <img :src="sharedFiles.paths.logo.dw" alt="Logo" class="h-8 w-auto sm:h-10 hidden dark:block" />
          </div>
          <div class="lg:hidden flex-shrink-0 mr-3">
            <img :src="sharedFiles.paths.logo.mc" alt="Logo" class="h-8 w-auto sm:h-10 dark:hidden" />
            <img :src="sharedFiles.paths.logo.mw" alt="Logo" class="h-8 w-auto sm:h-10 hidden dark:block" />
          </div>
          <!-- Badge Beta -->
          <span v-if="config.public.betaMode"
            class="inline-flex items-center px-2 py-0.5 text-xs font-semibold text-primary bg-primary/10 dark:bg-primary/20 rounded-full">
            {{ $t('navbar.home.beta') }}
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center space-x-4">
          <!-- Navigation Links -->
          <a v-for="link in NavLink" :key="link.label" :href="link.url" :target="link.external ? '_blank' : '_self'"
            :rel="link.external ? 'noopener noreferrer' : ''"
            class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
            {{ $t(link.label) }}
          </a>

          <!-- App Switcher -->
          <div class="ml-2">
            <PGSAppSwitcher container-id="header-app-switcher" :on-app-click="handleAppClick" />
          </div>

          <!-- Auth Section -->
          <template v-if="!authStore.isAuthenticated">
            <NuxtLink :to="localePath('/auth/login')"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              {{ $t('navbar.home.signIn') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/auth/register')"
              class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
              {{ $t('navbar.home.signUp') }}
            </NuxtLink>
          </template>

          <template v-else>
            <div class="relative">
              <button @click="toggleUserMenu"
                class="flex items-center space-x-2 hover:scale-105 transition-all duration-300 focus:outline-none">
                <div
                  class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {{ getInitials(authStore.user?.firstName || '', authStore.user?.lastName || '') }}
                </div>
                <IconChevronDown class="w-4 h-4 text-gray-500 transition-transform duration-200"
                  :class="{ 'rotate-180': showUserMenu }" />
              </button>

              <!-- User Dropdown -->
              <div v-if="showUserMenu"
                class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in-up">
                <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ authStore.fullName }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ authStore.user?.email }}</p>
                </div>

                <NuxtLink :to="localePath('/me')"
                  class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  @click="showUserMenu = false">
                  <IconDashboard class="w-4 h-4" />
                  {{ $t('navbar.db.dashboard') }}
                </NuxtLink>

                <NuxtLink :to="localePath('/me/profile')"
                  class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  @click="showUserMenu = false">
                  <IconUser class="w-4 h-4" />
                  {{ $t('navbar.db.profile') }}
                </NuxtLink>

                <NuxtLink :to="localePath('/me/setting')"
                  class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  @click="showUserMenu = false">
                  <IconSettings class="w-4 h-4" />
                  {{ $t('navbar.db.settings') }}
                </NuxtLink>

                <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                <button @click="handleLogout"
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <IconLogout class="w-4 h-4" />
                  {{ $t('navbar.db.signOut') }}
                </button>
              </div>

              <!-- Overlay to close menu when clicking outside -->
              <div v-if="showUserMenu" @click="showUserMenu = false"
                class="fixed inset-0 z-40 bg-transparent cursor-default"></div>
            </div>
          </template>

          <!-- prefSettings - Style simplifié -->
          <div class="ml-2">
            <prefSettings />
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="lg:hidden flex items-center space-x-2">
          <!-- App Switcher -->
          <PGSAppSwitcher container-id="mobile-app-switcher" :on-app-click="handleAppClick" />

          <button @click="toggleMobileMenu" class="p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
            aria-label="Menu">
            <IconMenu v-if="!isMobileMenuOpen" class="h-6 w-6" />
            <IconX v-else class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Menu mobile -->
      <div class="lg:hidden transition-all duration-300 ease-in-out"
        :class="{ 'max-h-screen opacity-100': isMobileMenuOpen, 'max-h-0 opacity-0': !isMobileMenuOpen, 'overflow-hidden': !isMobileMenuOpen }">
        <div class="py-3 space-y-1">
          <!-- Navigation Links -->
          <a v-for="link in NavLink" :key="link.label" :href="link.url" :target="link.external ? '_blank' : '_self'"
            :rel="link.external ? 'noopener noreferrer' : ''"
            class="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
            @click="isMobileMenuOpen = false">
            {{ $t(link.label) }}
          </a>

          <!-- Auth Section Mobile -->
          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <template v-if="!authStore.isAuthenticated">
              <NuxtLink :to="localePath('/auth/login')"
                class="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                @click="isMobileMenuOpen = false">
                {{ $t('navbar.home.signIn') }}
              </NuxtLink>
              <NuxtLink :to="localePath('/auth/register')"
                class="block w-full text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-base font-medium mt-2"
                @click="isMobileMenuOpen = false">
                {{ $t('navbar.home.signUp') }}
              </NuxtLink>
            </template>

            <template v-else>
              <!-- User Profile -->
              <div class="px-4 py-3 mb-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {{ getInitials(authStore.user?.firstName || '', authStore.user?.lastName || '') }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ authStore.fullName }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
                  </div>
                </div>
              </div>

              <!-- User Links -->
              <NuxtLink :to="localePath('/me')"
                class="flex items-center gap-3 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                @click="isMobileMenuOpen = false">
                <IconDashboard class="w-5 h-5" />
                {{ $t('navbar.db.dashboard') }}
              </NuxtLink>

              <NuxtLink :to="localePath('/me/profile')"
                class="flex items-center gap-3 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                @click="isMobileMenuOpen = false">
                <IconUser class="w-5 h-5" />
                {{ $t('navbar.db.profile') }}
              </NuxtLink>

              <NuxtLink :to="localePath('/me/setting')"
                class="flex items-center gap-3 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                @click="isMobileMenuOpen = false">
                <IconSettings class="w-5 h-5" />
                {{ $t('navbar.db.settings') }}
              </NuxtLink>

              <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

              <button @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                <IconLogout class="w-5 h-5" />
                {{ $t('navbar.db.signOut') }}
              </button>
            </template>

            <!-- prefSettings dans le menu mobile - Style amélioré -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="px-4">
                <prefSettings />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <Teleport to="body">
    <div v-if="isMobileMenuOpen"
      class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden transition-opacity duration-300"
      @click="isMobileMenuOpen = false">
    </div>
  </Teleport>
</template>

<script setup>
import { useSharedFiles } from '~/stores/sharedFiles';
import { IconMenu, IconX, IconChevronDown, IconDashboard, IconUser, IconSettings, IconLogout } from '@tabler/icons-vue';
import { prefSettings } from '~/components/pref'

const config = useRuntimeConfig();
const sharedFiles = useSharedFiles();
const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);
const localePath = useLocalePath();
const showUserMenu = ref(false);

const { data: customData } = await useAsyncData('customData', () => sharedFiles.getCustomData());
const pgsUrl = computed(() => customData.value?.pgs?.url);

const NavLink = computed(() => [
  {
    label: 'navbar.home.solutions',
    url: `${pgsUrl.value}/apps`,
    external: true
  },
  {
    label: 'navbar.home.about',
    url: `${pgsUrl.value}/about`,
    external: true
  },
  {
    label: 'navbar.home.contact',
    url: `${pgsUrl.value}/contact`,
    external: true
  }
]);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const getInitials = (firstName, lastName) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

const handleLogout = async () => {
  showUserMenu.value = false;
  isMobileMenuOpen.value = false;
  await authStore.logout();
}

// Handle app click from App Switcher
const handleAppClick = (app) => {
  console.log('🚀 Application sélectionnée:', app.name)
  if (window.gtag) window.gtag('event', 'app_click', { app_name: app.name })
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.2s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
