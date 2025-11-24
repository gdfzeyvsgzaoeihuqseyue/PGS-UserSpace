<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('dashboard.menu.settings') }}</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ $t('prefSettings.preferences') }}
      </p>
    </div>

    <div class="space-y-6">
      <!-- Appearance & Language -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            {{ $t('settings.interface.title') }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('prefSettings.lang') }}
              </label>
              <prefLang2 />
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {{ $t('settings.interface.langDesc') }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('prefSettings.theme') }}
              </label>
              <prefTheme2 />
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {{ $t('settings.interface.themeDesc') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications (Mock) -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            {{ $t('settings.notifications.title') }}
          </h3>
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="email_notifications" name="email_notifications" type="checkbox"
                  class="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" checked>
              </div>
              <div class="ml-3 text-sm">
                <label for="email_notifications" class="font-medium text-gray-700 dark:text-gray-300">{{
                  $t('settings.notifications.email.title') }}</label>
                <p class="text-gray-500 dark:text-gray-400">{{ $t('settings.notifications.email.desc') }}</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="marketing_emails" name="marketing_emails" type="checkbox"
                  class="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded">
              </div>
              <div class="ml-3 text-sm">
                <label for="marketing_emails" class="font-medium text-gray-700 dark:text-gray-300">{{
                  $t('settings.notifications.marketing.title') }}</label>
                <p class="text-gray-500 dark:text-gray-400">{{ $t('settings.notifications.marketing.desc') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security (Mock) -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            {{ $t('settings.security.title') }}
          </h3>
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ $t('settings.security.2fa.title') }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('settings.security.2fa.desc') }}</p>
            </div>
            <button class="btn btn-outline text-sm">{{ $t('settings.security.2fa.enable') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { prefLang2, prefTheme2 } from '~/components/pref'
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
