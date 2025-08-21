<template>
  <div class="mcpserver-form">
    <n-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      label-placement="left"
      label-width="120"
      require-mark-placement="right-hanging"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi
          :span="12"
          :label="t('mcpserver.server_name')"
          path="name"
        >
          <n-input
            v-model:value="formModel.name"
            :placeholder="t('mcpserver.input_server_name')"
            :disabled="isDetailMode"
          />
        </n-form-item-gi>

        <n-form-item-gi
          :span="12"
          :label="t('namespace.namespace')"
          path="namespace"
        >
          <namespace-pop-select
            v-model:value="formModel.namespace"
            :disabled="isDetailMode"
          />
        </n-form-item-gi>

        <n-form-item-gi
          :span="24"
          :label="t('mcpserver.server_description')"
          path="description"
        >
          <n-input
            v-model:value="formModel.description"
            type="textarea"
            :placeholder="t('mcpserver.input_description')"
            :disabled="isDetailMode"
          />
        </n-form-item-gi>

        <n-form-item-gi
          :span="24"
          :label="t('mcpserver.auth_keys')"
          path="authKeys"
        >
          <n-dynamic-input
            v-model:value="formModel.authKeys"
            :placeholder="t('mcpserver.add_auth_key')"
            :disabled="isDetailMode"
            :on-create="() => ''"
          />
        </n-form-item-gi>

        <n-form-item-gi :span="24" :label="t('mcpserver.tools')">
          <tool-config-list
            v-model:tools="formModel.tools"
            :mode="formModel.mode"
            :disabled="isDetailMode"
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NForm, NGrid, NFormItemGi, NInput, NDynamicInput } from 'naive-ui';
import NamespacePopSelect from '@/components/namespace/NamespacePopSelect.vue';
import ToolConfigList from './ToolConfigList.vue';
import { McpServerFormModel } from '@/types/mcpserver';
import { validateMcpServerParams } from '@/api/mcpserver';

interface Props {
  modelValue: McpServerFormModel;
}

interface Emits {
  (e: 'update:modelValue', value: McpServerFormModel): void;
  (e: 'validate', isValid: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const formRef = ref();

const formModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const isDetailMode = computed(() => formModel.value.mode === 'detail');

// 表单验证规则
const formRules = {
  name: {
    required: true,
    message: t('mcpserver.name_required'),
    trigger: 'blur'
  },
  namespace: {
    required: true,
    message: t('namespace.namespace_required'),
    trigger: 'blur'
  },
  authKeys: {
    required: true,
    validator: (rule: any, value: string[]) => {
      if (!value || value.length === 0) {
        return new Error(t('mcpserver.auth_keys_required'));
      }
      if (value.some((key) => !key || !key.trim())) {
        return new Error(t('mcpserver.auth_key_empty'));
      }
      return true;
    },
    trigger: 'blur'
  }
};

// 验证表单
const validateForm = async () => {
  if (!formRef.value) return false;

  try {
    await formRef.value.validate();

    // 自定义验证
    const customErrors = validateMcpServerParams(formModel.value);
    if (customErrors.length > 0) {
      return false;
    }

    emit('validate', true);
    return true;
  } catch (error) {
    emit('validate', false);
    return false;
  }
};

// 监听表单模型变化，触发验证
watch(
  formModel,
  () => {
    validateForm();
  },
  { deep: true }
);

// 暴露验证方法
defineExpose({
  validateForm
});
</script>

<style scoped>
.mcpserver-form {
  width: 100%;
}
</style>
