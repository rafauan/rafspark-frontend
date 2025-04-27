<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
      <thead class="text-left">
        <tr>
          <th class="whitespace-nowrap px-4 py-4 font-medium text-gray-900">{{ t('ID') }}</th>
          <th class="whitespace-nowrap px-4 py-4 font-medium text-gray-900">{{ t('Title') }}</th>
          <th class="whitespace-nowrap px-4 py-4 font-medium text-gray-900">{{ t('Type') }}</th>
          <th class="whitespace-nowrap px-4 py-4 font-medium text-gray-900">
            {{ t('Created At') }}
          </th>
          <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
            {{ t('Updated At') }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="item in props.data"
          :key="item.id"
          class="odd:bg-gray-50 cursor-pointer hover:bg-gray-200"
          @click="router.push(`/projects/${props.projectId}/posts/${item.id}`)"
        >
          <td class="whitespace-nowrap px-4 py-4 font-medium text-gray-900">{{ item.id }}</td>
          <td class="whitespace-nowrap px-4 py-4 text-gray-700">{{ item.title }}</td>
          <td class="whitespace-nowrap px-4 py-4 text-gray-700">{{ item.type }}</td>
          <td class="whitespace-nowrap px-4 py-4 text-gray-700">
            {{ formatDate(item.created_at) }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ formatDate(item.updated_at) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

// Definicja props
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  projectId: {
    type: Number,
    required: true
  }
})

// Funkcja pomocnicza do formatowania dat
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })} ${date.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // Użycie 24-godzinnego formatu
  })}`
}
</script>
