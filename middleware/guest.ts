export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // If user is authenticated, redirect to dashboard
  if (authStore.isAuthenticated && authStore.user) {
    return navigateTo('/me')
  }

  // Try to check session silently
  try {
    await authStore.checkSession()
    // If successful, redirect to dashboard
    return navigateTo('/me')
  } catch (error) {
    // Not authenticated, allow access to guest pages
    return
  }
})
