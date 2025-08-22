<template>
  <div class="tool-edit-form">
    <n-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      label-placement="left"
      label-width="100"
      require-mark-placement="right-hanging"
    >
      <n-space vertical size="large">
        <!-- 基本信息 -->
        <n-card title="基本信息" size="small">
          <n-grid :cols="24" :x-gap="12">
            <n-form-item-gi
              :span="12"
              label="工具名称"
              path="toolName"
              :validation-status="
                validationErrors.toolName ? 'error' : undefined
              "
            >
              <n-input
                v-model:value="formModel.toolName"
                placeholder="请输入工具名称"
                :status="validationErrors.toolName ? 'error' : undefined"
              />
              <template #feedback v-if="validationErrors.toolName">
                <n-text type="error" depth="3" style="font-size: 12px">
                  {{ validationErrors.toolName }}
                </n-text>
              </template>
            </n-form-item-gi>

            <n-form-item-gi
              :span="12"
              label="工具版本"
              path="toolVersion"
              :validation-status="
                validationErrors.toolVersion ? 'error' : undefined
              "
            >
              <n-input-number
                v-model:value="formModel.toolVersion"
                :min="1"
                placeholder="请输入版本号"
                :status="validationErrors.toolVersion ? 'error' : undefined"
              />
              <template #feedback v-if="validationErrors.toolVersion">
                <n-text type="error" depth="3" style="font-size: 12px">
                  {{ validationErrors.toolVersion }}
                </n-text>
              </template>
            </n-form-item-gi>

            <n-form-item-gi
              :span="12"
              label="命名空间"
              path="toolKey.namespace"
              :validation-status="
                validationErrors.namespace ? 'error' : undefined
              "
            >
              <n-input
                v-model:value="formModel.toolKey.namespace"
                placeholder="请输入命名空间"
                :status="validationErrors.namespace ? 'error' : undefined"
              />
              <template #feedback v-if="validationErrors.namespace">
                <n-text type="error" depth="3" style="font-size: 12px">
                  {{ validationErrors.namespace }}
                </n-text>
              </template>
            </n-form-item-gi>

            <n-form-item-gi
              :span="12"
              label="工具组"
              path="toolKey.group"
              :validation-status="validationErrors.group ? 'error' : undefined"
            >
              <n-input
                v-model:value="formModel.toolKey.group"
                placeholder="请输入工具组"
                :status="validationErrors.group ? 'error' : undefined"
              />
              <template #feedback v-if="validationErrors.group">
                <n-text type="error" depth="3" style="font-size: 12px">
                  {{ validationErrors.group }}
                </n-text>
              </template>
            </n-form-item-gi>
          </n-grid>
        </n-card>

        <!-- 路由规则 -->
        <n-card title="路由规则" size="small">
          <n-grid :cols="24" :x-gap="12">
            <n-form-item-gi
              :span="8"
              label="协议"
              path="routeRule.protocol"
              :validation-status="
                validationErrors.protocol ? 'error' : undefined
              "
            >
              <n-select
                v-model:value="formModel.routeRule!.protocol"
                :options="protocolOptions"
                placeholder="选择协议"
                :status="validationErrors.protocol ? 'error' : undefined"
              />
              <template #feedback v-if="validationErrors.protocol">
                <n-text type="error" depth="3" style="font-size: 12px">
                  {{ validationErrors.protocol }}
                </n-text>
              </template>
            </n-form-item-gi>

            <n-form-item-gi
              :span="8"
              label="方法"
              path="routeRule.method"
              :validation-status="validationErrors.method ? 'error' : undefined"
            >
              <n-select
                v-model:value="formModel.routeRule!.method"
                :options="methodOptions"
                placeholder="选择方法"
                :status="validationErrors.method ? 'error' : undefined"
              />
              <template #feedback v-if="validationErrors.method">
                <n-text type="error" depth="3" style="font-size: 12px">
                  {{ validationErrors.method }}
                </n-text>
              </template>
            </n-form-item-gi>

            <n-form-item-gi
              :span="8"
              label="转换类型"
              path="routeRule.convertType"
            >
              <n-select
                v-model:value="formModel.routeRule!.convertType"
                :options="convertTypeOptions"
                placeholder="选择转换类型"
              />
            </n-form-item-gi>

            <n-form-item-gi
              :span="24"
              label="URL"
              path="routeRule.url"
              :validation-status="validationErrors.url ? 'error' : undefined"
            >
              <n-input
                v-model:value="formModel.routeRule!.url"
                placeholder="请输入URL"
                :status="validationErrors.url ? 'error' : undefined"
              />
              <template #feedback v-if="validationErrors.url">
                <n-text type="error" depth="3" style="font-size: 12px">
                  {{ validationErrors.url }}
                </n-text>
              </template>
            </n-form-item-gi>

            <n-form-item-gi
              :span="8"
              label="服务命名空间"
              path="routeRule.serviceNamespace"
            >
              <n-input
                v-model:value="formModel.routeRule!.serviceNamespace"
                placeholder="请输入服务命名空间"
              />
            </n-form-item-gi>

            <n-form-item-gi
              :span="8"
              label="服务组"
              path="routeRule.serviceGroup"
            >
              <n-input
                v-model:value="formModel.routeRule!.serviceGroup"
                placeholder="请输入服务组"
              />
            </n-form-item-gi>

            <n-form-item-gi
              :span="8"
              label="服务名"
              path="routeRule.serviceName"
            >
              <n-input
                v-model:value="formModel.routeRule!.serviceName"
                placeholder="请输入服务名"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="24" label="额外头部">
              <n-dynamic-input
                v-model:value="headersArray"
                :on-create="createHeaderItem"
              >
                <template #default="{ value }">
                  <n-space>
                    <n-input
                      v-model:value="value.key"
                      placeholder="头部名称"
                      style="width: 200px"
                    />
                    <n-input
                      v-model:value="value.value"
                      placeholder="头部值"
                      style="width: 200px"
                    />
                  </n-space>
                </template>
              </n-dynamic-input>
            </n-form-item-gi>
          </n-grid>
        </n-card>

        <!-- 工具规范 -->
        <n-card title="工具规范" size="small">
          <n-grid :cols="24" :x-gap="12">
            <n-form-item-gi
              :span="12"
              label="函数名称"
              path="spec.name"
              :validation-status="
                validationErrors.functionName ? 'error' : undefined
              "
            >
              <n-input
                v-model:value="formModel.spec!.name"
                placeholder="请输入函数名称"
                :status="validationErrors.functionName ? 'error' : undefined"
              />
              <template #feedback v-if="validationErrors.functionName">
                <n-text type="error" depth="3" style="font-size: 12px">
                  {{ validationErrors.functionName }}
                </n-text>
              </template>
            </n-form-item-gi>

            <n-form-item-gi :span="12" label="函数描述" path="spec.description">
              <n-input
                v-model:value="formModel.spec!.description"
                placeholder="请输入函数描述"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="24" label="参数规范">
              <n-input
                v-model:value="parametersJson"
                type="textarea"
                :rows="6"
                placeholder="请输入JSON格式的参数规范"
                @blur="validateParametersJson"
              />
              <n-text
                v-if="parametersError"
                type="error"
                depth="3"
                style="font-size: 12px"
              >
                {{ parametersError }}
              </n-text>
            </n-form-item-gi>
          </n-grid>
        </n-card>
      </n-space>
    </n-form>

    <!-- 操作按钮 -->
    <div class="form-actions">
      <n-space justify="end">
        <n-button @click="handleCancel">取消</n-button>
        <n-button
          type="primary"
          @click="handleSave"
          :loading="saving"
          :disabled="!isFormValid && Object.keys(validationErrors).length > 0"
        >
          保存
        </n-button>
      </n-space>
    </div>

    <!-- 验证错误汇总 -->
    <div
      v-if="Object.keys(validationErrors).length > 0"
      class="validation-summary"
    >
      <n-alert type="error" title="表单验证错误" :show-icon="false">
        <ul class="error-list">
          <li v-for="(error, field) in validationErrors" :key="field">
            {{ error }}
          </li>
        </ul>
      </n-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import {
  NForm,
  NGrid,
  NFormItemGi,
  NInput,
  NInputNumber,
  NSelect,
  NDynamicInput,
  NSpace,
  NButton,
  NCard,
  NText,
  NAlert,
  useMessage
} from 'naive-ui';
import {
  McpToolEditModel,
  ToolRouteRule,
  ToolFunctionValue,
  JsonSchema
} from '@/types/mcpserver';

