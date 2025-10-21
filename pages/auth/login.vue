<template>
  <main class="min-h-screen auth-bg flex items-center justify-center py-12 px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 max-w-7xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">

      <div class="relative auth-bg2 text-white p-10 md:p-14 flex flex-col justify-center items-center overflow-hidden">
        <div v-if="slidesStore.currentSlide" class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
             :style="slidesStore.currentSlide?.backgroundImage ? { backgroundImage: `url(${slidesStore.currentSlide.backgroundImage})`, opacity: 0.2 } : {}">
        </div>
        <div class="relative z-10 flex flex-col items-center text-center">
          <h2 class="text-4xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            {{ slidesStore.currentSlide?.mainTitle || 'Bienvenue chez PGS' }}
          </h2>
          <p class="text-xl opacity-90 mb-8 drop-shadow-md">
            {{ slidesStore.currentSlide?.mainDescription || 'Connectez-vous pour une gestion d\'entreprise simplifiée et efficace en Afrique.' }}
          </p>

          <Transition name="slide-fade" mode="out-in">
            <div :key="slidesStore.currentSlide?.id" class="flex flex-col items-center">
              <img
                v-if="slidesStore.currentSlide?.image"
                :src="slidesStore.currentSlide?.image"
                alt="Illustration dynamique"
                class="w-full max-w-xs md:max-w-md h-auto rounded-lg shadow-xl mb-6 object-cover"
                style="aspect-ratio: 16/9;"
              />
              <blockquote v-else-if="slidesStore.currentSlide?.type === 'quote'" class="text-2xl italic font-semibold border-l-4 border-white pl-4 mb-4">
                <p>"{{ slidesStore.currentSlide?.content }}"</p>
              </blockquote>
              <div v-else-if="slidesStore.currentSlide?.type === 'text'" class="text-lg leading-relaxed mb-4">
                <p v-html="slidesStore.currentSlide?.content"></p>
              </div>
              <p v-if="slidesStore.currentSlide?.author" class="text-base font-medium opacity-80">— {{ slidesStore.currentSlide?.author }}</p>
            </div>
          </Transition>
        </div>

        <div class="absolute bottom-10 left-0 right-0 flex justify-center space-x-3 z-20">
          <button v-for="(slide, index) in slidesStore.slides" :key="slide.id"
                  @click="slidesStore.goToSlide(index)"
                  class="w-4 h-4 rounded-full bg-white transition-all duration-300 relative overflow-hidden"
                  :class="{ 'opacity-100 scale-125': slidesStore.currentIndex === index, 'opacity-40 hover:opacity-70': slidesStore.currentIndex !== index }">
            <div class="absolute top-0 left-0 h-full bg-white/50 origin-left"
                 :style="{ width: slidesStore.currentIndex === index ? `${slidesStore.progress}%` : '0%' }"></div>
          </button>
        </div>
      </div>

      <div class="p-10 md:p-14">
        <div class="text-center md:text-left mb-6">
          <h2 class="text-4xl font-extrabold leading-tight">
            Connectez-vous
          </h2>
          <p class="mt-3 text-lg">
            Accédez à votre compte pour continuer l'aventure !
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5" novalidate>
          <div>
            <label for="identifier" class="block font-medium mb-1">Email ou Nom d'utilisateur <span class="text-red-500">*</span></label>
            <div class="relative">
              <input id="identifier" v-model="form.identifier"
                type="text" placeholder="utilisateur23 ou votre.email@exemple.com"
                class="w-full rounded-lg border px-3 py-2 pl-10 focus:ring-primary focus:border-primary"
                :class="{ 'border-red-500': errors.identifier }"
                required
                :disabled="authStore.loading"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2">
                <IconMail v-if="isEmail(form.identifier)" class="h-5 w-5" />
                <IconUser v-else class="h-5 w-5" />
              </span>
            </div>
            <p v-if="errors.identifier" class="text-red-600 text-sm mt-1">{{ errors.identifier }}</p>
          </div>

          <div class="relative">
            <label for="password" class="block font-medium mb-1">Mot de passe <span class="text-red-500">*</span></label>
            <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password"
              placeholder="XXXXXXXXX"
              class="w-full rounded-lg border px-3 py-2 pr-10 pl-10 focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.password }"
              required
              :disabled="authStore.loading"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 mt-4">
              <IconLock class="h-5 w-5" />
            </span>
            <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 mt-4 hover:text-primary">
              <IconEyeOff v-if="showPassword" class="h-5 w-5" />
              <IconEye v-else class="h-5 w-5" />
            </button>
            <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <button type="submit" :disabled="authStore.loading" class="w-full bg-primary hover:bg-secondary disabled:opacity-80 text-white font-bold py-3 rounded-xl">
            <span v-if="authStore.loading" class="animate-spin inline-block mr-2">
              <IconLoaderQuarter class="w-5 h-5 text-white" />
            </span>
            {{ authStore.loading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>

          <p v-if="message" :class="{'text-green-600': message.type === 'success', 'text-red-600': message.type === 'error'}" class="text-center font-medium" v-html="message.text">
          </p>
        </form>

        <p class="mt-6 text-center text-sm">
          Pas encore de compte ?
          <NuxtLink to="/auth/signup" class="font-medium text-primary hover:text-secondary">Inscrivez-vous ici</NuxtLink>
        </p>
        <div class="flex items-center gap-6 justify-center">
          <NuxtLink to="/auth/reset-password"
            class="mt-2 text-center text-sm font-medium text-primary hover:text-secondary">
            Mot de passe oublié ?
          </NuxtLink>
          <span>|</span>
          <NuxtLink to="/auth/email-verify/resend"
          class="mt-2 text-center text-sm font-medium text-primary hover:text-secondary">
            Vérifier votre adresse mail
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <TwoFactorAuthModal
    :is-visible="showTwoFactorModal"
    :method="authStore.twoFactorMethod"
    :loading="authStore.loading"
    :error-message="twoFactorModalError"
    :new-code-sent="newCodeSent"
    @submit="handleTwoFactorSubmit"
    @cancel="cancelTwoFactor"
    @update:errorMessage="updateTwoFactorModalError"
    @request-new-code="handleRequestNewCode"
  />
  </main>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useSlidesStore } from '~/stores/slides'; 
import { useRouter } from 'vue-router';
import { IconMail, IconUser, IconLock, IconEye, IconEyeOff, IconLoaderQuarter } from '@tabler/icons-vue';

const authStore = useAuthStore();
const slidesStore = useSlidesStore();
const router = useRouter();

const form = reactive({
  identifier: '',
  password: '',
});

const errors = reactive({
  identifier: '',
  password: '',
});

const message = ref<{ type: 'success' | 'error'; text: string } | null>(null);
const showPassword = ref(false);

const showTwoFactorModal = ref(false);
const twoFactorModalError = ref<string | null>(null);
const newCodeSent = ref(false);

// Watch pour la redirection après une connexion réussie
watch(() => authStore.isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    router.push('/');
  }
}, { immediate: true });

