<template>
  <div class="mcp-server-detail-component">
    <n-card
      :title="t('mcpserverdetailcomponent.server_info')"
      :bordered="false"
    >
      <template #header-extra>
        <n-space>
          <n-tag
            :type="serverData.currentValue?.isRelease ? 'success' : 'warning'"
            size="small"
          >
            {{
              serverData.currentValue?.isRelease
                ? t('mcpserverdetailcomponent.published')
                : t('mcpserverdetailcomponent.unpublished')
            }}
          </n-tag>
          <n-tag v-if="mode !== 'detail'" type="info" size="small">
            {{ mode === 'update' ? '编辑模式' : '创建模式' }}
          </n-tag>
        </n-space>
      </template>

      <!-- 基础信息区域 -->
      <n-form
        v-if="mode !== 'detail'"
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item :label="t('mcpserverdetailcomponent.id')" path="id">
          <n-input :value="formData.id.toString()" disabled />
        </n-form-item>

        <n-form-item
          :label="t('mcpserverdetailcomponent.namespace')"
          path="namespace"
        >
          <n-input
            v-model:value="formData.namespace"
            :disabled="mode === 'update' || mode === 'create'"
          />
        </n-form-item>

        <n-form-item :label="t('mcpserverdetailcomponent.name')" path="name">
          <n-input
            v-model:value="formData.name"
            placeholder="请输入服务器名称"
          />
        </n-form-item>

        <n-form-item
          :label="t('mcpserverdetailcomponent.description')"
          path="description"
        >
          <n-input
            v-model:value="formData.description"
            type="textarea"
            placeholder="请输入服务器描述"
            :rows="3"
          />
        </n-form-item>

        <n-form-item
          :label="t('mcpserverdetailcomponent.auth_keys')"
          path="authKeys"
        >
          <n-dynamic-tags v-model:value="formData.authKeys" />
        </n-form-item>
      </n-form>

      <n-descriptions v-else :column="2" label-placement="left">
        <n-descriptions-item :label="t('mcpserverdetailcomponent.id')">
          <n-text>{{ serverData.id }}</n-text>
        </n-descriptions-item>

        <n-descriptions-item :label="t('mcpserverdetailcomponent.namespace')">
          <n-text>{{ serverData.namespace }}</n-text>
        </n-descriptions-item>

        <n-descriptions-item :label="t('mcpserverdetailcomponent.name')">
          <n-text>{{ serverData.name }}</n-text>
        </n-descriptions-item>

        <n-descriptions-item :label="t('mcpserverdetailcomponent.description')">
          <n-text>{{ serverData.description }}</n-text>
        </n-descriptions-item>

        <n-descriptions-item :label="t('mcpserverdetailcomponent.auth_keys')">
          <n-space :size="4">
            <n-tag
              v-for="(key, index) in serverData.authKeys"
              :key="index"
              size="small"
              type="info"
            >
              {{ key }}
            </n-tag>
          </n-space>
        </n-descriptions-item>

        <n-descriptions-item :label="t('mcpserverdetailcomponent.create_time')">
          <n-text>{{ formatTime(serverData.createTime) }}</n-text>
        </n-descriptions-item>

        <n-descriptions-item
          :label="t('mcpserverdetailcomponent.last_modified')"
        >
          <n-text>{{ formatTime(serverData.lastModifiedMillis) }}</n-text>
        </n-descriptions-item>
      </n-descriptions>

      <!-- 当前服务工具区域 -->
      <div v-if="serverData.currentValue" class="current-tools-section">
        <n-divider />
        <h3 class="tools-title">
          {{ t('mcpserverdetailcomponent.current_tools') }}
        </h3>
        <mcp-server-value-component
          :server-value="serverData.currentValue"
          :mode="mode === 'detail' ? 'detail' : 'update'"
          @update:value="handleServerValueUpdate"
          @tool-change="handleToolChange"
          @tool-save="handleToolSave"
          @tool-delete="handleToolDelete"
          @tool-add="handleToolAdd"
        />
      </div>

      <!-- 操作按钮区域 -->
      <div v-if="showActions" class="action-buttons">
        <n-divider />
        <n-space justify="end">
          <n-button v-if="mode !== 'detail'" @click="handleCancel">
            {{ t('common.cancel') }}
          </n-button>
          <n-button
            v-if="mode === 'update'"
            type="primary"
            :loading="loading"
            @click="handleSave"
          >
            {{ t('common.save') }}
          </n-button>
          <n-button
            v-if="mode === 'create'"
            type="primary"
            :loading="loading"
            @click="handleCreate"
          >
            {{ t('common.create') }}
          </n-button>
        </n-space>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NText,
  NTag,
  NSpace,
  NDivider,
  NForm,
  NFormItem,
  NInput,
  NDynamicTags,
  NButton,
  type FormInst,
  type FormRules
} from 'naive-ui';
import McpServerValueComponent from '@/components/mcpserver/McpServerValueComponent.vue';
import { McpServerDto, McpServerParams } from '@/types/mcpserver';
import { mcpServerApi } from '@/api/mcpserver';
import { namespaceStore } from '@/data/namespace';

