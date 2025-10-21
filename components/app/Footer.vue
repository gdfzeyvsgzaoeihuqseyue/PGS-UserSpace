<template>
  <footer class="text-center text-xs text-gray-500 py-4 border-t border-gray-200">
    <p>&copy; {{ currentYear }} Mon Compte. Tous droits réservés.</p>
    <p class="mt-1">
      <a href="#" class="hover:underline">Politique de confidentialité</a> |
      <a href="#" class="hover:underline">Conditions d'utilisation</a>
    </p>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>
