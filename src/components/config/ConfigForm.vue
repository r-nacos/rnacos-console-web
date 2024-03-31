<template>
  <div class="form-config">
    <n-modal
      v-model:show="showModal"
      class="custom-card"
      preset="card"
      :style="{
        width: '1000px',
      }"
      title="添加配置"
      size="huge"
      :bordered="false"
      :segmented="{
        content: 'soft',
        footer: 'soft',
      }"
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
          label="配置格式"
        >
          <n-radio
            v-for="i in list"
            :key="i"
            :checked="checkedValue === i"
            :value="i"
            :name="i"
            @change="handleChange"
          >
            {{ i }}
          </n-radio>
        </n-form-item>
        <n-form-item
          path="content"
          label="配置内容"
        >
          <Editor
            v-if="showEditor"
            v-model="formDataRef.content"
            :language-type="checkedValue"
          />
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
import apis from '@/apis'
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
const showEditor = ref(true)

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

// 关闭弹框
const onClose = () => {
  emits('closeModal')
}
</script>