interface Props {
  modelValue: McpToolEditModel;
}

interface Emits {
  (e: 'update:modelValue', value: McpToolEditModel): void;
  (e: 'save', value: McpToolEditModel): void;
  (e: 'cancel'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const message = useMessage();
const formRef = ref();
const saving = ref(false);
const parametersError = ref('');

// 表单模型
const formModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// 头部数组（用于动态输入）
const headersArray = ref<Array<{ key: string; value: string }>>([]);

// 参数JSON字符串
const parametersJson = ref('{}');

// 选项数据
const protocolOptions = [
  { label: 'HTTP', value: 'HTTP' },
  { label: 'HTTPS', value: 'HTTPS' },
  { label: 'gRPC', value: 'GRPC' },
  { label: 'TCP', value: 'TCP' }
];

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' }
];

const convertTypeOptions = [
  { label: '无转换', value: 'NONE' },
  { label: '表单转JSON', value: 'FORM_TO_JSON' },
  { label: '自定义', value: 'CUSTOM' }
];

// 表单验证规则
const formRules = {
  toolName: {
    required: true,
    message: '工具名称不能为空',
    trigger: 'blur'
  },
  toolVersion: {
    required: true,
    type: 'number' as const,
    message: '工具版本必须是数字',
    trigger: 'blur'
  },
  'toolKey.namespace': {
    required: true,
    message: '命名空间不能为空',
    trigger: 'blur'
  },
  'toolKey.group': {
    required: true,
    message: '工具组不能为空',
    trigger: 'blur'
  },
  'routeRule.protocol': {
    required: true,
    message: '协议不能为空',
    trigger: 'change'
  },
  'routeRule.method': {
    required: true,
    message: '方法不能为空',
    trigger: 'change'
  },
  'routeRule.url': {
    required: true,
    message: 'URL不能为空',
    trigger: 'blur'
  },
  'spec.name': {
    required: true,
    message: '函数名称不能为空',
    trigger: 'blur'
  }
};

// 初始化数据
const initializeData = () => {
  // 初始化路由规则
  if (!formModel.value.routeRule) {
    formModel.value.routeRule = {
      protocol: 'HTTP',
      url: '',
      method: 'POST',
      additionHeaders: {},
      convertType: 'NONE',
      serviceNamespace: '',
      serviceGroup: '',
      serviceName: ''
    };
  }

  // 初始化工具规范
  if (!formModel.value.spec) {
    formModel.value.spec = {
      name: formModel.value.toolName || '',
      description: '',
      parameters: {}
    };
  }

  // 初始化头部数组
  if (formModel.value.routeRule?.additionHeaders) {
    headersArray.value = Object.entries(
      formModel.value.routeRule.additionHeaders
    ).map(([key, value]) => ({ key, value: String(value) }));
  }

  // 初始化参数JSON
  if (formModel.value.spec?.parameters) {
    parametersJson.value = JSON.stringify(
      formModel.value.spec.parameters,
      null,
      2
    );
  }

  // 确保toolKey存在
  if (!formModel.value.toolKey) {
    formModel.value.toolKey = {
      namespace: '',
      group: '',
      toolName: formModel.value.toolName || ''
    };
  }

  // 同步toolName到toolKey
  if (formModel.value.toolName) {
    formModel.value.toolKey.toolName = formModel.value.toolName;
  }
};

// 创建头部项
const createHeaderItem = () => {
  return { key: '', value: '' };
};

// 更新头部
const updateHeaders = (headers: Array<{ key: string; value: string }>) => {
  const headersObj: Record<string, string> = {};
  headers.forEach(({ key, value }) => {
    if (key && value) {
      headersObj[key] = value;
    }
  });

  if (formModel.value.routeRule) {
    formModel.value.routeRule.additionHeaders = headersObj;
  }
};

// 验证参数JSON
const validateParametersJson = () => {
  parametersError.value = '';

  if (!parametersJson.value.trim()) {
    parametersJson.value = '{}';
    return;
  }

  try {
    const parsed = JSON.parse(parametersJson.value);
    if (formModel.value.spec) {
      formModel.value.spec.parameters = parsed;
    }
  } catch (error) {
    parametersError.value = 'JSON格式错误，请检查语法';
  }
};

// 实时验证状态
const validationErrors = ref<Record<string, string>>({});
const isFormValid = ref(false);

// 实时验证函数
const validateField = (field: string, value: any) => {
  const errors = { ...validationErrors.value };

  switch (field) {
    case 'toolName':
      if (!value?.trim()) {
        errors.toolName = '工具名称不能为空';
      } else {
        delete errors.toolName;
      }
      break;
    case 'toolVersion':
      if (!value || value < 1) {
        errors.toolVersion = '工具版本必须大于0';
      } else {
        delete errors.toolVersion;
      }
      break;
    case 'namespace':
      if (!value?.trim()) {
        errors.namespace = '命名空间不能为空';
      } else {
        delete errors.namespace;
      }
      break;
    case 'group':
      if (!value?.trim()) {
        errors.group = '工具组不能为空';
      } else {
        delete errors.group;
      }
      break;
    case 'protocol':
      if (!value?.trim()) {
        errors.protocol = '协议不能为空';
      } else {
        delete errors.protocol;
      }
      break;
    case 'method':
      if (!value?.trim()) {
        errors.method = '请求方法不能为空';
      } else {
        delete errors.method;
      }
      break;
    case 'url':
      if (
        formModel.value.routeRule?.protocol &&
        ['HTTP', 'HTTPS'].includes(formModel.value.routeRule.protocol) &&
        !value?.trim()
      ) {
        errors.url = 'HTTP/HTTPS协议需要指定URL';
      } else {
        delete errors.url;
      }
      break;
    case 'functionName':
      if (!value?.trim()) {
        errors.functionName = '函数名称不能为空';
      } else {
        delete errors.functionName;
      }
      break;
  }

  validationErrors.value = errors;
  isFormValid.value = Object.keys(errors).length === 0;
};

// 处理保存
const handleSave = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    // 验证参数JSON
    validateParametersJson();
    if (parametersError.value) {
      message.error('参数规范格式错误，请检查');
      return;
    }

