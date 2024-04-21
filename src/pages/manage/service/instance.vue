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
        list: apis.instanceList,
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
            label="服务名称"
            path="param.serviceParam"
          >
            <NInput
              :disabled="true"
              v-model:value="param.serviceName"
              placeholder="输入服务名称"
            />
          </NFormItem>
          <NFormItem
            label="服务组"
            path="param.groupParam"
          >
            <NInput
              :disabled="true"
              v-model:value="param.groupName"
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
import apis from '@/apis'
import constant from '@/types/constant'
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const pageContainer = ref<any>(null)
const router = useRouter()
const route = useRoute()
let webResources = useWebResources()
let paramRef = {
  serviceName: route.query.serviceName,
  groupName: route.query.groupName || '',
  namespaceId: route.query.namespaceId || '',
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
const createColumns = () => {
  const columns = [
    {
      title: 'IP',
      key: 'ip',
    },
    {
      title: '端口',
      key: 'port',
    },
    {
      title: '是否临时实例',
      key: 'ephemeral',
      render(row: { ephemeral: { toString: () => any } }) {
        return <span>{row.ephemeral && row.ephemeral.toString()}</span>
      },
    },
    {
      title: '权重',
      key: 'weight',
    },
    {
      title: '建康状态',
      key: 'healthy',
      render(row: { healthy: { toString: () => any } }) {
        return <span>{row.healthy && row.healthy.toString()}</span>
      },
    },
    {
      title: '元数据',
      key: 'metadata',
      width: 200,
      render(row: { metadata: any }) {
        return <span>{row.metadata && JSON.stringify(row.metadata)}</span>
      },
    },
  ]
  let optColumn = {
    title: '操作',
    key: '_type',
    fixed: 'right',
    render(row: any) {
      const onOffLine = () => {
        return (
          <NSwitch
            size="small"
            default-value={row.enabled}
            onUpdateValue={enabled => {
              if (enabled == row.enabled) {
                //操作中
                return
              }
              if (enabled) {
                onLine(row)
              } else {
                offLine(row)
              }
            }}
          />
        )
      }
      return (
        <div>
          <span style={{ 'padding-right': '5px' }}>{onOffLine()}</span>
          <NButton
            size="tiny"
            type="info"
            quaternary
            onClick={() => showUpdate(row)}>
            编辑
          </NButton>
        </div>
      )
    },
  }
  if (webResources.canUpdateService) {
    columns.push(optColumn)
  }
  return columns
}
const columns = createColumns()

/**
 * 编辑实列
 *
 * @param row 行数据
 */
const showUpdate = (row: any) => {
  pageContainer.value?.updateForm({
    namespaceId: row.namespaceId || '',
    groupName: row.groupName || 'DEFAULT_GROUP',
    serviceName: row.serviceName,
    ip: row.ip,
    port: row.port,
    weight: row.weight,
    enabled: row.enabled,
    metadata: JSON.stringify(row.metadata),
    mode: constant.FORM_MODE_UPDATE,
  })
}

// 设置下线
const onLine = (row: any) => {
  setRowEnabled(row, true)
}

// 设置在线
const offLine = (row: any) => {
  setRowEnabled(row, false)
}

/**
 *
 * @param row 行数据
 *
 * @param enabled 开启状态
 */
const setRowEnabled = async (row: any, enabled: boolean) => {
  let { status, data } = await apis.postJSON(apis.instanceUpdate, {
    data: {
      namespaceId: row.namespaceId,
      groupName: row.groupName,
      serviceName: row.serviceName,
      ip: row.ip,
      port: row.port,
      //weight: row.weight,
      enabled: `${enabled}`,
      //metadata: row.metadata,
    },
  })
  if (status === 200 && data && typeof data === 'object') {
    if (data.success) {
      row.enabled = enabled
      if (enabled) {
        message.success('上线啦')
      } else {
        message.warning('下线啦')
      }
    } else {
      message.error(data.message || '操作失败')
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
const rules = {
  weight: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return true //new Error('权重必须填写且只能是数字')
        }
        try {
          let v = parseFloat(value)
          if (isNaN(v)) {
            return new Error('权重需为数字')
          }
          if (v < 0) {
            return new Error('权重不能小于0')
          }
        } catch {
          return new Error('权重需为数字')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
}
</script>
