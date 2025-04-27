<template>
  <pre class="p-4 rounded-xl" v-html="highlightedHtml"></pre>
</template>

<script setup>
import { computed } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup' // 'markup' to identyfikator dla HTML w Prism.js
import '../prism-atom-dark.css' // Możesz wybrać inny motyw z dostępnych

const props = defineProps({
  htmlContent: {
    type: String,
    required: true
  }
})

const highlightedHtml = computed(() => {
  return Prism.highlight(props.htmlContent, Prism.languages.markup, 'markup')
})
</script>

<style>
/* Dodatkowe style, jeśli potrzebujesz */
pre {
  background-color: #111827;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  color: #d1d5db;
}
</style>
