<template>
  <h2 class="text-2xl font-bold mb-4">{{ t('Suggested Colors') }}</h2>

  <div class="rounded-lg relative">
    <!-- Blok dla każdego koloru -->
    <div
      v-for="(color, index) in parsedColors"
      :key="index"
      class="p-6 cursor-pointer relative"
      :style="{ backgroundColor: color.hex }"
      @mouseover="hoveredColor = color.hex"
      @mouseleave="hoveredColor = null"
      @click="copyToClipboard(color.hex)"
    >
      <!-- Tooltip w prawym dolnym rogu elementu -->
      <div
        v-if="hoveredColor === color.hex"
        class="absolute bottom-0 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded-md m-2"
      >
        {{ color.hex }}
      </div>
    </div>

    <!-- Komunikat "Skopiowano" -->
    <div
      v-if="showCopiedMessage"
      class="absolute top-4 right-4 bg-gray-900 text-white text-sm px-4 py-2 rounded-md shadow-md transition-opacity duration-300"
    >
      Skopiowano!
    </div>

    <div class="mt-4">
      <div class="flex justify-center items-center gap-4">
        <div
          v-for="(color, index) in parsedColors"
          :key="index"
          class="flex flex-col items-center text-center p-2 rounded-md"
        >
          <div class="w-10 h-10 rounded-full" :style="{ backgroundColor: color.hex }"></div>
          <p class="mt-2 text-sm font-medium tracking-widest">{{ color.hex }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
const props = defineProps({
  aiResponse: {
    type: String,
    required: true,
    default: ''
  }
})

// Stan komunikatu i najechania
const hoveredColor = ref(null)
const showCopiedMessage = ref(false)

// Funkcja kopiowania do schowka
const copyToClipboard = async (hex) => {
  try {
    await navigator.clipboard.writeText(hex)
    showCopiedMessage.value = true

    // Ukryj komunikat po 3 sekundach
    setTimeout(() => {
      showCopiedMessage.value = false
    }, 3000)
  } catch (error) {
    console.error('Nie udało się skopiować do schowka:', error)
  }
}

// Funkcja parsująca zwrotkę z AI
const extractColorsFromResponse = (responseText) => {
  if (!responseText || typeof responseText !== 'string') {
    console.error('Invalid responseText:', responseText)
    return []
  }

  const colorRegex = /#([0-9A-Fa-f]{6})/g
  const matches = responseText.match(colorRegex)

  if (!matches) {
    console.warn('No colors found in responseText:', responseText)
    return []
  }

  return matches.map((hex) => ({ hex }))
}

// Parsowanie kolorów na podstawie zwrotki AI
const parsedColors = computed(() => extractColorsFromResponse(props.aiResponse))
</script>

<style scoped>
/* Stylizacja opcjonalna */
</style>
