<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-WtB via-bgClr to-WtBAct transition-colors duration-300">
    <AppHeader class="sticky top-0 z-50 backdrop-blur-md bg-white/70 supports-[backdrop-filter]:bg-white/60 border-b border-gray-200/50" />
    <main class="flex-grow pt-16 w-full overflow-x-hidden">
      <slot />
    </main>
    <AppFooter class="mt-auto" />
  </div>
</template>

<script setup lang="ts">
// Layout logic here if needed
</script>

<style>
/* Global transitions for a fluid feel */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-in-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
