<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProjectStore } from '../stores/project'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navigation from '@/components/Navigation.vue'
import TextInput from '@/components/forms/TextForm.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import TextareaForm from '@/components/forms/TextareaForm.vue'
import Modal from '@/components/Modal.vue'
import BlogAnalysis from '@/components/BlogAnalysis.vue'
import SuccessAlert from '@/components/SuccessAlert.vue'
import InfoAlert from '@/components/InfoAlert.vue'

const authStore = useAuthStore()
const projectStore = useProjectStore()
const route = useRoute()
const router = useRouter()
const user = ref(null)
const errors = ref([])
const { t, locale } = useI18n()

const project = ref(null)
const post = ref(null)

const content = ref('')
const postTitle = ref('')
const postType = ref('')

const tempResponse = ref(null)
const isLoading = ref(false)
const isAnalyzingLoading = ref(false)
const isResultGenerated = ref(false)
const isSaved = ref(false)
const isLoadingExport = ref(false)
const isExported = ref(false)
const isLoadingPdfExport = ref(false)

onMounted(async () => {
  user.value = await authStore.fetchUser()
})

onBeforeMount(async () => {
  project.value = await projectStore.show(route.params.id)
  post.value = await projectStore.showPost(route.params.postId)
  postTitle.value = post.value.data.title
  content.value = post.value.data.content
  postType.value = post.value.data.type
})

