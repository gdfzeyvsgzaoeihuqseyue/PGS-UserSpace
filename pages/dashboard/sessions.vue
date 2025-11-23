<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Active Sessions</h1>
      <p class="mt-2 text-gray-600">
        Manage your active login sessions across different devices
      </p>
    </div>

    <!-- Current Session Info -->
    <div class="relative card border-primary">
      <span class="absolute inset-0 bg-primary opacity-10 dark:opacity-20"></span>
      <div class="flex items-start">
        <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <IconShieldCheck class="w-6 h-6 text-white" />
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-bold text-primary">Current Session</h3>
          <p class="text-sm text-secondary mt-1">
            This is your current active session. Sessions automatically expire after 7 days of inactivity.
          </p>
        </div>
      </div>
    </div>

    <!-- Session Management Info -->
    <div class="card">
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <IconInfoCircle class="w-5 h-5 text-primary" />
        </div>
        <div class="flex-1">
          <h3 class="font-medium text-gray-900 mb-1">About Sessions</h3>
          <p class="text-sm text-gray-600">
            Your sessions are managed automatically using secure HTTP-only cookies.
            Each session includes:
          </p>
          <ul class="mt-2 space-y-1 text-sm text-gray-600">
            <li class="flex items-center">
              <IconCheck class="w-4 h-4 mr-2 text-green-600" />
              Access token valid for 1 hour
            </li>
            <li class="flex items-center">
              <IconCheck class="w-4 h-4 mr-2 text-green-600" />
              Refresh token valid for 7 days
            </li>
            <li class="flex items-center">
              <IconCheck class="w-4 h-4 mr-2 text-green-600" />
              Automatic token refresh
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Security Recommendations -->
    <div class="card">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Security Best Practices</h3>
      <div class="space-y-3">
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <IconCheck class="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">Always sign out on shared devices</p>
            <p class="text-sm text-gray-600">Prevent unauthorized access by logging out when using public computers</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <IconCheck class="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">Use strong, unique passwords</p>
            <p class="text-sm text-gray-600">Protect your account with a password that's at least 8 characters long</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <IconCheck class="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">Keep your browser updated</p>
            <p class="text-sm text-gray-600">Ensure you're using the latest version of your web browser for best
              security</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Actions -->
    <div class="card">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Session Actions</h3>
      <div class="space-y-3">
        <button @click="handleLogout"
          class="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <IconLogout class="w-5 h-5 text-red-600" />
            </div>
            <div class="text-left">
              <p class="font-medium text-gray-900">Sign Out</p>
              <p class="text-sm text-gray-600">End your current session</p>
            </div>
          </div>
          <IconChevronRight class="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>

    <!-- Technical Details -->
    <div class="card bg-gray-50">
      <details class="cursor-pointer">
        <summary class="font-medium text-gray-900">Technical Details</summary>
        <div class="mt-4 space-y-2 text-sm text-gray-600">
          <p><strong>Authentication Method:</strong> HTTP-only Cookies with JWT</p>
          <p><strong>Token Type:</strong> Bearer Token</p>
          <p><strong>Security Features:</strong></p>
          <ul class="list-disc list-inside ml-4 space-y-1">
            <li>Secure cookie transmission (HTTPS only in production)</li>
            <li>SameSite cookie policy</li>
            <li>Automatic token rotation</li>
            <li>IP address tracking</li>
            <li>User agent validation</li>
          </ul>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCheck, IconChevronRight, IconInfoCircle, IconLogout, IconShieldCheck } from '@tabler/icons-vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const authStore = useAuthStore()

const handleLogout = async () => {
  if (confirm('Are you sure you want to sign out?')) {
    await authStore.logout()
  }
}
</script>