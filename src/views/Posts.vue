<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProjectStore } from '../stores/project'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navigation from '@/components/Navigation.vue'
import PostsTable from '@/components/PostsTable.vue'

const authStore = useAuthStore()
const router = useRouter()
const projectStore = useProjectStore()
const user = ref(null)
const projects = ref([])
const projectsNumber = ref(0)
const { t } = useI18n()
const posts = ref([])
const postsNumber = ref(0)

onMounted(async () => {
  user.value = await authStore.fetchUser()
  posts.value = await projectStore.indexAllPosts()
  postsNumber.value = posts.value.data.length
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
    <div class="flex justify-between mb-4 items-center">
      <h2 class="text-xl font-semibold">{{ t('Your posts') }}</h2>
      <button
        @click="router.push('/create-post')"
        type="button"
        class="focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5"
      >
        <font-awesome-icon :icon="['fas', 'plus']" />
        {{ t('Create new post') }}
      </button>
    </div>
    <PostsTable :data="posts?.data || []" />
  </Navigation>
</template>
