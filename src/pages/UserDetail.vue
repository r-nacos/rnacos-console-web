<template>
  <div class="detailWrap">
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="username" label="用户名">
        <n-input
          :disabled="isKeyReadonly"
          placeholder="输入用户名"
          v-model:value="model.username"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="nickname" label="用户昵称">
        <n-input
          :disabled="isReadonly"
          placeholder="输入用户昵称"
          v-model:value="model.nickname"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item v-if="!isKeyReadonly" path="password" label="密码">
        <n-input
          type="password"
          placeholder="输入用户密码"
          v-model:value="model.password"
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
          v-model:value="model.password"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="protectThreshold" label="角色">
        <n-select
          v-model:value="model.roles"
          :disabled="isReadonly"
          multiple
          :options="model.roleOptions"
        />
      </n-form-item>
      <n-form-item path="enabled" label="是否启用">
        <n-switch :disabled="isReadonly" v-model:value="model.enable" />
      </n-form-item>
    </n-form>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import * as constant from '@/types/constant';
export default defineComponent({
  props: ['model'],
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
</style>
