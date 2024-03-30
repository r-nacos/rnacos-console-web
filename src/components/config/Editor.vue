<template>
  <div
    ref="editorRef"
    class="editor-main"
  ></div>
</template>
<script lang="ts" setup>
import { basicSetup, EditorView } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { oneDarkTheme } from '@codemirror/theme-one-dark'
import { onMounted, ref } from 'vue'
import { darkTheme } from 'naive-ui'
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])
const editorRef = ref()
const editorView = ref()
const initEditor = () => {
  if (typeof editorView.value !== 'undefined') {
    editorView.value.destroy()
  }

  const myTheme = EditorView.theme(
    {
      '&': {
        color: 'white',

        backgroundColor: '#034',
      },

      '.cm-content': {
        caretColor: '#0e9',
      },

      '&.cm-focused .cm-cursor': {
        borderLeftColor: '#0e9',
      },

      '&.cm-focused .cm-selectionBackground, ::selection': {
        backgroundColor: '#074',
      },

      '.cm-gutters': {
        backgroundColor: '#045',

        color: '#ddd',

        border: 'none',
      },
    },
    { dark: true },
  )

  alert(props.modelValue)
  const startState = EditorState.create({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      javascript(),
      json(),
      EditorView.updateListener.of(function (e) {
        const val = e.state.doc.toString()
        emits('update:modelValue', val)
      }),
    ],
  })
  if (editorRef.value) {
    editorView.value = new EditorView({
      state: startState,
      parent: editorRef.value,
    })
  }
}
onMounted(() => {
  initEditor()
})
</script>
<style lang="scss" scoped>
.editor-main {
  width: 100%;
  height: 400px;
}
</style>
