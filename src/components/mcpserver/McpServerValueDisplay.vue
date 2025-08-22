<template>
  <div class="mcpserver-value-display">
    <span>mcpserver-value-display</span>
    <!-- 版本信息头部 -->
    <div v-if="showVersionInfo" class="version-info">
      <n-space align="center" class="version-header">
        <n-tag :type="valueData?.isRelease ? 'success' : 'info'" size="medium">
          {{
            valueData?.isRelease
              ? t('mcpserver.release_version')
              : t('mcpserver.draft_version')
          }}
        </n-tag>
        <n-text depth="2" class="version-meta">
          {{ t('mcpserver.create_time') }}:
          {{ formatTime(valueData?.createTime || valueData?.updateTime) }}
        </n-text>
        <n-text depth="2" v-if="valueData?.opUser" class="version-meta">
          {{ t('mcpserver.operator') }}: {{ valueData.opUser }}
        </n-text>
        <n-text depth="2" v-if="valueData?.description" class="version-meta">
          {{ t('mcpserver.description') }}: {{ valueData.description }}
        </n-text>
      </n-space>
    </div>

    <!-- 查看模式 -->
    <div v-if="!editMode" class="view-mode">
      <div v-if="hasTools" class="tools-section">
        <n-space vertical :size="16">
          <div class="section-header">
            <n-space align="center">
              <n-icon size="20" color="#18a058">
                <construct-outline />
              </n-icon>
              <n-text strong
                >{{ t('mcpserver.tools') }} ({{ toolsCount }})</n-text
              >
            </n-space>
          </div>

          <div class="tools-grid">
            <mcp-tool-component
              v-for="tool in valueData?.tools || []"
              :key="tool.id || tool.toolName"
              :tool="tool"
              :disabled="true"
              :show-actions="false"
            />
          </div>
        </n-space>
      </div>

      <n-empty
        v-else
        :description="t('mcpserver.no_tools')"
        class="empty-tools"
      >
        <template #icon>
          <n-icon size="48" color="#d1d5db">
            <construct-outline />
          </n-icon>
        </template>
        <template #extra v-if="allowEdit">
          <n-button type="primary" @click="$emit('enter-edit-mode')">
            <template #icon>
              <n-icon><add-outline /></n-icon>
            </template>
            {{ t('mcpserver.add_tool') }}
          </n-button>
        </template>
      </n-empty>
    </div>

    <!-- 编辑模式 -->
    <div v-else class="edit-mode">
      <n-space vertical :size="16">
        <div class="edit-header">
          <n-space align="center">
            <n-icon size="20" color="#f59e0b">
              <create-outline />
            </n-icon>
            <n-text strong>{{ t('mcpserver.edit_mode') }}</n-text>
            <n-tag type="warning" size="small">{{
              t('mcpserver.editing')
            }}</n-tag>
          </n-space>
        </div>

        <n-button
          type="primary"
          dashed
          block
          @click="showToolSpecSelector = true"
          class="add-tool-button"
        >
          <template #icon>
            <n-icon><add-outline /></n-icon>
          </template>
          {{ t('mcpserver.add_tool') }}
        </n-button>

        <div v-if="editableTools.length > 0" class="tools-section">
          <div class="section-header">
            <n-space align="center">
              <n-icon size="18" color="#18a058">
                <construct-outline />
              </n-icon>
              <n-text
                >{{ t('mcpserver.configured_tools') }} ({{
                  editableTools.length
                }})</n-text
              >
            </n-space>
          </div>

          <div class="tools-grid">
            <mcp-tool-component
              v-for="(tool, index) in editableTools"
              :key="tool.id || `${tool.toolName}-${index}`"
              :tool="tool"
              :disabled="false"
              :show-actions="true"
              @edit="handleToolEdit"
              @delete="handleToolDelete"
              @update="handleToolUpdate"
            />
          </div>
        </div>

        <n-empty
          v-else
          :description="t('mcpserver.no_configured_tools')"
          class="empty-tools-edit"
        >
          <template #icon>
            <n-icon size="48" color="#d1d5db">
              <construct-outline />
            </n-icon>
          </template>
        </n-empty>
      </n-space>

      <!-- ToolSpec选择器 -->
      <tool-spec-selector
        v-model:visible="showToolSpecSelector"
        :selected-tool-specs="[]"
        :namespace="namespace"
        @select="handleToolSpecSelect"
        @cancel="showToolSpecSelector = false"
      />
    </div>

    <!-- 操作按钮区域 -->
    <div v-if="showActions" class="actions-area">
      <n-space justify="end">
        <n-button
          v-if="!valueData?.isRelease && allowPublish"
          type="primary"
          @click="$emit('publish-version')"
          :loading="publishLoading"
        >
          <template #icon>
            <n-icon><rocket-outline /></n-icon>
          </template>
          {{ t('mcpserver.publish_version') }}
        </n-button>

        <n-button
          v-if="valueData?.isRelease && allowRollback"
          type="warning"
          @click="handleRollback"
          :loading="rollbackLoading"
        >
          <template #icon>
            <n-icon><refresh-outline /></n-icon>
          </template>
          {{ t('mcpserver.rollback_version') }}
        </n-button>
      </n-space>
    </div>

    <!-- 确认对话框 -->
    <n-modal
      v-model:show="showConfirmDialog"
      preset="dialog"
      :title="confirmDialog.title"
      :content="confirmDialog.content"
      :positive-text="t('common.confirm')"
      :negative-text="t('common.cancel')"
      @positive-click="confirmDialog.onConfirm"
      @negative-click="confirmDialog.onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import { NSpace, NTag, NText, NIcon, NButton, NEmpty, NModal } from 'naive-ui';
