import { defineStore } from 'pinia';
import { PGSServices } from '~/services/PGSServices';
import type { User, AuthState, UserUpdateData } from '~/types' 

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    requiresTwoFactor: false,
    twoFactorMethod: null,
    router: null,
  }),

  getters: {
    twoFactorNeedsAppConfiguration: (state) =>
      state.user?.twoFactorEnabled &&
      !state.user?.twoFactorSecretConfigured &&
      !state.user?.twoFactorTemporarilyDisabled,

    isTwoFactorTemporarilyDisabled: (state) =>
      state.user?.twoFactorEnabled && state.user?.twoFactorTemporarilyDisabled,

    isTwoFactorActiveGlobally: (state) =>
      state.user?.twoFactorEnabled && !state.user?.twoFactorTemporarilyDisabled,
  },

  actions: {
    setRouter(router: any) {
      this.router = router;
    },

    // Gestion du requestNewTwoFactorCode
    async login(identifier: string, password: string, twoFactorCode?: string, requestNewCode: boolean = false) {
      this.loading = true;
      this.error = null;
      this.requiresTwoFactor = false;
      this.twoFactorMethod = null;

      try {
        const { login: loginService } = PGSServices();
        const response = await loginService(identifier, password, twoFactorCode, requestNewCode);

        if (response.data.requiresTwoFactor) {
          this.requiresTwoFactor = true;
          this.twoFactorMethod = response.data.method;
          this.error = response.data.message;
          return {
            success: false,
            requiresTwoFactor: true,
            message: response.data.message,
            method: response.data.method,
            newCodeSent: response.data.newCodeSent || false,
          };
        } else {
          this.user = response.data.user;
          this.token = response.data.token;
          this.isLoggedIn = true;
          if (this.router) {
            this.router.push('/');
          }
          return { success: true, user: this.user, token: this.token };
        }
      } catch (err: any) {
        console.error('Login error:', err);
        const errorMessage = err.response?.data?.message || 'Une erreur inattendue est survenue.';
        this.error = errorMessage;

        if (err.response?.status === 401 && err.response?.data?.requiresTwoFactor) {
          this.requiresTwoFactor = true;
          this.twoFactorMethod = err.response.data.method;
          return {
            success: false,
            message: errorMessage,
            code: 'deuxFacteursRequis',
            requiresTwoFactor: true,
            method: err.response.data.method,
            newCodeSent: err.response.data.newCodeSent || false,
          };
        } else if (err.response?.status === 404) {
          return { success: false, message: errorMessage, code: 'utilisateurInexistant' };
        } else if (err.response?.status === 400) {
          return { success: false, message: errorMessage, code: 'motDePasseIncorrect' };
        } else if (err.response?.status === 403) {
          if (errorMessage.includes('vérifier votre adresse email')) {
            return { success: false, message: errorMessage, code: 'nonVerifie' };
          } else if (errorMessage.includes('suspendu')) {
            return { success: false, message: errorMessage, code: 'compteSuspendu' };
          } else if (errorMessage.includes('supprimé')) {
            return { success: false, message: errorMessage, code: 'compteSupprime' };
          }
        } else if (err.response?.status === 429) {
          return { success: false, message: errorMessage, code: 'tropDeTentatives' };
        }

        return { success: false, message: errorMessage, code: 'erreurServeur' };
      } finally {
        this.loading = false;
      }
    },

    async verifyTwoFactor(identifier: string, password: string, twoFactorCode: string) {
      this.loading = true;
      this.error = null;

      try {
        const { login: loginService } = PGSServices();
        const response = await loginService(identifier, password, twoFactorCode);

        this.user = response.data.user;
        this.token = response.data.token;
        this.isLoggedIn = true;
        this.requiresTwoFactor = false;
        this.twoFactorMethod = null;

        if (this.router) {
          this.router.push('/');
        }

        return { success: true, user: this.user, token: this.token };
      } catch (err: any) {
        console.error('2FA verification error:', err);
        const errorMessage = err.response?.data?.message || 'Code 2FA invalide ou erreur inattendue.';
        this.error = errorMessage;
        return { success: false, message: errorMessage, code: 'codeDeuxFacteursInvalide' };
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      this.error = null;

      try {
        const { logout: logoutService } = PGSServices();
        await logoutService();
        this.$reset();
        if (this.router) {
          this.router.push('/auth/login');
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Une erreur est survenue lors de la déconnexion.';
        console.error('Logout error:', err);
      } finally {
        this.loading = false;
      }
    },

    // Structure de réponse
    async fetchUser() {
      this.loading = true;
      this.error = null;

      try {
        const { getProfile } = PGSServices();
        const response = await getProfile();

        this.user = response.data.data || response.data.user || response.data;
        this.isLoggedIn = true;
        this.requiresTwoFactor = false;
        this.twoFactorMethod = null;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Impossible de récupérer les informations utilisateur.';
        this.$reset();
        console.error('Fetch user error:', err);

        if (this.router && this.router.currentRoute.value.path !== '/auth/login') {
          this.router.push('/auth/login');
        }
      } finally {
        this.loading = false;
      }
    },

    // Mise à jour de profil
    async updateUserProfileInfo(data: UserUpdateData) {
      if (!this.user) {
        return { success: false, message: 'Aucun utilisateur connecté.' };
      }

      this.loading = true;
      this.error = null;
      const previousUser = { ...this.user }; 

      try {
        this.user = { ...this.user, ...data } as User; 

        const { updateProfileInfo } = PGSServices();
        const response = await updateProfileInfo(data);

        this.user = { ...this.user, ...response.data.user } as User; 
        return { success: true, message: response.data.message };

      } catch (err: any) {
        console.error('Update profile info error:', err);
        this.user = previousUser; 

        const errorMessage = err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour.';
        this.error = errorMessage;
        return { success: false, message: errorMessage, errors: err.response?.data?.errors };
      } finally {
        this.loading = false;
      }
    },
    
    async updateUserProfilePhoto(formData: FormData) {
      this.loading = true;
      this.error = null;

      try {
        const { updateProfilePhoto } = PGSServices();
        const response = await updateProfilePhoto(formData);

        // Mettre à jour uniquement les URLs des photos
        if (this.user) {
          this.user.profilePictureUrl = response.data.profilePictureUrl || this.user.profilePictureUrl;
          this.user.coverPictureUrl = response.data.coverPictureUrl || this.user.coverPictureUrl;
        }

        return { success: true, message: response.data.message };
      } catch (err: any) {
        console.error('Update profile photo error:', err);
        const errorMessage = err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour des photos.';
        this.error = errorMessage;
        return { success: false, message: errorMessage, errors: err.response?.data?.errors };
      } finally {
        this.loading = false;
      }
    },
    async changeUserEmail(newEmailAddress: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const { changeEmail } = PGSServices();
        const response = await changeEmail(newEmailAddress, password);

        if (this.user) {
          this.user.emailAddress = newEmailAddress;
          this.user.isEmailVerified = false;
        }

        return { success: true, message: response.data.message };
      } catch (err: any) {
        console.error('Change email error:', err);
        const errorMessage = err.response?.data?.message || 'Une erreur est survenue lors du changement d\'email.';
        this.error = errorMessage;
        return { success: false, message: errorMessage };
      } finally {
        this.loading = false;
      }
    },

    // 2FA endpoints
    async enableTwoFactor() {
      this.loading = true;
      this.error = null;

      try {
        const { enableTwoFactor } = PGSServices();
        const response = await enableTwoFactor();

        if (this.user) {
          this.user.twoFactorEnabled = true;
        }

        return { success: true, message: response.data.message };
      } catch (err: any) {
        console.error('Enable 2FA error:', err);
        const errorMessage = err.response?.data?.message || 'Impossible d\'activer la 2FA.';
        this.error = errorMessage;
        return { success: false, message: errorMessage };
      } finally {
        this.loading = false;
      }
    },

    async disableTwoFactor(twoFactorCode?: string, temporary: boolean = false) {
      this.loading = true;
      this.error = null;

      try {
        const { disableTwoFactor } = PGSServices();
        const response = await disableTwoFactor(twoFactorCode, temporary);

        if (this.user) {
          if (temporary) {
            this.user.twoFactorTemporarilyDisabled = true;
          } else {
            this.user.twoFactorEnabled = false;
            this.user.twoFactorSecretConfigured = false;
          }
        }

        return { success: true, message: response.data.message };
      } catch (err: any) {
        console.error('Disable 2FA error:', err);
        const errorMessage = err.response?.data?.message || 'Impossible de désactiver la 2FA.';
        this.error = errorMessage;
        return { success: false, message: errorMessage };
      } finally {
        this.loading = false;
      }
    },
  },
});
