<template>
  <div
    v-if="errors.length > 0"
    role="alert"
    class="rounded border-s-4 border-red-500 bg-red-50 p-4 mb-4"
  >
    <div class="flex items-center gap-2 text-red-800">
      <font-awesome-icon :icon="['fas', 'circle-exclamation']" />

      <strong class="block font-medium">{{ t('An error has occurred') }}</strong>
    </div>
    <ul class="mt-2 text-sm text-red-700">
      <li v-for="error in errors" :key="error">{{ t(error) }}</li>
    </ul>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
  errors: {
    type: Array,
    required: true,
    default: () => [] // Domyślnie brak błędów
  }
})

const { t } = useI18n() // Dla tłumaczeń, np. "An error has occurred"
</script>

<style>
/* Opcjonalne style */
</style>
