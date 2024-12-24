<template>
  <div class="detailWrap">
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="username" :label="this.$t('user.username')">
        <n-input
          :disabled="isKeyReadonly"
          :placeholder="this.$t('common.preInput') + this.$t('user.username')"
          v-model:value="model.username"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="nickname" :label="this.$t('user.nickname')">
        <n-input
          :disabled="isReadonly"
          :placeholder="this.$t('common.preInput') + this.$t('user.nickname')"
          v-model:value="model.nickname"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        v-if="!isKeyReadonly"
        path="password"
        :label="this.$t('user.password')"
      >
        <n-input
          type="password"
          :placeholder="this.$t('common.preInput') + this.$t('user.password')"
          v-model:value="model.password"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        v-if="isKeyReadonly"
        path="updatePassword"
        :label="this.$t('user.resetPassword')"
      >
        <n-input
          type="password"
          :disabled="isReadonly"
          :placeholder="this.$t('common.preInput') + this.$t('user.password')"
          v-model:value="model.password"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="roles" :label="this.$t('user.roles')">
        <n-select
          v-model:value="model.roles"
          :disabled="isReadonly"
          multiple
          :options="model.roleOptions"
        />
      </n-form-item>
      <n-form-item path="enabled" :label="this.$t('user.enable')">
        <n-switch :disabled="isReadonly" v-model:value="model.enable" />
      </n-form-item>
      <n-form-item path="namespaceWhitelist" label="命名空间白名单">
        <div class="privilege-group">
          <div class="is_all">
            所有
            <n-switch
              :disabled="isReadonly"
              v-model:value="model.namespacePrivilege.whitelistIsAll"
            />
          </div>
          <div v-if="!model.namespacePrivilege.whitelistIsAll" class="select">
            <n-select
              v-model:value="model.namespacePrivilege.whitelist"
              :disabled="isReadonly"
              multiple
              :options="namespaceOptions"
            />
          </div>
        </div>
      </n-form-item>
      <n-form-item path="namespaceWhitelist" label="命名空间黑名单">
        <div class="privilege-group">
          <div class="is_all">
            所有
            <n-switch
              :disabled="isReadonly"
              v-model:value="model.namespacePrivilege.blacklistIsAll"
            />
          </div>
          <div v-if="!model.namespacePrivilege.blacklistIsAll" class="select">
            <n-select
              v-model:value="model.namespacePrivilege.blacklist"
              :disabled="isReadonly"
              multiple
              :options="namespaceOptions"
            />
          </div>
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import * as constant from '@/types/constant';

export default defineComponent({
  props: ['model', 'namespaceOptions'],
  computed: {
    isReadonly() {
      return this.model.mode === constant.FORM_MODE_DETAIL;
    },
    isKeyReadonly() {
      return this.model.mode !== constant.FORM_MODE_CREATE;
    }
  },
  data() {
    const rules = {
      username: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return new Error('需要输入用户名');
            }
            return true;
          },
          trigger: ['input', 'blur']
        }
      ],
      nickname: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return new Error('需要输入用户昵称');
            }
            return true;
          },
          trigger: ['input', 'blur']
        }
      ],
      password: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return new Error('需要输入用户密码');
            }
            return true;
          },
          trigger: ['blur']
        }
      ]
    };
    return {
      rules
    };
  }
});
</script>

<style scoped>
.detailWrap {
  background: #fff;
  padding: 3px;
  border-radius: 5px;
}
.privilege-group {
  display: block;
  position: relative;
  width: 100%;
  padding-left: 10px;
}
.select {
  padding: 5px 0;
}
</style>
