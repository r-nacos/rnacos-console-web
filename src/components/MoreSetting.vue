<template>
  <div v-if="!webResources.isOldConsole">
    <n-dropdown :options="options" @select="handleSelect" size="medium">
      <span class="h-full px-2 flex items-center justify-center">
        <n-icon size="16" class="dropdown">
          <ellipsis-horizontal />
        </n-icon>
      </span>
    </n-dropdown>
    <n-drawer
      :block-scroll="false"
      :trap-focus="false"
      v-model:show="showDrawer"
      default-width="600"
      resizable
    >
      <n-drawer-content header-style="height: 52px;" closable>
        <template #header>
          <div>
            <h3>{{ t('passwordpanel.reset_password') }}</h3>
          </div>
        </template>
        <ResetPassword :model="resetModel" />
        <template #footer>
          <n-space align="baseline">
            <n-button text @click="closeForm">
              {{ t('common.return') }}
            </n-button>
            <n-button type="primary" @click="submitForm">
              {{ t('common.confirm') }}
            </n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
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
import { renderIcon } from '@/utils/index';
import { handleApiResult, printApiError } from '@/utils/request';

const webResources = useWebResources();
window.$message = useMessage();
const showDrawer = ref(false);
const resetModel = reactive({
  oldPassword: null,
  newPassword: null,
  newPasswordRepeated: null
});

const { t } = useI18n();

const clearResetModel = () => {
  resetModel.oldPassword = null;
  resetModel.newPassword = null;
  resetModel.newPasswordRepeated = null;
};

const options = [
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
];

const handleSelect = async (key: string) => {
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
    showDrawer.value = true;
  }
};

const closeForm = () => {
  showDrawer.value = false;
  clearResetModel();
};

const submitForm = () => {
  if (!resetModel.oldPassword || !resetModel.newPassword) {
    window.$message.error(t('passwordpanel.the_input_cannot_be_empty'));
    return;
  }
  if (resetModel.newPassword !== resetModel.newPasswordRepeated) {
    window.$message.error(
      t(
        'passwordpanel.confirm_that_the_content_does_not_match_the_new_password'
      )
    );
    return;
  }
  userApi
    .resetPassword({
      oldPassword: resetModel.oldPassword,
      newPassword: resetModel.newPassword
    })
    .then(handleApiResult)
    .then(() => {
      window.$message.info(t('passwordpanel.reset_password_success'));
      showDrawer.value = false;
      clearResetModel();
    })
    .catch(printApiError);
};
</script>
