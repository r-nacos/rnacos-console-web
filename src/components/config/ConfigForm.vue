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
      <template v-if="!isHistory">
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
      </template>
      <NFormItem
        v-if="!isHistory"
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
      <template v-if="!isHistory">
        <NFormItem
          path="content"
          label="配置格式"
        >
          <NRadio
            :disabled="isDisabled"
            v-for="(o, i) in list"
            :key="i"
            :checked="checkedValue === o.value"
            :value="o.value"
            :name="o.label"
            @change="handleChange(o)"
          >
            {{ o.label }}
          </NRadio>
        </NFormItem>
      </template>
      <NFormItem
        path="content"
        label="配置内容(F10键切换全屏)"
      >
        <Editor
          v-if="showEditor"
          v-model="formDataRef.content"
          :language-type="checkedValue"
          :readonly="isDisabled"
        />
      </NFormItem>
    </NForm>
  </div>
</template>
<script lang="ts" setup>
import constant from '@/types/constant'
import { useMessage, NForm, NFormItem, NInput, NRadio, type FormItemRule, type FormInst } from 'naive-ui'
import Editor from './Editor.vue'
const emits = defineEmits(['closeModal', 'refreshData'])
const formRef = ref<FormInst | null>(null)
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
const list = [
  { label: 'TEXT', value: 'text' },
  { label: 'JSON', value: 'json' },
  { label: 'XML', value: 'xml' },
  { label: 'YAML', value: 'yaml' },
  { label: 'HTML', value: 'html' },
  { label: 'Properties', value: 'properties' },
  { label: 'TOML', value: 'toml' },
]
const checkedValue = ref<string>(props.formData.configType || 'text')

/**
 * 配置格式
 *
 * @param e
 */
const handleChange = (o: any) => {
  formDataRef.value.configType = o.value
  checkedValue.value = o.value
}

const isReadonly = props.formData.mode === constant.FORM_MODE_DETAIL
const isDisabled = props.formData.mode === constant.FORM_MODE_DETAIL

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

const validator = (data: any) => {
  return new Promise((resolve, reject) => {
    formRef.value?.validate((errors: any) => {
      if (!errors) {
        resolve(true)
      } else {
        reject('表单验证不通过')
      }
    })
  })
}

defineExpose({
  validator,
})
</script>