const saveData = async () => {
  errors.value = []
  isLoading.value = true
  isSaved.value = false
  try {
    let response = await projectStore.updatePost(post.value.data.id, postTitle.value, content.value)
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

const showModal = ref(false)

const handleConfirm = () => {
  showModal.value = false

  projectStore
    .deletePost(post.value.data.id)
    .then((response) => {
      console.log('Post deleted successfully:', response)
      router.push(`/posts`)
    })
    .catch((error) => {
      console.error('Delete Post Error:', error)
      errors.value.push('Failed to delete post. Please try again.')
      showModal.value = true
    })
}

const analyseData = async () => {
  errors.value = []
  isAnalyzingLoading.value = true
  try {
    let response = await projectStore.analyseData(
      route.params.id,
      locale.value === 'pl' ? 'Polish' : 'English',
      'Blog',
      null,
      route.params.postId,
      content.value
    )
    tempResponse.value = response.result
    isResultGenerated.value = true
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
    isAnalyzingLoading.value = false
  }
}

const exportPost = async () => {
  errors.value = []
  isLoadingExport.value = true
  try {
    let response = await projectStore.exportPost(route.params.postId)
    console.log('Export response:', response)
    isExported.value = true
    return response
  } catch (error) {
    console.error('Export Post Error:', error)
    if (error.response && error.response.status === 422) {
      for (const key in error.response.data) {
        errors.value.push(...error.response.data[key])
      }
    } else {
      errors.value.push('Failed to export post. Please try again.')
    }
  } finally {
    isLoadingExport.value = false
  }
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
      title: post.value.data.title
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

// Funkcja pomocnicza do pobierania pliku Blob
const downloadBlob = (blobData, filename, mimeType) => {
  const blob = new Blob([blobData], { type: mimeType })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link) // Usunięcie linku po kliknięciu
}
</script>

<template>
  <Navigation>
    <Breadcrumb
      class="mb-4"
      :breadcrumbs="[
        route.params.id
          ? { label: project?.data?.title, url: '/projects/' + route.params.id }
          : { label: t('Posts'), url: '/posts' },
        { label: t('Post'), url: null }
      ]"
    />
    <div class="p-6 bg-white border-2 border-gray-100 rounded-lg shadow-sm w-full">
      <form @submit.prevent="createProject">
        <div class="flex justify-between">
          <p class="text-2xl mb-4 font-semibold">{{ t('Post') }}</p>

          <div>
            <button
              v-if="postType == 'wordpress' && post?.data?.wp_url"
              @click="exportPost()"
              type="button"
              class="focus:outline-none text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:bg-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 mx-2 w-[160px]"
            >
              <span v-if="isLoadingExport == false">
                <font-awesome-icon :icon="['fab', 'wordpress']" />
                {{ t('Export post') }}
              </span>
              <LoadingSpinner v-else />
            </button>

            <share-network v-if="postType == 'facebook'" network="facebook" v-slot="{ share }">
              <button
                class="focus:outline-none text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mx-2"
                @click="share"
              >
                <font-awesome-icon :icon="['fab', 'facebook']" />
                {{ t('Share on Facebook') }}
              </button>
            </share-network>

            <share-network v-if="postType == 'linkedin'" network="linkedin" v-slot="{ share }">
              <button
                class="focus:outline-none text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:bg-sky-800 font-medium rounded-lg text-sm px-5 py-2.5 mx-2"
                title="postTitle"
                description="postText"
                @click="share"
              >
                <font-awesome-icon :icon="['fab', 'linkedin']" />
                {{ t('Share on LinkedIn') }}
              </button>
            </share-network>

            <share-network
              v-if="postType == 'twitter'"
              network="twitter"
              :title="content"
              v-slot="{ share }"
            >
              <button
                class="focus:outline-none text-white bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 mx-2"
                @click="share"
              >
                <font-awesome-icon :icon="['fab', 'x-twitter']" />
                {{ t('Share on X') }}
              </button>
            </share-network>

            <button
              @click="showModal = true"
              type="button"
              class="focus:outline-none text-white bg-red-600 hover:bg-red-500 focus:ring-4 focus:bg-red-500 font-medium rounded-lg text-sm px-5 py-2.5 mx-2 w-[140px]"
            >
              <font-awesome-icon :icon="['fas', 'trash-alt']" />
              {{ t('Delete post') }}
            </button>
          </div>
        </div>

        <ErrorAlert :errors="errors" />

        <InfoAlert
          v-if="postType == 'facebook'"
          title="Attention!"
          text="Due to Facebook's security policy, the text must be manually copied into the post."
          class="my-4"
        />

        <InfoAlert
          v-if="postType == 'linkedin'"
          title="Attention!"
          text="Due to LinkedIn's security policy, the text must be manually copied into the post."
          class="my-4"
        />

        <SuccessAlert
          v-if="isExported"
          class="my-4"
          title="Success!"
          :text="t('post_exported_success', { url: post?.data?.wp_url })"
        />

        <div class="mb-4">
          <TextInput v-model="postTitle" label="Title" name="title" id="title" />
        </div>
        <div class="mb-4" v-if="postType == 'wordpress'">
          <MarkdownEditor v-model="content" :height="'60vh'" />
        </div>
        <div class="mb-4" v-else>
          <TextareaForm v-model="content" label="Content" name="content" id="content" />
        </div>
        <div v-if="isResultGenerated">
          <BlogAnalysis :content="tempResponse" />
        </div>
        <div class="flex mt-8">
          <button
            @click="saveData()"
            type="button"
            class="focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 justify-center items-center w-[140px]"
          >
            <div v-if="isLoading == false">{{ t('Save changes') }}</div>
            <LoadingSpinner v-else />
          </button>
          <button
            @click="analyseData()"
            type="button"
            class="focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 mx-2 w-[160px] flex justify-center items-center"
          >
            <div v-if="isAnalyzingLoading == false">
              <font-awesome-icon :icon="['fas', 'edit']" />
              {{ t('Analyse content') }}
            </div>
            <LoadingSpinner v-else />
          </button>
          <button
            v-if="isResultGenerated"
            @click="exportPdfAnalysis()"
            type="button"
            class="focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 w-[220px] flex justify-center items-center"
          >
            <div v-if="isLoadingPdfExport == false">
              <font-awesome-icon :icon="['fas', 'file-pdf']" />
              {{ t('Download analysis result') }}
            </div>
            <LoadingSpinner v-else />
          </button>
          <div
            v-if="isSaved"
            class="focus:outline-none text-white text-center bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 w-[220px]"
          >
            <font-awesome-icon :icon="['fas', 'circle-check']" />
            {{ t('Data saved successfully') }}
          </div>
        </div>
      </form>
    </div>

    <Modal
      :isOpen="showModal"
      title="Are you sure?"
      @close="showModal = false"
      @confirm="handleConfirm"
    >
      <p>{{ t('Are you sure you want to delete this post?') }}</p>
    </Modal>
  </Navigation>
</template>
