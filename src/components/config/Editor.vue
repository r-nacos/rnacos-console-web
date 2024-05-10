<template>
  <div
    class="editor-main"
    @click="clickHandler"
  >
    <div ref="editorRef"></div>
  </div>
</template>
<script lang="ts" setup>
import { basicSetup, minimalSetup } from 'codemirror'
import { EditorState, Compartment, type Extension } from '@codemirror/state'
import { html } from '@codemirror/lang-html'
import { json } from '@codemirror/lang-json'
import { xml } from '@codemirror/lang-xml'
import { yaml } from '@codemirror/lang-yaml'
import { onMounted, ref } from 'vue'
import { keymap, EditorView, type ViewUpdate } from '@codemirror/view'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { solarizedDark } from 'cm6-theme-solarized-dark'
import { diagnosticCount as linterDagnosticCount, lintGutter, type Diagnostic, type LintSource } from '@codemirror/lint'
import type { LanguageSupport } from '@codemirror/language'
enum BrowserType {
  // 位置浏览器
  unknown = 'unknown',
  // ie浏览器
  IE = 'IE',
  // 火狐浏览器
  Firefox = 'Firefox',
  // 欧朋浏览器
  Opera = 'Opera',
  // 谷歌浏览器
  Chrome = 'Chrome',
  // 苹果浏览器
  Safari = 'Safari',
  // ie浏览器 11
  Trident = 'Trident',
}
const props = defineProps({
  languageType: {
    type: String,
    default: 'text',
  },
  modelValue: {
    type: String,
    default: '',
  },
  focusValue: {
    type: Number,
    default: 0,
  },
  /**
   * Theme
   *
   * @see {@link https://codemirror.net/docs/ref/#view.EditorView^theme}
   */
  theme: {
    type: Object,
    default: () => {},
  },
  themeDark: {
    type: Boolean,
    default: false,
  },
  /**
   * Use Basic Setup
   *
   * @see {@link https://codemirror.net/docs/ref/#codemirror.basicSetup}
   */
  basic: {
    type: Boolean,
    default: false,
  },
  /**
   * Use Minimal Setup (The basic setting has priority.)
   *
   * @see {@link https://codemirror.net/docs/ref/#codemirror.minimalSetup}
   */
  minimal: {
    type: Boolean,
    default: false,
  },
  /**
   * Placeholder
   *
   * @see {@link https://codemirror.net/docs/ref/#view.placeholder}
   */
  placeholder: {
    type: String as PropType<string | HTMLElement>,
    default: undefined,
  },
  /**
   * Line wrapping
   *
   * An extension that enables line wrapping in the editor (by setting CSS white-space to pre-wrap in the content).
   *
   * @see {@link https://codemirror.net/docs/ref/#view.EditorView%5ElineWrapping}
   */
  wrap: {
    type: Boolean,
    default: false,
  },
  /**
   * Allow tab key indent.
   *
   * @see {@link https://codemirror.net/examples/tab/}
   */
  tab: {
    type: Boolean,
    default: true,
  },
  /**
   * Allow Multiple Selection.
   *
   * @see {@link https://codemirror.net/docs/ref/#state.EditorState^allowMultipleSelections}
   */
  allowMultipleSelections: {
    type: Boolean,
    default: false,
  },
  /**
   * Tab size
   *
   * @see {@link https://codemirror.net/docs/ref/#state.EditorState^tabSize}
   */
  tabSize: {
    type: Number,
    default: undefined,
  },
  /**
   * Set line break (separetor) char.
   *
   * @see {@link https://codemirror.net/docs/ref/#state.EditorState^lineSeparator}
   */
  lineSeparator: {
    type: String,
    default: undefined,
  },
  /**
   * Readonly
   *
   * @see {@link https://codemirror.net/docs/ref/#state.EditorState^readOnly}
   */
  readonly: {
    type: Boolean,
    default: false,
  },
  /**
   * Disable input.
   *
   * This is the reversed value of the CodeMirror editable.
   * Similar to `readonly`, but setting this value to true disables dragging.
   *
   * @see {@link https://codemirror.net/docs/ref/#view.EditorView^editable}
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * Additional Extension
   *
   * @see {@link https://codemirror.net/docs/ref/#state.Extension}
   */
  extensions: {
    type: Array as PropType<Extension[]>,
    default: () => {
      return []
    },
  },
  /**
   * Language Phreses
   *
   * @see {@link https://codemirror.net/examples/translate/}
   */
  phrases: {
    type: Object as PropType<Record<string, string>>,
    default: () => undefined,
  },
  /**
   * CodeMirror Language
   *
   * @see {@link https://codemirror.net/docs/ref/#language}
   */
  lang: {
    type: Object as PropType<LanguageSupport>,
    default: () => undefined,
  },
  /**
   * CodeMirror Linter
   *
   * @see {@link https://codemirror.net/docs/ref/#lint.linter}
   */
  linter: {
    type: Function as PropType<LintSource>,
    default: undefined,
  },
  /**
   * Linter Config
   *
   * @see {@link https://codemirror.net/docs/ref/#lint.linter^config}
   */
  linterConfig: {
    type: Object,
    default: () => {
      return {}
    },
  },
  /**
   * Forces any linters configured to run when the editor is idle to run right away.
   *
   * @see {@link https://codemirror.net/docs/ref/#lint.forceLinting}
   */
  forceLinting: {
    type: Boolean,
    default: false,
  },
  /**
   * Show Linter Gutter
   *
   * An area to 🔴 the lines with errors will be displayed.
   * This feature is not enabled if `linter` is not specified.
   *
   * @see {@link https://codemirror.net/docs/ref/#lint.lintGutter}
   */
  gutter: {
    type: Boolean,
    default: false,
  },
  /**
   * Gutter Config
   *
   * @see {@link https://codemirror.net/docs/ref/#lint.lintGutter^config}
   */
  gutterConfig: {
    type: Object,
    default: () => undefined,
  },
  tag: {
    type: String,
    default: 'div',
  },
})
const emits = defineEmits(['update:modelValue'])
const editorRef = ref()
const editorView = ref()

