<template>
  <div class="text-sm my-2 space-y-1">
    <div
      v-for="(rule, key) in rules"
      :key="key"
      class="flex items-center gap-2"
    >
      <span
        :class="[
          rule.passed ? 'text-green-600' : 'text-gray-400',
          'flex items-center'
        ]"
      >
        <IconCheck v-if="rule.passed" size="16" />
        <IconX v-else size="16" />
      </span>
      <span :class="rule.passed ? 'text-green-700' : 'text-gray-500'">{{ rule.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconCheck, IconX } from '@tabler/icons-vue'

const props = defineProps<{ password: string }>()

const rules = computed(() => ({
  length: {
    passed: props.password.length >= 8,
    label: 'Au moins 8 caractères'
  },
  uppercase: {
    passed: /[A-Z]/.test(props.password),
    label: 'Au moins une lettre majuscule'
  },
  lowercase: {
    passed: /[a-z]/.test(props.password),
    label: 'Au moins une lettre miniscule'
  },
  digit: {
    passed: /\d/.test(props.password),
    label: 'Au moins un chiffre'
  },
  special: {
    passed: /[@$!%*?&]/.test(props.password),
    label: 'Au moins un caractère spécial (@$!%*?&)'
  }
}))
</script>
