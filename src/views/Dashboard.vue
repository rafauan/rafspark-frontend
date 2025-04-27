<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProjectStore } from '../stores/project'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navigation from '@/components/Navigation.vue'
import EmptyImage from '@/components/EmptyImage.vue'

const authStore = useAuthStore()
const projectStore = useProjectStore()
const router = useRouter()
const user = ref(null)
const projectNumber = ref(0)
const postNumber = ref(0)
const { t } = useI18n()

onMounted(async () => {
  user.value = await authStore.fetchUser()
  projectNumber.value = (await projectStore.index()).data.length
  postNumber.value = (await projectStore.countPosts()).data
})
</script>

<template>
  <Navigation>
    <h2 class="text-xl font-normal mb-4">
      {{ t('Welcome to the') }} <span class="font-bold">{{ t('RafSpark') }}</span>
    </h2>
    <div class="flex gap-4">
      <div class="p-6 bg-white border-2 border-gray-100 rounded-lg shadow-sm w-full">
        <p class="text-2xl mb-4">
          {{ t('Hello') }}, <strong>{{ user?.name }}</strong>
        </p>
        <span v-if="projectNumber == 0">
          <p class="text-gray-700">{{ t("You don't have any projects yet") }}</p>

          <EmptyImage width="225" height="225" class="m-4" />

          <button
            @click="router.push('/create-project')"
            type="button"
            class="mt-4 focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            {{ t('Create first project') }}
          </button>
        </span>
        <span v-else>
          <!-- <div class="flex gap-8">
            <div>
              <p class="text-6xl text-gray-800">
                {{ projectNumber }}
              </p>
              <p class="text-sm text-gray-800">
                {{ t('Number of projects') }}
              </p>
            </div>
            <div>
              <p class="text-6xl text-gray-800">
                {{ postNumber }}
              </p>
              <p class="text-sm text-gray-800">
                {{ t('Number of posts') }}
              </p>
            </div>
          </div> -->

          <!-- <div class="text-sm border-2 border-gray-100 rounded-lg">
            <div class="flex gap-8">
              <div class="w-32 font-medium text-gray-900 m-3">{{ t('Number of projects') }}</div>
              <div class="w-32 font-medium text-gray-900 m-3">{{ projectNumber }}</div>
            </div>

            <div class="flex gap-8 bg-gray-50">
              <div class="w-32 font-medium text-gray-900 m-3">{{ t('Number of posts') }}</div>
              <div class="w-32 font-medium text-gray-900 m-3">{{ postNumber }}</div>
            </div>
          </div> -->

          <!-- <div class="flex gap-6">
            <div>
              <div>
                <p class="text-sm font-medium text-gray-500 truncate">
                  {{ t('Number of projects') }}
                </p>
              </div>
              <div class="pb-6 flex items-baseline sm:pb-7">
                <p class="text-2xl font-semibold text-gray-900">{{ projectNumber }}</p>
              </div>
            </div>

            <div>
              <div>
                <p class="text-sm font-medium text-gray-500 truncate">{{ t('Number of posts') }}</p>
              </div>
              <div class="pb-6 flex items-baseline sm:pb-7">
                <p class="text-2xl font-semibold text-gray-900">{{ postNumber }}</p>
              </div>
            </div>
          </div> -->

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Liczba projektów -->
            <div
              class="flex items-center justify-between bg-blue-700 text-white rounded-lg p-4 shadow-md"
            >
              <div>
                <h3 class="text-lg font-semibold">{{ t('Number of projects') }}</h3>
                <p class="text-3xl font-bold">{{ projectNumber }}</p>
              </div>
              <div>
                <font-awesome-icon :icon="['fas', 'folder']" class="text-4xl" />
              </div>
            </div>
            <!-- Liczba postów -->
            <div
              class="flex items-center justify-between bg-gray-700 text-white rounded-lg p-4 shadow-md"
            >
              <div>
                <h3 class="text-lg font-semibold">{{ t('Number of posts') }}</h3>
                <p class="text-3xl font-bold">{{ postNumber }}</p>
              </div>
              <div>
                <font-awesome-icon :icon="['fas', 'file-alt']" class="text-4xl" />
              </div>
            </div>
          </div>

          <button
            @click="router.push('/create-project')"
            type="button"
            class="mt-4 focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            {{ t('Create new project') }}
          </button>
        </span>
      </div>
    </div>
  </Navigation>
</template>
