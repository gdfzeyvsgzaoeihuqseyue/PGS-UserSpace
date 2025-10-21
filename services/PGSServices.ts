import axios from 'axios';
import { useRuntimeConfig } from 'nuxt/app';

export function PGSServices() {
  const config = useRuntimeConfig();
  const API = config.public.pgsApiBase;
  const USER = `${API}/user`;
  const CRSL_SLD = `${API}/carousel-slide`;

  const apiSecure = axios.create({
    baseURL: API,
    withCredentials: true,
  });

  // REFRESH TOKEN
  let isRefreshing = false;
  let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  // INTERCEPTION
  apiSecure.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      // Si erreur 401 et pas déjà en train de refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Attendre que le refresh soit terminé
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            return apiSecure(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Appeler l'endpoint de refresh
          await apiSecure.post(`${USER}/auth/refresh-token`);
          processQueue(null, 'refreshed');
          return apiSecure(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Rediriger vers login
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  // USER
  const registerUser = (formData: FormData) =>
    apiSecure.post(`${USER}/auth/register`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

  const verifyEmail = (token: string) =>
    apiSecure.get(`${USER}/auth/verify-email?token=${token}`);

  const requestEmailVerification = (emailAddress: string) =>
    apiSecure.post(`${USER}/auth/request-email-verification`, { emailAddress });

  const login = (identifier: string, password: string, twoFactorCode?: string, requestNewTwoFactorCode?: boolean) => {
    return apiSecure.post(`${USER}/auth/login`, {
      identifier,
      password,
      twoFactorCode,
      requestNewTwoFactorCode,
    });
  };

  const logout = () => apiSecure.post(`${USER}/profile/logout`);

  const getProfile = () => apiSecure.get(`${USER}/profile`);

  const updateProfileInfo = (data: any) => {
    return apiSecure.put(`${USER}/profile/update-info`, data);
  };

  const updateProfilePhoto = (formData: FormData) => {
    return apiSecure.put(`${USER}/profile/update-photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  };

  const changeEmail = (newEmailAddress: string, password: string) => {
    return apiSecure.put(`${USER}/profile/change-email`, {
      newEmailAddress,
      password,
    });
  };

  const generateTwoFactorSecret = () =>
    apiSecure.post(`${USER}/security/2fa-generate`);

  const verifyTwoFactorSetup = (token: string) =>
    apiSecure.post(`${USER}/security/2fa-setup`, { token });

  const enableTwoFactor = () =>
    apiSecure.post(`${USER}/security/2fa-enable`);

  const disableTwoFactor = (twoFactorCode?: string, temporary?: boolean) => {
    return apiSecure.post(`${USER}/security/2fa-disable`, {
      twoFactorCode,
      temporary,
    });
  };

  // CAROUSEL
  const getAllCarouselSlides = () => apiSecure.get(CRSL_SLD);

  return {
    registerUser,
    verifyEmail,
    requestEmailVerification,
    login,
    logout,
    getProfile,
    updateProfileInfo,
    updateProfilePhoto,
    changeEmail,
    generateTwoFactorSecret,
    verifyTwoFactorSetup,
    enableTwoFactor,
    disableTwoFactor,
    getAllCarouselSlides,
  };
}
