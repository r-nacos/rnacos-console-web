<template>
  <PageContainer
    ref="pageContainer"
    :config="{
      columns: columns,
      form: {
        title: '命名空间',
      },
      apis: {
        list: apis.namespaces,
      },
    }"
    @on-save="onSave"
  >
    <template #header="{ methods }">
      <div>命名空间</div>
      <div>
        <n-button
          class="mg-r10"
          @click="methods.createForm()"
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
import { NPopconfirm, useMessage, NTag, NButton, NDataTable, NForm, NFormItem, NInput, NSpace, NDrawer, NDrawerContent, type FormItemRule, type FormInst } from 'naive-ui'
import apis from '@/apis/index'
import namespaceApi from '@/apis/namespace'
import type { INamespace } from '@/types/namespace'
import constant from '@/types/constant'
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const pageContainer = ref<any>(null)

/**
 * 表格表格字段
 */
const columns = [
  {
    title: '命名空间名称',
    key: 'namespaceName',
  },
  {
    title: '命名空间ID',
    key: 'namespaceId',
  },
  {
    title: '操作',
    key: 'type',
    fixed: 'right',
    render(row: INamespace) {
      if (row.namespaceId === '') {
        return (
          <NTag
            size="small"
            type="info">
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
              type="error">
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
            onClick={$event => showUpdate($event, row)}>
            编辑
          </NButton>
          <NPopconfirm
            onPositiveClick={() => remove(row)}
            v-slots={removeConfirmSlots}>
            <span>确定要删除此命名空间吗</span>
          </NPopconfirm>
        </div>
      )
    },
  },
]

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
const onSave = (data: any) => {
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      if (data.mode === constant.FORM_MODE_CREATE) {
        doCreate(data)
      } else {
        doUpdate(data)
      }
    }
  })
}

/**
 * 创建
 *
 * @param data 数据项
 */
const doCreate = (data: any) => {
  data.mode = 'add' // 注意后期统一
  namespaceApi
    .add(data)
    .then(res => {
      if (res.status == 200) {
        if (res.data.code == 200) {
          pageContainer.value?.refreshData()
          message.success(res.data.message || '新增成功')
        } else {
          message.error(res.data.message)
        }
      } else {
        message.error('request err,status code:' + res.status)
      }
    })
    .catch(err => {
      message.error(err.message)
    })
}

/**
 * 更新
 *
 * @param data 数据项
 */
const doUpdate = (data: any) => {
  namespaceApi
    .update(data)
    .then(res => {
      if (res.status == 200) {
        if (res.data.code == 200) {
          pageContainer.value?.refreshData()
          message.success(res.data.message || '修改成功')
        } else {
          message.error(res.data.message)
        }
      } else {
        message.error('request err,status code:' + res.status)
      }
    })
    .catch(err => {
      message.error(err.message)
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
  namespaceApi
    .delete(row)
    .then(res => {
      if (res.status == 200) {
        if (res.data.code == 200) {
          pageContainer.value.refreshData()
        } else {
          message.error(res.data.message)
        }
      } else {
        message.error('request err,status code:' + res.status)
      }
    })
    .catch(err => {
      message.error(err.message)
    })
}
</script>
