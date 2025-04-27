<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import EmailInput from '../components/forms/EmailForm.vue'
import PasswordInput from '../components/forms/PasswordForm.vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import SuccessAlert from '@/components/SuccessAlert.vue'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()
const errors = ref([])
const { t } = useI18n()
const isLoading = ref(false)
const successMessage = ref('')
const route = useRoute()

const login = async () => {
  errors.value = []
  isLoading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard') // Przekierowanie do dashboardu po zalogowaniu
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errors.value.push(error.response.data.message)
    } else {
      errors.value.push('Failed to login. Please check your credentials and try again.')
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (route.query.success === 'true' && route.query.message) {
    successMessage.value = route.query.message
  }
})
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
      <!-- <img src="../assets/img/logo.webp" alt="Logo" class="h-16" /> -->
      <p class="text-4xl mb-4">👋</p>
      <h1 class="text-2xl font-semibold mb-4">{{ t('Log in to the system') }}</h1>
      <!-- Success Message -->
      <SuccessAlert
        v-if="successMessage"
        class="my-4"
        :title="t('Success!')"
        :text="t(successMessage)"
      />
      <!-- Error Message -->
      <ErrorAlert :errors="errors" />
      <!-- Form -->
      <form @submit.prevent="login">
        <!-- Username Input -->
        <div class="mb-4">
          <EmailInput v-model="email" />
        </div>
        <!-- Password Input -->
        <div class="mb-4">
          <PasswordInput v-model="password" />
        </div>
        <!-- Remember Me Checkbox -->
        <!-- <div class="mb-4 flex items-center">
          <input type="checkbox" id="remember" name="remember" class="text-blue-500" />
          <label for="remember" class="text-gray-600 ml-2">Remember Me</label>
        </div> -->
        <!-- Forgot Password Link -->
        <!-- <div class="mb-6 text-blue-500">
          <a href="#" class="hover:underline">Forgot Password?</a>
        </div> -->
        <!-- Login Button -->
        <!-- <button
          type="submit"
          class="bg-blue-700 hover:bg-yellow-600 text-white font-semibold rounded-md py-2 px-4 w-full"
        >
          {{ t('Login') }}
        </button> -->
        <button
          type="submit"
          class="w-full inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
        >
          <div v-if="isLoading == false">{{ t('Login') }}</div>
          <LoadingSpinner v-else />
        </button>
      </form>
      <!-- Sign up  Link -->
      <div class="mt-6 text-blue-500 text-center cursor-pointer" @click="router.push('/register')">
        {{ t('Sign up Here') }}
      </div>
    </div>
  </div>
</template>