import {
  ConstructOutline,
  AddOutline,
  CreateOutline,
  RocketOutline,
  RefreshOutline
} from '@vicons/ionicons5';
import McpToolComponent from './McpToolComponent.vue';
import ToolSpecSelector from './ToolSpecSelector.vue';
import {
  McpServerValue,
  McpServerValueDto,
  McpTool,
  ToolSpecInfo,
  McpToolEditModel
} from '@/types/mcpserver';

interface Props {
  valueData?: McpServerValue | McpServerValueDto | null;
  editMode?: boolean;
  allowEdit?: boolean;
  allowPublish?: boolean;
  allowRollback?: boolean;
  showVersionInfo?: boolean;
  showActions?: boolean;
  namespace?: string;
  loading?: boolean;
}

interface Emits {
  (e: 'update:tools', tools: McpTool[]): void;
  (e: 'tool-add', toolSpec: ToolSpecInfo): void;
  (e: 'tool-edit', toolId: number, tool: McpToolEditModel): void;
  (e: 'tool-delete', toolId: number): void;
  (e: 'publish-version'): void;
  (e: 'rollback-version'): void;
  (e: 'enter-edit-mode'): void;
}

const props = withDefaults(defineProps<Props>(), {
  editMode: false,
  allowEdit: true,
  allowPublish: true,
  allowRollback: true,
  showVersionInfo: false,
  showActions: true,
  loading: false
});

const emit = defineEmits<Emits>();

const { t } = useI18n();
const message = useMessage();

// 状态管理
const showToolSpecSelector = ref(false);
const showConfirmDialog = ref(false);
const publishLoading = ref(false);
const rollbackLoading = ref(false);
const editableTools = ref<McpTool[]>([]);

// 确认对话框配置
const confirmDialog = ref({
  title: '',
  content: '',
  onConfirm: () => {},
  onCancel: () => {
    showConfirmDialog.value = false;
  }
});

// 计算属性
const hasTools = computed(() => {
  const tools = props.valueData?.tools || [];
  return tools.length > 0;
});

const toolsCount = computed(() => {
  const tools = props.valueData?.tools || [];
  return tools.length;
});

console.log('props.valueData', JSON.stringify(props.valueData));

// 监听valueData变化，同步到editableTools
watch(
  () => props.valueData?.tools,
  (newTools) => {
    if (newTools && Array.isArray(newTools)) {
      editableTools.value = [...newTools];
    } else {
      editableTools.value = [];
    }
  },
  { immediate: true, deep: true }
);

