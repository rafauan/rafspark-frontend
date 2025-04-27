<template>
  <div role="alert" class="rounded border-s-4 border-green-500 bg-green-50 p-4">
    <strong class="block font-medium text-green-800">{{ t(props.title) }}</strong>

    <p class="mt-2 text-sm text-green-700">
      {{ t(props.text) }}
    </p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
})
</script>
