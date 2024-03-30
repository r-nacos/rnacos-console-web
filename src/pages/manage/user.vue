<template>
  <PageContainer
    ref="pageContainer"
    :config="{
      columns: columns,
      form: {
        title: '用户',
      },
      apis: {
        list: apis.userList,
      },
      param: {
        like_username: '',
        pageNo: 1,
        pageSize: 10,
        isRev: false,
      },
    }"
    @on-save="onSave"
  >
    <template #header>用户管理</template>
    <template #actions="{ param, methods }">
      <div>
        <n-form
          label-placement="left"
          label-width="auto"
          inline
        >
          <n-form-item
            label="用户名"
            path="param.like_username"
          >
            <n-input
              v-model:value="param.like_username"
              placeholder="输入用户名"
              clearable
            />
          </n-form-item>
        </n-form>
      </div>
      <div>
        <n-button
          tertiary
          @click="methods.loadData()"
          class="mg-r10"
        >
          查询
        </n-button>
        <n-button
          type="info"
          @click="
            methods.createForm({
              mode: constant.FORM_MODE_CREATE,
              username: '',
              nickname: '',
              password: null,
              gmtCreate: null,
              gmtModified: null,
              enable: true,
              roles: [],
              roleOptions,
            })
          "
        >
          新建
        </n-button>
      </div>
    </template>
    <template #form="{ formData, isReadonly, isKeyReadonly }">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
      >
        <n-form-item
          path="username"
          label="用户名"
        >
          <n-input
            :disabled="isKeyReadonly"
            placeholder="输入用户名"
            v-model:value="formData.username"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item
          path="nickname"
          label="用户昵称"
        >
          <n-input
            :disabled="isReadonly"
            placeholder="输入用户昵称"
            v-model:value="formData.nickname"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item
          v-if="!isKeyReadonly"
          path="password"
          label="密码"
        >
          <n-input
            type="password"
            placeholder="输入用户密码"
            v-model:value="formData.password"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item
          v-if="isKeyReadonly"
          path="updatePassword"
          label="重置密码(空则不调整)"
        >
          <n-input
            type="password"
            :disabled="isReadonly"
            placeholder="输入用户密码"
            v-model:value="formData.password"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item
          path="protectThreshold"
          label="角色"
        >
          <n-select
            v-model:value="formData.roles"
            :disabled="isReadonly"
            multiple
            :options="state.roleOptions"
          />
        </n-form-item>
        <n-form-item
          path="enabled"
          label="是否启用"
        >
          <n-switch
            :disabled="isReadonly"
            v-model:value="formData.enable"
          />
        </n-form-item>
      </n-form>
    </template>
  </PageContainer>
</template>
<script lang="tsx" setup title="用户管理" layout="nav">
import { getRoleNameByCode, roleOptions } from '@/data/role'
import { userApi } from '@/apis/user'
import { useMessage, type FormInst, NButton, NPopconfirm, NTag } from 'naive-ui'
import { toDateTime } from '@/utils/date'
import constant from '@/types/constant'
import apis from '@/apis'
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const pageContainer = ref<any>(null)
const state = reactive({
  roleOptions: roleOptions as any,
})

const rules = {
  username: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('需要输入用户名')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  nickname: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('需要输入用户昵称')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('需要输入用户密码')
        }
        return true
      },
      trigger: ['blur'],
    },
  ],
}

/**
 * columns 显示字段
 */
const columns = [
  {
    title: '用户',
    key: 'username',
  },
  {
    title: '用户昵称',
    key: 'nickname',
  },
  {
    title: '创建时间',
    key: 'gmtCreate',
    render(row: any) {
      let value = ''
      if (row.gmtCreate) {
        const date = new Date(row.gmtCreate)
        value = toDateTime(date)
      }
      return <span>{value}</span>
    },
  },
  {
    title: '更新时间',
    key: 'gmtModified',
    render(row: any) {
      let value = ''
      if (row.gmtModified) {
        const date = new Date(row.gmtModified)
        value = toDateTime(date)
      }
      return <span>{value}</span>
    },
  },
  {
    title: '角色',
    key: 'roles',
    render(row: any) {
      const roleItems = row.roles.map((item: any) => <NTag type="success">{getRoleNameByCode(item)}</NTag>)
      return <>{roleItems}</>
    },
  },
  {
    title: '是否启用',
    key: 'enable',
    render(row: any) {
      let v = '是'
      if (!row.enable) {
        v = '否'
      }
      return <span>{v}</span>
    },
  },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
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
        <>
          <NButton
            size="tiny"
            quaternary
            type="info"
            onClick={$event => showUpdate($event, row)}>
            编辑
          </NButton>
          <NPopconfirm
            onPositiveClick={() => removeItem(row)}
            v-slots={removeConfirmSlots}>
            <span>确认要删服务名称为:{row.username} 的用户吗？</span>
          </NPopconfirm>
        </>
      )
    },
  },
]

const removeItem = (row: any) => {
  userApi
    .removeUser({ username: row.username })
    .then(res => {
      if (res.status == 200) {
        message.success('删除成功!')
        pageContainer.value?.refreshData()
        return
      }
      message.error('操作失败，response code' + res.status)
    })
    .catch(err => {
      message.error('操作失败' + err.message)
    })
}

/**
 *
 * @param $event 事件
 *
 * @param row 数据项
 */
const showUpdate = ($event: MouseEvent, row: any) => {
  pageContainer.value?.updateForm({
    mode: constant.FORM_MODE_UPDATE,
    username: row.username,
    nickname: row.nickname,
    password: null,
    enable: row.enable,
    roles: row.roles,
    roleOptions,
  })
}

// 表单提交
const onSave = (data: any) => {
  formRef.value?.validate(errors => {
    if (!errors) {
      let mode = data.mode
      if (mode === constant.FORM_MODE_DETAIL) {
        return
      }
      let userData = {
        username: data.username,
        nickname: data.nickname,
        password: data.password,
        enable: data.enable,
        roles: data.roles.join(','),
      }
      if (data.mode === constant.FORM_MODE_CREATE) {
        userApi
          .addUser(userData)
          .then(res => {
            if (res.status == 200) {
              message.success('操作成功!')
              pageContainer.value?.refreshData()
              return
            }
            message.error('操作失败，response code' + res.status)
          })
          .catch(err => {
            message.error('操作失败' + err.message)
          })
      } else {
        userApi
          .updateUser(userData)
          .then(res => {
            if (res.status == 200) {
              message.success('操作成功!')
              pageContainer.value?.refreshData()
              return
            }
            message.error(`操作失败，response code: ${res.status}`)
          })
          .catch(err => {
            message.error(`操作失败 ${err.message || ''}`)
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
