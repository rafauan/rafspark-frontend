<template>
  <div class="mb-2">
    <label :for="selectId" class="block text-sm font-medium text-gray-900">
      {{ t(label) }}
    </label>
    <div class="inline-block relative w-64">
      <select v-model="localValue" :name="name" :id="selectId" :class="selectClass">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ t(option.label) }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectId = computed(
  () => props.id || props.name || 'select-' + Math.random().toString(36).substr(2, 9)
)

const selectClass = computed(() => {
  return props.class || 'mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm'
})
</script>
