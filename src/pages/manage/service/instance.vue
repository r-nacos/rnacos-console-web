<template>
  <PageContainer
    ref="pageContainer"
    :config="{
      columns: columns,
      param: paramRef,
      form: {
        title: '服务器实列',
      },
    }"
    :data="tableData"
    @on-save="onSave"
  >
    <template #header>
      <div>服务实例列表</div>
      <n-button @click="router.go(-1)">返回</n-button>
    </template>
    <template #actions="{ param }">
      <div>
        <n-form
          label-placement="left"
          label-width="auto"
          inline
        >
          <n-form-item
            label="服务名称"
            path="param.serviceParam"
          >
            <n-input
              :disabled="true"
              v-model:value="param.serviceName"
              placeholder="输入服务名称"
            />
          </n-form-item>
          <n-form-item
            label="服务组"
            path="param.groupParam"
          >
            <n-input
              :disabled="true"
              v-model:value="param.groupName"
              placeholder=""
            />
          </n-form-item>
        </n-form>
      </div>
      <n-button @click="reloadData">刷新</n-button>
    </template>
    <template #form="{ formData }">
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
      >
        <NFormItem
          path="namespaceName"
          label="命名空间名称"
        >
          <NInput v-model:value="formData.namespaceName" />
        </NFormItem>
        <NFormItem
          path="namespaceId"
          label="命名空间Id"
        >
          <NInput v-model:value="formData.namespaceId" />
        </NFormItem>
      </NForm>
    </template>
  </PageContainer>
</template>

<script lang="tsx" setup title="服务实例列表" layout="nav">
import { NPopconfirm, NBreadcrumb, useMessage, NBreadcrumbItem, NTag, NButton, NDataTable, NForm, NFormItem, NInput, NSpace, NDrawer, NDrawerContent, type FormItemRule, type FormInst } from 'naive-ui'
import { namespaceStore } from '@/data/namespace'
import { namingApi } from '@/apis/naming'
import type { INamespace } from '@/types/namespace'
import { useWebResources } from '@/data/resources'
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
      render(row) {
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
      render(row) {
        return <span>{row.healthy && row.healthy.toString()}</span>
      },
    },
    {
      title: '元数据',
      key: 'metadata',
      width: 200,
      render(row) {
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

const reloadData = () => {
  doHandlePageChange(paginationReactive.page || 1)
}

const doQueryList = () => {
  return namingApi.queryServiceInstances({
    serviceName: paramRef.value.serviceName,
    groupName: paramRef.value.groupName,
    namespaceId: paramRef.value.namespaceId,
  })
}

const doHandlePageChange = currentPage => {
  doQueryList()
    .then(res => {
      loadingRef.value = false
      if (res.status == 200) {
        let count = res.data.count
        let pageSize = paginationReactive.pageSize
        paginationReactive.itemCount = count
        paginationReactive.pageCount = Math.round((count + pageSize - 1) / pageSize)
        loadedRef.value = true
        sourceDataRef.value = res.data.list || []
        setCurrentPageData(currentPage)
      } else {
        window.$message.error('request err,status code:' + res.status)
        dataRef.value = []
      }
    })
    .catch(err => {
      window.$message.error('request err,message' + err.message)
      dataRef.value = []
      loadingRef.value = false
    })
}

/**
 * 表单校验
 */
const rules = {
  namespaceId: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('需要输入ID')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],

  namespaceName: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('需要输入名称')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
}
const tableData = ref([])
const useFormRef = ref(false)

const onLine = (row: any) => {
  setRowEnabled(row, true)
}

const offLine = (row: any) => {
  setRowEnabled(row, false)
}

const setRowEnabled = (row, enabled) => {
  let instance = {
    namespaceId: param.namespaceId,
    groupName: param.groupName,
    serviceName: param.serviceName,

    ip: row.ip,
    port: row.port,
    //weight: row.weight,
    enabled: enabled,
    //metadata: row.metadata,
  }
  namingApi
    .updateInstance(instance)
    .then(res => {
      if (res.status == 200) {
        if (enabled) {
          window.$message.info('上线成功!')
        } else {
          window.$message.info('下线成功!')
        }
        row.enabled = enabled
        setCurrentPageData(paginationReactive.page || 1)
        //reloadData()
        return
      }
      window.$message.error('设置失败，response code' + res.status)
    })
    .catch(err => {
      window.$message.error('设置失败，' + err.message)
    })
}

/**
 * 保存数据
 *
 * @param data 保存数据
 */
const onSave = (data: any) => {
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      if (data.mode === 'add') {
        doCreate(data)
      } else {
        doUpdate(data)
      }
    }
  })
}

/**
 * 加载列表数据
 */
const doLoadNamespace = () => {
  doQueryList()
    .then(res => {
      loadingRef.value = false
      if (res.status == 200) {
        let count = res.data.count
        let pageSize = paginationReactive.pageSize
        paginationReactive.itemCount = count
        paginationReactive.pageCount = Math.round((count + pageSize - 1) / pageSize)
        loadedRef.value = true
        sourceDataRef.value = res.data.list || []
        setCurrentPageData(currentPage)
      } else {
        window.$message.error('request err,status code:' + res.status)
        dataRef.value = []
      }
    })
    .catch(err => {
      window.$message.error('request err,message' + err.message)
      dataRef.value = []
      loadingRef.value = false
    })
}

onMounted(() => {
  doLoadNamespace()
})
</script>
