<template>
  <div class="relative">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IconSearch class="h-5 w-5 text-gray-400" />
      </div>
      <input type="text" v-model="modelValue" :placeholder="placeholder"
        class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200 ease-in-out shadow-sm" />
      <div v-if="modelValue" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button @click="clearSearch"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <IconX class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconSearch, IconX } from '@tabler/icons-vue'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Rechercher...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'clear': []
}>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const clearSearch = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>
