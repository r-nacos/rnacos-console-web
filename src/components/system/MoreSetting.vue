<template>
  <div
    class="wrap"
    v-if="!webResources.isOldConsole"
  >
    <n-dropdown
      :options="options"
      @select="handleSelect"
      size="medium"
    >
      <div class="actions">
        <span class="icon">
          <n-icon
            size="16"
            class="dropdown"
          >
            <ellipsis-horizontal />
          </n-icon>
        </span>
        <!-- <div class="user-name">
          {{ userName }}
        </div> -->
      </div>
    </n-dropdown>
    <SystemResetPassword
      v-if="visible"
      @closeDrawer="closeDrawer"
    />
  </div>
</template>
<script setup lang="ts">
import { h, ref, reactive } from 'vue'
import { EllipsisHorizontal, LogOutOutline, Pencil as EditIcon } from '@vicons/ionicons5'
import { NIcon, useMessage } from 'naive-ui'
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
const visible = ref(false)
const userName = ref('')
const resetModel = reactive({
  oldPassword: null,
  newPassword: null,
  newPasswordRepeated: null,
})

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
    if (status === 200 && data && typeof data === 'object') {
      if (data.success) {
        message.info('退出登录成功')
        setTimeout(() => {
          location.href = '/login'
        }, 500)
      } else {
        message.info(data.message || '退出失败')
      }
    } else {
      message.error('请求失败')
    }
    // 重置密码
  } else if (key === 'reset_password') {
    visible.value = true
  }
}

const closeDrawer = () => {
  visible.value = false
}
</script>

<style scoped lang="scss">
.wrap {
  .actions {
    display: flex;
  }
  .icon {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }

  .user-name {
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>
