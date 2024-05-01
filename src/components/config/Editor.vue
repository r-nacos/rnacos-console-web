<template>
  <div class="editor-main">
    <div ref="editorRef"></div>
  </div>
</template>
<script lang="ts" setup>
import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { html } from '@codemirror/lang-html'
import { json } from '@codemirror/lang-json'
import { xml } from '@codemirror/lang-xml'
import { yaml } from '@codemirror/lang-yaml'
import { onMounted, ref } from 'vue'
import { keymap, EditorView } from '@codemirror/view'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { solarizedDark } from 'cm6-theme-solarized-dark'
const props = defineProps(['modelValue', 'languageType'])
const emits = defineEmits(['update:modelValue'])
const editorRef = ref()
const editorView = ref()

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
    case 'text':
      lang = html()
      break
    case 'json':
      lang = json()
      break
    case 'xml':
      lang = xml()
      break
    case 'yaml':
      lang = yaml()
      break
    case 'html':
      lang = html()
      break
    case 'properties':
      lang = yaml()
      break
    case 'toml':
      lang = yaml()
      break
    default:
      lang = html()
  }
  const startState = EditorState.create({
    doc: props.modelValue,
    extensions: [
      keymap.of(defaultKeymap),
      keymap.of([indentWithTab]),
      basicSetup,
      lang,
      solarizedDark,
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
  background: #002b36;
}
</style>
