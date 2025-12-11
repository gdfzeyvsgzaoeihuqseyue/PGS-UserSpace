<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Section Interactive (Carousel) -->
    <div
      class="hidden lg:block lg:w-2/3 relative h-screen sticky top-0 overflow-hidden bg-gray-900 border-r border-gray-800">
      <AuthCarousel />
    </div>

    <!-- Section Content (Page content) -->
    <div
      class="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 w-full max-w-2xl mx-auto lg:mx-0 lg:max-w-none bg-white">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthCarousel from '~/components/auth/Carousel.vue'
</script>
