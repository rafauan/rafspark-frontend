<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative" @click.stop>
      <!-- Close Button -->
      <button
        @click="close"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Modal Title -->
      <h2 class="text-xl font-bold mb-4 text-gray-800">{{ t(title) }}</h2>

      <!-- Modal Content -->
      <div>
        <slot></slot>
      </div>

      <!-- Modal Actions -->
      <div v-if="hasActions" class="mt-6 flex justify-end space-x-4">
        <button
          @click="close"
          class="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          {{ t(cancelText) }}
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-600"
        >
          {{ t(confirmText) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'Modal Title'
  },
  hasActions: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  }
})

const emit = defineEmits(['close', 'confirm'])

const close = () => {
  emit('close')
}
</script>

<style scoped>
/* Optional: Add any custom styles */
</style>
