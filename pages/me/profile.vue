<template>
  <div class="max-w-7xl mx-auto py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('profile.title') }}</h1>
      <p class="mt-2 text-gray-600">{{ $t('profile.subtitle') }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Quick Info -->
      <div class="space-y-6">
        <!-- Quick Profile Card -->
        <div class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
          <div class="h-32 bg-gradient-to-r from-primary to-secondary"></div>
          <div class="px-6 pb-6 relative">
            <div class="absolute -top-24 left-6">
              <div
                class="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center overflow-hidden">
                <div
                  class="h-full w-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold uppercase">
                  {{ userInitials }}
                </div>
              </div>
            </div>
            <div class="mt-12">
              <h2 class="text-xl font-bold text-gray-900">{{ fullName }}</h2>
              <p class="text-sm text-gray-500">@{{ authStore.user?.username || 'user' }}</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ $t('profile.account.active') }}
                </span>
                <span v-if="authStore.isEmailVerified"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ $t('profile.personalInfo.verified') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Stats -->
        <div class="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
          <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{{ $t('profile.account.title')
          }}
          </h3>
          <div class="space-y-4">
            <div>
              <p class="text-xs text-gray-500 uppercase mb-1">{{ $t('profile.account.id') }}</p>
              <p class="text-sm font-mono text-gray-700 break-all bg-gray-50 p-2 rounded border border-gray-100">
                {{ authStore.user?.id }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase mb-1">{{ $t('profile.account.createdAt') }}</p>
              <div class="flex items-center text-sm text-gray-700">
                <IconCalendar class="w-4 h-4 mr-2 text-gray-400" />
                {{ formatDate(authStore.user?.createdAt, locale) }}
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase mb-1">{{ $t('profile.account.lastLogin') }}</p>
              <div class="flex items-center text-sm text-gray-700">
                <IconCalendar class="w-4 h-4 mr-2 text-gray-400" />
                {{ formatDate(authStore.user?.lastLogin, locale, t('common.never')) }}
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase mb-1">{{ $t('profile.personalInfo.email') }}</p>
              <div class="flex items-center text-sm text-gray-700">
                <IconMail class="w-4 h-4 mr-2 text-gray-400" />
                {{ authStore.user?.email }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Details Forms -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Success Message -->
        <div v-if="profileStore.updateSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <IconCircleCheck class="w-5 h-5 text-green-600 mr-3" />
            <span class="text-sm text-green-800 font-medium">{{ $t('profile.success.update') }}</span>
          </div>
        </div>

        <!-- Personal Info Form -->
        <div class="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">{{ $t('profile.personalInfo.title') }}</h2>
            <button v-if="!editMode" @click="enableEditMode" class="flex items-center gap-2 btn btn-primary text-sm">
              <IconEdit class="w-4 h-4 mr-2" />
              {{ $t('profile.personalInfo.edit') }}
            </button>
          </div>

          <form @submit.prevent="handleUpdateProfile" class="space-y-6">
            <!-- Error Message -->
            <div v-if="profileStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-center">
                <IconAlertCircle class="w-5 h-5 text-red-600 mr-2" />
                <span class="text-sm text-red-800">{{ profileStore.error }}</span>
              </div>
            </div>

            <!-- Name Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('profile.personalInfo.firstName') }}
                </label>
                <input id="firstName" v-model="form.firstName" type="text" class="input"
                  :disabled="!editMode || profileStore.loading" :class="{ 'bg-gray-50 text-gray-500': !editMode }" />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('profile.personalInfo.lastName') }}
                </label>
                <input id="lastName" v-model="form.lastName" type="text" class="input"
                  :disabled="!editMode || profileStore.loading" :class="{ 'bg-gray-50 text-gray-500': !editMode }" />
              </div>
            </div>

            <!-- Username Field -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('profile.personalInfo.username') }} <span class="text-gray-500 text-xs">({{
                  $t('profile.personalInfo.optional') }})</span>
              </label>
              <input id="username" v-model="form.username" type="text" class="input"
                :disabled="!editMode || profileStore.loading" :class="{ 'bg-gray-50 text-gray-500': !editMode }" />
            </div>

            <!-- Email Field (Read-only mostly or editable?) Usually email is editable but let's keep it as per original logic which allowed edit -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('profile.personalInfo.email') }}
              </label>
              <input id="email" v-model="form.email" type="email" class="input"
                :disabled="!editMode || profileStore.loading" :class="{ 'bg-gray-50 text-gray-500': !editMode }" />
            </div>

            <!-- Action Buttons -->
            <div v-if="editMode" class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
              <button type="button" @click="cancelEdit" class="btn btn-gray" :disabled="profileStore.loading">
                {{ $t('profile.actions.cancel') }}
              </button>
              <button type="submit" class="btn btn-primary" :disabled="profileStore.loading">
                <span v-if="!profileStore.loading">{{ $t('profile.actions.save') }}</span>
                <span v-else class="flex items-center">
                  <IconLoader2 class="animate-spin h-4 w-4 mr-2" />
                  {{ $t('profile.actions.saving') }}
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password -->
        <div class="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-6">{{ $t('profile.password.title') }}</h2>
          <form @submit.prevent="handleChangePassword" class="space-y-6">
            <div v-if="passwordError" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-center">
                <IconAlertCircle class="w-5 h-5 text-red-600 mr-2" />
                <span class="text-sm text-red-800">{{ passwordError }}</span>
              </div>
            </div>

            <div v-if="passwordSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center">
                <IconCircleCheck class="w-5 h-5 text-green-600 mr-2" />
                <span class="text-sm text-green-800">{{ $t('profile.password.success') }}</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('profile.password.new') }}
                </label>
                <input id="newPassword" v-model="passwordForm.newPassword" type="password" class="input"
                  placeholder="••••••••" minlength="8" :disabled="changingPassword" />
                <p class="mt-1 text-xs text-gray-500">{{ $t('profile.password.minChars') }}</p>
              </div>

              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('profile.password.confirm') }}
                </label>
                <input id="confirmPassword" v-model="passwordForm.confirmPassword" type="password" class="input"
                  placeholder="••••••••" :disabled="changingPassword" />
              </div>
            </div>

            <div class="flex justify-end pt-4 border-t border-gray-100">
              <button type="submit" class="btn btn-primary" :disabled="changingPassword">
                <span v-if="!changingPassword">{{ $t('profile.password.submit') }}</span>
                <span v-else class="flex items-center">
                  <IconLoader2 class="animate-spin h-4 w-4 mr-2" />
                  {{ $t('profile.password.submitting') }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UpdateProfileData } from '~/types'
