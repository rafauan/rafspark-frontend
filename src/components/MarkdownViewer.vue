<template>
  <div class="bg-white rounded-md">
    <h2 class="text-2xl font-bold mb-4">{{ t('Suggested Fonts') }}</h2>
    <!-- Primary Font -->
    <div v-if="parsedFonts.primary_font" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-700">{{ t('Primary Font') }}</h3>
      <p class="text-gray-800 font-bold">{{ parsedFonts.primary_font.name }}</p>
      <p class="text-gray-600 text-sm mt-1">{{ parsedFonts.primary_font.explanation }}</p>
    </div>
    <!-- Secondary Font -->
    <div v-if="parsedFonts.secondary_font" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-700">{{ t('Secondary Font') }}</h3>
      <p class="text-gray-800 font-bold">{{ parsedFonts.secondary_font.name }}</p>
      <p class="text-gray-600 text-sm mt-1">{{ parsedFonts.secondary_font.explanation }}</p>
    </div>
    <!-- Additional Fonts -->
    <div v-if="parsedFonts.additional_fonts && parsedFonts.additional_fonts.length" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-700">{{ t('Additional Fonts') }}</h3>
      <div v-for="(font, index) in parsedFonts.additional_fonts" :key="index" class="mb-4">
        <h4 class="text-md font-medium text-gray-800 capitalize">{{ font.style }}</h4>
        <p class="text-gray-800 font-bold">{{ font.name }}</p>
        <p class="text-gray-600 text-sm mt-1">{{ font.explanation }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  response: {
    type: String,
    required: true,
    default: ''
  }
})

// Parsowanie JSON z odpowiedzi
const parsedFonts = computed(() => {
  try {
    // Usunięcie znacznika ```json, jeśli istnieje
    const cleanResponse = props.response.replace(/^```json\n/, '').replace(/\n```$/, '')
    return JSON.parse(cleanResponse)
  } catch (error) {
    console.error('Failed to parse response:', error)
    return {}
  }
})
</script>

<style scoped>
/* Dodaj opcjonalne style */
</style>
