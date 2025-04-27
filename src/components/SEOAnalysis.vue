<template>
  <div class="bg-white rounded-lg">
    <h2 class="text-2xl font-bold mb-4">{{ t('SEO Analysis Results') }}</h2>

    <!-- Meta Description Length -->
    <div class="mb-4">
      <h3 class="text-xl font-semibold text-gray-700">{{ t('Meta Description Length') }}</h3>
      <DynamicHtmlRenderer :htmlContent="props.description" class="my-2" />
      <p class="text-gray-800">
        <span class="font-semibold">{{ t('Length') }}:</span>
        {{ data.meta_description_length.length }}
        {{ t('characters') }}
      </p>
      <p>
        <span class="font-semibold">{{ t('Status') }}: </span>
        <span>
          {{ formattedStatus }}
        </span>
      </p>
    </div>

    <!-- Missing Keywords -->
    <div class="mb-4">
      <h3 class="text-xl font-semibold text-gray-700">{{ t('Missing Keywords') }}</h3>
      <DynamicHtmlRenderer :htmlContent="props.keywords" class="my-2" />
      <!-- <div v-for="keyword in data.missing_keywords" :key="keyword">
        <div class="flex items-center space-x-2">
          <div class="bg-blue-700 w-[6px] h-[6px] mt-1 rounded-full"></div>
          <p class="text-gray-800">{{ keyword }}</p>
        </div>
      </div> -->
      <ul class="list-disc list-inside text-gray-800">
        <li v-for="keyword in data.missing_keywords" :key="keyword" class="mb-2">
          {{ keyword }}
        </li>
      </ul>
    </div>

    <!-- SEO Title Evaluation -->
    <div>
      <h3 class="text-xl font-semibold text-gray-700">{{ t('SEO Title Evaluation') }}</h3>

      <DynamicHtmlRenderer :htmlContent="props.title" class="my-2" />

      <p class="text-gray-800">
        <span class="font-semibold">{{ t('Score') }}: </span
        >{{ data.seo_title_evaluation.score }}/10
      </p>
      <h4 class="text-gray-700 font-medium text-xl mt-4 mb-1">{{ t('Suggestions') }}:</h4>

      <div class="flex items-center space-x-2">
        <p class="text-gray-700">{{ data.analysis_commentary }}</p>
      </div>
    </div>
  </div>

  <div></div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
// import TextareaForm from '@/components/forms/TextareaForm.vue'
import DynamicHtmlRenderer from './DynamicHtmlRenderer.vue'

const { t } = useI18n()

// Props for accepting JSON response
const props = defineProps({
  response: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  keywords: {
    type: String,
    required: true
  }
})

const content = '<title>Testowe</title>'

// Parse the JSON response
const data = computed(() => {
  try {
    const cleanResponse = props.response.replace(/^```json\n/, '').replace(/\n```$/, '')
    return JSON.parse(cleanResponse)
  } catch (error) {
    console.error('Failed to parse JSON response:', error)
    return {}
  }
})

// Computed property for capitalized status
const formattedStatus = computed(() => {
  const status = data.value.meta_description_length.status
  if (!status) {
    return ''
  } else if (status === 'too_short') {
    return t('Good')
  } else if (status === 'optimal') {
    return t('Optimal')
  } else if (status === 'too_long') {
    return t('Too long')
  } else {
    return ''
  }
})
</script>

<style scoped>
/* Add custom styles if necessary */
</style>
