<template>
  <div class="space-y-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('profile.title') }}</h1>
      <p class="mt-2 text-gray-600">{{ $t('profile.subtitle') }}</p>
    </div>

    <!-- Success Message -->
    <div v-if="profileStore.updateSuccess" class="card bg-green-50 border-green-200">
      <div class="flex items-center">
        <IconCircleCheck class="w-5 h-5 text-green-600 mr-3" />
        <span class="text-sm text-green-800 font-medium">{{ $t('profile.success.update') }}</span>
      </div>
    </div>

    <!-- Profile Information -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">{{ $t('profile.personalInfo.title') }}</h2>
        <button v-if="!editMode" @click="enableEditMode" class="btn btn-secondary">
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
              :disabled="!editMode || profileStore.loading" :class="{ 'bg-gray-100': !editMode }" />
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('profile.personalInfo.lastName') }}
            </label>
            <input id="lastName" v-model="form.lastName" type="text" class="input"
              :disabled="!editMode || profileStore.loading" :class="{ 'bg-gray-100': !editMode }" />
          </div>
        </div>

        <!-- Username Field -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('profile.personalInfo.username') }} <span class="text-gray-500 text-xs">{{
              $t('profile.personalInfo.optional') }}</span>
          </label>
          <input id="username" v-model="form.username" type="text" class="input"
            :disabled="!editMode || profileStore.loading" :class="{ 'bg-gray-100': !editMode }" />
        </div>

        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('profile.personalInfo.email') }}
          </label>
          <div class="flex items-center space-x-2">
            <input id="email" v-model="form.email" type="email" class="input flex-1"
              :disabled="!editMode || profileStore.loading" :class="{ 'bg-gray-100': !editMode }" />
            <span v-if="authStore.isEmailVerified" class="badge badge-success">
              {{ $t('profile.personalInfo.verified') }}
            </span>
            <span v-else class="badge badge-warning">
              {{ $t('profile.personalInfo.unverified') }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="editMode" class="flex items-center space-x-3 pt-4 border-t">
          <button type="submit" class="btn btn-primary" :disabled="profileStore.loading">
            <span v-if="!profileStore.loading">{{ $t('profile.actions.save') }}</span>
            <span v-else class="flex items-center">
              <IconLoader2 class="animate-spin h-4 w-4 mr-2" />
              {{ $t('profile.actions.saving') }}
            </span>
          </button>
          <button type="button" @click="cancelEdit" class="btn btn-secondary" :disabled="profileStore.loading">
            {{ $t('profile.actions.cancel') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Change Password -->
    <div class="card">
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

        <button type="submit" class="btn btn-primary" :disabled="changingPassword">
          <span v-if="!changingPassword">{{ $t('profile.password.submit') }}</span>
          <span v-else class="flex items-center">
            <IconLoader2 class="animate-spin h-4 w-4 mr-2" />
            {{ $t('profile.password.submitting') }}
          </span>
        </button>
      </form>
    </div>

    <!-- Account Information -->
    <div class="card">
      <h2 class="text-xl font-bold text-gray-900 mb-6">{{ $t('profile.account.title') }}</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p class="text-sm font-medium text-gray-700">{{ $t('profile.account.id') }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ authStore.user?.id }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p class="text-sm font-medium text-gray-700">{{ $t('profile.account.status') }}</p>
            <span class="badge badge-success mt-1">{{ $t('profile.account.active') }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between py-3">
          <div>
            <p class="text-sm font-medium text-gray-700">{{ $t('profile.account.lastLogin') }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ formatDate(authStore.user?.lastLogin, locale, t('common.never')) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UpdateProfileData } from '~/types'
import { useProfileStore } from '~/stores/profile'
import { IconAlertCircle, IconCircleCheck, IconEdit, IconLoader2 } from '@tabler/icons-vue'
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
</script>