onMounted(async () => {
  authStore.setRouter(router);
  slidesStore.fetchSlides();

  if (authStore.isLoggedIn) {
    router.push('/');
  }
});

onUnmounted(() => {
  slidesStore.stopCarousel(); // Arrêter le carrousel lors du démontage
});

const isEmail = (input: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

function clearErrors() {
  Object.keys(errors).forEach(k => (errors[k as keyof typeof errors] = ''));
}

async function handleLogin() {
  clearErrors();
  message.value = null;
  let valid = true;

  if (!form.identifier.trim()) { 
    errors.identifier = 'L\'email ou le nom d\'utilisateur est requis.'; 
    valid = false; 
  }
  if (!form.password.trim()) { 
    errors.password = 'Le mot de passe est requis.'; 
    valid = false; 
  }

  if (!valid) return;

  const result = await authStore.login(form.identifier, form.password);

  if (result.success) {
    message.value = { type: 'success', text: result.message || 'Connexion réussie.' };
  } else {
    if (result.requiresTwoFactor) {
      showTwoFactorModal.value = true;
      twoFactorModalError.value = result.message;
      newCodeSent.value = result.newCodeSent || false;
      return;
    }

    message.value = { type: 'error', text: result.message || 'Échec de la connexion.' };

    if (result.code === 'utilisateurInexistant') {
      errors.identifier = result.message;
    } else if (result.code === 'motDePasseIncorrect') {
      errors.password = result.message;
    } else if (result.code === 'nonVerifie') {
      message.value = { 
        type: 'error', 
        text: `${result.message} <a href="/auth/email-verify/resend" class="font-medium text-primary hover:underline">Renvoyer le lien</a>` 
      };
    }
  }
}

async function handleTwoFactorSubmit(twoFactorCode: string) {
  twoFactorModalError.value = null;
  newCodeSent.value = false;

  const result = await authStore.verifyTwoFactor(form.identifier, form.password, twoFactorCode);

  if (result.success) {
    showTwoFactorModal.value = false;
    message.value = { type: 'success', text: 'Vérification 2FA réussie. Connexion en cours...' };
  } else {
    twoFactorModalError.value = result.message;
  }
}


// Gérer la demande d'un nouveau code
async function handleRequestNewCode() {
  twoFactorModalError.value = null;
  newCodeSent.value = false;

  const result = await authStore.login(form.identifier, form.password, undefined, true);

  if (result.newCodeSent) {
    newCodeSent.value = true;
    twoFactorModalError.value = null;
  } else {
    twoFactorModalError.value = result.message || 'Impossible de renvoyer le code.';
  }
}

function cancelTwoFactor() {
  showTwoFactorModal.value = false;
  twoFactorModalError.value = null;
  newCodeSent.value = false;
  message.value = { type: 'error', text: 'Vérification 2FA annulée.' };
}


function updateTwoFactorModalError(message: string | null) {
  twoFactorModalError.value = message;
}

// SEO
useHead({
  title: 'Connexion - PGS'
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
