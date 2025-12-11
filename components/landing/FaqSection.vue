<template>
  <section v-if="faqStore.loading || faqStore.hasFaqs" class="py-20 bg-WtBAct border-t border-ash">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900">{{ $t('indexPage.faq.title') }}</h2>
        <p class="mt-4 text-gray-600">{{ $t('indexPage.faq.subtitle') }}</p>
      </div>

      <div v-if="faqStore.loading" class="flex justify-center py-12">
        <IconLoader2 class="w-8 h-8 animate-spin text-primary" />
      </div>

      <div v-else class="space-y-4">
        <div v-for="(item, index) in faqStore.activeFaqs" :key="item.id || index"
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
import { IconChevronDown, IconLoader2 } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { useFaqStore } from '~/stores/faq'

const { t } = useI18n()
const faqStore = useFaqStore()
const openIndex = ref<number | null>(0)

onMounted(async () => {
  if (faqStore.faqs.length === 0) {
    await faqStore.fetchFaqs()
  }
})

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

const isOpen = (index: number) => openIndex.value === index
</script>