    // 执行完整的表单验证
    validateField('toolName', formModel.value.toolName);
    validateField('toolVersion', formModel.value.toolVersion);
    validateField('namespace', formModel.value.toolKey?.namespace);
    validateField('group', formModel.value.toolKey?.group);
    validateField('protocol', formModel.value.routeRule?.protocol);
    validateField('method', formModel.value.routeRule?.method);
    validateField('url', formModel.value.routeRule?.url);
    validateField('functionName', formModel.value.spec?.name);

    if (!isFormValid.value) {
      message.error('表单验证失败，请检查标红的字段');
      return;
    }

    saving.value = true;

    // 同步toolName到toolKey
    if (formModel.value.toolKey) {
      formModel.value.toolKey.toolName = formModel.value.toolName;
    }

    emit('save', formModel.value);
  } catch (error) {
    message.error('表单验证失败，请检查输入');
  } finally {
    saving.value = false;
  }
};

// 处理取消
const handleCancel = () => {
  emit('cancel');
};

// 监听toolName变化，同步到toolKey和spec，并进行实时验证
watch(
  () => formModel.value.toolName,
  (newName) => {
    if (formModel.value.toolKey) {
      formModel.value.toolKey.toolName = newName;
    }
    if (formModel.value.spec && !formModel.value.spec.name) {
      formModel.value.spec.name = newName;
    }
    validateField('toolName', newName);
  }
);

