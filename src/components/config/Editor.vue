<template>
  <div class="editor-main">
    <div ref="editorRef"></div>
  </div>
</template>
<script lang="ts" setup>
import { basicSetup, EditorView } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { html } from '@codemirror/lang-html'
import { json } from '@codemirror/lang-json'
import { xml } from '@codemirror/lang-xml'
import { yaml } from '@codemirror/lang-yaml'
import { onMounted, ref } from 'vue'
import { monokai } from '@uiw/codemirror-theme-monokai'
const props = defineProps(['modelValue', 'languageType'])
const emits = defineEmits(['update:modelValue'])
const editorRef = ref()
const editorView = ref()
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

watch(
  () => props.languageType,
  (nv, ov) => {
    console.log(editorView.value)
    initEditor()
  },
)

/**
 * 初始化编辑器
 */
const initEditor = () => {
  if (typeof editorView.value !== 'undefined') {
    editorView.value.destroy()
  }

  let lang = {} as any
  switch (props.languageType) {
    case 'TEXT':
      lang = html()
      break
    case 'JSON':
      lang = json()
      break
    case 'XML':
      lang = xml()
      break
    case 'YAML':
      lang = yaml()
      break
    case 'HTML':
      lang = html()
      break
    case 'Properties':
      lang = yaml()
      break
  }

  const startState = EditorState.create({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      // javascript(),
      lang,
      monokai,
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
  height: 300px;
  border: 1px solid #f2f2f2;
  border-radius: 6px;
  overflow-x: hidden;
  overflow-y: auto;
  background: #272822;
}
</style>
