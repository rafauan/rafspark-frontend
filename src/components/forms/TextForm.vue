<template>
  <div>
    <label :for="inputId" class="block text-sm font-medium text-gray-700">
      {{ t(label) }}
    </label>
    <input
      v-model="localValue"
      :type="type"
      :id="inputId"
      :name="name"
      class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
      autocomplete="off"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  name: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const inputId = computed(
  () => props.id || props.name || 'input-' + Math.random().toString(36).substr(2, 9)
)
</script>
