<template>
  <div>
    <label for="password" class="block text-sm font-medium text-gray-700">
      {{ t(label) }}
    </label>
    <input
      v-model="localPassword"
      type="password"
      id="password"
      name="password"
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
  },
  label: {
    type: String,
    default: 'Password'
  }
})

const emit = defineEmits(['update:modelValue'])

const localPassword = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const { t } = useI18n()
</script>
