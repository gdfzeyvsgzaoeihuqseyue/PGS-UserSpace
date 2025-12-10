<template>
  <section class="py-20 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0"
        style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;">
      </div>
    </div>

    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
        {{ $t('indexPage.cta.title') }}
      </h2>
      <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
        {{ $t('indexPage.cta.subtitle') }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
// Static component
</script>
