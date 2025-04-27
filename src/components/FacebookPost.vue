<template>
  <div class="max-w-lg bg-gray-800 border border-gray-200 rounded-lg shadow-md overflow-hidden">
    <!-- User info -->
    <div class="flex items-center px-4 py-3">
      <div class="w-10 h-10 rounded-full object-cover bg-gray-300"></div>
      <div class="ml-3">
        <p class="text-sm font-medium text-gray-300">{{ author }}</p>
        <p class="text-xs text-gray-400">{{ timestamp }}</p>
      </div>
    </div>

    <!-- Post content -->
    <div class="px-4 py-2">
      <p class="text-sm text-gray-300" v-html="formattedContent"></p>
    </div>

    <!-- Post image -->
    <img v-if="image" :src="image" alt="Post content" class="w-full object-cover" />

    <!-- Actions -->
    <div class="px-4 py-2 flex items-center justify-between text-sm text-gray-300">
      <button class="flex items-center space-x-1 hover:text-blue-600">
        <font-awesome-icon icon="fa-solid fa-thumbs-up" />
        <span>Like</span>
      </button>
      <button class="flex items-center space-x-1 hover:text-blue-600">
        <font-awesome-icon icon="fa-solid fa-comment" />
        <span>Comment</span>
      </button>
      <button class="flex items-center space-x-1 hover:text-blue-600">
        <font-awesome-icon icon="fa-solid fa-share" />
        <span>Share</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props to make the component dynamic
const props = defineProps({
  content: {
    type: String,
    required: true,
    default: 'This is a sample Facebook post content.'
  },
  image: {
    type: String,
    default: null // Image is optional
  },
  timestamp: {
    type: String,
    default: '2 hours ago'
  },
  author: {
    type: String,
    required: true,
    default: 'John Doe'
  }
})

// Correctly compute formatted content
const formattedContent = computed(() => {
  return props.content.replace(
    /#([a-zA-Z0-9_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+)/g, // Uwzględnia polskie znaki
    '<span class="text-blue-500 cursor-pointer">#$1</span>' // Wrap hashtags in a styled span
  )
})
</script>

<style scoped>
/* Optional: Add custom styles if needed */
</style>
