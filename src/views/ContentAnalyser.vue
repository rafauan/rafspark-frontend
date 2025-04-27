<script setup>
import { ref, onMounted, watch, computed, onBeforeMount } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProjectStore } from '../stores/project'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import Navigation from '@/components/Navigation.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import SelectInput from '@/components/forms/SelectInput.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import SEOAnalysis from '@/components/SEOAnalysis.vue'
import BlogAnalysis from '@/components/BlogAnalysis.vue'
import SocialMediaAnalysis from '@/components/SocialMediaAnalysis.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import InfoAlert from '@/components/InfoAlert.vue'

const authStore = useAuthStore()
const projectStore = useProjectStore()
const user = ref(null)
const project = ref(null)
const language = ref('')
const type = ref('')
const errors = ref([])
const subtype = ref('')
const tempResponse = ref(null)
const { t, locale } = useI18n()
const isResultGenerated = ref(false)
const isSaved = ref(false)
const postTitle = ref('')
const customComment = ref('')
const routerProject = ref('')
const router = useRouter()
const route = useRoute()
const projects = ref({
  data: []
})
const posts = ref({
  data: []
})

const selectedProject = ref(null)
const selectedPost = ref(null)
const isLoadingPdfExport = ref(false)

onBeforeMount(async () => {
  if (route.params.id) {
    routerProject.value = await projectStore.show(route.params.id)
    selectedProject.value = routerProject.value.data.id
  }
})

onMounted(async () => {
  user.value = await authStore.fetchUser()
  projects.value = await projectStore.index()
})

watch([selectedProject, type], async ([newProject, newType]) => {
  if (newProject && newType) {
    try {
      posts.value = await projectStore.indexTypePost(newProject, newType)
    } catch (error) {
      console.error('Error fetching posts:', error)
      posts.value = [] // Reset posts w przypadku błędu
    }
  } else {
    posts.value = [] // Reset posts, jeśli brakuje projektu lub typu
  }
})

const isLoading = ref(false)

const projectList = computed(() => {
  return projects.value.data.map((project) => {
    return {
      value: project.id,
      label: project.title
    }
  })
})

const postList = computed(() => {
  if (!posts.value || !Array.isArray(posts.value.data)) {
    return [] // Zwróć pustą tablicę, jeśli posts.value lub posts.value.data jest undefined/null
  }

  return posts.value.data.map((post) => {
    return {
      value: post.id,
      label: post.title
    }
  })
})

const contentTypes = [
  {
    value: 'SEO',
    label: 'SEO for website'
  },
  {
    value: 'Blog',
    label: 'Blog',
    isPosts: true
  },
  {
    value: 'Social Media',
    label: 'Social Media',
    isPosts: true
  }
]

const languages = [
  { value: 'Polish', label: 'Polish' },
  { value: 'English', label: 'English' }
]

