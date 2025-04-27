<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProjectStore } from '../stores/project'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navigation from '@/components/Navigation.vue'
import TextInput from '@/components/forms/TextForm.vue'
import TextareaForm from '@/components/forms/TextareaForm.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import PasswordForm from '@/components/forms/PasswordForm.vue'

const authStore = useAuthStore()
const projectStore = useProjectStore()
const route = useRoute()
const router = useRouter()
const user = ref(null)
const title = ref('')
const description = ref('')
const metaDescription = ref('')
const metaKeywords = ref('')
const metaTitle = ref('')
const errors = ref([])
const seoErrors = ref([])
const { t } = useI18n()
const wpUrl = ref('')
const wpLogin = ref('')
const wpPassword = ref('')

const project = ref(null)

onMounted(async () => {
  user.value = await authStore.fetchUser()
})

onBeforeMount(async () => {
  project.value = await projectStore.show(route.params.id)
  title.value = project.value.data.title
  description.value = project.value.data.description
  metaTitle.value = project.value.data.seo_title
  metaDescription.value = project.value.data.seo_description
  metaKeywords.value = project.value.data.seo_keywords
  wpUrl.value = project.value.data.wp_url
  wpLogin.value = project.value.data.wp_login
  wpPassword.value = project.value.data.wp_password
})

const isLoading = ref(false)
const isSaved = ref(false)
const isSeoLoading = ref(false)
const isSeoSaved = ref(false)

const saveData = async () => {
  errors.value = []
  isLoading.value = true
  isSaved.value = false
  try {
    let response = await projectStore.editData(
      route.params.id,
      title.value,
      description.value,
      wpUrl.value,
      wpLogin.value,
      wpPassword.value
    )
    isSaved.value = true
    return response
  } catch (error) {
    console.error('Update Project Error:', error) // Debugging line
    if (error.response && error.response.status === 422) {
      for (const key in error.response.data) {
        errors.value.push(...error.response.data[key])
      }
    } else {
      errors.value.push('Failed to update project. Please try again.')
      isLoading.value = false
    }
  } finally {
    isLoading.value = false
  }
}

const saveSeoData = async () => {
  seoErrors.value = []
  isSeoLoading.value = true
  isSeoSaved.value = false
  try {
    let response = await projectStore.editSeoData(
      route.params.id,
      metaTitle.value,
      metaDescription.value,
      metaKeywords.value
    )
    isSeoSaved.value = true
    return response
  } catch (error) {
    console.error('Update SEO Error:', error) // Debugging line
    if (error.response && error.response.status === 422) {
      for (const key in error.response.data) {
        seoErrors.value.push(...error.response.data[key])
      }
    } else {
      seoErrors.value.push('Failed to update SEO data. Please try again.')
      isSeoLoading.value = false
    }
  } finally {
    isSeoLoading.value = false
  }
}
</script>

<template>
  <Navigation>
    <Breadcrumb
      class="mb-4"
      :breadcrumbs="[
        { label: project?.data?.title, url: '/projects/' + project?.data?.id },
        { label: t('Edit data'), url: null }
      ]"
    />
    <div class="p-6 bg-white border-2 border-gray-100 rounded-lg shadow-sm w-full">
      <form @submit.prevent="createProject">
        <p class="text-2xl mb-4 font-semibold">{{ t('Edit project details') }}</p>

        <ErrorAlert :errors="errors" />

        <div class="mb-4">
          <TextInput v-model="title" label="Title" name="title" id="title" />
        </div>
        <div class="mb-4">
          <TextareaForm
            v-model="description"
            label="Description"
            name="desc"
            id="desc"
            :rows="5"
            :useTranslation="false"
          />
        </div>
        <div class="mb-4">
          <TextInput v-model="wpUrl" label="Wordpress site URL" name="wpUrl" id="wpUrl" />
        </div>
        <div class="mb-4">
          <TextInput v-model="wpLogin" label="Wordpress user login" name="wpLogin" id="wpLogin" />
        </div>
        <div class="mb-4">
          <PasswordForm v-model="wpPassword" label="Wordpress user password" />
        </div>
        <!-- <div
          v-if="errors.length"
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          <span class="font-medium">{{ t('Error!') }}</span>
          <ul class="mt-2 list-inside list-none">
            <li v-for="error in errors" :key="error">{{ t(error) }}</li>
          </ul>
        </div> -->
        <div class="flex mt-4">
          <button
            @click="saveData()"
            type="button"
            class="focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 justify-center items-center w-[140px]"
          >
            <div v-if="isLoading == false">{{ t('Save changes') }}</div>
            <LoadingSpinner v-else />
          </button>
          <div
            v-if="isSaved"
            class="focus:outline-none text-white text-center bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 ml-2 w-[220px]"
          >
            <font-awesome-icon :icon="['fas', 'circle-check']" />
            {{ t('Data saved successfully') }}
          </div>
        </div>
      </form>

      <form @submit.prevent="createProject">
        <p class="text-2xl mb-4 mt-8 font-semibold">{{ t('Edit SEO for website') }}</p>

        <ErrorAlert :errors="seoErrors" />

        <div class="mb-4">
          <TextInput v-model="metaTitle" label="Title" name="metaTitle" id="metaTitle" />
        </div>
        <div class="mb-4">
          <TextareaForm
            v-model="metaDescription"
            label="Meta description"
            name="metaDescription"
            id="metaDescription"
            :rows="5"
            :useTranslation="false"
          />
        </div>
        <div class="mb-4">
          <TextareaForm
            v-model="metaKeywords"
            label="Meta keywords"
            name="metaKeywords"
            id="metaKeywords"
            :rows="5"
            :useTranslation="false"
          />
        </div>
        <div class="flex mt-4">
          <button
            @click="saveSeoData()"
            type="button"
            class="focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 justify-center items-center w-[140px]"
          >
            <div v-if="isSeoLoading == false">{{ t('Save changes') }}</div>
            <LoadingSpinner v-else />
          </button>
          <div
            v-if="isSeoSaved"
            class="focus:outline-none text-white text-center bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 ml-2 w-[220px]"
          >
            <font-awesome-icon :icon="['fas', 'circle-check']" />
            {{ t('Data saved successfully') }}
          </div>
        </div>
      </form>
    </div>
  </Navigation>
</template>
