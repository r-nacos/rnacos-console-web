<template>
  <div class="bg-white rounded-lg p-4">
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="ip" label="IP">
        <n-input
          :disabled="true"
          placeholder=""
          v-model:value="model.ip"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="port" :label="this.$t('instance.port')">
        <n-input
          :disabled="true"
          placeholder=""
          v-model:value="model.port"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="enabled" :label="this.$t('instance.online')">
        <n-switch v-model:value="model.enabled" />
      </n-form-item>
      <n-form-item path="weight" :label="this.$t('instance.weight')">
        <n-input
          :disabled="isReadonly"
          placeholder=""
          v-model:value="model.weight"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="metadata" :label="this.$t('instance.metadata')">
        <n-input
          :disabled="isReadonly"
          type="textarea"
          placeholder="输入元数据"
          :autosize="{ minRows: 3 }"
          v-model:value="model.metadata"
        />
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
      weight: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return true;
            }
            try {
              let v = parseFloat(value);
              if (isNaN(v)) {
                return new Error('权重需为数字');
              }
              if (v < 0) {
                return new Error('权重不能小于0');
              }
            } catch {
              return new Error('权重需为数字');
            }
            return true;
          },
          trigger: ['input', 'blur']
        }
      ]
    };
    return {
      rules
    };
  }
});
</script>
