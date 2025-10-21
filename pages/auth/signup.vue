<template>
  <main class="min-h-screen auth-bg flex items-center justify-center py-12 px-4">
    <div
      class="grid grid-cols-1 md:grid-cols-2 max-w-7xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
      <!-- Gauche -->
      <section class="p-10 md:p-14">
        <div class="text-center md:text-left mb-6">
          <h2 class="text-4xl font-extrabold leading-tight">
            Créer votre compte
          </h2>
          <p class="mt-3 text-lg">
            Rejoignez notre aventure et découvrez un monde de possibilités !
          </p>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="onSubmit" class="space-y-5" novalidate>
          <div class="flex gap-4">
            <div class="w-1/2">
              <label for="firstName" class="block font-medium mb-1">Prénom <span
                  class="text-red-500">*</span></label>
              <div class="relative">
                <input id="firstName" v-model="form.firstName" type="text" placeholder="Votre prénom"
                  class="w-full rounded-lg border px-3 py-2 pl-10 focus:ring-primary focus:border-primary"
                  :class="{ 'border-red-500': errors.firstName }" />
                <span class="absolute left-3 top-1/2 -translate-y-1/2">
                  <IconUser class="h-5 w-5" />
                </span>
              </div>
              <p v-if="errors.firstName" class="text-danger text-sm mt-1">{{ errors.firstName }}</p>
            </div>
            <div class="w-1/2">
              <label for="lastName" class="block font-medium mb-1">Nom <span
                  class="text-red-500">*</span></label>
              <div class="relative">
                <input id="lastName" v-model="form.lastName" type="text" placeholder="Votre nom"
                  class="w-full rounded-lg border px-3 py-2 pl-10 focus:ring-primary focus:border-primary"
                  :class="{ 'border-red-500': errors.lastName }" />
                <span class="absolute left-3 top-1/2 -translate-y-1/2">
                  <IconUser class="h-5 w-5" />
                </span>
              </div>
              <p v-if="errors.lastName" class="text-danger text-sm mt-1">{{ errors.lastName }}</p>
            </div>
          </div>

          <div>
            <label for="emailAddress" class="block font-medium mb-1">Adresse email <span
                class="text-red-500">*</span></label>
            <div class="relative">
              <input id="emailAddress" v-model="form.emailAddress" type="email" placeholder="votre.email@exemple.com"
                class="w-full rounded-lg border px-3 py-2 pl-10 focus:ring-primary focus:border-primary"
                :class="{ 'border-red-500': errors.emailAddress }" />
              <span class="absolute left-3 top-1/2 -translate-y-1/2">
                <IconMail class="h-5 w-5" />
              </span>
            </div>
            <p v-if="errors.emailAddress" class="text-danger text-sm mt-1">{{ errors.emailAddress }}</p>
          </div>

          <div>
            <label for="username" class="block font-medium mb-1">Nom d'utilisateur (optionnel)</label>
            <div class="relative">
              <input id="username" v-model="form.username" type="text" placeholder="Choisissez un nom d'utilisateur"
                class="w-full rounded-lg border px-3 py-2 pl-10 focus:ring-primary focus:border-primary"
                :class="{ 'border-red-500': errors.username }" />
              <span class="absolute left-3 top-1/2 -translate-y-1/2">
                <IconUser class="h-5 w-5" />
              </span>
            </div>
            <p v-if="errors.username" class="text-danger text-sm mt-1">{{ errors.username }}</p>
          </div>

          <div class="relative">
            <label for="password" class="block font-medium mb-1">Mot de passe <span
                class="text-red-500">*</span></label>
            <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password"
              placeholder="Minimum 8 caractères"
              class="w-full rounded-lg border px-3 py-2 pr-10 pl-10 focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.password }" />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 mt-4">
              <IconLock class="h-5 w-5" />
            </span>
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 mt-4 hover:text-primary">
              <IconEyeOff v-if="showPassword" class="h-5 w-5" />
              <IconEye v-else class="h-5 w-5" />
            </button>
            <p v-if="errors.password" class="text-danger text-sm mt-1">{{ errors.password }}</p>
          </div>

          <PasswordStrength v-if="form.password" :password="form.password" />

          <button type="submit" :disabled="loading"
            class="w-full bg-primary hover:bg-secondary disabled:opacity-80 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
            <IconLoaderQuarter v-if="loading" class="animate-spin w-5 h-5 text-white" />
            <span>
              {{ loading ? "Inscription..." : "S'inscrire" }}
            </span>
          </button>

          <p v-if="message"
            :class="{ 'text-green-600': message.type === 'success', 'text-danger': message.type === 'error' }"
            class="text-center font-medium">
            {{ message.text }}
          </p>
        </form>

        <p class="mt-6 text-center text-sm">
          Vous avez déjà un compte ?
          <NuxtLink to="/auth/login" class="font-medium text-primary hover:text-secondary">Connectez-vous
          </NuxtLink>
        </p>
      </section>

      <!-- Droit -->
      <section class="relative auth-bg2 text-white p-10 md:p-14 flex flex-col justify-center items-center overflow-hidden">
        <div v-if="currentSlide"
          class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          :style="currentSlide?.backgroundImage ? { backgroundImage: `url(${currentSlide.backgroundImage})`, opacity: 0.2 } : {}">
        </div>
        <div class="relative z-10 flex flex-col items-center text-center">
          <h2 class="text-4xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            {{ currentSlide?.mainTitle || 'Bienvenue chez PGS' }}
          </h2>
          <p class="text-xl opacity-90 mb-8 drop-shadow-md">
            {{ currentSlide?.mainDescription ||
              'Rejoignez une communauté de professionnels qui révolutionnent la gestion d\'entreprise en Afrique.' }}
          </p>

          <Transition name="slide-fade" mode="out-in">
            <div :key="currentSlide?.id" class="flex flex-col items-center">
              <img v-if="currentSlide?.image" :src="currentSlide?.image" alt="Illustration dynamique"
                class="w-full max-w-xs md:max-w-md h-auto rounded-lg shadow-xl mb-6 object-cover"
                style="aspect-ratio: 16/9;" />
              <blockquote v-if="currentSlide?.type === 'quote'"
                class="text-2xl italic font-semibold border-l-4 border-white pl-4 mb-4">
                <p>"{{ currentSlide?.content }}"</p>
              </blockquote>
              <div v-else-if="currentSlide?.type === 'text'" class="text-lg leading-relaxed mb-4">
                <p v-html="currentSlide?.content"></p>
              </div>
              <p v-if="currentSlide?.author" class="text-base font-medium opacity-80">— {{ currentSlide?.author }}</p>
            </div>
          </Transition>
        </div>

        <div class="absolute bottom-10 left-0 right-0 flex justify-center space-x-3 z-20">
          <button v-for="(slide, index) in slides" :key="slide.id" @click="goToSlide(index)"
            class="w-4 h-4 rounded-full bg-white transition-all duration-300 relative overflow-hidden"
            :class="{ 'opacity-100 scale-125': currentIndex === index, 'opacity-40 hover:opacity-70': currentIndex !== index }">
            <div class="absolute top-0 left-0 h-full bg-white/50 origin-left"
              :style="{ width: currentIndex === index ? `${progress}%` : '0%' }"></div>
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue';
import { PGSServices } from '~/services/PGSServices';
import { useRouter } from 'vue-router';
import { IconUser, IconLock, IconEye, IconEyeOff, IconMail, IconLoaderQuarter } from '@tabler/icons-vue'

