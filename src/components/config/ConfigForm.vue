<template>
  <div class="form-config">
    <n-modal
      v-model:show="showModal"
      class="custom-card"
      preset="card"
      :style="bodyStyle"
      title="添加配置"
      size="huge"
      :bordered="false"
      :segmented="segmented"
      @close="onClose"
    >
      <n-form
        ref="formRef"
        :model="formDataRef"
        :rules="rules"
      >
        <n-form-item
          path="dataId"
          label="配置ID"
        >
          <n-input
            :disabled="isReadonly"
            placeholder="输入配置ID"
            v-model:value="formDataRef.dataId"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item
          path="group"
          label="配置组"
        >
          <n-input
            :disabled="isReadonly"
            placeholder="输入配置组"
            v-model:value="formDataRef.group"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item
          v-show="formDataRef.showMd5"
          path="md5"
          label="MD5"
        >
          <n-input
            :disabled="true"
            placeholder=""
            v-model:value="formDataRef.md5"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item
          path="content"
          label="配置内容"
        >
        {{ formDataRef.content }}
          <Editor v-model="formDataRef.content"/>
          <!-- <n-input
            :disabled="isReadonly"
            type="textarea"
            placeholder="输入配置内容"
            :autosize="{ minRows: 5 }"
            v-model:value="formDataRef.content"
          /> -->
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="text-right">
          <n-button
            class="mg-r10"
            @click="onClose"
          >
            取消
          </n-button>
          <n-button
            type="info"
            @click="submitDiffForm"
          >
            确定
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>
<script lang="ts" setup>
import constant from '@/types/constant'
import { namespaceStore } from '@/data/namespace'
import { configApi } from '@/apis/config'
import { useMessage } from 'naive-ui'
import Editor from './Editor.vue'
const emits = defineEmits(['closeModal', 'refreshData'])
const message = useMessage()
let props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
})
const formDataRef = ref<any>(props.formData)
formDataRef.value.content = `{
   root: true,
   extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
    "vue-global-api"
   ],
   parserOptions: {
    ecmaVersion: "latest",
   },
   rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    endOfLine: "auto",
    "prettier/prettier": ["error", { "endOfLine": "auto" }]

   },
  }`
const isReadonly = props.formData.mode === constant.FORM_MODE_DETAIL
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
const showModal = computed(() => props.visible)
const bodyStyle = {
  width: '1000px',
}
const segmented = {
  content: 'soft',
  footer: 'soft',
} as const

const submitDiffForm = () => {
  let config = {
    dataId: formDataRef.value.dataId,
    group: formDataRef.value.group,
    tenant: namespaceStore.current.value.namespaceId,
    content: formDataRef.value.content,
  }
  configApi
    .setConfig(config)
    .then(res => {
      if (res.status == 200) {
        message.success('设置成功!')
        emits('refreshData')
        return
      }
      message.error('设置失败，response code' + res.status)
    })
    .catch(err => {
      message.error('设置失败，' + err.message)
    })
}

const onClose = () => {
  emits('closeModal')
}
</script>
