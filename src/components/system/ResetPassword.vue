<template>
  <div>
    <n-drawer
      :block-scroll="false"
      :trap-focus="false"
      v-model:show="showForm"
      default-width="600"
      resizable
      :on-after-leave="closeForm"
    >
      <n-drawer-content
        header-style="height: 52px;"
        closable
      >
        <template #header>
          <div>
            <h3>修改密码</h3>
          </div>
        </template>
        <n-form
          ref="formRef"
          :model="formModel"
          :rules="rules"
        >
          <n-form-item
            path="oldPassword"
            label="旧密码"
          >
            <n-input
              placeholder="输入旧密码"
              type="password"
              v-model:value="formModel.oldPassword"
              @keydown.enter.prevent
            />
          </n-form-item>
          <n-form-item
            path="newPassword"
            label="新密码"
          >
            <n-input
              placeholder="输入新密码"
              type="password"
              v-model:value="formModel.newPassword"
              @keydown.enter.prevent
            />
          </n-form-item>
          <n-form-item
            path="newPasswordRepeated"
            label="新密码确认"
          >
            <n-input
              placeholder="输入新密码确认"
              type="password"
              v-model:value="formModel.newPasswordRepeated"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space align="baseline">
            <n-button
              text
              @click="closeForm"
            >
              返回
            </n-button>
            <n-button
              type="primary"
              @click="submitForm"
            >
              确定
            </n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script setup lang="ts">
import apis from '@/apis'
import { useMessage, type FormInst } from 'naive-ui'
const emits = defineEmits(['closeDrawer'])
const message = useMessage()
const showForm = ref(true)
const formModel = reactive({
  oldPassword: null,
  newPassword: null,
  newPasswordRepeated: null,
})
const formRef = ref<FormInst | null>()

// 表单校验规则
const rules = {
  oldPassword: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('需要输入旧密码')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  newPassword: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('需要输入新密码')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  newPasswordRepeated: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('需要输入新密码二次确认')
        }
        if (value !== formModel.newPassword) {
          return new Error('确认内容与新密码不一致')
        }
        return true
      },
      trigger: ['blur'],
    },
  ],
}

// 关闭表单修改弹框
const closeForm = () => {
  clearResetModel()
  showForm.value = false
  emits('closeDrawer')
}

// 清除表单填写
const clearResetModel = function () {
  formModel.oldPassword = null
  formModel.newPassword = null
  formModel.newPasswordRepeated = null
}

// 提交表单数据
const submitForm = () => {
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      let { status, data } = await apis.postJSON(apis.userResetPassword, {
        data: {
          oldPassword: formModel.oldPassword,
          newPassword: formModel.newPassword,
        },
      })
      if (status === 200 && data && typeof data === 'object') {
        if (data.success) {
          message.success('修改密码成功!')
          closeForm()
        } else {
          message.error(data.message || '密码修改失败')
          // closeForm()
        }
      } else {
        message.error('请求失败')
      }
    }
    // else {
    // message.error('表单校验不通过，请按要求输入')
    // }
  })
}
</script>

<style scoped></style>
