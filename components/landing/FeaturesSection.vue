<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
          {{ $t('indexPage.featuresHeader.badge') }}
        </span>
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {{ $t('indexPage.featuresHeader.title') }}
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          {{ $t('indexPage.featuresHeader.subtitle') }}
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(feature, index) in features" :key="feature.title"
          class="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-primary/50 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
          :style="{ animationDelay: `${index * 0.1}s` }">
          <!-- Icon -->
          <div class="relative w-16 h-16 mb-6 transform group-hover:scale-110 transition-transform duration-300">
            <div
              class="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-10 group-hover:opacity-20 rounded-2xl transition-opacity">
            </div>
            <div
              class="relative w-full h-full flex items-center justify-center bg-white rounded-2xl shadow-md group-hover:shadow-lg transition-shadow">
              <component :is="feature.icon" class="w-8 h-8 text-primary" />
            </div>
          </div>

          <!-- Content -->
          <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
            {{ feature.title }}
          </h3>
          <p class="text-gray-600 leading-relaxed">
            {{ feature.description }}
          </p>

          <!-- Hover Effect -->
          <div
            class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconBolt, IconLayoutGridAdd, IconLock } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const features = computed(() => [
  {
    icon: IconLock,
    title: t('indexPage.features.secureAuth.title'),
    description: t('indexPage.features.secureAuth.description')
  },
  {
    icon: IconLayoutGridAdd,
    title: t('indexPage.features.multipleServices.title'),
    description: t('indexPage.features.multipleServices.description')
  },
  {
    icon: IconBolt,
    title: t('indexPage.features.lightningFast.title'),
    description: t('indexPage.features.lightningFast.description')
  }
])
</script>
