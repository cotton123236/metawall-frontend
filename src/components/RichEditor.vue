<script setup>
import { ref, watch, onMounted, onBeforeUnmount, reactive, toRefs } from '@vue/runtime-core'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  }
})

const { modelValue } = toRefs(props)
console.log(modelValue.value);
const editor = ref(null)

watch(modelValue, () => {
  // HTML
  const isSame = editor.value.getHTML() === value

  console.log(isSame);
  // JSON
  // const isSame = JSON.stringify(editor.value.getJSON()) === JSON.stringify(value)

  if (isSame) return;

  editor.value.commands.setContent(value, false)
})

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit
    ],
    content: modelValue.value,
    onUpdate: () => {
      // HTML
      // this.$emit('update:modelValue', editor.value.getHTML())

      // JSON
      // this.$emit('update:modelValue', editor.value.getJSON())
    },
  })
})

onBeforeUnmount(() => {
  editor.value.destroy()
})
</script>

<template>
  <editor-content :editor="editor" />
</template>