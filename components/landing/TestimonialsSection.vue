<template>
  <section v-if="pending || currentTestimonials.length > 0" class="py-20 bg-WtB">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">{{ $t('indexPage.testimonials.title') }}</h2>
        <p class="mt-4 text-xl text-gray-600">{{ $t('indexPage.testimonials.subtitle') }}</p>
      </div>

      <div v-if="pending" class="grid md:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <SkeletonLoading :loading="true" :count="3" type="list" />
        </div>
      </div>

      <div v-else class="grid md:grid-cols-3 gap-8">
        <div v-for="(testimonial, index) in currentTestimonials" :key="testimonial.id || index"
          class="bg-gray-50 rounded-2xl p-8 border hover:shadow-lg transition-shadow relative"
          :class="testimonial.isFeatured ? 'border-primary shadow-md' : 'border-gray-100'">

          <!-- Platform Badge -->
          <div v-if="testimonial.platform" class="absolute top-4 right-4">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
              {{ testimonial.platform.name }}
            </span>
          </div>

          <div class="flex items-center space-x-1 mb-4 text-warning">
            <template v-for="i in 5" :key="i">
              <IconStarFilled v-if="i <= (testimonial.note || 5)" class="w-5 h-5 text-yellow-400" />
              <IconStarHalfFilled
                v-else-if="i === Math.ceil(testimonial.note || 5) && (testimonial.note || 5) % 1 !== 0"
                class="w-5 h-5 text-yellow-400" />
              <IconStarFilled v-else class="w-5 h-5 text-gray-300" />
            </template>
          </div>
          <p class="text-gray-700 mb-6 italic line-clamp-4">"{{ testimonial.content }}"</p>
          <div class="flex items-center space-x-4">
            <img v-if="testimonial.avatar" :src="testimonial.avatar" :alt="testimonial.author"
              class="h-10 w-10 rounded-full object-cover" />
            <div v-else
              class="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
              {{ testimonial.author.charAt(0) }}
            </div>
            <div>
              <p class="font-bold text-gray-900">{{ testimonial.author }}</p>
              <p class="text-sm text-gray-500">{{ testimonial.role }} <span v-if="testimonial.company">, {{
                testimonial.company
              }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconStarFilled, IconStarHalfFilled } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import SkeletonLoading from '~/components/ui/SkeletonLoading.vue'

const { t } = useI18n()
const config = useRuntimeConfig()

const { data: testimonialsData, pending } = await useFetch<any>('/solution/testimony', {
  baseURL: config.public.pgsBaseAPI,
  query: { isPublished: true }
})

const allTestimonials = computed(() => testimonialsData.value?.data || [])
const currentTestimonials = ref<any[]>([])

const updateTestimonials = () => {
  if (allTestimonials.value.length === 0) return
  const shuffled = [...allTestimonials.value].sort(() => 0.5 - Math.random())
  currentTestimonials.value = shuffled.slice(0, 3)
}

watch(allTestimonials, () => {
  updateTestimonials()
})

let intervalId: any

onMounted(() => {
  updateTestimonials()
  intervalId = setInterval(updateTestimonials, 1 * 60 * 1000) // Chaque minute
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>
