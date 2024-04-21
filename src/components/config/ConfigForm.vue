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
        v-show="!isHistory"
        path="desc"
        label="描述"
      >
        <NInput
          :disabled="isReadonly"
          placeholder="输入描述备注信息"
          v-model:value="formDataRef.desc"
          type="textarea"
          :autosize="{ minRows: 2 }"
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
import { useMessage, NForm, NFormItem, NInput, NRadio } from 'naive-ui'
import Editor from './Editor.vue'
const emits = defineEmits(['closeModal', 'refreshData'])
const message = useMessage()
let props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  isHistory: {
    type: Boolean,
    default: false,
  },
})
const formDataRef = ref<any>(props.formData)
const showEditor = ref(true)

// 配置文件类型
const list = ['TEXT', 'JSON', 'XML', 'YAML', 'HTML', 'Properties', 'TOML']
const checkedValue = ref<string | null>('TEXT')

/**
 * 配置格式
 *
 * @param e
 */
const handleChange = (e: Event) => {
  checkedValue.value = (e.target as HTMLInputElement).value
  formDataRef.value.configType = checkedValue.value
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
</script>
