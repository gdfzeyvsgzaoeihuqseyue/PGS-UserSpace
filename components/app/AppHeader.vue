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
          <NuxtLink :to="localePath('/auth/login')" class="hover:text-primary transition-colors font-medium">
            {{ $t('navbar.signIn') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/auth/register')" class="btn btn-primary">
            {{ $t('navbar.signUp') }}
          </NuxtLink>

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
    <div v-show="isMobileMenuOpen"
      class="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg z-40">
      <div class="px-4 pt-2 pb-4 space-y-3">
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

        <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div class="px-3 py-2">
            <prefSettings />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useSharedFiles } from '~/stores/sharedFiles';
import { IconMenu, IconX } from '@tabler/icons-vue';
import { prefSettings } from '~/components/pref'

const config = useRuntimeConfig();
const sharedFiles = useSharedFiles();
const isMobileMenuOpen = ref(false);
const localePath = useLocalePath();

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Close mobile menu when route changes
const route = useRoute();
watch(() => route.path, () => {
  isMobileMenuOpen.value = false;
});
</script>
