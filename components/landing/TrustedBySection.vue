<template>
  <section class="py-16 bg-WtBAct">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-base font-semibold text-primary tracking-wide uppercase">{{ $t('indexPage.trustedBy.title') }}
        </h2>

        <div v-if="pending" class="mt-8 flex justify-center gap-8 md:gap-16">
          <SkeletonLoading :loading="true" :count="4" type="circle" class="flex gap-8 md:gap-16" />
        </div>

        <div v-else-if="currentPartners.length > 0"
          class="mt-8 flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
          <div v-for="partner in currentPartners" :key="partner.id"
            class="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all duration-300">
            <img v-if="partner.logo" :src="partner.logo" :alt="partner.name" class="h-10 w-auto object-contain" />
            <div v-else class="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold">{{
              partner.name.charAt(0) }}</div>
            <span class="text-lg font-bold text-gray-500 hidden md:block">{{ partner.name }}</span>
          </div>
        </div>

        <div v-else class="mt-8 flex justify-center gap-8 md:gap-16 opacity-40">
          <!-- Fallback -->
          <div class="flex items-center space-x-2 grayscale">
            <div class="h-8 w-8 bg-gray-400 rounded-full"></div>
            <span class="text-xl font-bold text-gray-400">Partner 1</span>
          </div>
          <div class="flex items-center space-x-2 grayscale">
            <div class="h-8 w-8 bg-gray-400 rounded-full"></div>
            <span class="text-xl font-bold text-gray-400">Partner 2</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SkeletonLoading from '~/components/ui/SkeletonLoading.vue'

const config = useRuntimeConfig()
const { data: partnersData, pending } = await useFetch<any>('/solution/partner', {
  baseURL: config.public.pgsBaseAPI
})

const allPartners = computed(() => partnersData.value?.data || [])
const currentPartners = ref<any[]>([])

const updatePartners = () => {
  if (allPartners.value.length === 0) return
  // Shuffle and pick 4
  const shuffled = [...allPartners.value].sort(() => 0.5 - Math.random())
  currentPartners.value = shuffled.slice(0, 4)
}

watch(allPartners, () => {
  updatePartners()
})

let intervalId: any

onMounted(() => {
  updatePartners()
  intervalId = setInterval(updatePartners, 5 * 60 * 1000) // 5 minutes
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>