// 监听工具版本变化
watch(
  () => formModel.value.toolVersion,
  (newVersion) => {
    validateField('toolVersion', newVersion);
  }
);

// 监听命名空间变化
watch(
  () => formModel.value.toolKey?.namespace,
  (newNamespace) => {
    validateField('namespace', newNamespace);
  }
);

// 监听工具组变化
watch(
  () => formModel.value.toolKey?.group,
  (newGroup) => {
    validateField('group', newGroup);
  }
);

// 监听协议变化
watch(
  () => formModel.value.routeRule?.protocol,
  (newProtocol) => {
    validateField('protocol', newProtocol);
    // 协议变化时重新验证URL
    validateField('url', formModel.value.routeRule?.url);
  }
);

// 监听请求方法变化
watch(
  () => formModel.value.routeRule?.method,
  (newMethod) => {
    validateField('method', newMethod);
  }
);

// 监听URL变化
watch(
  () => formModel.value.routeRule?.url,
  (newUrl) => {
    validateField('url', newUrl);
  }
);

// 监听函数名称变化
watch(
  () => formModel.value.spec?.name,
  (newName) => {
    validateField('functionName', newName);
  }
);

// 监听头部数组变化
watch(headersArray, updateHeaders, { deep: true });

// 组件挂载时初始化数据
onMounted(() => {
  initializeData();

  // 初始化验证状态
  validateField('toolName', formModel.value.toolName);
  validateField('toolVersion', formModel.value.toolVersion);
  validateField('namespace', formModel.value.toolKey?.namespace);
  validateField('group', formModel.value.toolKey?.group);
  validateField('protocol', formModel.value.routeRule?.protocol);
  validateField('method', formModel.value.routeRule?.method);
  validateField('url', formModel.value.routeRule?.url);
  validateField('functionName', formModel.value.spec?.name);
});
</script>

<style scoped>
.tool-edit-form {
  width: 100%;
}

.form-actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.validation-summary {
  margin-top: 16px;
}

.error-list {
  margin: 0;
  padding-left: 16px;
}

.error-list li {
  margin-bottom: 4px;
  font-size: 13px;
}
</style>
