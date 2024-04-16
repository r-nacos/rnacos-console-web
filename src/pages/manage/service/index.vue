<template>
  <PageContainer
    ref="pageContainer"
    :config="{
      columns: columns,
      form: {
        title: '服务',
      },
      apis: {
        list: apis.serviceList,
        create: apis.serviceAdd,
        update: apis.serviceUpdate,
        delete: apis.serviceDelete,
      },
    }"
    :data="tableData"
    @on-save="onSave"
  >
    <template #header>服务列表</template>
    <template #actions="{ param, methods }">
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
              v-model:value="param.serviceName"
              placeholder="输入服务名称"
            />
          </n-form-item>
          <n-form-item
            label="服务组"
            path="param.groupParam"
          >
            <n-input
              v-model:value="param.groupName"
              placeholder=""
            />
          </n-form-item>
        </n-form>
      </div>
      <div>
        <n-button
          tertiary
          class="mg-r10"
          @click="methods.onSearch()"
        >
          查询
        </n-button>
        <n-button
          type="info"
          @click="
            methods.createForm({
              groupName: '',
              serviceName: '',
              protectThreshold: 0,
              metadata: '',
              selector: '',
              mode: constant.FORM_MODE_CREATE,
            })
          "
        >
          新建
        </n-button>
      </div>
    </template>
    <template #form="{ formData, isKeyReadonly, isReadonly }">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
      >
        <n-form-item
          path="serviceName"
          label="服务名称"
        >
          <n-input
            :disabled="isKeyReadonly"
            placeholder="输入服务名称"
            v-model:value="formData.serviceName"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item
          path="groupName"
          label="服务组"
        >
          <n-input
            :disabled="isKeyReadonly"
            placeholder="输入服务组"
            v-model:value="formData.groupName"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item
          path="protectThreshold"
          label="保护阀值"
        >
          <n-input
            :disabled="isReadonly"
            placeholder="输入保护阀值"
            v-model:value.number="formData.protectThreshold"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item
          path="metadata"
          label="元数据"
        >
          <n-input
            :disabled="isReadonly"
            type="textarea"
            placeholder="输入元数据"
            :autosize="{ minRows: 3 }"
            v-model:value="formData.metadata"
          />
        </n-form-item>
        <n-form-item
          path="selector"
          label="服务路由类型"
        >
          <n-input
            :disabled="true"
            placeholder="暂不支持"
            v-model:value="formData.selector"
            @keydown.enter.prevent
          />
        </n-form-item>
      </n-form>
    </template>
  </PageContainer>
</template>
<script lang="tsx" setup title="服务列表" layout="nav">
import apis from '@/apis/index'
import { useMessage, type FormInst, NButton, NPopconfirm } from 'naive-ui'
import constant from '@/types/constant'
import { useWebResources } from '@/data/resources'
import { namingApi } from '@/apis/naming'
import { namespaceStore } from '@/data/namespace'
const tableData = ref<any>([])
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const pageContainer = ref<any>(null)
let route = useRoute()
let webResources = useWebResources()
let query = route.query
const router = useRouter()
const paginationReactive = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  itemCount: 0,
  prefix({ itemCount }: any) {
    return `总行数: ${itemCount}`
  },
})

