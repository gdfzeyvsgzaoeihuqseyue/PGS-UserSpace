import { defineStore } from 'pinia';
import { PGSServices } from '~/services/PGSServices';

export interface Slide {
  id: number;
  type: 'quote' | 'text' | 'image';
  content?: string;
  author?: string;
  image?: string;
  mainTitle?: string;
  mainDescription?: string;
  backgroundImage?: string;
}

interface SlidesState {
  slides: Slide[];
  loading: boolean;
  error: string | null;
  currentIndex: number;
  intervalId: ReturnType<typeof setInterval> | null;
  progress: number;
  slideDuration: number;
}

export const useSlidesStore = defineStore('slides', {
  state: (): SlidesState => ({
    slides: [],
    loading: false,
    error: null,
    currentIndex: 0,
    intervalId: null,
    progress: 0,
    slideDuration: 20000, // 20 secondes
  }),

  getters: {
    currentSlide: (state) => state.slides[state.currentIndex],
  },

  actions: {
    async fetchSlides() {
      this.loading = true;
      this.error = null;
      try {
        const { getAllCarouselSlides } = PGSServices();
        const response = await getAllCarouselSlides();
        this.slides = response.data.slides || response.data;
        if (this.slides.length > 0) {
          this.startCarousel();
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement des slides.';
        console.error('Error fetching carousel slides:', err);
      } finally {
        this.loading = false;
      }
    },

    startCarousel() {
      if (this.intervalId) clearInterval(this.intervalId);
      this.progress = 0;

      if (this.slides.length === 0) return;

      const startTime = Date.now();

      this.intervalId = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        this.progress = Math.min(100, (elapsedTime / this.slideDuration) * 100);

        if (this.progress >= 100) {
          this.currentIndex = (this.currentIndex + 1) % this.slides.length;
          this.startCarousel(); // Redémarrer le carrousel pour la nouvelle slide
        }
      }, 50);
    },

    goToSlide(index: number) {
      if (this.intervalId) clearInterval(this.intervalId);
      this.currentIndex = index;
      this.startCarousel();
    },

    stopCarousel() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
  },
});
