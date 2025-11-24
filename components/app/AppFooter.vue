<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center md:text-left text-gray-600 text-sm space-y-2 mb-4 md:mb-0">
        <p>{{ $t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
        <p>{{ $t('footer.description') }}</p>
      </div>

      <div class="flex flex-col items-center md:items-end text-gray-600 text-sm space-y-4 md:space-y-2">
        <div class="flex space-x-6">
          <a href="#" class="text-sm text-gray-500 hover:text-gray-900">
            {{ $t('footer.terms') }}
          </a>
          <a href="#" class="text-sm text-gray-500 hover:text-gray-900">
            {{ $t('footer.privacy') }}
          </a>
          <a href="#" class="text-sm text-gray-500 hover:text-gray-900">
            {{ $t('footer.support') }}
          </a>
        </div>

        <!-- Liens sociaux -->
        <ul role="list" class="flex justify-center space-x-4">
          <SocialCustomLink />
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SocialCustomLink } from '@/components/utils';
</script>
