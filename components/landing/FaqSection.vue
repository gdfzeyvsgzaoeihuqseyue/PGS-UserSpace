<template>
  <section class="relative py-24 overflow-hidden bg-white dark:bg-slate-900">
    <!-- Decorational Blobs -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-3xl animate-pulse">
      </div>
      <div class="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-3xl animate-pulse"
        style="animation-delay: 2s;"></div>
    </div>

    <div class="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center mb-16">
        <h2 class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl mb-4">
          <span class="text-primary text-3xl font-bold">
            Questions Fréquentes
          </span>
        </h2>
        <p class="text-lg text-slate-600 dark:text-slate-400">
          <span v-if="faqStore.loading">Recherche des questions les plus pertinentes...</span>
          <span v-else-if="faqStore.activeTopic">
            Questions aléatoires sur le sujet :
            <span class="font-semibold text-indigo-600 dark:text-indigo-400">{{ faqStore.activeTopic.name }}</span>
            <span v-if="faqStore.activeTopic.platform"
              class="text-sm ml-2 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {{ faqStore.activeTopic.platform.name }}
            </span>
          </span>
          <span v-else>Découvrez les réponses à vos questions.</span>
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <!-- Left Column: FAQ List (2/3) -->
        <div class="lg:col-span-2 space-y-4">
          <SkeletonLoading :loading="faqStore.loading" :count="4" type="list">
            <!-- FAQs -->
            <div v-if="faqStore.faqs.length > 0" class="space-y-4">
              <div v-for="(faq, index) in faqStore.faqs" :key="faq.id"
                class="group bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-500/30">
                <button @click="toggleFaq(index)"
                  class="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none">
                  <span
                    class="text-lg font-medium text-slate-900 dark:text-white pr-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {{ faq.question }}
                  </span>
                  <span class="flex-shrink-0 ml-2">
                    <svg class="w-6 h-6 text-slate-400 transform transition-transform duration-300"
                      :class="{ 'rotate-180': isOpen(index) }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div v-show="isOpen(index)"
                  class="px-6 pb-6 text-slate-600 dark:text-slate-300 prose prose-slate dark:prose-invert max-w-none">
                  <div
                    class="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-4">
                  </div>
                  <p>{{ faq.answer }}</p>

                  <div class="mt-4 flex items-center gap-4 text-xs text-slate-400">
                    <div class="flex items-center gap-1">
                      <span class="i-heroicons-hand-thumb-up w-4 h-4"></span>
                      <span>{{ faq.isUseful || 0 }} utile(s)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <div
                class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <svg class="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-slate-500">Aucune question trouvée pour le moment.</p>
              <button @click="faqStore.loadRandomFaqs()" class="mt-4 text-indigo-600 hover:text-indigo-500 font-medium">
                Essayer un autre sujet
              </button>
            </div>
          </SkeletonLoading>

          <!-- Refresh Action -->
          <div v-if="!faqStore.loading && faqStore.faqs.length > 0" class="text-center sm:text-left">
            <button @click="randomize"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all duration-300 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Découvrir d'autres questions
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

const sharedFiles = useSharedFiles();
const faqStore = useFaqStore()
const openIndex = ref<number | null>(0) // Open first one by default

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

const isOpen = (index: number) => openIndex.value === index

const randomize = async () => {
  openIndex.value = null
  await faqStore.loadRandomFaqs()
}

onMounted(() => {
  faqStore.loadRandomFaqs()
})
</script>
