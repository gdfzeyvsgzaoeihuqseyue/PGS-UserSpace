<template>
  <div class="min-h-screen mt-16 font-body">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();
const sharedFilesUrl = runtimeConfig.public.pgsSharedFiles;

const heroImagePath = `${sharedFilesUrl}/SuitOps_Landing/Hero/index.png`;
const baseUrl = "https://pgs-user.netlify.app/";

useHead({
  titleTemplate: '%s | PGS MY SPACE',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: computed(() => t('meta.indexPage.description'))
    },

    // Open Graph (Facebook, LinkedIn)
    { property: 'og:title', content: computed(() => t('meta.indexPage.title')) },
    { property: 'og:description', content: computed(() => t('meta.indexPage.description')) },
    { property: 'og:image', content: heroImagePath },
    { property: 'og:url', content: baseUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: computed(() => t('meta.indexPage.title')) },
    { name: 'twitter:description', content: computed(() => t('meta.indexPage.description')) },
    { name: 'twitter:image', content: heroImagePath },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
    { rel: 'canonical', href: baseUrl }
  ]
});
</script>
