<template>
  <div>
    <label :for="textareaId" class="block text-sm font-medium text-gray-700">
      {{ t(label) }}
    </label>
    <textarea
      v-model="localValue"
      :id="textareaId"
      :name="name"
      :class="textareaClass"
      :rows="rows"
      autocomplete="off"
    ></textarea>
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
    default: 'Description'
  },
  name: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 8
  }
})

const emit = defineEmits(['update:modelValue'])

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const textareaId = computed(
  () => props.id || props.name || 'textarea-' + Math.random().toString(36).substr(2, 9)
)

const textareaClass = computed(() => {
  return 'mt-1 w-full rounded-lg border-gray-200 align-top shadow-sm sm:text-sm'
})
</script>
