<template>
  <div
    class="flex h-screen bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 transition-all duration-500 overflow-hidden">
    <!-- Sidebar Navigation -->
    <aside
      class="flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ease-in-out flex flex-col z-30 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50"
      :class="[
        isSidebarCollapsed ? 'w-20' : 'w-64',
        showMobileMenu ? 'fixed inset-y-0 left-0 w-64 transform translate-x-0' : 'hidden lg:flex'
      ]">

      <!-- Sidebar Header: Toggle + Logo -->
      <div
        class="h-16 flex items-center px-4 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0 transition-all duration-300 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
        :class="isSidebarCollapsed ? 'justify-center' : 'justify-between'">

        <div class="flex items-center w-full justify-between" :class="isSidebarCollapsed ? 'justify-arround' : 'gap-3'">
          <!-- Logo -->
          <div class="block flex-shrink-0 transition-all duration-200">
            <!-- Collapsed State: Show small logo -->
            <div v-if="isSidebarCollapsed" class="flex justify-center">
              <img :src="sharedFiles.paths.logo.mc" alt="Logo" class="h-8 w-auto dark:hidden" />
              <img :src="sharedFiles.paths.logo.mw" alt="Logo" class="h-8 w-auto hidden dark:block" />
            </div>
            <!-- Expanded State: Show full logo (larger) -->
            <div v-else>
              <img :src="sharedFiles.paths.logo.dc" alt="Logo" class="h-10 w-auto dark:hidden" />
              <img :src="sharedFiles.paths.logo.dw" alt="Logo" class="h-10 w-auto hidden dark:block" />
            </div>
          </div>

          <button @click="toggleSidebar"
            class="p-2 rounded-lg hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hidden lg:flex items-center justify-center transition-all duration-300 flex-shrink-0 hover:scale-110">
            <IconLayoutSidebarRightCollapse v-if="isSidebarCollapsed" class="w-5 h-5" />
            <IconLayoutSidebarLeftCollapse v-else class="w-5 h-5" />
          </button>
        </div>

        <!-- Mobile Close Button -->
        <button @click="showMobileMenu = false"
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 ml-auto">
          <IconX class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation Links -->
      <div class="flex-1 overflow-y-auto px-3 py-4">
        <nav class="space-y-1">
          <!-- Home Link (Return to Landing) -->
          <NuxtLink :to="localePath('/')"
            class="flex items-center px-3 py-3 rounded-lg transition-all duration-300 group relative text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary dark:hover:text-primary hover:scale-105 hover:shadow-md"
            @click="showMobileMenu = false">
            <IconHome2 class="w-6 h-6 flex-shrink-0" />
            <span class="ml-3 font-medium whitespace-nowrap transition-opacity duration-300"
              :class="{ 'lg:opacity-0 lg:hidden': isSidebarCollapsed }">
              {{ $t('navbar.db.home') }}
            </span>
            <div v-if="isSidebarCollapsed"
              class="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
              {{ $t('navbar.db.home') }}
            </div>
          </NuxtLink>

          <div class="my-2 border-t border-gray-200 dark:border-gray-700"></div>

          <NuxtLink :to="localePath('/me')"
            class="flex items-center px-3 py-3 rounded-lg transition-all duration-300 group relative"
            :class="isActive('/me') && isExactActive('/me') ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/30' : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary dark:hover:text-primary hover:scale-105 hover:shadow-md'"
            @click="showMobileMenu = false">
            <IconDashboard class="w-6 h-6 flex-shrink-0" />
            <span class="ml-3 font-medium whitespace-nowrap transition-opacity duration-300"
              :class="{ 'lg:opacity-0 lg:hidden': isSidebarCollapsed }">
              {{ $t('navbar.db.dashboard') }}
            </span>
            <!-- Tooltip for collapsed state -->
            <div v-if="isSidebarCollapsed"
              class="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
              {{ $t('navbar.db.dashboard') }}
            </div>
          </NuxtLink>

          <NuxtLink :to="localePath('/me/services')"
            class="flex items-center px-3 py-3 rounded-lg transition-all duration-300 group relative"
            :class="isActive('/me/services') ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/30' : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary dark:hover:text-primary hover:scale-105 hover:shadow-md'"
            @click="showMobileMenu = false">
            <IconLayout2 class="w-6 h-6 flex-shrink-0" />
            <span class="ml-3 font-medium whitespace-nowrap transition-opacity duration-300"
              :class="{ 'lg:opacity-0 lg:hidden': isSidebarCollapsed }">
              {{ $t('navbar.db.services') }}
            </span>
            <span v-if="servicesStore.activeServiceCount > 0"
              class="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md animate-pulse">
              {{ servicesStore.activeServiceCount }}
            </span>
            <div v-if="isSidebarCollapsed"
              class="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
              {{ $t('navbar.db.services') }}
            </div>
          </NuxtLink>

          <NuxtLink :to="localePath('/me/solutions')"
            class="flex items-center px-3 py-3 rounded-lg transition-all duration-300 group relative"
            :class="isActive('/me/solutions') ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/30' : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary dark:hover:text-primary hover:scale-105 hover:shadow-md'"
            @click="showMobileMenu = false">
            <IconLayoutGridAdd class="w-6 h-6 flex-shrink-0" />
            <span class="ml-3 font-medium whitespace-nowrap transition-opacity duration-300"
              :class="{ 'lg:opacity-0 lg:hidden': isSidebarCollapsed }">
              {{ $t('navbar.db.solutions') }}
            </span>
            <span v-if="solutionsStore.activeSolutions.length > 0"
              class="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md animate-pulse">
              {{ solutionsStore.activeSolutions.length }}
            </span>
            <div v-if="isSidebarCollapsed"
              class="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
              {{ $t('navbar.db.solutions') }}
            </div>
          </NuxtLink>

          <NuxtLink :to="localePath('/me/sessions')"
            class="flex items-center px-3 py-3 rounded-lg transition-all duration-300 group relative"
            :class="isActive('/me/sessions') ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/30' : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary dark:hover:text-primary hover:scale-105 hover:shadow-md'"
            @click="showMobileMenu = false">
            <IconLock class="w-6 h-6 flex-shrink-0" />
            <span class="ml-3 font-medium whitespace-nowrap transition-opacity duration-300"
              :class="{ 'lg:opacity-0 lg:hidden': isSidebarCollapsed }">
              {{ $t('navbar.db.sessions') }}
            </span>
            <span v-if="sessionsStore.activeSessionCount > 0"
              class="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md animate-pulse">
              {{ sessionsStore.activeSessionCount }}
            </span>
            <div v-if="isSidebarCollapsed"
              class="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
              {{ $t('navbar.db.sessions') }}
            </div>
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div v-if="showMobileMenu" class="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
      @click="showMobileMenu = false"></div>

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <!-- Top Navigation -->
      <header
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10 transition-all duration-300">
        <div class="w-full px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Left Side: Mobile Menu Toggle & Search -->
            <div class="flex items-center gap-4 flex-1 max-w-2xl">
              <!-- Mobile Menu Button -->
              <button @click="toggleMobileMenu"
                class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
                <IconMenu class="w-5 h-5" />
              </button>

              <div class="w-full max-w-md hidden sm:block">
                <GlobalSearch />
              </div>
            </div>

            <!-- Right Side: User Menu & Preferences -->
            <div class="flex items-center space-x-2 sm:space-x-4">
              <!-- Mobile Search Toggle -->
              <button @click="showMobileSearch = true"
                class="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
                <IconSearch class="w-5 h-5" />
              </button>

              <prefLang2 />
              <prefTheme2 />

              <div class="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"></div>

              <div class="relative" v-if="authStore.user">
                <button @click="toggleUserMenu"
                  class="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors">
                  <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-sm">
                    <span class="text-white text-sm font-medium">
                      {{ getInitials(authStore.user.firstName, authStore.user.lastName) }}
                    </span>
                  </div>
                  <div class="hidden md:block text-left">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ authStore.fullName }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ authStore.user.email }}</p>
                  </div>
                  <IconChevronDown class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>

                <!-- User Dropdown -->
                <div v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
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
                    class="flex items-center gap-3 w-full text-left px-3 py-2 text-sm rounded-md font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <IconLogout class="w-5 h-5" />
                    {{ $t('navbar.db.signOut') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Page Content -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>

    <!-- Mobile Search Modal -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showMobileSearch"
        class="sm:hidden fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex flex-col p-4"
        @click.self="showMobileSearch = false">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-white">{{ $t('dashboard.search.title', 'Recherche') }}</h2>
          <button @click="showMobileSearch = false"
            class="p-2 rounded-lg hover:bg-white/10 text-white transition-colors">
            <IconX class="w-6 h-6" />
          </button>
        </div>
        <div class="flex-shrink-0" @click.stop>
          <GlobalSearch />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">

import { IconChevronDown, IconHome2, IconDashboard, IconLayout2, IconLayoutGridAdd, IconLock, IconMenu, IconUser, IconSettings, IconLayoutSidebarRightCollapse, IconLayoutSidebarLeftCollapse, IconX, IconSearch, IconLogout } from '@tabler/icons-vue'
import { useSharedFiles } from '~/stores/sharedFiles';
import GlobalSearch from '~/components/GlobalSearch.vue'
import { prefLang2, prefTheme2 } from '~/components/pref'

const sharedFiles = useSharedFiles();
const authStore = useAuthStore()
const servicesStore = useServicesStore()
const solutionsStore = useSolutionsStore()
const sessionsStore = useSessionsStore()
const route = useRoute()
const localePath = useLocalePath()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const showMobileSearch = ref(false)
const isSidebarCollapsed = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const isActive = (path: string) => {
  const currentPath = route.path
  const targetPath = localePath(path)

  // Handle root path or exact match
  if (path === '/me') {
    return currentPath === targetPath
  }

  // Handle sub-paths
  return currentPath.startsWith(targetPath)
}

const isExactActive = (path: string) => {
  return route.path === localePath(path)
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const handleLogout = async () => {
  showUserMenu.value = false
  await authStore.logout()
}

// Close dropdowns when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showUserMenu.value = false
    }
  })

  // Fetch data for badges
  servicesStore.fetchServices()
  solutionsStore.fetchSolutions()
  sessionsStore.fetchSessions()
})
</script>
