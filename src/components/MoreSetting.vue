<template>
  <div v-if="!webResources.isOldConsole" class="wrap">
    <n-dropdown :options="options" @select="handleSelect" size="medium">
      <span class="icon">
        <n-icon size="16" class="dropdown">
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
      <n-drawer-content header-style="height: 52px;" closable>
        <template #header>
          <div>
            <h3>{{ this.$t('passwordpanel.reset_password') }}</h3>
          </div>
        </template>
        <ResetPassword :model="resetModel" />
        <template #footer>
          <n-space align="baseline">
            <n-button text @click="closeForm">{{
              this.$t('common.return')
            }}</n-button>
            <n-button type="primary" @click="submitForm">{{
              this.$t('common.confirm')
            }}</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
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
import ResetPassword from './user/ResetPassword.vue';
import { useWebResources } from '@/data/resources';
import router from '@/route/router.js';
import { useI18n } from 'vue-i18n';
import { handleApiResult, printApiError } from '@/utils/request';
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
    let webResources = useWebResources();
    window.$message = useMessage();
    const useFormRef = ref(false);
    const resetModel = reactive({
      oldPassword: null,
      newPassword: null,
      newPasswordRepeated: null
    });
    const clearResetModel = function () {
      resetModel.oldPassword = null;
      resetModel.newPassword = null;
      resetModel.newPasswordRepeated = null;
    };
    const { t } = useI18n();
    return {
      webResources,
      options: [
        {
          label: t('passwordpanel.reset_password'),
          key: 'reset_password',
          icon: renderIcon(EditIcon)
        },
        {
          label: t('passwordpanel.logout'),
          key: 'logout',
          icon: renderIcon(LogOutOutline)
        }
      ],
      handleSelect(key) {
        //console.log("select key:",key)
        if (key === 'logout') {
          userApi.logout().then((res) => {
            if (res.status == 200) {
              window.$message.info(t('passwordpanel.logout_success'));
              setTimeout(() => {
                router.push('/p/login');
              }, 500);
            }
          });
        } else if (key === 'reset_password') {
          clearResetModel();
          useFormRef.value = true;
        }
      },
      useForm: useFormRef,
      resetModel,
      closeForm() {
        useFormRef.value = false;
        clearResetModel();
      },
      submitForm() {
        if (!resetModel.oldPassword || !resetModel.newPassword) {
          window.$message.error(
            this.$t('passwordpanel.the_input_cannot_be_empty')
          );
          return;
        }
        if (resetModel.newPassword !== resetModel.newPasswordRepeated) {
          window.$message.error(
            this.$t(
              'passwordpanel.confirm_that_the_content_does_not_match_the_new_password'
            )
          );
          return;
        }
        useFormRef.value = false;
        userApi
          .resetPassword({
            oldPassword: resetModel.oldPassword,
            newPassword: resetModel.newPassword
          })
          .then(handleApiResult)
          .then(() => {
            window.$message.info(t('passwordpanel.reset_password_success'));
            useFormRef.value = false;
            clearResetModel();
          })
          .catch(printApiError);
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
.icon {
  display: block;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 8px;
}
</style>
