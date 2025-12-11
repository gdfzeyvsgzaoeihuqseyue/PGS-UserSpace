<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">{{ $t('indexPage.testimonials.title') }}</h2>
        <p class="mt-4 text-xl text-gray-600">{{ $t('indexPage.testimonials.subtitle') }}</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(testimonial, index) in testimonials" :key="index"
          class="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
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

const { t } = useI18n()

const testimonials = computed(() => [
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
</script>
