<template>
  <div class="wrap">
    <n-dropdown :options="options" @select="handleSelect" size="medium">
      <n-icon size="32" class="dropdown">
        <ellipsis-horizontal />
      </n-icon>
    </n-dropdown>
  </div>
</template>
<script>
import { h, ref, reactive, defineComponent } from 'vue';
import {
  EllipsisHorizontal,
  LogOutOutline,
  Pencil as EditIcon
} from '@vicons/ionicons5';
import { NIcon, useMessage } from 'naive-ui';
import { userApi } from '@/api/user';

const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    });
  };
};

export default defineComponent({
  components: {
    EllipsisHorizontal
  },
  setup(self) {
    window.$message = useMessage();
    return {
      options: [
        /*
        {
          label: '修改密码',
          key: 'reset_password',
          icon: renderIcon(EditIcon)
        },
        */
        {
          label: '退出登录',
          key: 'logout',
          icon: renderIcon(LogOutOutline)
        }
      ],
      handleSelect(key) {
        //console.log("select key:",key)
        if (key === 'logout') {
          userApi.logout().then((res) => {
            if (res.status == 200) {
              window.$message.info('退出登录成功');
              setTimeout(() => {
                location.href = '/p/login';
              }, 500);
            }
          });
        }
      }
    };
  }
});
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
</style>
