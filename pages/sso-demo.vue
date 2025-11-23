<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Démo d'Intégration SSO
        </h1>
        <p class="text-lg text-gray-600">
          Exemple d'intégration du SSO PGS dans vos services
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div v-for="service in services" :key="service.id" class="card">
          <div class="flex items-start space-x-4 mb-4">
            <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img v-if="service.logo" :src="service.logo" :alt="service.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center bg-primaryn">
                <span class="text-white font-bold text-xl">
                  {{ service.name.charAt(0) }}
                </span>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900">{{ service.name }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ service.description }}</p>
              <a :href="service.domain" target="_blank" rel="noopener noreferrer"
                class="text-xs text-primaryn hover:text-secondaryn mt-2 inline-block">
                {{ service.domain }}
              </a>
            </div>
          </div>

          <div class="space-y-2">
            <SSOButton :service-id="service.id" action="login" :return-url="`${service.domain}/dashboard`"
              button-class="w-full btn btn-primary">
              <span>Se connecter à {{ service.name }}</span>
            </SSOButton>

            <SSOButton :service-id="service.id" action="register" :return-url="`${service.domain}/dashboard`"
              button-class="w-full btn btn-outline">
              <span>S'inscrire sur {{ service.name }}</span>
            </SSOButton>
          </div>

          <!-- Code Example -->
          <details class="mt-4">
            <summary class="text-sm text-gray-600 cursor-pointer hover:text-primaryn">
              Voir le code d'intégration
            </summary>
            <div class="mt-3 bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre class="text-xs text-green-400"><code>&lt;!-- Bouton Login --&gt;
&lt;a href="{{ getSSOUrl(service.id, 'login', service.domain) }}"&gt;
  Se connecter
&lt;/a&gt;

&lt;!-- Bouton Register --&gt;
&lt;a href="{{ getSSOUrl(service.id, 'register', service.domain) }}"&gt;
  S'inscrire
&lt;/a&gt;</code></pre>
            </div>
          </details>
        </div>
      </div>

      <!-- Documentation Section -->
      <div class="card">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          Comment ça marche ?
        </h2>

        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-primaryn font-bold">1</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">L'utilisateur clique sur "Se connecter"</h3>
              <p class="text-sm text-gray-600 mt-1">
                Le bouton redirige vers l'espace SSO avec les paramètres du service
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-primaryn font-bold">2</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">Vérification de l'authentification</h3>
              <p class="text-sm text-gray-600 mt-1">
                Le SSO vérifie si l'utilisateur est déjà connecté
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-primaryn font-bold">3</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">Création ou vérification de l'accès</h3>
              <p class="text-sm text-gray-600 mt-1">
                Le système crée automatiquement l'accès au service si nécessaire
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-primaryn font-bold">4</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">Redirection vers le service</h3>
              <p class="text-sm text-gray-600 mt-1">
                L'utilisateur est redirigé vers le service avec un token SSO temporaire
              </p>
            </div>
          </div>
        </div>

        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-start">
            <IconInfoCircle class="w-5 h-5 text-primaryn mr-3 mt-0.5" />
            <div>
              <h4 class="text-sm font-medium text-blue-900 mb-1">Note importante</h4>
              <p class="text-sm text-blue-800">
                L'accès au service est créé automatiquement lors de la première connexion.
                Aucune configuration manuelle n'est nécessaire pour les nouveaux utilisateurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconInfoCircle } from '@tabler/icons-vue'

definePageMeta({
  layout: 'default'
})

const config = useRuntimeConfig()

// Services de démonstration
const services = ref([
  {
    id: '69009f1cef08469044080df0',
    name: 'EasyQuickTrack',
    description: 'Solution complète pour le web : raccourcissement d\'URLs et QR codes',
    domain: 'https://eqt.me',
    logo: 'https://cdn.jsdelivr.net/gh/progestionsoft/Files/_General/Images/Logos/EQT-MC.png'
  },
  {
    id: '69009f1bef08469044080def',
    name: 'Templix',
    description: 'Application de gestion de templates',
    domain: 'https://templix.app',
    logo: 'https://cdn.jsdelivr.net/gh/progestionsoft/Files/_General/Images/Logos/Templix-MC.png'
  },
  {
    id: '69009f1bef08469044080dee',
    name: 'Suitops Hire',
    description: 'Plateforme de recrutement moderne',
    domain: 'https://hire.suitops.com',
    logo: 'https://cdn.jsdelivr.net/gh/progestionsoft/Files/_General/Images/Logos/Hire-MC.png'
  },
  {
    id: '69009f1bef08469044080ded',
    name: 'Suitops',
    description: 'Suite complète d\'outils d\'entreprise',
    domain: 'https://suitops.com',
    logo: 'https://cdn.jsdelivr.net/gh/progestionsoft/Files/_General/Images/Logos/SuitOps-MC.png'
  }
])

const getSSOUrl = (serviceId: string, action: string, domain: string) => {
  const baseUrl = config.public.pgsBaseAPI.replace('/api/v1', '')
  return `${baseUrl}/auth/authorize?serviceId=${serviceId}&action=${action}&returnUrl=${domain}/dashboard`
}
</script>