const { registerUser, getAllCarouselSlides } = PGSServices();
const router = useRouter();

const form = reactive({
  firstName: '',
  lastName: '',
  emailAddress: '',
  username: '',
  password: '',
});

const errors = reactive({
  firstName: '',
  lastName: '',
  emailAddress: '',
  username: '',
  password: '',
});

const message = ref<{ type: 'success' | 'error'; text: string } | null>(null);
const loading = ref(false);
const showPassword = ref(false);

interface Slide {
  id: number;
  type: 'quote' | 'text' | 'image';
  content?: string;
  author?: string;
  image?: string;
  mainTitle?: string;
  mainDescription?: string;
  backgroundImage?: string;
}

const slides = ref<Slide[]>([]);
const currentIndex = ref(0);
const currentSlide = computed(() => slides.value[currentIndex.value]);
const slideDuration = 10000;
let intervalId: ReturnType<typeof setInterval> | null = null;
const progress = ref(0);

const startCarousel = () => {
  if (intervalId) clearInterval(intervalId);
  progress.value = 0;

  if (slides.value.length === 0) return;

  const startTime = Date.now();

  intervalId = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    progress.value = Math.min(100, (elapsedTime / slideDuration) * 100);

    if (progress.value >= 100) {
      currentIndex.value = (currentIndex.value + 1) % slides.value.length;
      startCarousel();
    }
  }, 50);
};

