<template>
  <section v-if="faqStore.loading || faqStore.faqs.length > 0" class="relative py-20 bg-WtBAct overflow-hidden">
    <div class="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        <!-- Left Column (2/3) -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Header -->
          <div class="text-center sm:text-left mb-4">
            <h2 class="text-3xl font-bold text-primary sm:text-4xl">{{ $t('indexPage.faq.title') }}</h2>
            <p class="mt-4 text-xl text-gray-600">{{ $t('indexPage.faq.subtitle') }}</p>
          </div>

          <SkeletonLoading :loading="faqStore.loading" :count="4" type="list">
            <!-- FAQs -->
            <div v-if="faqStore.faqs.length > 0" class="space-y-4">
              <div v-if="faqStore.activeTopic" class="flex flex-wrap items-center gap-3 mt-2">
                <span v-if="faqStore.activeTopic.platform"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10">
                  {{ faqStore.activeTopic.platform.name }}
                </span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 ring-1 ring-inset ring-purple-700/10">
                  {{ faqStore.activeTopic.name }}
                </span>
              </div>
              <div v-for="(faq, index) in faqStore.faqs" :key="faq.id"
                class="group bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-500/30">
                <button @click="toggleFaq(index)"
                  class="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none">
                  <span
                    class="text-lg font-medium text-slate-900 dark:text-white pr-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {{ faq.question }}
                  </span>
                  <span class="flex-shrink-0 ml-2">
                    <IconChevronDown class="w-6 h-6 text-slate-400 transform transition-transform duration-300"
                      :class="{ 'rotate-180': isOpen(index) }" />
                  </span>
                </button>
                <div v-show="isOpen(index)"
                  class="px-6 pb-6 text-slate-600 dark:text-slate-300 prose prose-slate dark:prose-invert max-w-none">
                  <div
                    class="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-4">
                  </div>
                  <p class="mb-4">{{ faq.answer }}</p>

                  <div
                    class="flex items-center gap-4 text-sm text-slate-500 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                    <span class="font-medium text-xs">{{ t('indexPage.faq.usefulQuestion') }}</span>
                    <div class="flex gap-2">
                      <button @click.stop="vote(faq.id, 'useful')"
                        class="flex items-center gap-1 px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 text-slate-500 hover:text-green-600 transition-colors"
                        :class="{ 'text-green-600 font-medium': voteStatus[faq.id] === 'useful' }">
                        <IconThumbUp class="w-4 h-4" />
                        <span class="text-xs">{{ faq.isUseful || 0 }}</span>
                      </button>
                      <button @click.stop="vote(faq.id, 'useless')"
                        class="flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 transition-colors"
                        :class="{ 'text-red-600 font-medium': voteStatus[faq.id] === 'useless' }">
                        <IconThumbDown class="w-4 h-4" />
                        <span class="text-xs">{{ faq.isUseless || 0 }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </SkeletonLoading>

          <!-- Refresh Action -->
          <div v-if="!faqStore.loading && faqStore.faqs.length > 0" class="text-left">
            <button @click="randomize"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all duration-300 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              <IconRefresh class="w-4 h-4" />
              {{ t('indexPage.faq.discoverMore') }}
            </button>
          </div>
        </div>

        <!-- Right Column: Illustration (1/3) -->
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
import { ref, onMounted } from 'vue'
import { useFaqStore } from '~/stores/faq'
import SkeletonLoading from '~/components/ui/SkeletonLoading.vue'
import { useSharedFiles } from '~/stores/sharedFiles';
import { IconThumbUp, IconThumbDown, IconChevronDown, IconHelpCircle, IconRefresh } from '@tabler/icons-vue'

const { t } = useI18n()
const sharedFiles = useSharedFiles();
const faqStore = useFaqStore()
const openIndex = ref<number | null>(0) // Open first one by default
const voteStatus = ref<Record<string, 'useful' | 'useless' | null>>({})

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

const isOpen = (index: number) => openIndex.value === index

const randomize = async () => {
  openIndex.value = null
  await faqStore.loadRandomFaqs()
}

const vote = async (id: string, type: 'useful' | 'useless') => {
  if (voteStatus.value[id]) return // Prevent multiple votes per session

  if (type === 'useful') {
    await faqStore.voteUseful(id)
  } else {
    await faqStore.voteUseless(id)
  }
  voteStatus.value[id] = type
}

onMounted(() => {
  if (faqStore.faqs.length === 0) {
    faqStore.loadRandomFaqs()
  }
})
</script>
