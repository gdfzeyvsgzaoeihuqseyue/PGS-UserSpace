<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center text-gray-600 text-sm space-y-2">
        <p>&copy; {{ new Date().getFullYear() }} PGS User Space. All rights reserved.</p>
        <p>Single Sign-On Platform for PGS Ecosystem</p>
      </div>

      <div class="text-center text-gray-600 text-sm space-y-2">
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a href="#" class="text-sm text-gray-500 hover:text-gray-900">
            Conditions d'utilisation
          </a>
          <a href="#" class="text-sm text-gray-500 hover:text-gray-900">
            Politique de confidentialité
          </a>
          <a href="#" class="text-sm text-gray-500 hover:text-gray-900">
            Support
          </a>
        </div>

        <!-- Liens sociaux -->
        <ul role="list" class="flex justify-center sm:justify-start space-x-4">
          <SocialCustomLink />
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SocialCustomLink } from '@/components/utils';
</script>

