<template>
  <div class="form-config">
    <NForm
      ref="formRef"
      :model="formDataRef"
      :rules="rules"
    >
      <NFormItem
        path="dataId"
        label="配置ID"
      >
        <NInput
          :disabled="isReadonly"
          placeholder="输入配置ID"
          v-model:value="formDataRef.dataId"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem
        path="group"
        label="配置组"
      >
        <NInput
          :disabled="isReadonly"
          placeholder="输入配置组"
          v-model:value="formDataRef.group"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem
        v-show="formDataRef.showMd5"
        path="md5"
        label="MD5"
      >
        <NInput
          :disabled="true"
          placeholder=""
          v-model:value="formDataRef.md5"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem
        path="content"
        label="配置格式"
      >
        <NRadio
          v-for="i in list"
          :key="i"
          :checked="checkedValue === i"
          :value="i"
          :name="i"
          @change="handleChange"
        >
          {{ i }}
        </NRadio>
      </NFormItem>
      <NFormItem
        path="content"
        label="配置内容"
      >
        <Editor
          v-if="showEditor"
          v-model="formDataRef.content"
          :language-type="checkedValue"
        />
      </NFormItem>
    </NForm>
  </div>
</template>
<script lang="ts" setup>
import constant from '@/types/constant'
import { namespaceStore } from '@/data/namespace'
import { configApi } from '@/apis/config'
import { useMessage, NForm, NFormItem, NInput, NRadio } from 'naive-ui'
import Editor from './Editor.vue'
import apis from '@/apis'
import DiffContent from './DiffContent.vue'
const emits = defineEmits(['closeModal', 'refreshData'])
const message = useMessage()
const showDiff = ref(false)
let props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
})
const formDataRef = ref<any>(props.formData)
const showEditor = ref(true)
const oldVal = ref('')
const saveData = ref<any>({})

// 配置文件类型
const list = ['TEXT', 'JSON', 'XML', 'YAML', 'HTML', 'Properties']
const checkedValue = ref<string | null>('TEXT')

onMounted(async () => {
  // formData
  if (formDataRef.value.mode === constant.FORM_MODE_UPDATE) {
    showEditor.value = false
    let resp = await apis.getJSON(apis.getConfig, {
      params: {
        tenant: formDataRef.value.tenant,
        group: formDataRef.value.group,
        dataId: formDataRef.value.dataId,
      },
    })
    formDataRef.value.content = `${resp.data || ''}`
    oldVal.value = `${resp.data || ''}`
    showEditor.value = true
  }
})

const handleChange = (e: Event) => {
  checkedValue.value = (e.target as HTMLInputElement).value
}

const isReadonly = props.formData.mode === constant.FORM_MODE_DETAIL

// 表单校验规则
const rules = {
  group: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('需要输入配置组')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  dataId: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('需要输入配置ID')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
}

// 显示模态框
const showModal = computed(() => props.visible)

// 提交表单
const submitDiffForm = () => {
  saveData.value = {
    dataId: formDataRef.value.dataId,
    group: formDataRef.value.group,
    tenant: namespaceStore.current.value.namespaceId,
    content: formDataRef.value.content,
  }
  showDiff.value = true
}

const closeModal = (bool: boolean = false) => {
  if (bool) {
    emits('refreshData')
  }
  emits('closeModal')
}

// 关闭弹框
const onClose = () => {
  emits('closeModal')
}
</script>
