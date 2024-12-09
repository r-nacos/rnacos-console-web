<template>
  <div class="detailWrap">
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="serviceName" :label="this.$t('service.name')">
        <n-input
          :disabled="isKeyReadonly"
          placeholder="service name"
          v-model:value="model.serviceName"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="groupName" :label="this.$t('service.groupName')">
        <n-input
          :disabled="isKeyReadonly"
          placeholder="group name"
          v-model:value="model.groupName"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        path="protectThreshold"
        :label="this.$t('service.protectThreshold')"
      >
        <n-input
          :disabled="isReadonly"
          placeholder="protect threshold"
          v-model:value="model.protectThreshold"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="metadata" :label="this.$t('service.metadata')">
        <n-input
          :disabled="isReadonly"
          type="textarea"
          placeholder="metadata"
          :autosize="{ minRows: 3 }"
          v-model:value="model.metadata"
        />
      </n-form-item>
      <!--
      <n-form-item path="selector" label="服务路由类型">
        <n-input
          :disabled="true"
          placeholder="暂不支持"
          v-model:value="model.selector"
          @keydown.enter.prevent
        />
      </n-form-item>
      -->
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
      serviceName: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return new Error('需要服务名称');
            }
            return true;
          },
          trigger: ['input', 'blur']
        }
      ],

      groupName: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return new Error('需要输入服务组');
            }
            return true;
          },
          trigger: ['input', 'blur']
        }
      ],
      protectThreshold: [
        {
          required: false,
          validator(rule, value) {
            if (!value) {
              return true;
            }
            try {
              let v = parseFloat(value);
              if (isNaN(v)) {
                return new Error('保护阀值需为数字');
              }
              if (v < 0 || v > 1) {
                return new Error('保护阀值不能小于0或大于1');
              }
            } catch {
              return new Error('保护阀值需为数字');
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

<style scoped>
.detailWrap {
  background: #fff;
  padding: 3px;
  border-radius: 5px;
}
</style>
