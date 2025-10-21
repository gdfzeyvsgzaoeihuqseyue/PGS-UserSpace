<template>
  <div class="flex justify-center mb-4">
  <button @click="emit('toggle-sidebar')" 
    class="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 rounded-md transition-colors duration-200">
    <IconMenu2 v-if="!isSidebarOpen" class="w-6 h-6" />
    <IconX v-else class="w-6 h-6" />
  </button>
</div>

  <nav :class="[
    'bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-300 ease-in-out',
    isSidebarOpen ? 'w-64' : 'w-20', 'h-full overflow-y-auto',
    { 'fixed top-16 left-0 z-40': isMobile }, { 'lg:static lg:block': !isMobile },
  ]">
    <div v-if="isMobile && isSidebarOpen" class="flex justify-end mb-4">
      <button @click="emit('toggle-sidebar')" class="p-2 text-gray-500 hover:text-gray-700">
        <IconX class="w-6 h-6" />
      </button>
    </div>

    <ul class="space-y-2">
      <li v-for="item in navItems" :key="item.tab">
        <button @click="selectTab(item.tab)" :class="[
          'sidebar-item w-full text-left flex items-center transition-colors',
          { 'active': activeTab === item.tab },
          isSidebarOpen ? 'justify-start' : 'justify-center',
        ]" :title="!isSidebarOpen ? item.label : ''">
          <component :is="item.iconComponent" class="w-5 h-5 flex-shrink-0" :class="{ 'mr-3': isSidebarOpen }" />
          <span v-if="isSidebarOpen" class="whitespace-nowrap">{{ item.label }}</span>
        </button>
      </li>
    </ul>
  </nav>

  <div v-if="isSidebarOpen && isMobile" @click="emit('toggle-sidebar')"
    class="fixed inset-0 bg-black opacity-30 z-30"></div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { IconMenu2, IconX, IconUserCircle, IconShieldLock, IconFingerprint, IconDeviceLaptop, IconBell, IconSettings, IconCloudUpload, IconTrash } from '@tabler/icons-vue';

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
