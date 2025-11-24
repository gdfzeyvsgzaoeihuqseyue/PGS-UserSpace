<template>
  <Listbox v-model="colorMode.preference">
    <div class="relative">
      <ListboxButton
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50"
        :title="$t('dashboard.preferences.theme', 'Thème')">
        <component :is="currentThemeIcon" class="w-5 h-5" />
      </ListboxButton>

      <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <ListboxOptions
          class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 focus:outline-none">
          <ListboxOption v-for="theme in themes" :key="theme.id" :value="theme.id" v-slot="{ active, selected }"
            as="template">
            <li :class="[
              active ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300',
              'cursor-pointer select-none relative py-2 pl-10 pr-4 flex items-center transition-colors'
            ]">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <component :is="theme.icon" class="w-5 h-5" />
              </span>
              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                {{ theme.name }}
              </span>
              <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-primary">
                <IconCheck class="w-4 h-4" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup>
import { computed } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { IconSun, IconMoon, IconDeviceDesktop, IconCheck } from '@tabler/icons-vue'

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
</script>
