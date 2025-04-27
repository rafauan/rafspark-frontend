<template>
  <div>
    <label for="email" class="block text-sm font-medium text-gray-700">
      {{ t('E-mail') }}
    </label>
    <input
      v-model="localEmail"
      type="email"
      id="email"
      name="email"
      class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
      autocomplete="off"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const localEmail = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const { t } = useI18n()
</script>
