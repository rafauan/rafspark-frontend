<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()
const user = ref(null)

// const user = ref(authStore.user)

const asideItems = [
  {
    title: 'Profile',
    icon: ['fas', 'user'],
    routePath: '/profile'
  },
  {
    title: 'Projects',
    icon: ['fas', 'table-columns'],
    routePath: '/projects'
  },
  {
    title: 'Posts',
    icon: ['fas', 'file-alt'],
    routePath: '/posts'
  },
  {
    title: 'Content analyser',
    icon: ['fas', 'gear'],
    routePath: '/content-analyser'
  }
]

onMounted(async () => {
  user.value = await authStore.fetchUser()
})

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

const changeLanguage = (lang) => {
  locale.value = lang
}

function getInitials() {
  if (!user.value?.name) return ''

  return user.value.name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}
</script>

<template>
  <div class="h-screen bg-white flex flex-col">
    <!-- Header -->
    <header
      class="w-full h-16 p-4 flex justify-between items-center bg-white border-b-2 border-gray-100"
    >
      <a href="/dashboard" class="text-xl text-black font-semibold cursor-pointer">
        {{ t('RafSpark') }}
      </a>
      <div>
        <button
          @click="changeLanguage(locale === 'en' ? 'pl' : 'en')"
          type="button"
          class="focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 mr-3"
        >
          <font-awesome-icon :icon="['fas', 'language']" class="mr-1" />
          <span v-if="locale === 'en'">EN</span>
          <span v-else>PL</span>
        </button>
        <button
          @click="logout"
          type="button"
          class="focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />
          {{ t('Sign out') }}
        </button>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside
        class="flex-shrink-0 w-80 h-full flex flex-col justify-between border-e-2 bg-white border-gray-100"
      >
        <div class="px-4 py-6">
          <ul class="mt-6 space-y-1">
            <li v-for="item in asideItems" :key="item.title">
              <a
                href="#"
                class="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                :class="
                  route.path.startsWith(item.routePath)
                    ? 'border-blue-500 bg-blue-50 text-blue-900 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700'
                    : ''
                "
                @click="router.push(item.routePath)"
              >
                <font-awesome-icon :icon="item.icon" class="size-5 opacity-75" />
                <span class="text-sm font-medium">{{ t(item.title) }}</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="sticky inset-x-0 bottom-0 border-t border-gray-100">
          <a href="#" class="flex items-center gap-2 bg-white p-4">
            <div
              class="w-10 h-10 bg-blue-700 rounded-full flex justify-center items-center text-white font-semibold"
            >
              {{ getInitials(user?.name) }}
            </div>
            <div>
              <p class="text-xs">
                <strong class="block font-medium">{{ user?.name }}</strong>
                <span>{{ user?.email }}</span>
              </p>
            </div>
          </a>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 p-8 overflow-y-auto">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
