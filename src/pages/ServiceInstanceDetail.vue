<template>
  <div class="bg-white rounded-lg p-4">
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="ip" :label="this.$t('instance.ipOrDomain')">
        <n-input
          :disabled="isKeyReadonly"
          :placeholder="
            this.$t('common.preInput') + this.$t('instance.ipOrDomain')
          "
          v-model:value="model.ip"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="port" :label="this.$t('instance.port')">
        <n-input
          :disabled="isKeyReadonly"
          placeholder="请输入端口号"
          v-model:value="model.port"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="enabled" :label="this.$t('instance.online')">
        <n-switch v-model:value="model.enabled" />
      </n-form-item>
      <n-form-item path="ephemeral" :label="this.$t('instance.ephemeral')">
        <n-switch
          v-model:value="model.ephemeral"
          :disabled="!canEditEphemeral"
        />
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
    },
    canEditEphemeral() {
      // 创建模式下可以编辑
      if (this.model.mode === constant.FORM_MODE_CREATE) {
        return true;
      }
      // 编辑模式下，只有原实例是临时实例才能编辑
      if (this.model.mode === constant.FORM_MODE_UPDATE) {
        return this.model.originalEphemeral === true;
      }
      // 详情模式下不可编辑
      return false;
    }
  },
  data() {
    const rules = {
      ip: [
        {
          required: true,
          validator(rule, value) {
            if (!value || value.trim() === '') {
              return new Error(this.$t('instance.ipOrDomain') + '不能为空');
            }
            // 基本的格式检查，只检查不为空且不包含特殊字符
            const trimmedValue = value.trim();
            if (trimmedValue.length === 0) {
              return new Error('IP地址或域名不能为空');
            }
            return true;
          },
          trigger: ['input', 'blur']
        }
      ],
      port: [
        {
          required: true,
          validator(rule, value) {
            if (!value || value.toString().trim() === '') {
              return new Error('端口不能为空');
            }
            try {
              let v = parseInt(value);
              if (isNaN(v)) {
                return new Error('端口需为数字');
              }
              if (v < 1 || v > 65535) {
                return new Error('端口范围为1-65535');
              }
            } catch {
              return new Error('端口需为数字');
            }
            return true;
          },
          trigger: ['input', 'blur']
        }
      ],
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
