<template>
  <div class="relative h-full w-full overflow-hidden bg-gray-900 text-white">
    <!-- Slides -->
    <div v-if="slides.length > 0" class="relative h-full w-full">
      <TransitionGroup name="fade">
        <div v-for="(slide, index) in slides" :key="slide.id" v-show="currentSlide === index"
          class="absolute inset-0 flex flex-col justify-end p-12 transition-all duration-700 ease-in-out">
          <!-- Background Image -->
          <div class="absolute inset-0 z-0">
            <img v-if="slide.backgroundImage" :src="slide.backgroundImage" class="h-full w-full object-cover opacity-60"
              :alt="slide.mainTitle" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          </div>

          <!-- Content -->
          <div class="relative z-10 max-w-2xl mb-12">
            <div v-if="slide.type === 'quote'" class="space-y-6">
              <IconQuote class="h-12 w-12 text-primary-400 opacity-80" />
              <blockquote class="text-2xl font-medium leading-relaxed md:text-3xl lg:text-4xl text-white">
                "{{ slide.content }}"
              </blockquote>
              <div class="mt-4 border-l-4 border-primary-500 pl-4 flex items-center gap-4">
                <img v-if="slide.image" :src="slide.image"
                  class="h-12 w-12 rounded-full object-cover border-2 border-primary-500" alt="Avatar" />
                <div>
                  <cite class="block text-lg font-semibold text-white not-italic">{{ slide.author }}</cite>
                  <span class="block text-sm text-gray-300">{{ slide.mainDescription }}</span>
                </div>
              </div>
            </div>

            <div v-else class="space-y-4">
              <div class="flex items-center gap-4 mb-4" v-if="slide.image">
                <img :src="slide.image" class="h-16 w-16 rounded-lg object-cover shadow-lg border border-white/10"
                  alt="Icon" />
                <div
                  class="inline-flex rounded-full bg-primary-500/20 px-3 py-1 text-sm font-medium text-primary-300 ring-1 ring-inset ring-primary-500/40 backdrop-blur-sm">
                  {{ slide.mainTitle }}
                </div>
              </div>
              <div v-else
                class="inline-flex rounded-full bg-primary-500/20 px-3 py-1 text-sm font-medium text-primary-300 ring-1 ring-inset ring-primary-500/40 backdrop-blur-sm">
                {{ slide.mainTitle }}
              </div>

              <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {{ slide.mainDescription }}
              </h2>
              <div class="prose prose-invert max-w-none text-lg text-gray-200" v-html="slide.content"></div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Indicators -->
      <div class="absolute bottom-12 left-12 z-20 flex space-x-2">
        <button v-for="(_, index) in slides" :key="index" @click="setSlide(index)"
          class="h-1.5 rounded-full transition-all duration-300 focus:outline-none"
          :class="currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'"
          aria-label="Go to slide" />
      </div>
    </div>

    <!-- Loading/Empty State -->
    <div v-else class="flex h-full items-center justify-center bg-gray-900">
      <div class="text-center" v-if="pending">
        <IconLoader2 class="mx-auto h-8 w-8 animate-spin text-primary-500" />
      </div>
      <div class="text-center px-6" v-else>
        <p class="text-gray-500">Aucune slide disponible</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconQuote, IconLoader2 } from '@tabler/icons-vue'

interface Slide {
  id: string
  type: 'text' | 'quote'
  mainTitle: string
  mainDescription: string
  content: string
  author?: string
  image?: string
  backgroundImage?: string
}

const config = useRuntimeConfig()
const currentSlide = ref(0)
let timer: any = null

const { data, pending } = await useFetch<any>(`/carousel-slide`, {
  baseURL: config.public.pgsBaseAPI,
  lazy: true
})

const slides = computed<Slide[]>(() => {
  if (data.value && Array.isArray(data.value.slides) && data.value.slides.length > 0) {
    return data.value.slides
  }
  return fallbackSlides
})

const fallbackSlides: Slide[] = [
  {
    id: 'f1',
    type: 'text',
    mainTitle: 'Sécurité Avancée',
    mainDescription: 'Protection de vos données',
    content: 'Nous utilisons les dernières technologies de chiffrement pour garantir la confidentialité et la sécurité de vos informations sensibles.',
    backgroundImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
  },
  {
    id: 'f2',
    type: 'quote',
    mainTitle: 'Témoignage',
    mainDescription: 'Directeur Technique',
    content: 'Une solution innovante qui a transformé notre gestion quotidienne. L\'interface est intuitive et les fonctionnalités sont puissantes.',
    author: 'Jean Dupont',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    backgroundImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
  }
]

const setSlide = (index: number) => {
  currentSlide.value = index
  resetTimer()
}

const nextSlide = () => {
  if (slides.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const resetTimer = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(nextSlide, 6000)
}

watch(slides, (newSlides) => {
  if (newSlides.length > 0) {
    resetTimer()
  }
})

onMounted(() => {
  if (slides.value.length > 0) {
    resetTimer()
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
