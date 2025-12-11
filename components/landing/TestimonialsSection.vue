<template>
  <section class="py-20 bg-white">
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

      <div v-else-if="currentTestimonials.length > 0" class="grid md:grid-cols-3 gap-8">
        <div v-for="(testimonial, index) in currentTestimonials" :key="testimonial.id || index"
          class="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="flex items-center space-x-1 mb-4 text-yellow-400">
            <IconStarFilled v-for="i in 5" :key="i" class="w-5 h-5"
              :class="{ 'text-gray-300': i > (testimonial.note || 5) }" />
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
                  testimonial.company }}</span></p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid md:grid-cols-3 gap-8">
        <!-- Fallback -->
        <div v-for="(testimonial, index) in fallbackTestimonials" :key="index"
          class="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow opacity-70">
          <div class="flex items-center space-x-1 mb-4 text-yellow-400">
            <IconStarFilled v-for="i in 5" :key="i" class="w-5 h-5" />
          </div>
          <p class="text-gray-700 mb-6 italic">"{{ testimonial.quote }}"</p>
          <div class="flex items-center space-x-4">
            <div class="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
              {{ testimonial.author.charAt(0) }}
            </div>
            <div>
              <p class="font-bold text-gray-900">{{ testimonial.author }}</p>
              <p class="text-sm text-gray-500">{{ testimonial.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconStarFilled } from '@tabler/icons-vue'
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

const fallbackTestimonials = computed(() => [
  {
    quote: t('indexPage.testimonials.item1.quote'),
    author: "Jean Dupont",
    role: "CEO, TechStart"
  },
  {
    quote: t('indexPage.testimonials.item2.quote'),
    author: "Marie Curie",
    role: "Director, LabCorp"
  },
  {
    quote: t('indexPage.testimonials.item3.quote'),
    author: "Albert Einstein",
    role: "Founder, Relativity Inc"
  }
])

let intervalId: any

onMounted(() => {
  updateTestimonials()
  intervalId = setInterval(updateTestimonials, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>
