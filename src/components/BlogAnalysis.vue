<template>
  <div class="bg-white border-gray-200 rounded-lg shadow-sm">
    <h2 class="text-2xl font-bold mb-4">{{ t('Blog Content Analysis') }}</h2>

    <!-- Readability Score -->
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-700">{{ t('Readability Score') }}</h3>
      <p class="text-gray-800">
        <span class="font-semibold">{{ t('Score') }}:</span>
        {{ parsedData.readability_score.score }}
      </p>
      <p class="text-gray-800">
        <span class="font-semibold">{{ t('Level') }}:</span>
        {{ t(parsedData.readability_score.level) }}
      </p>
      <p class="text-gray-600">{{ parsedData.readability_score.explanation }}</p>
    </div>

    <!-- Spelling and Grammar -->
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-700">{{ t('Spelling and Grammar Issues') }}</h3>
      <ul v-if="parsedData.spelling_and_grammar.length" class="list-disc list-inside text-gray-800">
        <li v-for="(issue, index) in parsedData.spelling_and_grammar" :key="index" class="mb-2">
          <span class="font-semibold">{{ t('Issue') }}:</span> {{ issue.issue }}<br />
          <span class="font-semibold">{{ t('Suggestion') }}:</span> {{ issue.suggestion }}<br />
          <span class="font-semibold">{{ t('Context') }}:</span> {{ issue.context }}
        </li>
      </ul>
      <p v-else class="text-gray-600">{{ t('No spelling or grammar issues detected.') }}</p>
    </div>

    <!-- Tone Evaluation -->
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-700">{{ t('Tone Evaluation') }}</h3>
      <p class="text-gray-800">
        <span class="font-semibold">{{ t('Tone') }}:</span> {{ t(parsedData.tone_evaluation.tone) }}
      </p>
      <p class="text-gray-800">
        <span class="font-semibold">{{ t('Consistency') }}:</span>
        {{ t(parsedData.tone_evaluation.consistency) }}
      </p>
      <p class="text-gray-600">{{ parsedData.tone_evaluation.explanation }}</p>
    </div>

    <!-- Recommendations -->
    <div>
      <h3 class="text-lg font-bold text-gray-700">{{ t('Recommendations') }}</h3>
      <!-- <div v-for="(recommendation, index) in parsedData.recommendations" :key="index">
        <div class="flex space-x-2">
          <div class="bg-blue-700 w-[6px] h-[6px] mt-3 rounded-full"></div>
          <p class="text-gray-800">{{ recommendation }}</p>
        </div>
      </div> -->
      <ul class="list-disc list-inside text-gray-800">
        <li v-for="(recommendation, index) in parsedData.recommendations" :key="index" class="mb-1">
          {{ recommendation }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  content: {
    type: String,
    required: true,
    default: ''
  }
})

// Parsowanie JSON z odpowiedzi
const parsedData = computed(() => {
  try {
    // Usunięcie znacznika ```json i końcowego ``` jeśli istnieją
    const cleanResponse = props.content.replace(/^```json\n/, '').replace(/\n```$/, '')
    return JSON.parse(cleanResponse)
  } catch (error) {
    console.error('Failed to parse JSON content:', error)
    return {}
  }
})
</script>

<style scoped>
/* Styl opcjonalny dla czytelności */
</style>
