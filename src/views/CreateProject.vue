<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProjectStore } from '../stores/project'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navigation from '@/components/Navigation.vue'
import TextInput from '@/components/forms/TextForm.vue'
import TextareaForm from '@/components/forms/TextareaForm.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import InfoAlert from '../components/InfoAlert.vue'
import PasswordForm from '@/components/forms/PasswordForm.vue'

const authStore = useAuthStore()
const projectStore = useProjectStore()
const router = useRouter()
const user = ref(null)
const title = ref('')
const description = ref('')
const errors = ref([])
const { t } = useI18n()
const isChecked = ref(false)

const wpUrl = ref('')
const wpLogin = ref('')
const wpPassword = ref('')

onMounted(async () => {
  user.value = await authStore.fetchUser()
})

const isLoading = ref(false)

const createProject = async () => {
  errors.value = []
  isLoading.value = true
  try {
    let response = await projectStore.store(
      title.value,
      description.value,
      isChecked.value,
      wpUrl.value,
      wpLogin.value,
      wpPassword.value
    )
    router.push('/projects')
    return response
  } catch (error) {
    if (error) {
      for (const key in error.response.data) {
        errors.value.push(...error.response.data[key])
      }
    } else {
      errors.value.push('Failed to save data. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Navigation>
    <div class="p-6 bg-white border-2 border-gray-100 rounded-lg shadow-sm w-full">
      <form @submit.prevent="createProject">
        <p class="text-2xl mb-4 font-semibold">{{ t('Create your personnal project') }}</p>
        <InfoAlert
          title="Attention!"
          text="The information provided here is the basis for generating further content."
          class="mb-4"
        />
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
          <p class="block text-sm font-medium text-gray-700 mb-1">
            {{ t('Add Wordpress configuration') }}
          </p>
          <label
            for="AcceptConditions"
            class="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-blue-700"
          >
            <input v-model="isChecked" type="checkbox" id="AcceptConditions" class="peer sr-only" />

            <span
              class="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"
            >
            </span>
          </label>
        </div>

        <div v-if="isChecked">
          <div class="mb-4">
            <TextInput v-model="wpUrl" label="Site URL" name="wpUrl" id="wpUrl" />
          </div>
          <div class="mb-4">
            <TextInput v-model="wpLogin" label="User login" name="wpLogin" id="wpLogin" />
          </div>
          <div class="mb-4">
            <PasswordForm v-model="wpPassword" label="User password" />
          </div>
        </div>

        <button
          type="submit"
          class="mt-4 focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 justify-center items-center w-[140px]"
        >
          <div v-if="isLoading == false">{{ t('Create project') }}</div>
          <LoadingSpinner v-else />
        </button>
      </form>
    </div>
  </Navigation>
</template>
