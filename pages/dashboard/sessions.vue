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
    <div class="card bg-primary-50 border-primary-200">
      <div class="flex items-start">
        <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-bold text-primary-900">Current Session</h3>
          <p class="text-sm text-primary-700 mt-1">
            This is your current active session. Sessions automatically expire after 7 days of inactivity.
          </p>
        </div>
      </div>
    </div>

    <!-- Session Management Info -->
    <div class="card">
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="font-medium text-gray-900 mb-1">About Sessions</h3>
          <p class="text-sm text-gray-600">
            Your sessions are managed automatically using secure HTTP-only cookies.
            Each session includes:
          </p>
          <ul class="mt-2 space-y-1 text-sm text-gray-600">
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Access token valid for 1 hour
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Refresh token valid for 7 days
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
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
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">Always sign out on shared devices</p>
            <p class="text-sm text-gray-600">Prevent unauthorized access by logging out when using public computers</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">Use strong, unique passwords</p>
            <p class="text-sm text-gray-600">Protect your account with a password that's at least 8 characters long</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
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
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div class="text-left">
              <p class="font-medium text-gray-900">Sign Out</p>
              <p class="text-sm text-gray-600">End your current session</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
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