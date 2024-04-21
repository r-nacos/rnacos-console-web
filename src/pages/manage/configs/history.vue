<template>
  <PageContainer
    ref="pageContainer"
    :config="{
      columns: columns,
      param: paramRef,
      form: {
        title: '实例',
      },
      apis: {
        list: apis.configHistory,
        create: apis.instanceAdd,
        update: apis.instanceUpdate,
        delete: apis.instanceDelete,
      },
      pagination: paginationReactive,
      validator: validator,
    }"
  >
    <template #header>
      <div>服务实例列表</div>
      <n-button @click="router.go(-1)">返回</n-button>
    </template>
    <template #actions="{ param, methods }">
      <div>
        <n-form
          label-placement="left"
          label-width="auto"
          inline
        >
          <NFormItem
            label="配置ID"
            path="param.serviceParam"
          >
            <NInput
              :disabled="true"
              v-model:value="param.dataId"
              placeholder=""
            />
          </NFormItem>
          <NFormItem
            label="配置组"
            path="param.groupParam"
          >
            <NInput
              :disabled="true"
              v-model:value="param.group"
              placeholder=""
            />
          </NFormItem>
        </n-form>
      </div>
      <n-button @click="methods.refreshData()">刷新</n-button>
    </template>
    <template #form="{ formData, isReadonly }">
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
      >
        <NFormItem
          path="ip"
          label="IP"
        >
          <NInput
            :disabled="true"
            placeholder=""
            v-model:value="formData.ip"
            @keydown.enter.prevent
          />
        </NFormItem>
        <NFormItem
          path="port"
          label="端口"
        >
          <NInput
            :disabled="true"
            placeholder=""
            v-model:value="formData.port"
            @keydown.enter.prevent
          />
        </NFormItem>
        <NFormItem
          path="enabled"
          label="是否上线"
        >
          <NSwitch v-model:value="formData.enabled" />
        </NFormItem>
        <NFormItem
          path="weight"
          label="权重"
        >
          <NInput
            :disabled="isReadonly"
            placeholder=""
            v-model:value.number="formData.weight"
            @keydown.enter.prevent
          />
        </NFormItem>
        <NFormItem
          path="metadata"
          label="元数据"
        >
          <NInput
            :disabled="isReadonly"
            type="textarea"
            placeholder="输入元数据"
            :autosize="{ minRows: 3 }"
            v-model:value="formData.metadata"
          />
        </NFormItem>
      </NForm>
    </template>
  </PageContainer>
</template>

<script lang="tsx" setup title="服务实例列表" layout="nav">
import { NSwitch, NButton, NForm, NFormItem, NInput, useMessage, type FormItemRule, type FormInst, messageDark } from 'naive-ui'
import { useWebResources } from '@/data/resources'
import { toDateTime } from '@/utils/date'
import apis from '@/apis'
import constant from '@/types/constant'
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const pageContainer = ref<any>(null)
const router = useRouter()
const route = useRoute()
let webResources = useWebResources()
let paramRef = {
  tenant: route.query.tenant || '',
  dataId: route.query.dataId,
  group: route.query.group || '',
  pageNo: 1,
  pageSize: 20,
}
const paginationReactive = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  itemCount: 0,
  prefix({ itemCount }: any) {
    return `总行数: ${itemCount}`
  },
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  },
})
/**
 * 表格表格字段
 */
const columns = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: '配置ID',
    key: 'dataId',
  },
  {
    title: '配置组',
    key: 'group',
  },
  {
    title: '更新时间',
    key: 'modifiedTime',
    render(row: { modifiedTime: string | number | Date }) {
      let value = ''
      if (row.modifiedTime) {
        let date = new Date(row.modifiedTime)
        value = toDateTime(date)
      }
      return <span>{value}</span>
    },
  },
  {
    title: '操作',
    key: 'type',
    fixed: 'right',
    render(row: any) {
      let rollbackButton
      if (webResources.canUpdateConfig) {
        rollbackButton = (
          <NButton
            size="tiny"
            quaternary
            type="primary"
            onClick={() => rollback(row)}>
            恢复
          </NButton>
        )
      } else {
        rollbackButton = <span></span>
      }
      return (
        <div>
          <NButton
            size="tiny"
            quaternary
            type="info"
            onClick={() => detail(row)}>
            详情
          </NButton>
          {rollbackButton}
        </div>
      )
    },
  },
]

let configContent = ref('')

const detail = (row: any) => {}

const rollback = (row: any) => {
  configContent.value = row.content
}

const doRollback = async (content: string) => {
  let config = {
    dataId: paramRef.dataId,
    group: paramRef.group,
    tenant: paramRef.tenant,
    content: content,
  }
  let { status, data } = await apis.postJSON(apis.configAdd, {
    data: config,
  })
  if (status === 200 && data && typeof data === 'object') {
    if (data.success) {
      message.success('恢复成功')
      pageContainer.value?.refreshData()
    } else {
      message.error('恢复失败，' + data.message)
    }
  } else {
    message.error('请求失败')
  }
}

/**
 * 保存数据
 *
 * @param data 保存数据
 */
const validator = (data: any) => {
  return new Promise((resolve, reject) => {
    formRef.value?.validate((errors: any) => {
      if (!errors) {
        data.enabled = `${data.enabled}`
        data.weight = parseInt(data.weight)
        data.port = parseInt(data.port)
        resolve(data)
      } else {
        reject('表单验证不通过')
      }
    })
  })
}

/**
 * 表单校验
 */
const rules = {}
</script>
