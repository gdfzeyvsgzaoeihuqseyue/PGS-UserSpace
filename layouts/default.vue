<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-WtB via-bgClr to-WtBAct transition-colors duration-300">
    <AppHeader />
    <main class="flex-grow pt-16 w-full overflow-x-hidden">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
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
