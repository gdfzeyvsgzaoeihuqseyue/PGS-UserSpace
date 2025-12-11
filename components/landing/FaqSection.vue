<template>
  <section v-if="faqStore.loading || faqStore.hasFaqs" class="py-20 bg-WtBAct border-t border-ash">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900">{{ $t('indexPage.faq.title') }}</h2>
        <p class="mt-4 text-gray-600">{{ $t('indexPage.faq.subtitle') }}</p>
      </div>

      <div v-if="faqStore.loading" class="flex justify-center py-12">
        <IconLoader2 class="w-8 h-8 animate-spin text-primary" />
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <!-- FAQs Column (2/3) -->
        <div class="lg:col-span-2 space-y-4">
          <div v-for="(item, index) in faqStore.activeFaqs" :key="item.id || index"
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button @click="toggle(index)"
              class="flex items-center justify-between w-full px-6 py-4 text-left focus:outline-none">
              <span class="font-medium text-gray-900">{{ item.question }}</span>
              <IconChevronDown class="w-5 h-5 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen(index) }" />
            </button>
            <div v-show="isOpen(index)" class="px-6 pb-4 bg-gray-50/50">
              <div class="text-gray-600 mb-4">{{ item.answer }}</div>

              <!-- Voting -->
              <div class="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-3">
                <span class="font-medium">Cet article vous a-t-il été utile ?</span>
                <div class="flex gap-2">
                  <button @click.stop="vote(item.id, 'useful')"
                    class="flex items-center gap-1 px-2 py-1 rounded hover:bg-green-50 text-gray-600 hover:text-green-700 transition">
                    <IconThumbUp class="w-4 h-4" />
                    <span>{{ item.isUseful || 0 }}</span>
                  </button>
                  <button @click.stop="vote(item.id, 'useless')"
                    class="flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 text-gray-600 hover:text-red-700 transition">
                    <IconThumbDown class="w-4 h-4" />
                    <span>{{ item.isUseless || 0 }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Image Column (1/3) - Desktop Only -->
        <div class="hidden lg:block lg:col-span-1">
          <div class="sticky top-24">
            <img :src="sharedFiles.paths.general.faq" alt="FAQ Illustration"
              class="w-full h-auto object-contain drop-shadow-xl" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconChevronDown, IconLoader2, IconThumbUp, IconThumbDown } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { useFaqStore } from '~/stores/faq'
import { useSharedFiles } from '~/stores/sharedFiles';

const sharedFiles = useSharedFiles();
const { t } = useI18n()
const faqStore = useFaqStore()
const openIndex = ref<number | null>(0)

onMounted(async () => {
  if (faqStore.faqs.length === 0) {
    await faqStore.fetchRandomFaqs()
  }
})

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

const isOpen = (index: number) => openIndex.value === index

const vote = async (id: string, type: 'useful' | 'useless') => {
  if (type === 'useful') {
    await faqStore.voteUseful(id)
  } else {
    await faqStore.voteUseless(id)
  }
}
</script>
