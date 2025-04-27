<template>
  <div>
    <!-- Kontener edytora Markdown -->
    <div ref="editorContainer"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import '@toast-ui/editor/dist/toastui-editor.css'
import Editor from '@toast-ui/editor'

// Props: treść Markdown przekazywana dynamicznie
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  height: {
    type: String,
    default: '500px'
  }
})

// Emitowanie zmian
const emit = defineEmits(['update:modelValue'])

// Referencja do kontenera edytora
const editorContainer = ref(null)
let editorInstance

// Inicjalizacja edytora
onMounted(() => {
  editorInstance = new Editor({
    el: editorContainer.value,
    height: props.height,
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    initialValue: props.modelValue || ''
  })

  // Obsługa zmiany treści
  editorInstance.on('change', () => {
    const updatedContent = editorInstance.getMarkdown()
    emit('update:modelValue', updatedContent)
  })
})

// Aktualizacja edytora, gdy `props.modelValue` ulegnie zmianie
watch(
  () => props.modelValue,
  (newContent) => {
    if (editorInstance && newContent !== editorInstance.getMarkdown()) {
      editorInstance.setMarkdown(newContent || '')
    }
  }
)

// Usuwanie instancji edytora podczas demontażu komponentu
onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.destroy()
  }
})
</script>
