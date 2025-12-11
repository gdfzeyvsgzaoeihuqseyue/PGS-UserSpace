<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Section Interactive (Carousel) -->
    <div
      class="hidden lg:block lg:w-2/3 relative h-screen sticky top-0 overflow-hidden bg-gray-900 border-r border-gray-800">
      <AuthCarousel />
    </div>

    <!-- Section Content (Page content) -->
    <div class="flex flex-1 flex-col relative w-full max-w-2xl mx-auto lg:mx-0 lg:max-w-none bg-white">

      <!-- Top Action -->
      <div class="absolute top-0 right-0 p-4 sm:p-6">
        <NuxtLink to="/"
          class="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors">
          <IconArrowLeft class="w-4 h-4" />
          <span>{{ $t('auth.back') }}</span>
        </NuxtLink>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <slot />
      </div>

      <!-- Footer -->
      <footer class="py-6 px-8 border-t border-gray-100 mt-auto">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>{{ $t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
          <div class="flex gap-4">
            <a href="#" class="hover:text-primary transition-colors">Confidentialité</a>
            <a href="#" class="hover:text-primary transition-colors">Conditions</a>
            <a href="#" class="hover:text-primary transition-colors">Aide</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthCarousel from '~/components/auth/Carousel.vue'
import { IconArrowLeft } from '@tabler/icons-vue'

const route = useRoute()
</script>