watch(
  () => props.languageType,
  (nv, ov) => {
    initEditor()
  },
)

// 鼠标移除编辑器区域
const mouseleave = () => {
  if (editorView.value && editorView.value.contentDOM) {
    let b = editorView.value.contentDOM.getAttribute('contenteditable')
    if (b === 'true') {
      editorView.value.contentDOM.setAttribute('contenteditable', 'false')
    }
  }
}

// 鼠标移入到编辑器区域
const mouseenter = () => {
  if (editorView.value && editorView.value.contentDOM) {
    editorView.value.contentDOM.setAttribute('contenteditable', 'true')
    editorView.value.contentDOM.focus()
  }
}

/* 兼容火狐处理 */
const clickHandler = () => {
  if (editorView.value) {
    editorView.value.focus()
  }
}

const getBrowserType = () => {
  const userAgent = navigator.userAgent //取得浏览器的userAgent字符串
  let browser = BrowserType.unknown
  if (userAgent.indexOf(BrowserType.IE) != -1) {
    //字符串含有IE字段，表明是IE浏览器
    browser = BrowserType.IE
  } else if (userAgent.indexOf(BrowserType.Firefox) != -1) {
    //字符串含有Firefox字段，表明是火狐浏览器
    browser = BrowserType.Firefox
  } else if (userAgent.indexOf('OPR') != -1) {
    //Opera
    browser = BrowserType.Opera
  } else if (userAgent.indexOf(BrowserType.Chrome) != -1) {
    //Chrome
    browser = BrowserType.Chrome
  } else if (userAgent.indexOf(BrowserType.Safari) != -1) {
    //Safari
    browser = BrowserType.Safari
  } else if (userAgent.indexOf(BrowserType.Trident) != -1) {
    //IE内核
    browser = BrowserType.Trident
  }
  return browser
}

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
  const language = new Compartment()
  const tabSize = new Compartment()
  const startState = EditorState.create({
    doc: props.modelValue,
    extensions: [
      props.minimal && !props.basic ? minimalSetup : undefined,
      props.minimal ? minimalSetup : basicSetup,
      props.theme ? props.theme : solarizedDark,
      props.wrap ? EditorView.lineWrapping : undefined,
      props.tab ? keymap.of([indentWithTab]) : keymap.of(defaultKeymap),
      EditorState.allowMultipleSelections.of(props.allowMultipleSelections),
      props.tabSize ? tabSize.of(EditorState.tabSize.of(props.tabSize)) : undefined,
      props.phrases ? EditorState.phrases.of(props.phrases) : undefined,
      EditorState.readOnly.of(props.readonly),
      EditorView.editable.of(!props.disabled),
      props.lineSeparator ? EditorState.lineSeparator.of(props.lineSeparator) : undefined,
      props.lineSeparator ? EditorState.lineSeparator.of(props.lineSeparator) : undefined,
      props.lang ? language.of(props.lang) : lang || undefined,
      props.linter && props.gutter ? lintGutter(props.gutterConfig) : undefined,
      ...props.extensions,
      EditorView.updateListener.of(function (e) {
        const val = e.state.doc.toString()
        emits('update:modelValue', val)
      }),
    ].filter((extension): extension is Extension => !!extension),
  })

  if (editorRef.value) {
    editorView.value = new EditorView({
      state: startState,
      parent: editorRef.value,
    })
  }

  // if (getBrowserType() !== BrowserType.Chrome) {
  //   editorView.value && editorView.value.contentDOM && editorView.value.contentDOM.addEventListener('mouseleave', mouseleave, false)
  //   editorView.value && editorView.value.contentDOM && editorView.value.contentDOM.addEventListener('mouseenter', mouseenter, false)
  // }
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
:deep(.ͼ1.cm-focused) {
  outline: none;
}
</style>
