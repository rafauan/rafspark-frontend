<script setup>
import { ref, onMounted, onBeforeMount, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProjectStore } from '../stores/project'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navigation from '@/components/Navigation.vue'
import DynamicHtmlRenderer from '@/components/DynamicHtmlRenderer.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import DynamicTable from '@/components/DynamicTable.vue'
import ColorPalette from '@/components/ColorPalette.vue'
import MarkdownViewer from '@/components/MarkdownViewer.vue'
import Modal from '@/components/Modal.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const user = ref(null)
const posts = ref([])
const postsNumber = ref(0)
const showModal = ref(false)

const project = ref(null)

onMounted(async () => {
  user.value = await authStore.fetchUser()
  posts.value = await projectStore.indexPost(route.params.id)
  postsNumber.value = posts.value.data.length
})

onBeforeMount(async () => {
  project.value = await projectStore.show(route.params.id)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const countSeoPoints = computed(() => {
  let points = 0
  if (project.value.data.seo_description) {
    points++
  }
  if (project.value.data.seo_keywords) {
    points++
  }
  if (project.value.data.seo_title) {
    points++
  }
  return points
})

const calculatePercentage = (filled, total) => {
  return ((filled / total) * 100).toFixed(2)
}

const handleConfirm = () => {
  showModal.value = false

  projectStore
    .deleteProject(route.params.id)
    .then((response) => {
      console.log('Post deleted successfully:', response)
      router.push(`/projects`)
    })
    .catch((error) => {
      console.error('Delete Project Error:', error)
      errors.value.push('Failed to delete project. Please try again.')
      showModal.value = true
    })
}
</script>

<template>
  <Navigation>
    <div class="flex items-center justify-between align-middle mb-4">
      <h2 class="text-xl font-semibold">{{ project?.data?.title }}</h2>
      <div>
        <button
          @click="router.push(`/content-analyser/${route.params.id}`)"
          type="button"
          class="focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
        >
          <font-awesome-icon :icon="['fas', 'edit']" />
          {{ t('Analyse content') }}
        </button>
        <button
          @click="router.push(`/edit-project/${route.params.id}`)"
          type="button"
          class="focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          <font-awesome-icon :icon="['fas', 'edit']" />
          {{ t('Edit') }}
        </button>
        <button
          @click="showModal = true"
          type="button"
          class="focus:outline-none text-white bg-red-600 hover:bg-red-500 focus:ring-4 focus:bg-red-500 font-medium rounded-lg text-sm px-5 py-2.5 mx-2 w-[140px]"
        >
          <font-awesome-icon :icon="['fas', 'trash-alt']" />
          {{ t('Delete project') }}
        </button>
      </div>
    </div>
    <div class="p-6 bg-white border-2 border-gray-100 rounded-lg shadow-sm">
      <p class="font-semibold">{{ t('Description') }}</p>
      <div class="p-3 bg-gray-200 my-2 rounded-xl inline-block">
        {{ project?.data?.description }}
      </div>

      <p class="font-semibold">{{ t('Created at') }}</p>
      <div class="my-2">
        {{ formatDate(project?.data?.created_at) }}
      </div>

      <p class="font-semibold">{{ t('Updated at') }}</p>
      <div class="my-2">
        {{ formatDate(project?.data?.updated_at) }}
      </div>

      <div class="my-2" v-if="project?.data?.wp_url">
        <p class="font-semibold mb-2">{{ t('Wordpress site URL') }}</p>
        <a
          :href="project?.data?.wp_url || '#'"
          target="_blank"
          class="text-blue-600 hover:underline"
        >
          {{ project?.data?.wp_url }}
        </a>
      </div>

      <button
        @click="router.push(`/generate-data/${project.data.id}`)"
        type="button"
        class="focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 mt-2"
      >
        {{ t('Generate data') }}
      </button>
    </div>

    <span v-if="project?.data?.colors">
      <h2 class="text-xl font-semibold mt-4 mb-1">{{ t('Branding') }}</h2>
      <div class="p-6 bg-white border-2 border-gray-100 rounded-lg shadow-sm">
        <ColorPalette :aiResponse="project?.data?.colors" />

        <MarkdownViewer v-if="project?.data?.fonts" :response="project?.data?.fonts" class="mt-2" />
      </div>
    </span>

    <span v-if="project?.data?.seo_description || project?.data?.seo_keywords">
      <h2 class="text-xl font-semibold mt-4 mb-1">{{ t('SEO for website') }}</h2>
      <div class="flex items-center mb-4">
        <p class="text-gray-600 text-sm">{{ t('Filling level') }}:</p>
        <ProgressBar
          :percentage="calculatePercentage(countSeoPoints, 3)"
          class="w-64 ml-2 mt-[4px]"
        />
      </div>

      <div class="p-6 bg-white border-2 border-gray-100 rounded-lg shadow-sm">
        <p class="font-semibold mb-2">Meta description</p>
        <DynamicHtmlRenderer
          v-if="project?.data?.seo_description"
          :htmlContent="project?.data?.seo_description"
          class="mb-2"
        />
        <div
          v-else
          class="border border-gray-300 p-4 bg-gray-200 mb-2 rounded-xl inline-block w-full"
        >
          {{ t('Data not yet generated') }}
        </div>

        <p class="font-semibold mb-2">Meta keywords</p>
        <DynamicHtmlRenderer
          v-if="project?.data?.seo_keywords"
          :htmlContent="project?.data?.seo_keywords"
          class="mb-2"
        />
        <div
          v-else
          class="border border-gray-300 p-4 bg-gray-200 mb-2 rounded-xl inline-block w-full"
        >
          {{ t('Data not yet generated') }}
        </div>

        <p class="font-semibold mb-2">Title</p>
        <DynamicHtmlRenderer
          v-if="project?.data?.seo_title"
          :htmlContent="project?.data?.seo_title"
          class="mb-2"
        />
        <div
          v-else
          class="border border-gray-300 p-4 bg-gray-200 mb-2 rounded-xl inline-block w-full"
        >
          {{ t('Data not yet generated') }}
        </div>
      </div>
    </span>

    <span v-if="postsNumber > 0">
      <h2 class="text-xl font-semibold mt-4 mb-1">{{ t('Posts') }}</h2>
      <div class="flex items-center mb-4">
        <p class="text-gray-600 text-sm">
          {{ t('Number of posts') }}: <strong>{{ postsNumber }} </strong>
        </p>
      </div>
      <div>
        <DynamicTable :data="posts.data" :project-id="route.params.id" />
      </div>
    </span>

    <Modal
      :isOpen="showModal"
      title="Are you sure?"
      @close="showModal = false"
      @confirm="handleConfirm"
    >
      <p>{{ t('Are you sure you want to delete this project?') }}</p>
    </Modal>
  </Navigation>
</template>