import { useProfileStore } from '~/stores/profile'
import { IconAlertCircle, IconCircleCheck, IconEdit, IconLoader2, IconCalendar, IconMail } from '@tabler/icons-vue'
import { formatDate } from '~/utils/dateFormatter'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const authStore = useAuthStore()
const profileStore = useProfileStore()
const { t, locale } = useI18n()

const editMode = ref(false)
const changingPassword = ref(false)
const passwordError = ref<string | null>(null)
const passwordSuccess = ref(false)

const form = reactive<UpdateProfileData>({
  firstName: '',
  lastName: '',
  username: '',
  email: ''
})

const passwordForm = reactive({
  newPassword: '',
  confirmPassword: ''
})

const fullName = computed(() => {
  if (authStore.user) {
    return `${authStore.user.firstName} ${authStore.user.lastName}`
  }
  return ''
})

const userInitials = computed(() => {
  if (authStore.user) {
    const first = authStore.user.firstName?.charAt(0) || ''
    const last = authStore.user.lastName?.charAt(0) || ''
    return (first + last).toUpperCase()
  }
  return ''
})

const enableEditMode = () => {
  editMode.value = true
  profileStore.resetUpdateStatus()
}

const cancelEdit = () => {
  editMode.value = false
  loadUserData()
  profileStore.resetUpdateStatus()
}

const loadUserData = () => {
  if (authStore.user) {
    form.firstName = authStore.user.firstName
    form.lastName = authStore.user.lastName
    form.username = authStore.user.username || ''
    form.email = authStore.user.email
  }
}

const handleUpdateProfile = async () => {
  try {
    await profileStore.updateProfile(form)
    editMode.value = false
  } catch (error) {
    // Error handled in store
  }
}

const handleChangePassword = async () => {
  passwordError.value = null
  passwordSuccess.value = false

  if (passwordForm.newPassword.length < 8) {
    passwordError.value = t('profile.password.error.length')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = t('profile.password.error.match')
    return
  }

  changingPassword.value = true

  try {
    await profileStore.updateProfile({ password: passwordForm.newPassword })
    passwordSuccess.value = true
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error: any) {
    passwordError.value = error.data?.message || t('profile.password.error.failed')
  } finally {
    changingPassword.value = false
  }
}

onMounted(() => {
  loadUserData()
})

watch(() => profileStore.updateSuccess, (success) => {
  if (success) {
    setTimeout(() => {
      profileStore.resetUpdateStatus()
    }, 3000)
  }
})

useHead({
  title: t('profile.title')
})
</script>
