<template>
  <div>
    <n-form ref="formRef" :model="model" :rules="resetRules">
      <n-form-item
        path="oldPassword"
        :label="this.$t('passwordpanel.old_password')"
      >
        <n-input
          :placeholder="this.$t('passwordpanel.input_old_password')"
          type="password"
          v-model:value="model.oldPassword"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        path="newPassword"
        :label="this.$t('passwordpanel.new_password')"
      >
        <n-input
          :placeholder="this.$t('passwordpanel.input_new_password')"
          type="password"
          v-model:value="model.newPassword"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        path="newPasswordRepeated"
        :label="this.$t('passwordpanel.new_password_confirm')"
      >
        <n-input
          :placeholder="this.$t('passwordpanel.input_new_password_confirm')"
          type="password"
          v-model:value="model.newPasswordRepeated"
          @keydown.enter.prevent
        />
      </n-form-item>
    </n-form>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
//import { useMessage } from 'naive-ui';
//import { userApi } from '@/api/user';

export default defineComponent({
  props: ['model'],
  components: {},
  setup(props) {
    //window.$message = useMessage();
    const resetRules = {
      oldPassword: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return new Error(
                this.$t('passwordpanel.need_input_old_password')
              );
            }
            return true;
          },
          trigger: ['input', 'blur']
        }
      ],
      newPassword: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return new Error(
                this.$t('passwordpanel.need_input_new_password')
              );
            }
            return true;
          },
          trigger: ['input', 'blur']
        }
      ],
      newPasswordRepeated: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return new Error(
                this.$t(
                  'you_will_need_to_enter_a_new_password_for_a_second_confirmation'
                )
              );
            }
            if (value !== props.model.newPassword) {
              return new Error(
                this.$t(
                  'confirm_that_the_content_does_not_match_the_new_password'
                )
              );
            }
            return true;
          },
          trigger: ['blur']
        }
      ]
    };
    return {
      resetRules
    };
  }
});
</script>

<style scoped></style>
