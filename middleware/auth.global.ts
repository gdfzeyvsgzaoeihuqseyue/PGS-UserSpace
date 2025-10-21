import { useAuthStore } from '~/stores/auth'; 
import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  const router = useRouter(); 

  // Set the router instance in the store if it hasn't been set yet
  // This is crucial for actions in the store to be able to push to routes
  if (!authStore.router) {
    authStore.setRouter(router);
  }

  // Pages d'authentification
  const isAuthPage = [
    '/auth/login', 
    '/auth/signup', 
    '/auth/reset-password', 
    '/auth/email-verify',
    '/auth/email-verify/resend'
  ].includes(to.path);

  // Vérifier si l'utilisateur est connecté et si son profil a été chargé
  if (!authStore.isLoggedIn && !authStore.loading && !authStore.user) {
    try {
      await authStore.fetchUser();
    } catch (error) {
      console.log('Middleware: User not logged in, fetchUser failed or no session.');
    }
  }

  // --- LOGIQUE DE REDIRECTION ---

  // CAS 1: L'utilisateur est connecté
  if (authStore.isLoggedIn) {
    // A. Si l'utilisateur est sur une page d'authentification, redirigez-le vers le tableau de bord
    if (isAuthPage) {
      console.log('Middleware: Logged in user trying to access auth page. Redirecting to /');
      return navigateTo('/');
    }

    // // B. Si le 2FA par application DOIT être configuré et l'utilisateur n'est PAS sur la page de sécurité
    // if (authStore.twoFactorNeedsAppConfiguration && to.path !== '/settings/security') {
    //   console.log('Middleware: 2FA app config required. Redirecting to /settings/security');
    //   return navigateTo('/settings/security');
    // }

    // C. Si l'email n'est pas vérifié ET l'utilisateur n'est PAS sur une page d'authentification ou la page de vérification d'email
    // et que le 2FA par application n'est PAS requis (pour éviter les conflits de redirection)
    if (!authStore.user?.isEmailVerified && !isAuthPage && to.path !== '/auth/email-verify/resend' && !authStore.twoFactorNeedsAppConfiguration) {
      console.log('Middleware: Email not verified. Redirecting to /auth/email-verify/resend');
      return navigateTo('/auth/email-verify/resend');
    }
  } 
  // CAS 2: L'utilisateur n'est PAS connecté
  else {
    // Si l'utilisateur essaie d'accéder à une page protégée (non-authentification)
    if (!isAuthPage) {
      console.log('Middleware: User not logged in. Redirecting to /auth/login');
      return navigateTo('/auth/login');
    }
  }

  // Si aucune redirection n'est nécessaire, laissez passer la requête
  console.log('Middleware: No redirection needed for', to.path);
});
