<template>
  <div class="min-h-screen mt-16 font-body">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const sharedFilesUrl = runtimeConfig.public.pgsSharedFiles;

const heroImagePath = `${sharedFilesUrl}/SuitOps_Landing/Hero/index.png`;
const baseUrl = "https://pgs-account.netlify.app";

useHead({
  titleTemplate: '%s | PGS MY SPACE',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: 'PGS Single Sign-On Platform.'
    },
    
    // Open Graph (Facebook, LinkedIn)
    { property: 'og:title', content: 'PGS MY SPACE - PGS Single Sign-On Platform' },
    { property: 'og:description', content: '....' },
    { property: 'og:image', content: heroImagePath },
    { property: 'og:url', content: baseUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'PGS MY SPACE - PGS Single Sign-On Platform' },
    { name: 'twitter:description', content: '....' },
    { name: 'twitter:image', content: heroImagePath },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
    { rel: 'canonical', href: baseUrl }
  ]
});
</script>