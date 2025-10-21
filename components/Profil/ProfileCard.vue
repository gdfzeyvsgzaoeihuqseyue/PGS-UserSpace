<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
    <!-- Couverture -->
    <div class="relative h-48 bg-gray-100">
      <img
        :src="user.coverPictureUrl || `https://placehold.co/600x400/E0F2FE/0284C7?text=${encodeURIComponent(user.username || 'Couverture')}`"
        alt="Photo de couverture"
        class="w-full h-full object-cover">
      <!-- Avatar positionné par-dessus la couverture -->
      <div class="absolute left-1/2 sm:left-8 bottom-0 transform -translate-x-1/2 sm:translate-x-0 translate-y-1/2">
        <img
          :src="user.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.firstName)}&backgroundColor=007bff,ff9900&radius=50`"
          :alt="user.firstName + ' ' + user.lastName"
          class="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover">
      </div>
    </div>

    <!-- Détails Profil -->
    <div class="p-8 pt-20 sm:pt-8">
      <div class="text-center sm:text-left sm:ml-40">
        <h1 class="text-3xl font-extrabold text-gray-900">{{ user.firstName }} {{ user.lastName }}</h1>
        <p v-if="user.jobTitle && user.company" class="text-xl text-gray-600 mt-1">
          {{ user.jobTitle }} chez {{ user.company }}
        </p>
        <p v-else-if="user.jobTitle" class="text-xl text-gray-600 mt-1">
          {{ user.jobTitle }}
        </p>
        <p v-if="user.username" class="text-md text-gray-500 mt-2">@{{ user.username }}</p>

        <!-- Contact -->
        <div class="flex items-center justify-center sm:justify-start space-x-4 mt-3 text-gray-700">
          <span v-if="user.city" class="flex items-center">
            <IconMapPin class="w-4 h-4 mr-1 text-gray-500" /> {{ user.city }}
          </span>
          <span v-if="user.emailAddress" class="flex items-center">
            <IconMail class="w-4 h-4 mr-1 text-gray-500" /> {{ user.emailAddress }}
          </span>
          <span v-if="user.phoneNumber" class="flex items-center">
            <IconPhone class="w-4 h-4 mr-1 text-gray-500" /> {{ user.phoneNumber }}
          </span>
        </div>

        <!-- Compétences -->
        <div v-if="user.skills && user.skills.length > 0" class="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
          <span v-for="skill in user.skills" :key="skill"
            class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Bouton Modifier -->
      <div class="flex justify-end pt-4 border-t border-gray-100 mt-6">
        <button @click="$emit('edit-profile')"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
          <IconPencil class="h-5 w-5 mr-2" /> Modifier le Profil
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconPencil, IconMail, IconPhone, IconMapPin } from '@tabler/icons-vue';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['edit-profile']);
</script>
