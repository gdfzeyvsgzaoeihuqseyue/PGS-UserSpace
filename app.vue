<template>
  <div class="min-h-screen bg-gray-50 text-textClr">
    <NuxtPage />
  </div>
</template>

<script setup>
useHead({
  titleTemplate: '%s | PGS Space account',
  meta: [
    { name: 'description', content: 'Gérez votre profil et vos services PGS' }
  ]
})
</script>