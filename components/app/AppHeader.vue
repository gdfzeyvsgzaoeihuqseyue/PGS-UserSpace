<template>
  <header class="fixed top-0 left-0 right-0 shadow-sm z-50 bg-white border-b border-gray-200">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo avec Badge Beta -->
        <NuxtLink to="/" class="flex items-center gap-2 hover:scale-105 overflow-hidden transition-all duration-300">
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

        <div class="flex items-center space-x-4">
          <NuxtLink to="/auth/login" class="hover:text-primary transition-colors">
            {{ $t('navbar.signIn') }}
          </NuxtLink>
          <NuxtLink to="/auth/register" class="btn btn-primary">
            {{ $t('navbar.signUp') }}
          </NuxtLink>

          <prefSettings />
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useSharedFiles } from '~/stores/sharedFiles';

const config = useRuntimeConfig();
const sharedFiles = useSharedFiles();
</script>
