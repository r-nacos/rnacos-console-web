<template>
  <div
    v-if="!webResources.isOldConsole"
    class="wrap"
  >
    <n-dropdown
      :options="options"
      @select="handleSelect"
      size="medium"
    >
      <div
        class="user-name"
        v-if="userName"
      >
        {{ userName }}
      </div>
      <span
        class="icon"
        v-else
      >
        <n-icon
          size="16"
          class="dropdown"
        >
          <ellipsis-horizontal />
        </n-icon>
      </span>
    </n-dropdown>
    <n-drawer
      :block-scroll="false"
      :trap-focus="false"
      v-model:show="useForm"
      default-width="600"
      resizable
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
        <SystemResetPassword :model="resetModel" />
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
import { h, ref, reactive } from 'vue'
import { EllipsisHorizontal, LogOutOutline, Pencil as EditIcon } from '@vicons/ionicons5'
import { NIcon, useMessage } from 'naive-ui'
import { userApi } from '@/apis/user'
import { useWebResources } from '@/data/resources'
import apis from '@/apis'
const message = useMessage()
const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

let webResources = useWebResources()
const useForm = ref(false)
const userName = ref('')
const resetModel = reactive({
  oldPassword: null,
  newPassword: null,
  newPasswordRepeated: null,
})

const clearResetModel = function () {
  resetModel.oldPassword = null
  resetModel.newPassword = null
  resetModel.newPasswordRepeated = null
}

const options = [
  {
    label: '修改密码',
    key: 'reset_password',
    icon: renderIcon(EditIcon),
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogOutOutline),
  },
]

onMounted(() => {
  userName.value = sessionStorage.getItem('userName') as string
})

const handleSelect = async (key: string) => {
  // 退出登录
  if (key === 'logout') {
    const { status, data } = await apis.postJSON(apis.logout)
    if (status === 200 && typeof data === 'object') {
      if (data.success) {
        message.info('退出登录成功')
        setTimeout(() => {
          location.href = '/login'
        }, 500)
      } else {
        message.info(data.message || '退出失败')
      }
    }
    // 重置密码
  } else if (key === 'reset_password') {
    clearResetModel()
    useForm.value = true
  }
}

const closeForm = () => {
  useForm.value = false
  clearResetModel()
}

const submitForm = () => {
  if (!resetModel.oldPassword || !resetModel.newPassword) {
    message.error('输入内容不能为空')
    return
  }
  if (resetModel.newPassword !== resetModel.newPasswordRepeated) {
    message.error('确认内容与新密码不一致')
    return
  }
  useForm.value = false
  userApi
    .resetPassword({
      oldPassword: resetModel.oldPassword,
      newPassword: resetModel.newPassword,
    })
    .then(res => {
      if (res.status == 200 && res.data != null && res.data.success) {
        message.info('修改密码成功!')
        useForm.value = false
        clearResetModel()
        return
      }
      message.error('请求失败，response code' + res.status)
    })
    .catch(err => {
      message.error('请求失败，' + err.message)
    })
}
</script>

<style scoped lang="scss">
.wrap {
  .icon {
    display: block;
    width: 25px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .user-name {
    background: rgba(255, 255, 255, 0.2);
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>
