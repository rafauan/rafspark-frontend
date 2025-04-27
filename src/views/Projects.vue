<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProjectStore } from '../stores/project'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navigation from '@/components/Navigation.vue'

const authStore = useAuthStore()
const router = useRouter()
const projectStore = useProjectStore()
const user = ref(null)
const projects = ref([])
const projectsNumber = ref(0)
const { t } = useI18n()

onMounted(async () => {
  user.value = await authStore.fetchUser()
  projects.value = await projectStore.index()
  projectsNumber.value = projects.value.data.length
})

// function truncateText(text, maxLength) {
//   if (text.length <= maxLength) {
//     return text
//   }
//   return text.slice(0, maxLength) + '...'
// }

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
</script>

<template>
  <Navigation>
    <h2 class="text-xl font-semibold mb-4">{{ t('Your projects') }}</h2>
    <div class="flex items-center justify-between mb-4">
      <p class="text-gray-700">
        {{ t('projectCount', projectsNumber, { count: projectsNumber }) }}
      </p>
      <button
        @click="router.push('/create-project')"
        type="button"
        class="focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5"
      >
        <font-awesome-icon :icon="['fas', 'plus']" />
        {{ t('Create new project') }}
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="project in projects.data"
        :key="project.id"
        @click="router.push(`/projects/${project.id}`)"
        class="p-6 bg-white border-2 border-gray-100 hover:shadow-md rounded-lg cursor-pointer transition duration-300 ease-in-out"
      >
        <font-awesome-icon :icon="['fas', 'envelope-open-text']" class="text-blue-700 h-8 mb-2" />
        <p class="text-2xl mb-2">{{ project.title }}</p>
        <span class="text-gray-700">{{ formatDate(project.created_at) }}</span>
        <!-- <div class="flex">
          <div
            class="mt-2"
            v-if="project.seo_description || project.seo_keywords || project.seo_title"
          >
            <span
              class="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-0.5 text-sm text-green-700"
            >
              SEO
            </span>
          </div>
          <div class="mt-2" v-else>
          <span
            class="whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-0.5 text-sm text-gray-700"
          >
            {{ t('Other') }}
          </span>
        </div>
          <div class="mt-2" v-if="project.colors || project.fonts">
            <span
              class="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700"
            >
              {{ t('Branding') }}
            </span>
          </div>
        </div> -->
      </div>
    </div>
  </Navigation>
</template>
