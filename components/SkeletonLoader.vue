<!-- components/SkeletonLoader.vue -->
<template>
  <div class="animate-pulse">
    <!-- Profile Card Skeleton -->
    <div v-if="type === 'profile-card'" class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div class="h-48 bg-gray-200"></div>
      <div class="p-8 pt-20">
        <div class="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="flex space-x-2">
          <div class="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div class="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div class="h-6 w-20 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- Form Skeleton -->
    <div v-else-if="type === 'form'" class="space-y-4">
      <div v-for="i in 5" :key="i" class="space-y-2">
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- List Skeleton -->
    <div v-else-if="type === 'list'" class="space-y-3">
      <div v-for="i in 3" :key="i" class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
        <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div class="flex-1">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'profile-card',
    validator: (value) => ['profile-card', 'form', 'list'].includes(value),
  },
});
</script>