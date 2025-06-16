<template>
  <div class="h-full overflow-y-scroll bg-[#1f1f1f]">
    <div class="w-full h-full">
      <div ref="editorContainer" class="h-full"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as monaco from 'monaco-editor';
import { getMonacoWorkerUrl } from '@/utils/monaco';

// 配置 Monaco 环境
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    return getMonacoWorkerUrl(label);
  }
};

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  dst: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'plaintext'
  }
});

const editorContainer = ref(null);
let diffEditor = null;

const initDiffEditor = async () => {
  if (editorContainer.value) {
    // 如果已经存在编辑器实例，先销毁
    if (diffEditor) {
      diffEditor.dispose();
    }

    diffEditor = monaco.editor.createDiffEditor(editorContainer.value, {
      readOnly: true,
      automaticLayout: true,
      theme: 'vs-dark',
      renderSideBySide: true,
      originalEditable: false,
      renderIndicators: true,
      enableSplitViewResizing: true,
      renderOverviewRuler: true,
      minimap: {
        enabled: false
      },
      scrollBeyondLastLine: false,
      fontSize: 14,
      tabSize: 2,
      wordWrap: 'on'
    });

    // 设置原始内容和修改后的内容
    const originalModel = monaco.editor.createModel(
      props.src || '',
      props.language
    );
    const modifiedModel = monaco.editor.createModel(
      props.dst || '',
      props.language
    );

    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel
    });
  }
};

// 监听属性变化
watch(
  () => props.src,
  (newValue) => {
    if (diffEditor) {
      const originalModel = diffEditor.getModel().original;
      originalModel.setValue(newValue || '');
    }
  }
);

watch(
  () => props.dst,
  (newValue) => {
    if (diffEditor) {
      const modifiedModel = diffEditor.getModel().modified;
      modifiedModel.setValue(newValue || '');
    }
  }
);

watch(
  () => props.language,
  (newValue) => {
    if (diffEditor) {
      const originalModel = diffEditor.getModel().original;
      const modifiedModel = diffEditor.getModel().modified;
      monaco.editor.setModelLanguage(originalModel, newValue);
      monaco.editor.setModelLanguage(modifiedModel, newValue);
    }
  }
);

onMounted(() => {
  initDiffEditor();
  // 添加窗口大小变化的监听
  window.addEventListener('resize', () => {
    if (diffEditor) {
      diffEditor.layout();
    }
  });
});

onBeforeUnmount(() => {
  if (diffEditor) {
    diffEditor.dispose();
  }
  window.removeEventListener('resize', () => {
    if (diffEditor) {
      diffEditor.layout();
    }
  });
});
</script>

<style scoped>
.h-full {
  height: 100%;
}
</style>