const analyseData = async () => {
  errors.value = []
  isLoading.value = true
  try {
    let response = await projectStore.analyseData(
      selectedProject.value,
      language.value,
      type.value,
      customComment.value,
      selectedPost.value
    )
    tempResponse.value = response
    postTitle.value = response.blog_title
    subtype.value = type.value
    isResultGenerated.value = true
    isSaved.value = false
    return response
  } catch (error) {
    console.error('Error details:', error) // Wyświetl pełny błąd w konsoli
    if (error && error.response && error.response.data) {
      const errorData = error.response.data
      console.log('Error response data:', errorData) // Loguj dane odpowiedzi

      for (const key in errorData) {
        if (Array.isArray(errorData[key])) {
          errors.value.push(...errorData[key])
        } else if (typeof errorData[key] === 'string') {
          errors.value.push(errorData[key])
        } else {
          errors.value.push(String(errorData[key]))
        }
      }
    } else {
      errors.value.push('Failed to analyse data. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}

const downloadBlob = (blobData, filename, mimeType) => {
  const blob = new Blob([blobData], { type: mimeType })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link) // Usunięcie linku po kliknięciu
}

const exportPdfAnalysis = async () => {
  errors.value = []
  isLoadingPdfExport.value = true
  try {
    // Parsowanie danych wejściowych
    let rawData = tempResponse.value._value || tempResponse.value._rawValue || tempResponse.value
    if (!rawData) throw new Error('No input data.')

    const cleanJsonString = rawData.replace(/^```json\n/, '').replace(/\n```$/, '')
    const cleanData = JSON.parse(cleanJsonString)

    // Pobieranie PDF
    const pdfBlob = await projectStore.exportPdfAnalysis({
      data: cleanData,
      locale: locale.value,
      title: postTitle.value
    })

    // Tworzenie i pobranie pliku PDF
    downloadBlob(pdfBlob, 'analysis_report.pdf', 'application/pdf')

    console.log('PDF został pobrany.')
    return true
  } catch (error) {
    console.error('Export PDF Error:', error)

    // Dodanie szczegółowego błędu
    const errorMessage = error?.response?.data?.message || error.message || 'Nieznany błąd.'
    errors.value.push(`PDF export error: ${errorMessage}`)

    return false
  } finally {
    // Reset flagi ładowania
    isLoadingPdfExport.value = false
  }
}
</script>

<template>
  <Navigation>
    <Breadcrumb
      v-if="route.params.id"
      class="mb-4"
      :breadcrumbs="[
        { label: routerProject?.data?.title, url: '/projects/' + route.params.id },
        { label: t('Analyse content'), url: null }
      ]"
    />
    <h2 class="text-xl font-semibold mb-4">{{ project?.data?.title }}</h2>
    <div class="p-6 bg-white border-2 border-gray-100 rounded-lg shadow-sm">
      <SelectInput
        v-if="!route.params.id"
        v-model="selectedProject"
        :options="projectList"
        label="Choose project"
        name="project"
        :useTranslation="false"
      />

      <SelectInput
        v-model="type"
        :options="contentTypes"
        label="Choose content type"
        name="type"
        :useTranslation="false"
      />

      <SelectInput
        v-if="type == 'Blog' || type == 'Social Media'"
        v-model="selectedPost"
        :options="postList"
        label="Choose post"
        name="post"
        :useTranslation="false"
      />

      <div class="mb-4 w-64" v-if="subtype != 'Branding'">
        <SelectInput
          v-model="language"
          :options="languages"
          label="Choose your language"
          name="type"
          :useTranslation="false"
        />
      </div>

      <ErrorAlert v-if="errors.length" :errors="errors" />

      <div>
        <SEOAnalysis
          v-if="isResultGenerated && subtype == 'SEO'"
          :response="tempResponse?.result"
          :title="tempResponse?.seo_title"
          :description="tempResponse?.seo_description"
          :keywords="tempResponse?.seo_keywords"
        />

        <BlogAnalysis
          v-if="isResultGenerated && subtype == 'Blog'"
          :content="tempResponse?.result"
        />

        <SocialMediaAnalysis
          v-if="isResultGenerated && subtype == 'Social Media'"
          :content="tempResponse?.result"
        />
      </div>

      <div class="flex">
        <div class="my-2 flex">
          <button
            @click="analyseData()"
            type="button"
            class="mr-2 focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 w-[160px]"
          >
            <div v-if="isLoading == false">
              <span v-if="isResultGenerated == false">{{ t('Analyse content') }}</span>
              <span v-else>{{ t('Analyse again') }}</span>
            </div>
            <LoadingSpinner v-else />
          </button>
          <button
            v-if="isResultGenerated"
            @click="exportPdfAnalysis()"
            type="button"
            class="mr-2 focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 w-[220px]"
          >
            <div v-if="isLoadingPdfExport == false">
              <font-awesome-icon :icon="['fas', 'file-pdf']" />
              {{ t('Download analysis result') }}
            </div>
            <LoadingSpinner v-else />
          </button>
        </div>
      </div>
    </div>
  </Navigation>
</template>
