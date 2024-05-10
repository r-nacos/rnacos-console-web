<template>
  <Transition name="slide-fade">
    <div
      class="custom-modal"
      v-if="showForm"
    >
      <div class="header">
        <div class="title">{{ formData.mode === constant.FORM_MODE_CREATE ? '新增配置' : formData.mode === constant.FORM_MODE_UPDATE ? '编辑配置' : '配置详情' }}</div>
        <div
          class="close"
          @click="cancel"
        >
          <n-icon
            size="16"
            class="dropdown"
          >
            <CloseOutline class="icon-style" />
          </n-icon>
        </div>
      </div>
      <div class="content">
        <ConfigForm
          ref="configForm"
          :formData="formData"
          :isReadonly="isReadonly"
          v-if="vt == 1"
        />
        <DiffComponent
          v-else
          :dst="formData.content"
          :src="ov"
        />
      </div>
      <div class="footer">
        <NSpace
          align="baseline"
          v-if="vt == 1"
        >
          <NButton
            text
            @click="closeDrawer"
          >
            返回
          </NButton>
          <NButton
            type="primary"
            @click="onNext"
          >
            确认
          </NButton>
        </NSpace>
        <NSpace
          align="baseline"
          v-else
        >
          <NButton
            text
            @click="onPrev"
          >
            返回
          </NButton>
          <NButton
            type="primary"
            @click="onSave(formData)"
          >
            确认变更
          </NButton>
        </NSpace>
      </div>
    </div>
  </Transition>
</template>
<script lang="ts" setup>
import apis from '@/apis'
import ConfigForm from '@/components/config/ConfigForm.vue'
import DiffComponent from '@/components/config/DiffComponent.vue'
import { useMessage, NButton } from 'naive-ui'
import constant from '@/types/constant'
import type { AnyObj } from 'encjs/core/base'
import { CloseOutline } from '@vicons/ionicons5'

const toast = useMessage()
const configForm = ref<HTMLDivElement>() as any
let props = defineProps({
  showForm: {
    type: Boolean,
    default: false,
  },
  formData: {
    type: Object,
    default: () => {},
  },
  isReadonly: {
    type: Boolean,
    default: false,
  },
  visibleType: {
    type: Number,
    default: 1,
  },
  ov: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['cancel'])
const vt = ref(props.visibleType)

const cancel = () => {
  emits('cancel')
}

const closeDrawer = () => {
  emits('cancel')
}

/**
 * 上一步
 */
const onPrev = () => {
  vt.value = 1
}

/**
 * 下一步进行diff对比
 */
const onNext = async () => {
  let validate = await configForm.value?.validator()
  if (validate) {
    if (props.formData.mode === constant.FORM_MODE_DETAIL) {
      emits('cancel')
      return
    }
    vt.value = 2
  }
}

/**
 * 保存配置数据
 *
 * @param formData 配置项
 */
const onSave = async (formData: AnyObj) => {
  let url = formData.mode === 'add' || formData.mode === constant.FORM_MODE_CREATE ? `${apis.configAdd || ''}` : `${apis.configUpdate || ''}`
  let { status, data } = await apis.postJSON(url, {
    data: formData,
  })
  if (status === 200 && data && typeof data === 'object') {
    if (data.success) {
      if (formData.mode === constant.FORM_MODE_CREATE) {
        toast.info('添加成功')
      } else {
        toast.info('编辑成功')
      }
      emits('cancel', 'refreshData')
      vt.value = 1
    } else {
      if (formData.mode === constant.FORM_MODE_CREATE) {
        toast.info('添加失败')
      } else {
        toast.info('编辑失败')
      }
    }
  } else {
    toast.error('请求失败')
  }
}
</script>

<style lang="scss" scoped>
.custom-modal {
  position: absolute;
  z-index: 9999;
  height: calc(100vh - 50px);
  width: calc(100vw - 200px);
  box-sizing: border-box;
  left: 0;
  top: 0;
  background: #fff;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    background: #fff;
    box-sizing: border-box;
    margin-bottom: 8px;
    border-bottom: 1px solid #ccc;
  }

  .header,
  .content,
  .footer {
    padding-left: 10px;
    padding-right: 10px;
  }

  .content {
    height: calc(100vh - 145px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .footer {
    display: flex;
    justify-content: right;
    position: absolute;
    width: calc(100% - 20px);
    bottom: 0;
    height: 46px;
    align-items: center;
    margin-right: 20px;
    border-top: 1px solid #ccc;
    background-color: #fff;
  }
}
</style>
