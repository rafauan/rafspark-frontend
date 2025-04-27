<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
      <thead class="text-left">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="whitespace-nowrap px-4 py-4 font-medium text-gray-900 cursor-pointer"
            @click="sortBy(column.key)"
          >
            {{ t(column.label) }}
            <font-awesome-icon :icon="getSortIcon(column.key)" class="ml-2" />
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="item in sortedData"
          :key="item.id"
          class="odd:bg-gray-50 cursor-pointer hover:bg-gray-200"
          @click="router.push(`/posts/${item.id}`)"
        >
          <td class="whitespace-nowrap px-4 py-4 font-medium text-gray-900">{{ item.id }}</td>
          <td class="whitespace-nowrap px-4 py-4 text-gray-700">{{ item.title }}</td>
          <td class="whitespace-nowrap px-4 py-4 text-gray-700">{{ item.project_title }}</td>
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
import { ref, computed } from 'vue'
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
  }
})

// Kolumny tabeli
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'project_title', label: 'Project' },
  { key: 'type', label: 'Type' },
  { key: 'created_at', label: 'Created At' },
  { key: 'updated_at', label: 'Updated At' }
]

// Stan sortowania
const sortKey = ref('id')
const sortDirection = ref('asc') // 'asc' lub 'desc'

// Funkcja do zmiany sortowania
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

// Dane posortowane
const sortedData = computed(() => {
  return [...props.data].sort((a, b) => {
    const aValue = a[sortKey.value]
    const bValue = b[sortKey.value]

    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

// Funkcja pomocnicza do pobierania ikony sortowania
const getSortIcon = (key) => {
  if (sortKey.value !== key) return ['fas', 'chevron-down']
  return sortDirection.value === 'asc' ? ['fas', 'chevron-up'] : ['fas', 'chevron-down']
}

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
