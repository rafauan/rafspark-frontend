<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'
import Navigation from '@/components/Navigation.vue'

const authStore = useAuthStore()
const user = ref(null)
const { t } = useI18n()

onMounted(async () => {
  user.value = await authStore.fetchUser()
})
</script>

<template>
  <Navigation>
    <h2 class="text-xl font-semibold mb-4">{{ t('Your account informations') }}</h2>
    <div class="flow-root rounded-lg border border-gray-100 py-3 border-2 bg-white">
      <dl class="-my-3 divide-y divide-gray-100 text-sm">
        <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt class="font-medium text-gray-900">{{ t('Name') }}</dt>
          <dd class="text-gray-700 sm:col-span-2">{{ user?.name }}</dd>
        </div>

        <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt class="font-medium text-gray-900">{{ t('E-mail') }}</dt>
          <dd class="text-gray-700 sm:col-span-2">{{ user?.email }}</dd>
        </div>

        <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt class="font-medium text-gray-900">{{ t('Created at') }}</dt>
          <dd class="text-gray-700 sm:col-span-2">{{ user?.created_at }}</dd>
        </div>
      </dl>
    </div>
  </Navigation>
</template>
