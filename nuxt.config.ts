// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    ['nuxt-gtag', {
      id: process.env.GTAG_ID || 'G-S2H4ZNE84G',
      enabled: process.env.NODE_ENV === 'production'
    }],
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],

  site: {
    url: 'https://pgs-account.netlify.app',
    name: 'SuitOps',
  },

  sitemap: {
    xslColumns: [
      { label: 'URL', width: '50%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
      { label: 'Change Frequency', select: 'sitemap:changefreq', width: '12.5%' },
      { label: 'Hreflangs', select: 'count(xhtml:link)', width: '25%' },
    ],
  },

  runtimeConfig: {
    public: {
      pgsBaseAPI: process.env.PGS_API_URL,
      pgsSharedFiles: process.env.PGS_SHARED_FILES,
      betaMode: process.env.BETA_MODE === 'true',
      siteIdentifier: process.env.SITE_IDENTIFIER || 'user',
    }
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'nuxt-color-mode'
  },

  i18n: {
    locales: [
      { code: 'fr', lang: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'en', lang: 'en-US', name: 'English', file: 'en.json' }
    ],
    langDir: 'locales/',
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'system' as any,
    },
    compilation: {
      strictMessage: false
    }
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: '~/tailwind.config.ts'
  },

  app: {
    head: {
      title: 'PGS MY SPACE',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'Pro Gestion Soft' },
        { name: 'keywords', content: 'gestion entreprise, PME, Afrique, Bénin, SaaS, SuitOps, PGS, Pro Gestion Soft' },
        { name: 'google-site-verification', content: 'OdKxHpVkBSxk0mj4vD4OTmZPdVi5pWzyCu4QPIMHy9A' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://pgs-account.netlify.app' }
      ]
    }
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  ssr: false,
})
