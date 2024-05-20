<template>
  <PageContainer
    ref="pageContainer"
    :config="{
      columns: columns,
      form: {
        title: '命名空间',
      },
      apis: {
        list: apis.namespacesList,
        update: apis.namespacesUpdate,
        create: apis.namespacesAdd,
        delete: apis.namespacesRemove,
      },
      validator: validator,
      pagination: paginationReactive,
    }"
  >
    <template #header="{ methods }">
      <div>命名空间</div>
      <div>
        <n-button
          v-if="webResources.canUpdateNamespace"
          class="mg-r5"
          @click="
            methods.createForm({
              mode: 'add',
            })
          "
        >
          创建命名空间
        </n-button>
        <n-button @click="methods.refreshData()">刷新</n-button>
      </div>
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

<script lang="tsx" setup title="命名空间管理" layout="nav">
import { NPopconfirm, NTag, NButton, NForm, NFormItem, NInput, type FormItemRule, type FormInst } from 'naive-ui'
import apis from '@/apis/index'
import type { INamespace } from '@/types/namespace'
import { useWebResources } from '@/data/resources'
let webResources = useWebResources()
const formRef = ref<FormInst | null>(null)
const pageContainer = ref<any>(null)
const columns = ref<any>([])
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
      title: '命名空间名称',
      key: 'namespaceName',
    },
    {
      title: '命名空间ID',
      key: 'namespaceId',
    },
  ]
  const optColumn = {
    title: '操作',
    key: 'type',
    fixed: 'right',
    render(row: INamespace) {
      if (row.namespaceId === '') {
        return (
          <NTag
            size="small"
            type="info"
          >
            保留空间
          </NTag>
        )
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
      return (
        <div>
          <NButton
            size="tiny"
            quaternary
            type="info"
            onClick={$event => showUpdate($event, row)}
          >
            编辑
          </NButton>
          <NPopconfirm
            onPositiveClick={() => remove(row)}
            v-slots={removeConfirmSlots}
          >
            <span>确定要删除此命名空间吗</span>
          </NPopconfirm>
        </div>
      )
    },
  }

  if (webResources.canUpdateNamespace) {
    columns.push(optColumn)
  }
  return columns
}

onMounted(() => {
  columns.value = createColumns()
})

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

/**
 * 保存数据
 *
 * @param data 保存数据
 */
const validator = (data: any) => {
  return new Promise((resolve, reject) => {
    formRef.value?.validate((errors: any) => {
      if (!errors) {
        resolve(data)
      } else {
        reject('表单验证不通过')
      }
    })
  })
}

/**
 *
 * @param $event 事件
 *
 * @param row 当前行数据
 */
const showUpdate = ($event: MouseEvent, row: INamespace) => {
  pageContainer.value?.updateForm({
    namespaceId: row.namespaceId,
    namespaceName: row.namespaceName,
    mode: 'update',
  })
}

/**
 * 删除命名空间
 *
 * @param row 当前行数据
 */
const remove = (row: INamespace) => {
  pageContainer.value?.onDelete({ namespaceId: row.namespaceId })
}
</script>
