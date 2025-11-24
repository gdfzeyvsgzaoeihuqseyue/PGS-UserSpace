<template>
  <button @click="cycleTheme"
    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50"
    :title="$t('dashboard.preferences.theme', 'Thème')">
    <component :is="currentThemeIcon" class="w-5 h-5" />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-vue'

const colorMode = useColorMode()
const themes = [
  { id: 'system', name: 'Système', icon: IconDeviceDesktop },
  { id: 'light', name: 'Clair', icon: IconSun },
  { id: 'dark', name: 'Sombre', icon: IconMoon }
]

const currentThemeIcon = computed(() => {
  const theme = themes.find(t => t.id === colorMode.preference)
  return theme ? theme.icon : IconDeviceDesktop
})

const cycleTheme = () => {
  const currentIndex = themes.findIndex(t => t.id === colorMode.preference)
  const nextIndex = (currentIndex + 1) % themes.length
  colorMode.preference = themes[nextIndex].id
}
</script>
