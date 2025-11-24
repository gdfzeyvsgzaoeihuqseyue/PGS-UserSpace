<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
    <!-- Sidebar Navigation -->
    <aside
      class="flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col z-30"
      :class="[
        isSidebarCollapsed ? 'w-20' : 'w-64',
        showMobileMenu ? 'fixed inset-y-0 left-0 w-64 transform translate-x-0' : 'hidden lg:flex'
      ]">

      <!-- Sidebar Header: Toggle + Logo -->
      <div
        class="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 transition-all duration-300"
        :class="isSidebarCollapsed ? 'justify-center' : 'justify-between'">

        <div class="flex items-center" :class="{ 'gap-3': !isSidebarCollapsed }">
          <!-- Sidebar Toggle (Desktop) -->
          <button @click="toggleSidebar"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hidden lg:flex items-center justify-center transition-colors flex-shrink-0">
            <IconLayoutSidebarRightCollapse v-if="isSidebarCollapsed" class="w-5 h-5" />
            <IconLayoutSidebarLeftCollapse v-else class="w-5 h-5" />
          </button>

          <!-- Logo -->
          <NuxtLink to="/me" class="block flex-shrink-0 transition-opacity duration-200"
            :class="{ 'opacity-0 w-0 overflow-hidden': isSidebarCollapsed && !showMobileMenu }">
            <img :src="sharedFiles.paths.logo.dc" alt="Logo" class="h-8 w-auto dark:hidden" />
            <img :src="sharedFiles.paths.logo.dw" alt="Logo" class="h-8 w-auto hidden dark:block" />
          </NuxtLink>
        </div>

        <!-- Mobile Close Button -->
        <button @click="showMobileMenu = false"
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
          <IconX class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation Links -->
      <div class="flex-1 overflow-y-auto px-3 py-4">
        <nav class="space-y-1">
          <NuxtLink to="/me" class="flex items-center px-3 py-3 rounded-lg transition-colors group relative"
            :class="isActive('/me') && route.path === '/me' ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="showMobileMenu = false">
            <IconHome class="w-6 h-6 flex-shrink-0" />
            <span class="ml-3 font-medium whitespace-nowrap transition-opacity duration-300"
              :class="{ 'lg:opacity-0 lg:hidden': isSidebarCollapsed }">
              {{ $t('dashboard.menu.dashboard') }}
            </span>
            <!-- Tooltip for collapsed state -->
            <div v-if="isSidebarCollapsed"
              class="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
              {{ $t('dashboard.menu.dashboard') }}
            </div>
          </NuxtLink>

          <NuxtLink to="/me/services" class="flex items-center px-3 py-3 rounded-lg transition-colors group relative"
            :class="isActive('/me/services') ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="showMobileMenu = false">
            <IconLayout2 class="w-6 h-6 flex-shrink-0" />
            <span class="ml-3 font-medium whitespace-nowrap transition-opacity duration-300"
              :class="{ 'lg:opacity-0 lg:hidden': isSidebarCollapsed }">
              {{ $t('dashboard.menu.services') }}
            </span>
            <span v-if="servicesStore.activeServiceCount > 0 && !isSidebarCollapsed" class="ml-auto badge badge-info">
              {{ servicesStore.activeServiceCount }}
            </span>
            <div v-if="isSidebarCollapsed"
              class="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
              {{ $t('dashboard.menu.services') }}
            </div>
          </NuxtLink>

          <NuxtLink to="/me/solutions" class="flex items-center px-3 py-3 rounded-lg transition-colors group relative"
            :class="isActive('/me/solutions') ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="showMobileMenu = false">
            <IconLayoutGridAdd class="w-6 h-6 flex-shrink-0" />
            <span class="ml-3 font-medium whitespace-nowrap transition-opacity duration-300"
              :class="{ 'lg:opacity-0 lg:hidden': isSidebarCollapsed }">
              {{ $t('dashboard.menu.solutions') }}
            </span>
            <div v-if="isSidebarCollapsed"
              class="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
              {{ $t('dashboard.menu.solutions') }}
            </div>
          </NuxtLink>

          <NuxtLink to="/me/sessions" class="flex items-center px-3 py-3 rounded-lg transition-colors group relative"
            :class="isActive('/me/sessions') ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="showMobileMenu = false">
            <IconLock class="w-6 h-6 flex-shrink-0" />
            <span class="ml-3 font-medium whitespace-nowrap transition-opacity duration-300"
              :class="{ 'lg:opacity-0 lg:hidden': isSidebarCollapsed }">
              {{ $t('dashboard.menu.sessions') }}
            </span>
            <div v-if="isSidebarCollapsed"
              class="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
              {{ $t('dashboard.menu.sessions') }}
            </div>
          </NuxtLink>

          <NuxtLink to="/me/profile" class="flex items-center px-3 py-3 rounded-lg transition-colors group relative"
            :class="isActive('/me/profile') ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="showMobileMenu = false">
            <IconUser class="w-6 h-6 flex-shrink-0" />
            <span class="ml-3 font-medium whitespace-nowrap transition-opacity duration-300"
              :class="{ 'lg:opacity-0 lg:hidden': isSidebarCollapsed }">
              {{ $t('dashboard.menu.profile') }}
            </span>
            <div v-if="isSidebarCollapsed"
              class="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
              {{ $t('dashboard.menu.profile') }}
            </div>
          </NuxtLink>

          <NuxtLink to="/me/setting" class="flex items-center px-3 py-3 rounded-lg transition-colors group relative"
            :class="isActive('/me/setting') ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="showMobileMenu = false">
            <IconSettings class="w-6 h-6 flex-shrink-0" />
            <span class="ml-3 font-medium whitespace-nowrap transition-opacity duration-300"
              :class="{ 'lg:opacity-0 lg:hidden': isSidebarCollapsed }">
              {{ $t('dashboard.menu.settings') }}
            </span>
            <div v-if="isSidebarCollapsed"
              class="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
              {{ $t('dashboard.menu.settings') }}
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
        class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors duration-300">
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
              <button
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
                  <NuxtLink to="/me/profile"
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
            </div>
          </div>
        </div>
      </header>

      <!-- Main Page Content -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">

import { IconChevronDown, IconHome, IconLayout2, IconLayoutGridAdd, IconLock, IconMenu, IconUser, IconSettings, IconLayoutSidebarRightCollapse, IconLayoutSidebarLeftCollapse, IconX, IconSearch } from '@tabler/icons-vue'
import { useSharedFiles } from '~/stores/sharedFiles';
import GlobalSearch from '~/components/GlobalSearch.vue'
import { prefLang2, prefTheme2 } from '~/components/pref'

const sharedFiles = useSharedFiles();
const authStore = useAuthStore()
const servicesStore = useServicesStore()
const route = useRoute()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)
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
  if (path === '/me') {
    return route.path === '/me'
  }
  return route.path.startsWith(path)
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
})
</script>
