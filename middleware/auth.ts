export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Skip if already authenticated
  if (authStore.isAuthenticated && authStore.user) {
    return
  }

  try {
    // Try to restore session
    await authStore.checkSession()
  } catch (error) {
    // Session invalid, redirect to login
    return navigateTo('/auth/login')
  }
})