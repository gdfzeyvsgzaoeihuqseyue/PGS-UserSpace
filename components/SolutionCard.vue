<template>
  <div class="card hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
    <!-- Header with Logo -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          <img v-if="solution.logo" :src="solution.logo" :alt="`${solution.name} logo`"
            class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center bg-primary">
            <span class="text-white font-bold text-xl">
              {{ solution.name.charAt(0) }}
            </span>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
            {{ solution.name }}
          </h3>
          <span class="badge badge-info text-xs">{{ solution.category }}</span>
        </div>
      </div>

      <!-- Auth Badge -->
      <div class="flex-shrink-0 flex gap-1">
        <span v-if="solution.allowAuth" class="badge badge-success" :title="$t('solutionCard.ssoAvailable')">
          <IconShieldCheck class="w-3 h-3 mr-1" />
          {{ $t('solutionCard.badges.sso') }}
        </span>
        <span v-if="solution.authType === 'all'" class="badge badge-warning"
          :title="$t('solutionCard.badges.multiple')">
          <IconUsers class="w-3 h-3 mr-1" />
          {{ $t('solutionCard.badges.multiple') }}
        </span>
        <span v-if="!solution.authType" class="badge badge-info" :title="$t('solutionCard.badges.free')">
          <IconLockOpen class="w-3 h-3 mr-1" />
          {{ $t('solutionCard.badges.free') }}
        </span>
      </div>
    </div>

    <!-- Description -->
    <p class="text-gray-600 text-sm mb-4 flex-grow">
      {{ solution.description }}
    </p>

    <!-- Features -->
    <div v-if="showFeatures && solution.features.length > 0" class="mb-4">
      <div class="border-t border-gray-200 pt-3">
        <p class="text-xs font-medium text-gray-700 mb-2">{{ $t('solutionCard.keyFeatures') }}</p>
        <ul class="space-y-1">
          <li v-for="(feature, index) in solution.features.slice(0, 3)" :key="index"
            class="flex items-start text-xs text-gray-600">
            <IconCheck class="w-3 h-3" />
            <span>{{ feature }}</span>
          </li>
        </ul>
        <p v-if="solution.features.length > 3" class="text-xs text-gray-500 mt-1 ml-4">
          {{ $t('solutionCard.others', { count: solution.features.length - 3 }, solution.features.length - 3) }}
        </p>
      </div>
    </div>

    <!-- Footer with CTA -->
    <div class="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between">
      <div class="text-xs text-gray-500">
        {{ solution.updatedAt }}
      </div>
      <div class="flex items-center space-x-2">
        <a :href="`${pgsUrl}/apps/${solution.slug}`" target="_blank" rel="noopener noreferrer"
          class="text-sm text-primary hover:text-secondary font-medium transition-colors">
          {{ $t('solutionCard.viewDetails') }}
        </a>
        <a :href="solution.ctaLink" target="_blank" rel="noopener noreferrer"
          class="btn btn-primary text-sm py-2 px-4 flex items-center space-x-1 group/btn">
          <span>{{ solution.ctaText || $t('solutionCard.open') }}</span>
          <IconArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Solution } from '~/types'
import { IconArrowRight, IconCheck, IconShieldCheck, IconLockOpen, IconUsers } from '@tabler/icons-vue'
import { useSharedFiles } from '~/stores/sharedFiles';

interface Props {
  solution: Solution
  showFeatures?: boolean
}

withDefaults(defineProps<Props>(), {
  showFeatures: false
})

const sharedFiles = useSharedFiles();
const { data: customData } = await useAsyncData('customData', () => sharedFiles.getCustomData());
const pgsUrl = computed(() => customData.value?.pgs?.url);
</script>
