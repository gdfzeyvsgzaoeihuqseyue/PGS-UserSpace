<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
      <p class="mt-2 text-gray-600">Manage your account information and preferences</p>
    </div>

    <!-- Success Message -->
    <div v-if="profileStore.updateSuccess" class="card bg-green-50 border-green-200">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm text-green-800 font-medium">Profile updated successfully!</span>
      </div>
    </div>

    <!-- Profile Information -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Personal Information</h2>
        <button v-if="!editMode" @click="enableEditMode" class="btn btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </button>
      </div>

      <form @submit.prevent="handleUpdateProfile" class="space-y-6">
        <!-- Error Message -->
        <div v-if="profileStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm text-red-800">{{ profileStore.error }}</span>
          </div>
        </div>

        <!-- Name Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input id="firstName" v-model="form.firstName" type="text" class="input"
              :disabled="!editMode || profileStore.loading" :class="{ 'bg-gray-100': !editMode }" />
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input id="lastName" v-model="form.lastName" type="text" class="input"
              :disabled="!editMode || profileStore.loading" :class="{ 'bg-gray-100': !editMode }" />
          </div>
        </div>

        <!-- Username Field -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Username <span class="text-gray-500 text-xs">(optional)</span>
          </label>
          <input id="username" v-model="form.username" type="text" class="input"
            :disabled="!editMode || profileStore.loading" :class="{ 'bg-gray-100': !editMode }" />
        </div>

        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div class="flex items-center space-x-2">
            <input id="email" v-model="form.email" type="email" class="input flex-1"
              :disabled="!editMode || profileStore.loading" :class="{ 'bg-gray-100': !editMode }" />
            <span v-if="authStore.isEmailVerified" class="badge badge-success">
              Verified
            </span>
            <span v-else class="badge badge-warning">
              Unverified
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="editMode" class="flex items-center space-x-3 pt-4 border-t">
          <button type="submit" class="btn btn-primary" :disabled="profileStore.loading">
            <span v-if="!profileStore.loading">Save Changes</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Saving...
            </span>
          </button>
          <button type="button" @click="cancelEdit" class="btn btn-secondary" :disabled="profileStore.loading">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Change Password -->
    <div class="card">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
      <form @submit.prevent="handleChangePassword" class="space-y-6">
        <div v-if="passwordError" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm text-red-800">{{ passwordError }}</span>
          </div>
        </div>

        <div v-if="passwordSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm text-green-800">Password changed successfully!</span>
          </div>
        </div>

        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input id="newPassword" v-model="passwordForm.newPassword" type="password" class="input"
            placeholder="••••••••" minlength="8" :disabled="changingPassword" />
          <p class="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input id="confirmPassword" v-model="passwordForm.confirmPassword" type="password" class="input"
            placeholder="••••••••" :disabled="changingPassword" />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="changingPassword">
          <span v-if="!changingPassword">Change Password</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Changing...
          </span>
        </button>
      </form>
    </div>

    <!-- Account Information -->
    <div class="card">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Account Information</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p class="text-sm font-medium text-gray-700">Account ID</p>
            <p class="text-sm text-gray-600 mt-1">{{ authStore.user?.id }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p class="text-sm font-medium text-gray-700">Account Status</p>
            <span class="badge badge-success mt-1">Active</span>
          </div>
        </div>
        <div class="flex items-center justify-between py-3">
          <div>
            <p class="text-sm font-medium text-gray-700">Last Login</p>
            <p class="text-sm text-gray-600 mt-1">{{ formatDate(authStore.user?.lastLogin) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UpdateProfileData } from '~/types'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const authStore = useAuthStore()
const profileStore = useProfileStore()

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
    passwordError.value = 'Password must be at least 8 characters long'
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Passwords do not match'
    return
  }

  changingPassword.value = true

  try {
    await profileStore.updateProfile({ password: passwordForm.newPassword })
    passwordSuccess.value = true
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error: any) {
    passwordError.value = error.data?.message || 'Failed to change password'
  } finally {
    changingPassword.value = false
  }
}

const formatDate = (date?: string) => {
  if (!date) return 'Never'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
