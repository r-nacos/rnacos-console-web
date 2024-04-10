<template>
  <div class="diff-container">
    <div class="diff-val">
      <div class="item">当前值</div>
      <div class="item">原始值</div>
    </div>
    <div ref="diffDom"></div>
  </div>
</template>
<script setup lang="ts">
import { MergeView } from '@codemirror/merge'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { configApi } from '@/apis/config'
import { useMessage } from 'naive-ui'
const diffDom = ref<HTMLElement | HTMLBodyElement>()
const message = useMessage()
let props = defineProps({
  nv: {
    type: String,
    default: '',
    required: true,
  },
  ov: {
    type: String,
    default: '',
    required: true,
  },
})
const view = ref()
const emits = defineEmits(['closeModal'])

onMounted(() => {
  if (diffDom.value) {
    initDiffView(props.nv, props.ov, diffDom.value)
  }
})

const initDiffView = (nv: string, ov: string, el: HTMLElement) => {
  view.value = new MergeView({
    a: {
      doc: nv,
      extensions: [basicSetup, EditorView.editable.of(false), EditorState.readOnly.of(true)],
    },
    b: {
      doc: ov,
      extensions: [basicSetup, EditorView.editable.of(false), EditorState.readOnly.of(true)],
    },
    parent: el,
  })
}

const onClose = () => {
  emits('closeModal')
}

const submitForm = () => {
  configApi
    .setConfig(props.data as any)
    .then(res => {
      if (res.status == 200) {
        message.success('设置成功!')
        // emits('refreshData')
        emits('closeModal', true)
        return
      }
      message.error('设置失败，response code' + res.status)
    })
    .catch(err => {
      message.error('设置失败，' + err.message)
    })
}
</script>
<style lang="scss" scoped>
.diff-val {
  display: flex;

  .item {
    width: 50%;
    text-align: center;
    font-weight: bold;
    font-size: 16px;
  }
}
:deep(.cm-mergeViewEditor) {
  margin-right: 20px;
}
</style>
