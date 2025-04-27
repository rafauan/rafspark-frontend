<template>
  <div
    class="max-w-lg bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden text-gray-800"
  >
    <!-- User info -->
    <div class="flex items-center px-4 py-3">
      <div class="w-10 h-10 rounded-full object-cover bg-gray-300"></div>
      <div class="ml-3">
        <p class="text-sm font-medium">{{ user.name }}</p>
        <p class="text-xs text-gray-500">@{{ user.username }}</p>
      </div>
    </div>

    <!-- Post image -->
    <img v-if="image" :src="image" alt="Post content" class="w-full object-cover" />

    <!-- Post content -->
    <div class="px-4 py-2">
      <p class="text-sm text-gray-700" v-html="formattedContent"></p>
    </div>

    <!-- Actions -->
    <div class="px-4 py-2 flex items-center justify-between text-sm text-gray-600">
      <button class="flex items-center space-x-1 hover:text-red-600">
        <font-awesome-icon icon="fa-solid fa-heart" />
        <span>Like</span>
      </button>
      <button class="flex items-center space-x-1 hover:text-gray-800">
        <font-awesome-icon icon="fa-regular fa-comment" />
        <span>Comment</span>
      </button>
      <button class="flex items-center space-x-1 hover:text-gray-800">
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
    default: 'This is a sample Instagram post content with #hashtags.'
  },
  image: {
    type: String,
    required: true,
    default: 'https://via.placeholder.com/500x500' // Placeholder image
  },
  user: {
    type: Object,
    required: true,
    default: () => ({
      name: 'Jane Doe',
      username: 'janedoe',
      avatar: 'https://i.pravatar.cc/150?img=10'
    })
  }
})

// Format content for hashtags
const formattedContent = computed(() => {
  return props.content.replace(
    /#([a-zA-Z0-9_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+)/g, // Uwzględnia polskie znaki
    '<span class="text-blue-500 cursor-pointer">#$1</span>' // Wrap hashtags in a styled span
  )
})
</script>