// 监听editableTools变化，向上传递
watch(
  editableTools,
  (newTools) => {
    if (props.editMode) {
      emit('update:tools', [...newTools]);
    }
  },
  { deep: true }
);

// 工具方法
const formatTime = (timestamp?: number) => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleString('zh-CN');
};

// 工具配置验证
const validateToolConfiguration = (
  tool: McpTool
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 验证基本信息
  if (!tool.toolName?.trim()) {
    errors.push('工具名称不能为空');
  }

  if (!tool.toolKey?.namespace?.trim()) {
    errors.push('命名空间不能为空');
  }

  if (!tool.toolKey?.group?.trim()) {
    errors.push('工具组不能为空');
  }

  if (!tool.toolVersion || tool.toolVersion < 1) {
    errors.push('工具版本必须大于0');
  }

  // 验证路由规则
  if (tool.routeRule) {
    if (!tool.routeRule.protocol?.trim()) {
      errors.push('协议不能为空');
    }

    if (!tool.routeRule.method?.trim()) {
      errors.push('请求方法不能为空');
    }

    // HTTP/HTTPS协议需要URL
    if (
      ['HTTP', 'HTTPS'].includes(tool.routeRule.protocol) &&
      !tool.routeRule.url?.trim()
    ) {
      errors.push('HTTP/HTTPS协议需要指定URL');
    }

    // 验证服务信息
    if (!tool.routeRule.serviceNamespace?.trim()) {
      errors.push('服务命名空间不能为空');
    }

    if (!tool.routeRule.serviceGroup?.trim()) {
      errors.push('服务组不能为空');
    }

    if (!tool.routeRule.serviceName?.trim()) {
      errors.push('服务名不能为空');
    }
  } else {
    errors.push('路由规则不能为空');
  }

  // 验证工具规范
  if (tool.spec) {
    if (!tool.spec.name?.trim()) {
      errors.push('函数名称不能为空');
    }

    // 验证参数规范是否为有效的JSON Schema
    if (tool.spec.parameters) {
      try {
        // 基本的JSON Schema验证
        if (typeof tool.spec.parameters !== 'object') {
          errors.push('参数规范必须是有效的JSON对象');
        }
      } catch (error) {
        errors.push('参数规范格式错误');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// 验证所有工具配置
const validateAllTools = (): {
  isValid: boolean;
  errors: Record<number, string[]>;
} => {
  const allErrors: Record<number, string[]> = {};
  let hasErrors = false;

  editableTools.value.forEach((tool) => {
    const validation = validateToolConfiguration(tool);
    if (!validation.isValid) {
      allErrors[tool.id] = validation.errors;
      hasErrors = true;
    }
  });

  return {
    isValid: !hasErrors,
    errors: allErrors
  };
};

// 事件处理
const handleToolSpecSelect = (toolSpec: ToolSpecInfo) => {
  // 检查是否已存在相同的工具
  const existingTool = editableTools.value.find(
    (tool) =>
      tool.toolName === toolSpec.toolName &&
      tool.toolKey.namespace === toolSpec.namespace &&
      tool.toolKey.group === toolSpec.group
  );

  if (existingTool) {
    message.warning('该工具已存在，请勿重复添加');
    showToolSpecSelector.value = false;
    return;
  }

  // 创建新工具
  const newTool: McpTool = {
    id: Date.now(), // 临时ID
    toolName: toolSpec.toolName,
    toolKey: {
      namespace: toolSpec.namespace,
      group: toolSpec.group,
      toolName: toolSpec.toolName
    },
    toolVersion: toolSpec.version,
    spec: {
      name: toolSpec.function.name,
      description: toolSpec.function.description,
      parameters: toolSpec.function.parameters
    },
    routeRule: {
      protocol: 'HTTP',
      url: '',
      method: 'POST',
      additionHeaders: {},
      convertType: 'NONE',
      serviceNamespace: toolSpec.namespace,
      serviceGroup: toolSpec.group,
      serviceName: toolSpec.toolName
    }
  };

  // 验证新工具配置
  const validation = validateToolConfiguration(newTool);
  if (!validation.isValid) {
    message.warning(`工具配置不完整：${validation.errors.join(', ')}`);
  }

  editableTools.value.push(newTool);
  emit('tool-add', toolSpec);
  showToolSpecSelector.value = false;
  message.success('工具添加成功，请完善配置信息');
};

const handleToolEdit = (tool: McpTool) => {
  // 工具编辑由McpToolComponent内部处理
  console.log('Edit tool:', tool);
};

const handleToolUpdate = (updatedTool: McpTool) => {
  // 验证更新的工具配置
  const validation = validateToolConfiguration(updatedTool);
  if (!validation.isValid) {
    message.error(`工具配置验证失败：${validation.errors.join(', ')}`);
    return;
  }

  // 更新editableTools中的工具
  const index = editableTools.value.findIndex(
    (tool) => tool.id === updatedTool.id
  );
  if (index !== -1) {
    editableTools.value[index] = { ...updatedTool };
    message.success('工具配置更新成功');
  }

  // 将工具更新事件传递给父组件处理
  const editModel: McpToolEditModel = {
    id: updatedTool.id,
    toolName: updatedTool.toolName,
    toolKey: updatedTool.toolKey,
    toolVersion: updatedTool.toolVersion,
    routeRule: updatedTool.routeRule,
    spec: updatedTool.spec
  };

  emit('tool-edit', updatedTool.id, editModel);
};

const handleToolDelete = (tool: McpTool) => {
  // 从editableTools中移除工具
  const index = editableTools.value.findIndex((t) => t.id === tool.id);
  if (index !== -1) {
    editableTools.value.splice(index, 1);
    message.success('工具删除成功');
  }

  // 将工具删除事件传递给父组件处理
  emit('tool-delete', tool.id);
};

const handleRollback = () => {
  confirmDialog.value = {
    title: t('mcpserver.confirm_rollback_title'),
    content: t('mcpserver.confirm_rollback_content'),
    onConfirm: () => {
      rollbackLoading.value = true;
      emit('rollback-version');
      showConfirmDialog.value = false;
      // 注意：loading状态应该由父组件控制
      setTimeout(() => {
        rollbackLoading.value = false;
      }, 1000);
    },
    onCancel: () => {
      showConfirmDialog.value = false;
    }
  };
  showConfirmDialog.value = true;
};

// 暴露验证方法给父组件
const validateCurrentConfiguration = () => {
  return validateAllTools();
};

// 获取当前编辑的工具列表
const getCurrentTools = () => {
  return [...editableTools.value];
};

// 重置编辑状态
const resetEditState = () => {
  const tools = props.valueData?.tools || [];
  editableTools.value = [...tools];
};

// 暴露方法给父组件
defineExpose({
  validateCurrentConfiguration,
  getCurrentTools,
  resetEditState
});
</script>

<style scoped>
.mcpserver-value-display {
  width: 100%;
}

.version-info {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.version-header {
  flex-wrap: wrap;
}

.version-meta {
  font-size: 13px;
}

.view-mode,
.edit-mode {
  min-height: 120px;
}

.section-header {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.tools-section {
  margin-top: 16px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.empty-tools,
.empty-tools-edit {
  margin: 32px 0;
  padding: 24px;
}

.edit-header {
  padding: 8px 12px;
  background: #fef3c7;
  border-radius: 6px;
  border-left: 3px solid #f59e0b;
}

.add-tool-button {
  margin: 16px 0;
  height: 48px;
  border: 2px dashed #d1d5db;
  background: #fafafa;
  transition: all 0.3s ease;
}

.add-tool-button:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.actions-area {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .version-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 8px;
  }

  .version-meta {
    font-size: 12px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .version-info {
    background: #1f2937;
    border-left-color: #60a5fa;
  }

  .edit-header {
    background: #451a03;
    border-left-color: #f59e0b;
  }

  .add-tool-button {
    background: #374151;
    border-color: #4b5563;
  }

  .add-tool-button:hover {
    background: #1f2937;
    border-color: #60a5fa;
  }
}
</style>
