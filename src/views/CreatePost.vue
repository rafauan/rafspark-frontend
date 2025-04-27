<script setup>
import { ref, onMounted, computed } from 'vue'
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
import SelectInput from '@/components/forms/SelectInput.vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'

const authStore = useAuthStore()
const projectStore = useProjectStore()
const router = useRouter()
const user = ref(null)
const title = ref('')
const errors = ref([])
const { t } = useI18n()
const projects = ref({
  data: []
})
const selectedProject = ref(null)
const type = ref('')
const subtype = ref('')
const content = ref('')

onMounted(async () => {
  user.value = await authStore.fetchUser()
  projects.value = await projectStore.index()
})

const projectList = computed(() => {
  return projects.value.data.map((project) => {
    return {
      value: project.id,
      label: project.title
    }
  })
})

const isLoading = ref(false)

const createPost = async () => {
  errors.value = []
  isLoading.value = true
  try {
    let response = await projectStore.savePost(
      title.value,
      content.value,
      subtype.value,
      selectedProject.value
    )
    router.push('/posts')
    return response
  } catch (error) {
    console.error('Create Project Error:', error) // Debugging line
    if (error.response && error.response.status === 422) {
      for (const key in error.response.data) {
        errors.value.push(...error.response.data[key])
      }
    } else {
      errors.value.push('Failed to create project. Please try again.')
      isLoading.value = false
    }
  } finally {
    isLoading.value = false
  }
}

const contentTypes = [
  {
    value: 'Blog',
    label: 'Blog',
    isChildren: true,
    children: [{ value: 'wordpress', label: 'Wordpress' }]
  },
  {
    value: 'Social Media',
    label: 'Social Media',
    isPosts: true,
    isChildren: true,
    children: [
      { value: 'facebook', label: 'Facebook' },
      { value: 'twitter', label: 'X (Twitter)' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'linkedin', label: 'LinkedIn' }
    ]
  }
]

const languages = [
  { value: 'Polish', label: 'Polish' },
  { value: 'English', label: 'English' }
]
</script>

<template>
  <Navigation>
    <div class="p-6 bg-white border-2 border-gray-100 rounded-lg shadow-sm w-full">
      <form @submit.prevent="createPost">
        <p class="text-2xl mb-4 font-semibold">{{ t('Create your post') }}</p>
        <InfoAlert
          title="Attention!"
          text="If you want to generate a post with AI collaboration go to the project section."
          class="mb-4"
        />
        <ErrorAlert :errors="errors" />

        <div class="mb-4">
          <SelectInput
            v-model="selectedProject"
            :options="projectList"
            label="Choose project"
            name="project"
            :useTranslation="false"
          />
        </div>
        <div class="mb-4">
          <SelectInput
            v-model="type"
            :options="contentTypes"
            label="Choose content type"
            name="type"
            :useTranslation="false"
          />
        </div>
        <div class="mb-4">
          <SelectInput
            v-if="contentTypes.find((item) => item.value === type)?.isChildren"
            v-model="subtype"
            :options="contentTypes.find((item) => item.value === type)?.children"
            label="Choose category"
            name="type"
            :useTranslation="false"
          />
        </div>
        <div class="mb-4" v-if="type == 'Blog' || type == 'Social Media'">
          <TextInput v-model="title" label="Title" name="title" id="title" />
        </div>
        <div class="mb-4" v-if="type == 'Social Media'">
          <TextareaForm
            v-model="content"
            label="Description"
            name="desc"
            id="desc"
            :rows="5"
            :useTranslation="false"
          />
        </div>
        <div class="mb-4" v-if="type == 'Blog'">
          <p class="block text-sm font-medium text-gray-700 mb-1">{{ t('Content') }}</p>
          <MarkdownEditor v-model="content" :modelValue="content" />
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
        <button
          type="submit"
          class="mt-4 focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 justify-center items-center w-[120px]"
        >
          <div v-if="isLoading == false">{{ t('Create post') }}</div>
          <LoadingSpinner v-else />
        </button>
      </form>
    </div>
  </Navigation>
</template>
