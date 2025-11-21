<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">P</span>
            </div>
            <span class="text-xl font-bold text-gray-900">PGS User Space</span>
          </NuxtLink>

          <nav class="flex items-center space-x-4">
            <NuxtLink 
              to="/auth/login" 
              class="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Sign In
            </NuxtLink>
            <NuxtLink 
              to="/auth/register" 
              class="btn btn-primary"
            >
              Sign Up
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-600 text-sm">
          <p>&copy; {{ new Date().getFullYear() }} PGS. All rights reserved.</p>
          <p class="mt-2">Single Sign-On Platform for PGS Ecosystem</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>
