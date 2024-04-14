<template>
  <div>
    <n-form
      ref="formRef"
      :model="formRef"
      :rules="rules"
    >
      <n-form-item
        path="oldPassword"
        label="旧密码"
      >
        <n-input
          placeholder="输入旧密码"
          type="password"
          v-model:value="formRef.oldPassword"
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
          v-model:value="formRef.newPassword"
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
          v-model:value="formRef.newPasswordRepeated"
          @keydown.enter.prevent
        />
      </n-form-item>
    </n-form>
  </div>
</template>
<script setup lang="ts">
const formRef = reactive({
  oldPassword: null,
  newPassword: null,
  newPasswordRepeated: null,
})

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
        if (value !== formRef.newPassword) {
          return new Error('确认内容与新密码不一致')
        }
        return true
      },
      trigger: ['blur'],
    },
  ],
}
/* import { defineComponent } from 'vue'
export default defineComponent({
  props: ['model'],
  components: {},
  setup(props) {
    //window.$message = useMessage();

    return {
      resetRules,
    }
  },
}) */
</script>

<style scoped></style>
