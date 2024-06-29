<template>
  <PageContainer
    ref="pageContainer"
    :config="{
      columns: columns,
      param: paramRef,
      form: {
        title: '服务',
      },
      apis: {
        list: apis.serviceList,
        create: apis.serviceAdd,
        update: apis.serviceUpdate,
        delete: apis.serviceDelete,
      },
      validator: validator,
    }"
  >
    <template #header>
      <div>服务列表</div>
      <div>
        <NamespacePopSelect @change="changeNamespace" />
      </div>
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
              v-model:value="param.serviceNameParam"
              placeholder="输入服务名称"
              clearable
            />
          </NFormItem>
          <NFormItem
            label="服务组"
            path="param.groupParam"
          >
            <NInput
              v-model:value="param.groupNameParam"
              placeholder="输入服务组"
              clearable
            />
          </NFormItem>
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
          v-if="webResources.canUpdateService"
          type="info"
          @click="
            methods.createForm({
              namespaceId: namespaceStore.current.value.namespaceId || '',
              groupName: '',
              serviceName: '',
              protectThreshold: 0,
              metadata: JSON.stringify({}),
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
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
      >
        <NFormItem
          path="serviceName"
          label="服务名称"
        >
          <NInput
            :disabled="isKeyReadonly"
            placeholder="输入服务名称"
            v-model:value="formData.serviceName"
            @keydown.enter.prevent
          />
        </NFormItem>
        <NFormItem
          path="groupName"
          label="服务组"
        >
          <NInput
            :disabled="isKeyReadonly"
            placeholder="输入服务组"
            v-model:value="formData.groupName"
            @keydown.enter.prevent
          />
        </NFormItem>
        <NFormItem
          path="protectThreshold"
          label="保护阀值"
        >
          <NInput
            :disabled="isReadonly"
            placeholder="输入保护阀值"
            v-model:value.number="formData.protectThreshold"
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
        <NFormItem
          path="selector"
          label="服务路由类型"
        >
          <NInput
            :disabled="true"
            placeholder="暂不支持"
            v-model:value="formData.selector"
            @keydown.enter.prevent
          />
        </NFormItem>
      </NForm>
    </template>
  </PageContainer>
</template>
<script lang="tsx" setup title="服务列表" layout="nav">
import apis from '@/apis/index'
import { useMessage, type FormInst, NButton, NPopconfirm, NForm, NFormItem } from 'naive-ui'
import constant from '@/types/constant'
import { useWebResources } from '@/data/resources'
import { namespaceStore } from '@/data/namespace'
import type { INamespace } from '@/types/namespace'
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const pageContainer = ref<any>(null)
let webResources = useWebResources()
const router = useRouter()
const paramRef = ref({
  serviceNameParam: '',
  groupNameParam: '',
  namespaceId: namespaceStore.current.value.namespaceId,
  pageNo: 1,
  pageSize: 10,
})

/**
 * 改变命名空间
 *
 * @param nm
 */
const changeNamespace = (nm: INamespace) => {
  paramRef.value.namespaceId = nm.namespaceId
  pageContainer.value?.onSearch()
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
        try {
          let nData = JSON.parse(JSON.stringify(data)) as any
          nData.metadata = JSON.parse(nData.metadata)
          resolve(nData)
        } catch (e) {
          message.error('元数据格式不正确，解析失败，需要正确的json格式数据')
          reject('元数据格式不正确，解析失败，需要正确的json格式数据')
        }
      } else {
        reject('表单验证不通过')
      }
    })
  })
}

/**
 * 表单验证规则
 */
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
const showForm = (row: any, mode: string) => {
  if (mode === constant.FORM_MODE_UPDATE) {
    pageContainer.value?.updateForm({
      namespaceId: row.namespaceId,
      groupName: row.groupName,
      serviceName: row.name,
      protectThreshold: row.protectThreshold,
      metadata: row.metadata,
      tenant: row.getTenant,
      mode: mode,
    })
  } else {
    pageContainer.value?.showDetail({
      namespaceId: row.namespaceId,
      groupName: row.groupName,
      serviceName: row.name,
      protectThreshold: row.protectThreshold,
      metadata: row.metadata,
      tenant: row.getTenant,
      mode: mode,
    })
  }
}

/**
 * 表格字段列表
 */
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
            onClick={() => showForm(row, constant.FORM_MODE_UPDATE)}
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
            onClick={() => showForm(row, constant.FORM_MODE_DETAIL)}
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
  pageContainer.value?.onDelete({
    namespaceId: namespaceStore.current.value.namespaceId,
    groupName: row.groupName,
    serviceName: row.name,
  })
}
</script>
