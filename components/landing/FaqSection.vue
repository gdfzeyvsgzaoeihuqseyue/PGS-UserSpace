<template>
  <section class="py-20 bg-WtBAct border-t border-ash">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900">{{ $t('indexPage.faq.title') }}</h2>
        <p class="mt-4 text-gray-600">{{ $t('indexPage.faq.subtitle') }}</p>
      </div>

      <div class="space-y-4">
        <div v-for="(item, index) in faqItems" :key="index"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button @click="toggle(index)"
            class="flex items-center justify-between w-full px-6 py-4 text-left focus:outline-none">
            <span class="font-medium text-gray-900">{{ item.question }}</span>
            <IconChevronDown class="w-5 h-5 text-gray-400 transition-transform duration-200"
              :class="{ 'rotate-180': isOpen(index) }" />
          </button>
          <div v-show="isOpen(index)" class="px-6 pb-4 text-gray-600 bg-gray-50/50">
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const openIndex = ref<number | null>(0)

const faqItems = computed(() => [
  {
    question: t('indexPage.faq.item1.question'),
    answer: t('indexPage.faq.item1.answer')
  },
  {
    question: t('indexPage.faq.item2.question'),
    answer: t('indexPage.faq.item2.answer')
  },
  {
    question: t('indexPage.faq.item3.question'),
    answer: t('indexPage.faq.item3.answer')
  },
  {
    question: t('indexPage.faq.item4.question'),
    answer: t('indexPage.faq.item4.answer')
  }
])

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

const isOpen = (index: number) => openIndex.value === index
</script>