const rules = {
  serviceName: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('需要服务名称')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],

  groupName: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('需要输入服务组')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  protectThreshold: [
    {
      required: false,
      validator(rule: any, value: string | number) {
        if (!value) {
          return true
        }
        try {
          let v = parseFloat(value)
          if (isNaN(v)) {
            return new Error('保护阀值需为数字')
          }
          if (v < 0 || v > 1) {
            return new Error('保护阀值不能小于0或大于1')
          }
        } catch {
          return new Error('保护阀值需为数字')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
}

const removeConfirmSlots = {
  trigger: () => {
    return (
      <NButton
        size="tiny"
        quaternary
        type="error"
      >
        删除
      </NButton>
    )
  },
}

/**
 *
 * @param $event 事件
 *
 * @param row 数据项
 */
const showUpdate = ($event: MouseEvent, row: any) => {
  console.log(row, 'row')
  pageContainer.value?.updateForm({
    ip: row.ip,
    port: `${row.port}`,
    enabled: row.enabled,
    weight: `${row.weight || 1}`,
    metadata: JSON.stringify(row.metadata || {}),
    mode: constant.FORM_MODE_UPDATE,
  })
}

const columns = [
  {
    title: '服务名称',
    key: 'name',
  },
  {
    title: '服务组',
    key: 'groupName',
  },
  {
    title: '实例数',
    key: 'ipCount',
  },
  {
    title: '健康实例数',
    key: 'healthyInstanceCount',
  },
  {
    title: '操作',
    key: 'type',
    render(row: any) {
      let editButton
      let removePopconfirm
      if (webResources.canUpdateService) {
        editButton = (
          <NButton
            size="tiny"
            quaternary
            type="info"
            onClick={$event => showUpdate($event, row)}
          >
            编辑
          </NButton>
        )
        removePopconfirm = (
          <NPopconfirm
            onPositiveClick={() => removeItem(row)}
            v-slots={removeConfirmSlots}
          >
            <span>
              确认要删服务名称为:{row.name},服务组为:{row.groupName}
              ,的配置吗？
            </span>
          </NPopconfirm>
        )
      } else {
        editButton = <span></span>
        removePopconfirm = editButton
      }
      return (
        <div>
          <NButton
            size="tiny"
            quaternary
            type="info"
            onClick={() => showInstances(row)}
          >
            服务实例
          </NButton>
          <NButton
            size="tiny"
            quaternary
            type="info"
            onClick={() => showInstances(row)}
          >
            详情
          </NButton>
          {editButton}
          {removePopconfirm}
        </div>
      )
    },
  },
]

/**
 * 查看服务
 *
 * @param row 服务数据
 */
const showInstances = (row: any) => {
  router.push({
    path: '/manage/service/instance',
    query: {
      groupName: row.groupName,
      serviceName: row.name,
      namespaceId: namespaceStore.current.value.namespaceId,
    },
  })
}

/**
 * 删除
 *
 * @param row 含数据
 */
const removeItem = (row: any) => {
  let serviceKey = {
    namespaceId: namespaceStore.current.value.namespaceId,
    groupName: row.groupName,
    serviceName: row.name,
  }
  pageContainer.value?.onDelete({
    namespaceId: namespaceStore.current.value.namespaceId,
    groupName: row.groupName,
    serviceName: row.name,
  })
}

// 表单提交
const onSave = (data: any) => {
  alert(1)
  formRef.value?.validate(errors => {
    if (!errors) {
      if (data.mode === constant.FORM_MODE_DETAIL) {
        return
      }
      let serviceInfo = {
        namespaceId: namespaceStore.current.value.namespaceId,
        groupName: data.groupName,
        serviceName: data.serviceName,
        protectThreshold: data.protectThreshold,
        metadata: data.metadata,
        tenant: undefined, // this.getTenant 这里是个bug
      } as any
      if (data.mode === constant.FORM_MODE_CREATE) {
        namingApi
          .createService(serviceInfo)
          .then(res => {
            if (res.status == 200) {
              message.success('设置成功!')
              pageContainer.value?.refreshData()
              return
            }
            message.error('设置失败，response code' + res.status)
          })
          .catch(err => {
            message.error('设置失败，' + err.message)
          })
      } else {
        namingApi
          .updateService(serviceInfo)
          .then(res => {
            if (res.status == 200) {
              message.success('设置成功!')
              pageContainer.value?.refreshData()
              return
            }
            message.error('设置失败，response code' + res.status)
          })
          .catch(err => {
            message.error('设置失败，' + err.message)
          })
      }
    }
    // else {
    // console.log(errors)
    // message.error('请安要求进行表单填写')
    // }
  })
}
</script>
