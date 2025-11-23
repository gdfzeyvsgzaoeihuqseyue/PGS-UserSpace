<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/dashboard" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primaryn rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">P</span>
            </div>
            <span class="text-xl font-bold text-gray-900 hidden sm:block">PGS User Space</span>
          </NuxtLink>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <button @click="toggleMobileMenu" class="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <IconMenu class="w-5 h-5" />
            </button>

            <div class="relative" v-if="authStore.user">
              <button @click="toggleUserMenu"
                class="flex items-center space-x-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">
                <div class="w-8 h-8 bg-primaryn rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">
                    {{ getInitials(authStore.user.firstName, authStore.user.lastName) }}
                  </span>
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-sm font-medium text-gray-900">{{ authStore.fullName }}</p>
                  <p class="text-xs text-gray-500">{{ authStore.user.email }}</p>
                </div>
                <IconChevronDown class="w-5 h-5" />
              </button>

              <!-- User Dropdown -->
              <div v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <NuxtLink to="/dashboard/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false">
                  Profile Settings
                </NuxtLink>
                <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <aside class="lg:w-64 flex-shrink-0" :class="{ 'hidden lg:block': !showMobileMenu }">
          <nav class="space-y-1">
            <NuxtLink to="/dashboard" class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors"
              :class="isActive('/dashboard') ? 'bg-primaryn text-white' : 'text-gray-700 hover:bg-gray-100'"
              @click="showMobileMenu = false">
              <IconHome class="w-5 h-5" />
              <span class="font-medium">Dashboard</span>
            </NuxtLink>

            <NuxtLink to="/dashboard/services"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors"
              :class="isActive('/dashboard/services') ? 'bg-primaryn text-white' : 'text-gray-700 hover:bg-gray-100'"
              @click="showMobileMenu = false">
              <IconLayout2 class="w-5 h-5" />
              <span class="font-medium">Services</span>
              <span v-if="servicesStore.activeServiceCount > 0" class="ml-auto badge badge-info">
                {{ servicesStore.activeServiceCount }}
              </span>
            </NuxtLink>

            <NuxtLink to="/dashboard/all-solutions"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors"
              :class="isActive('/dashboard/all-solutions') ? 'bg-primaryn text-white' : 'text-gray-700 hover:bg-gray-100'"
              @click="showMobileMenu = false">
              <IconLayoutGridAdd class="w-5 h-5" />
              <span class="font-medium">Toutes les solutions</span>
            </NuxtLink>

            <NuxtLink to="/dashboard/sessions"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors"
              :class="isActive('/dashboard/sessions') ? 'bg-primaryn text-white' : 'text-gray-700 hover:bg-gray-100'"
              @click="showMobileMenu = false">
              <IconLock class="w-5 h-5" />
              <span class="font-medium">Sessions</span>
            </NuxtLink>

            <NuxtLink to="/dashboard/profile" class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors"
              :class="isActive('/dashboard/profile') ? 'bg-primaryn text-white' : 'text-gray-700 hover:bg-gray-100'"
              @click="showMobileMenu = false">
              <IconUser class="w-5 h-5" />
              <span class="font-medium">Profile</span>
            </NuxtLink>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconChevronDown, IconHome, IconLayout2, IconLayoutGridAdd, IconLock, IconMenu, IconUser } from '@tabler/icons-vue'

const authStore = useAuthStore()
const servicesStore = useServicesStore()
const route = useRoute()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const isActive = (path: string) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
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
