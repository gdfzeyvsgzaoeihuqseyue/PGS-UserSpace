<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span class="text-primary-600">PGS</span>
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your centralized Single Sign-On platform for seamless access to all PGS ecosystem services
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/auth/register" class="btn btn-primary text-lg px-8 py-3">
            Get Started
          </NuxtLink>
          <NuxtLink to="/auth/login" class="btn btn-outline text-lg px-8 py-3">
            Sign In
          </NuxtLink>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <div class="card text-center hover:shadow-lg transition-shadow">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Secure Authentication</h3>
          <p class="text-gray-600">Industry-standard security with HTTP-only cookies and JWT tokens</p>
        </div>

        <div class="card text-center hover:shadow-lg transition-shadow">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Multiple Services</h3>
          <p class="text-gray-600">Access Templix, Suitops, EQT, Hire, and more with one account</p>
        </div>

        <div class="card text-center hover:shadow-lg transition-shadow">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
          <p class="text-gray-600">Instant authentication and seamless service switching</p>
        </div>
      </div>

      <!-- Services Showcase -->
      <div class="card">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Connected Services</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div class="w-12 h-12 bg-blue-600 rounded-lg mb-3"></div>
            <span class="font-medium text-gray-900">Suitops</span>
          </div>
          <div class="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div class="w-12 h-12 bg-purple-600 rounded-lg mb-3"></div>
            <span class="font-medium text-gray-900">Templix</span>
          </div>
          <div class="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div class="w-12 h-12 bg-green-600 rounded-lg mb-3"></div>
            <span class="font-medium text-gray-900">EQT</span>
          </div>
          <div class="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div class="w-12 h-12 bg-orange-600 rounded-lg mb-3"></div>
            <span class="font-medium text-gray-900">Hire</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'guest'
})
</script>
