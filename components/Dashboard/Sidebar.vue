<template>
  <nav :class="[
    'bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-300 ease-in-out flex flex-col h-full',
    isSidebarOpen ? 'w-64' : 'w-20',
  ]">
    <!-- Header (Logo + Toggle) -->
    <div class="flex items-center flex-shrink-0" :class="{
      'justify-between mb-6': isSidebarOpen,
      'justify-center mb-4': !isSidebarOpen,
    }">
      <NuxtLink to="/" v-if="isSidebarOpen"
        class="flex items-center gap-2 group transition-transform duration-200 hover:scale-105 hover:opacity-80">
        <img src="/img/logoDeskCol.png" alt="Logo" class="h-8 w-auto sm:h-10 hidden md:block" />
        <img src="/img/logoMobCol.png" alt="Logo" class="h-8 w-auto sm:h-10 block md:hidden" />
      </NuxtLink>

      <button @click="emit('toggle-sidebar')"
        class="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 rounded-md transition-colors duration-200 flex-shrink-0"
        :class="{ 'ml-auto': isSidebarOpen }">
        <IconMenu2 v-if="!isSidebarOpen" class="w-6 h-6" />
        <IconX v-else class="w-6 h-6" />
      </button>
    </div>

    <!-- Navigation List -->
    <div class="flex-1 overflow-y-auto">
      <ul class="space-y-2">
        <li v-for="item in navItems" :key="item.tab">
          <button @click="selectTab(item.tab)" :class="[
            'sidebar-item w-full text-left flex items-center transition-colors',
            { active: activeTab === item.tab },
            isSidebarOpen ? 'justify-start' : 'justify-center',
          ]" :title="!isSidebarOpen ? item.label : ''">
            <component :is="item.iconComponent" class="w-5 h-5 flex-shrink-0" :class="{ 'mr-3': isSidebarOpen }" />
            <span v-if="isSidebarOpen" class="whitespace-nowrap">
              {{ item.label }}
            </span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Footer -->
    <div v-if="isSidebarOpen" class="flex-shrink-0 pt-4 border-t border-gray-200">
      <AppFooter />
    </div>
  </nav>

  <div v-if="isSidebarOpen && isMobile" @click="emit('toggle-sidebar')" class="fixed inset-0 bg-black opacity-30 z-30">
  </div>
</template>


<script setup>
import { IconMenu2, IconX, IconUserCircle, IconShieldLock, IconFingerprint, IconBell, IconSettings, IconTrash } from '@tabler/icons-vue';
import AppFooter from '@/components/app/Footer.vue';

const props = defineProps({
  activeTab: String,
  isSidebarOpen: Boolean,
  isMobile: Boolean,
});

const emit = defineEmits(['update:activeTab', 'toggle-sidebar']);

const navItems = [
  { tab: 'profil', label: 'Mon profil', iconComponent: IconUserCircle },
  { tab: 'securite', label: 'Sécurité', iconComponent: IconShieldLock },
  { tab: 'confidentialite', label: 'Confidentialité', iconComponent: IconFingerprint },
  { tab: 'notifications', label: 'Notifications', iconComponent: IconBell },
  { tab: 'services', label: 'Mes services', iconComponent: IconSettings },
  { tab: 'supprimer', label: 'Supprimer un service', iconComponent: IconTrash },
];

const selectTab = (tab) => {
  emit('update:activeTab', tab);
  if (props.isMobile) {
    emit('toggle-sidebar');
  }
};
</script>

<style scoped>
.sidebar-item {
  @apply flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors;
}

.sidebar-item.active {
  @apply bg-blue-50 text-blue-700 font-medium;
}
</style>
