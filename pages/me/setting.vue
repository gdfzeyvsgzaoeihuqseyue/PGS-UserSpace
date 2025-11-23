<template>
  <div class="max-w-4xl mx-auto">
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
            Interface
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('prefSettings.lang') }}
              </label>
              <prefLang />
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Select your preferred language for the interface.
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('prefSettings.theme') }}
              </label>
              <prefTheme />
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Choose between light and dark mode.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications (Mock) -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Notifications
          </h3>
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="email_notifications" name="email_notifications" type="checkbox"
                  class="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" checked>
              </div>
              <div class="ml-3 text-sm">
                <label for="email_notifications" class="font-medium text-gray-700 dark:text-gray-300">Email
                  Notifications</label>
                <p class="text-gray-500 dark:text-gray-400">Receive emails about your account activity.</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="marketing_emails" name="marketing_emails" type="checkbox"
                  class="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded">
              </div>
              <div class="ml-3 text-sm">
                <label for="marketing_emails" class="font-medium text-gray-700 dark:text-gray-300">Marketing
                  Emails</label>
                <p class="text-gray-500 dark:text-gray-400">Receive news and updates about PGS products.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security (Mock) -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Security
          </h3>
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account.</p>
            </div>
            <button class="btn btn-outline text-sm">Enable</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
