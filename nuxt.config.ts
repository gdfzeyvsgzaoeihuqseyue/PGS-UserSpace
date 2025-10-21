// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@pinia/nuxt',
  ],
  colorMode: {
    preference: 'light'
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      pgsApiBase: process.env.PGS_API
    }
  },

  app: {
    head: {
      title: 'PGS Space account',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})
