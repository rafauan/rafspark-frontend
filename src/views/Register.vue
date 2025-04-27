<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import EmailInput from '../components/forms/EmailForm.vue'
import PasswordInput from '../components/forms/PasswordForm.vue'
import TextInput from '@/components/forms/TextForm.vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const name = ref('')
const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()
const errors = ref([])
const { t } = useI18n()
const isLoading = ref(false)

const register = async () => {
  errors.value = []
  isLoading.value = true
  try {
    await authStore.register(name.value, email.value, password.value)
    router.push({
      path: '/login',
      query: {
        success: 'true',
        message: t('Account successfully created. Please log in.')
      }
    })
  } catch (error) {
    if (error.response && error.response.status === 422) {
      for (const key in error.response.data) {
        errors.value.push(...error.response.data[key])
      }
    } else {
      errors.value.push('Failed to register. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-white flex justify-center items-center h-screen">
    <!-- Left: Image -->
    <div
      class="w-1/2 h-screen hidden lg:flex bg-gradient-to-r from-indigo-400 to-blue-800 items-center justify-center"
    >
      <p class="text-5xl text-white text-left font-normal">
        <span>{{ t("Let's build something") }}</span> <br />
        <span class="font-semibold">{{ t('together') }}</span>
      </p>
    </div>

    <!-- Right: Login Form -->
    <div class="bg-white lg:p-36 md:p-52 sm:20 p-8 w-full flex flex-col lg:w-1/2 xl:w-1/2">
      <p class="text-4xl mb-4">👋</p>
      <h1 class="text-2xl font-semibold mb-4">{{ t('Register in the system') }}</h1>
      <!-- Error Message -->
      <ErrorAlert :errors="errors" />
      <!-- Form -->
      <form @submit.prevent="register">
        <!-- Name Input -->
        <div class="mb-4">
          <TextInput v-model="name" label="Name" name="username" id="username-input" />
        </div>
        <!-- Username Input -->
        <div class="mb-4">
          <EmailInput v-model="email" />
        </div>
        <!-- Password Input -->
        <div class="mb-4">
          <PasswordInput v-model="password" />
        </div>
        <!-- Login Button -->
        <button
          type="submit"
          class="w-full inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
        >
          <div v-if="isLoading == false">{{ t('Register') }}</div>
          <LoadingSpinner v-else />
        </button>
      </form>
      <!-- Sign up  Link -->
      <div class="mt-6 text-blue-500 text-center cursor-pointer" @click="router.push('/login')">
        {{ t('Do you have an account? Login here') }}
      </div>
    </div>
  </div>
</template>