const { t } = useI18n();

interface Props {
  serverData: McpServerDto;
  mode?: 'detail' | 'update' | 'create';
  showActions?: boolean;
}

interface Emits {
  (e: 'update:serverData', data: McpServerDto): void;
  (e: 'save:success', data: McpServerDto): void;
  (e: 'create:success', data: McpServerDto): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'detail',
  showActions: true
});

const emit = defineEmits<Emits>();

const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const formData = ref({
  id: 0,
  namespace: '',
  name: '',
  description: '',
  authKeys: [] as string[]
});

// 表单验证规则
const formRules: FormRules = {
  name: [
    {
      required: true,
      message: t('validation.required', { field: '服务器名称' })
    }
  ],
  namespace: [
    { required: true, message: t('validation.required', { field: '命名空间' }) }
  ],
  description: [
    { required: true, message: t('validation.required', { field: '描述' }) }
  ],
  authKeys: [
    {
      required: true,
      type: 'array',
      min: 1,
      message: t('validation.required', { field: '认证密钥' })
    }
  ]
};

// 初始化表单数据
const initFormData = () => {
  if (props.mode === 'create') {
    formData.value = {
      id: 0,
      namespace: namespaceStore.current.value.namespaceId,
      name: '',
      description: '',
      authKeys: []
    };
  } else {
    formData.value = {
      id: props.serverData.id,
      namespace: props.serverData.namespace,
      name: props.serverData.name,
      description: props.serverData.description,
      authKeys: [...props.serverData.authKeys]
    };
  }
};

// 监听模式变化
watch(() => props.mode, initFormData, { immediate: true });

// 监听serverData变化
watch(() => props.serverData, initFormData, { deep: true });

// 将McpServerDto转换为McpServerParams
const convertToParams = (): McpServerParams => {
  // 转换tools从McpTool到McpSimpleToolParams
  const tools = (props.serverData.currentValue?.tools || []).map((tool) => ({
    id: tool.id,
    toolName: tool.toolName,
    namespace: tool.toolKey.namespace,
    group: tool.toolKey.group,
    toolVersion: tool.toolVersion,
    routeRule: tool.routeRule
  }));

  const params: McpServerParams = {
    id: props.mode === 'create' ? undefined : formData.value.id,
    namespace: formData.value.namespace,
    name: formData.value.name,
    description: formData.value.description,
    authKeys: formData.value.authKeys,
    tools: tools
  };
  return params;
};

// 格式化时间
const formatTime = (timestamp: number) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// 处理服务器值更新
const handleServerValueUpdate = (value: any) => {
  // 确保只更新 currentValue，保留 McpServerDto 中的其他信息
  const updatedData = {
    ...props.serverData,
    currentValue: {
      ...props.serverData.currentValue,
      ...value
    }
  };
  emit('update:serverData', updatedData);
};

