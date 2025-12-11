<template>
  <div v-if="loading" :class="containerClass">
    <div v-for="i in count" :key="i" :class="itemClass" class="animate-pulse bg-gray-200 rounded"></div>
  </div>
  <slot v-else></slot>
</template>

<script setup lang="ts">
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  count: {
    type: Number,
    default: 1
  },
  type: {
    type: String,
    default: 'block', // 'block', 'list', 'grid', 'card'
    validator: (value: string) => ['block', 'list', 'grid', 'card', 'circle'].includes(value)
  },
  gridCols: {
    type: Number,
    default: 3
  }
})

const containerClass = computed(() => {
  if (props.type === 'grid') {
    return `grid grid-cols-1 md:grid-cols-${props.gridCols} gap-4`
  }
  if (props.type === 'list') {
    return 'space-y-4'
  }
  return ''
})

const itemClass = computed(() => {
  if (props.type === 'card') {
    return 'h-64'
  }
  if (props.type === 'circle') {
    return 'h-12 w-12 rounded-full'
  }
  if (props.type === 'list') {
    return 'h-16'
  }
  return 'h-8'
})
</script>