const goToSlide = (index: number) => {
  if (intervalId) clearInterval(intervalId);
  currentIndex.value = index;
  startCarousel();
};

onMounted(async () => {
  try {
    const response = await getAllCarouselSlides();
    slides.value = response.data.slides;
    if (slides.value.length > 0) {
      startCarousel();
    }
  } catch (error) {
    console.error('Error fetching carousel slides:', error);
  }
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Valider la robustesse du mot de passe
const validatePasswordStrength = (password: string) => {
  const passwordErrors = [];
  if (password.length < 8) {
    passwordErrors.push('Le mot de passe doit contenir au moins 8 caractères.');
  }
  if (!/[A-Z]/.test(password)) {
    passwordErrors.push('Au moins une lettre majuscule.');
  }
  if (!/[a-z]/.test(password)) {
    passwordErrors.push('Au moins une lettre minuscule.');
  }
  if (!/\d/.test(password)) {
    passwordErrors.push('Au moins un chiffre.');
  }
  if (!/[@$!%*?&]/.test(password)) {
    passwordErrors.push('Au moins un caractère spécial (@$!%*?&).');
  }
  return passwordErrors;
};


function clearErrors() {
  Object.keys(errors).forEach(k => (errors[k as keyof typeof errors] = ''));
}

async function onSubmit() {
  clearErrors();
  message.value = null;

  let valid = true;
  if (!form.firstName.trim()) { errors.firstName = 'Le prénom est requis.'; valid = false; }
  if (!form.lastName.trim()) { errors.lastName = 'Le nom est requis.'; valid = false; }
  if (!form.emailAddress.trim()) {
    errors.emailAddress = 'L\'adresse email est requise.'; valid = false;
  } else if (!validateEmail(form.emailAddress)) {
    errors.emailAddress = 'Veuillez entrer une adresse email valide.'; valid = false;
  }

  // Validation complète du mot de passe
  const passwordStrengthErrors = validatePasswordStrength(form.password);
  if (passwordStrengthErrors.length > 0) {
    // Affiche un message général si la validation frontend échoue
    errors.password = 'Le mot de passe ne respecte pas les critères de sécurité.';
    valid = false;
  }

  if (!valid) return;

  loading.value = true;
  try {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
    const res = await registerUser(fd);

    if (res.status === 201) {
      message.value = { type: 'success', text: res.data.message || 'Inscription réussie ! Un email de vérification vous a été envoyé.' };
      Object.keys(form).forEach(k => {
        form[k as keyof typeof form] = '';
      });
    }
  } catch (err: any) {
    const backendMessage = err.response?.data?.message;
    const backendErrors = err.response?.data?.errors;

    if (err.response?.status === 409) {
      if (backendMessage && backendMessage.includes('email déjà utilisée')) {
        errors.emailAddress = 'Cette adresse email est déjà utilisée.';
      } else if (backendMessage && backendMessage.includes('nom d\'utilisateur déjà pris')) {
        errors.username = 'Ce nom d\'utilisateur est déjà pris.';
      } else {
        message.value = { type: 'error', text: backendMessage || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.' };
      }
    } else if (err.response?.status === 500 && backendErrors && backendErrors.length > 0) {
      errors.password = backendMessage || 'Le mot de passe ne respecte pas les critères de sécurité.';
      message.value = { type: 'error', text: backendMessage || 'Le mot de passe ne respecte pas les critères de sécurité.' };
    } else {
      message.value = { type: 'error', text: backendMessage || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.' };
    }
  } finally {
    loading.value = false;
  }
}

useHead({
  title: 'Inscription - Mon Application'
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1.2s ease-out forwards;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