// 处理工具变更
const handleToolChange = (toolIndex: number, tool: any) => {
  console.log('工具变更:', toolIndex, tool);
  // 工具变更时自动更新服务器数据
  if (props.serverData.currentValue) {
    const updatedTools = [...props.serverData.currentValue.tools];
    updatedTools[toolIndex] = tool;

    const updatedValue = {
      ...props.serverData.currentValue,
      tools: updatedTools
    };

    handleServerValueUpdate(updatedValue);
  }
};

// 处理工具保存
const handleToolSave = (toolIndex: number, params: any) => {
  console.log('工具保存:', toolIndex, params);
  // 工具保存时的逻辑可以在这里处理
};

// 处理工具删除
const handleToolDelete = (toolIndex: number) => {
  console.log('工具删除:', toolIndex);
  // 工具删除时自动更新服务器数据
  if (props.serverData.currentValue) {
    const updatedTools = props.serverData.currentValue.tools.filter(
      (_, i) => i !== toolIndex
    );

    const updatedValue = {
      ...props.serverData.currentValue,
      tools: updatedTools
    };

    handleServerValueUpdate(updatedValue);
  }
};

// 处理工具添加
const handleToolAdd = (params: any) => {
  console.log('工具添加:', params);
  // 工具添加时确保只更新 tools 数组，保留 currentValue 的其他属性
  if (props.serverData.currentValue) {
    // 从 params 中创建新工具对象
    const newTool: any = {
      id: 0, // 临时ID，实际保存时由后端分配
      toolName: params.toolName || '',
      toolKey: {
        namespace: params.namespace || '',
        group: params.group || '',
        toolName: params.toolName || ''
      },
      toolVersion: 0,
      spec: {
        name: '',
        description: '',
        parameters: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      routeRule: params.routeRule || {
        protocol: 'HTTP',
        url: '',
        method: 'GET',
        additionHeaders: {},
        convertType: 'NONE',
        serviceNamespace: '',
        serviceGroup: '',
        serviceName: ''
      }
    };

    const updatedValue = {
      ...props.serverData.currentValue,
      tools: [...props.serverData.currentValue.tools, newTool]
    };

    handleServerValueUpdate(updatedValue);
  }
};

// 处理保存
const handleSave = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    const params = convertToParams();
    const success = await mcpServerApi.updateMcpServerWithErrorHandling(params);

    if (success) {
      // 获取最新数据
      const updatedServer = await mcpServerApi.getMcpServerWithErrorHandling(
        formData.value.id
      );
      if (updatedServer) {
        emit('update:serverData', updatedServer);
        emit('save:success', updatedServer);
      }
    }
  } catch (error) {
    console.error('保存失败:', error);
  } finally {
    loading.value = false;
  }
};

// 处理创建
const handleCreate = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    const params = convertToParams();
    const newId = await mcpServerApi.addMcpServerWithErrorHandling(params);

    if (newId) {
      // 获取新创建的服务器数据
      const newServer = await mcpServerApi.getMcpServerWithErrorHandling(newId);
      if (newServer) {
        emit('update:serverData', newServer);
        emit('create:success', newServer);
      }
    }
  } catch (error) {
    console.error('创建失败:', error);
  } finally {
    loading.value = false;
  }
};

// 处理取消
const handleCancel = () => {
  initFormData();
  emit('cancel');
};

onMounted(() => {
  initFormData();
});

// 暴露方法给父组件
defineExpose({
  handleSave,
  handleCreate,
  handleCancel
});
</script>

<style scoped>
.mcp-server-detail-component {
  width: 100%;
}

.current-tools-section {
  margin-top: 16px;
}

.tools-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--n-text-color);
}

.action-buttons {
  margin-top: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mcp-server-detail-component {
    padding: 8px;
  }
}
</style>
