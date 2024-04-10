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
      <span class="icon">
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
        <!-- <ResetPassword :model="resetModel" /> -->
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
<script>
import { h, ref, reactive, defineComponent } from 'vue'
import { EllipsisHorizontal, LogOutOutline, Pencil as EditIcon } from '@vicons/ionicons5'
import { NIcon, useMessage } from 'naive-ui'
import { userApi } from '@/apis/user'
import ResetPassword from './user/ResetPassword.vue'
import { useWebResources } from '@/data/resources'

const renderIcon = icon => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

export default defineComponent({
  components: {
    EllipsisHorizontal,
  },
  setup(self) {
    let webResources = useWebResources()
    window.$message = useMessage()
    const useFormRef = ref(false)
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
    return {
      webResources,
      options: [
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
      ],
      handleSelect(key) {
        //console.log("select key:",key)
        if (key === 'logout') {
          userApi.logout().then(res => {
            if (res.status == 200) {
              window.$message.info('退出登录成功')
              setTimeout(() => {
                location.href = '/login'
              }, 500)
            }
          })
        } else if (key === 'reset_password') {
          clearResetModel()
          useFormRef.value = true
        }
      },
      useForm: useFormRef,
      resetModel,
      closeForm() {
        useFormRef.value = false
        clearResetModel()
      },
      submitForm() {
        if (!resetModel.oldPassword || !resetModel.newPassword) {
          window.$message.error('输入内容不能为空')
          return
        }
        if (resetModel.newPassword !== resetModel.newPasswordRepeated) {
          window.$message.error('确认内容与新密码不一致')
          return
        }
        useFormRef.value = false
        userApi
          .resetPassword({
            oldPassword: resetModel.oldPassword,
            newPassword: resetModel.newPassword,
          })
          .then(res => {
            if (res.status == 200 && res.data != null && res.data.success) {
              window.$message.info('修改密码成功!')
              useFormRef.value = false
              clearResetModel()
              return
            }
            window.$message.error('请求失败，response code' + res.status)
          })
          .catch(err => {
            window.$message.error('请求失败，' + err.message)
          })
      },
    }
  },
})
</script>

<style scoped>
.wrap {
  padding: 10px;
}
/*
.dropdown{
  border: 1px solid #fff;
  border-radius: 8px;
}
*/
.icon {
  display: block;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 8px;
}
</style>
