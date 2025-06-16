<template>
  <div
    class="monaco-editor-container"
    ref="editorContainer"
    style="height: 100%; min-height: 300px"
  ></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { getMonacoWorkerUrl } from '@/utils/monaco';

// 配置 Monaco 环境
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    return getMonacoWorkerUrl(label);
  }
};

loader.config({ monaco });
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'plaintext'
  }
});

const emit = defineEmits(['update:modelValue']);

const editorContainer = ref(null);
let editor = null;
const monacoRef = ref(null);
import { langStore } from '@/data/lang';

const initMonaco = async () => {
  if (editorContainer.value) {
    // 等待 DOM 更新
    await nextTick();

    // 如果已经存在编辑器实例，先销毁
    if (editor) {
      editor.dispose();
    }
    const supportedLangs = [
      'de',
      'es',
      'fr',
      'it',
      'ja',
      'ko',
      'ru',
      'zh-cn',
      'zh-tw'
    ];
    let currentLang = langStore.current.value;
    if (currentLang == 'zh') {
      currentLang = 'zh-cn';
    }
    const lang = supportedLangs.includes(currentLang) ? currentLang : null;
    try {
      if (lang) {
        loader.config({ 'vs/nls': { availableLanguages: { '*': lang } } });
      }
      const monaco = await loader.init();
      monacoRef.value = monaco;

      editor = monaco.editor.create(editorContainer.value, {
        value: props.modelValue || '',
        language: props.language,
        theme: 'vs-dark',
        automaticLayout: true,
        readOnly: props.readonly,
        minimap: {
          enabled: false
        },
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: 2,
        wordWrap: 'on'
      });

      editor.onDidChangeModelContent(() => {
        emit('update:modelValue', editor?.getValue() || '');
      });

      // 强制重新布局
      editor.layout();
    } catch (error) {
      console.error('Monaco initialization error:', error);
    }
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (editor && newValue !== editor.getValue()) {
      editor.setValue(newValue || '');
    }
  }
);

watch(
  () => props.language,
  (newValue) => {
    if (editor && monacoRef.value) {
      monacoRef.value.editor.setModelLanguage(editor.getModel(), newValue);
    }
  }
);

watch(
  () => props.readonly,
  (newValue) => {
    if (editor) {
      editor.updateOptions({ readOnly: newValue });
    }
  }
);

onMounted(() => {
  initMonaco();
  // 添加窗口大小变化的监听
  window.addEventListener('resize', () => {
    if (editor) {
      editor.layout();
    }
  });
});

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose();
  }
  window.removeEventListener('resize', () => {
    if (editor) {
      editor.layout();
    }
  });
});

defineExpose({
  editor
});
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  position: relative;
}
</style>
