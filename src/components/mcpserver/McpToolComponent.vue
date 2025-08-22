<template>
  <div class="mcp-tool-component">
    <n-card 
      :class="['tool-card', { 'tool-card--editing': isEditing, 'tool-card--disabled': disabled }]"
      hoverable
      @click="handleCardClick"
    >
      <template #header>
        <n-space align="center">
          <n-icon size="18" color="#18a058">
            <construct-outline />
          </n-icon>
          <span class="tool-name">{{ tool.toolName }}</span>
          <n-tag size="small" type="info">{{ tool.toolKey.group }}</n-tag>
          <n-tag size="small" type="success">{{ tool.toolKey.namespace }}</n-tag>
          <n-tag size="small" type="warning">v{{ tool.toolVersion }}</n-tag>
        </n-space>
      </template>

      <template #header-extra v-if="!disabled && showActions">
        <n-space>
          <n-button size="small" quaternary @click.stop="handleEdit">
            <template #icon><n-icon><edit-outline /></n-icon></template>
          </n-button>
          <n-button size="small" quaternary type="error" @click.stop="handleDelete">
            <template #icon><n-icon><trash-outline /></n-icon></template>
          </n-button>
        </n-space>
      </template>

      <!-- 基本信息显示 -->
      <div class="tool-basic-info">
        <n-descriptions :column="2" size="small">
          <n-descriptions-item :label="t('mcpserver.tool_name')">
            {{ tool.toolName }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('mcpserver.tool_version')">
            v{{ tool.toolVersion }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('mcpserver.tool_group')">
            {{ tool.toolKey.group }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('namespace.namespace')">
            {{ tool.toolKey.namespace }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('mcpserver.route_rule')" :span="2">
            <route-rule-display :route-rule="tool.routeRule" />
          </n-descriptions-item>
        </n-descriptions>
      </div>
    </n-card>

    <!-- 详细信息弹窗 -->
    <n-modal v-model:show="showDetailModal" preset="card" style="width: 80%; max-width: 800px;">
      <template #header>
        <span>{{ t('mcpserver.tool_detail') }} - {{ tool.toolName }}</span>
      </template>
      
      <tool-detail-display :tool="tool" />
    </n-modal>

    <!-- 编辑弹窗 -->
    <n-modal v-model:show="showEditModal" preset="card" style="width: 80%; max-width: 600px;">
      <template #header>
        <span>{{ t('mcpserver.edit_tool') }} - {{ tool.toolName }}</span>
      </template>
      
      <tool-edit-form
        v-model="editingTool"
        @save="handleSave"
        @cancel="handleCancelEdit"
      />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NCard,
  NSpace,
  NIcon,
  NTag,
  NButton,
  NDescriptions,
  NDescriptionsItem,
  NModal
} from 'naive-ui';
import {
  ConstructOutline,
  CreateOutline as EditOutline,
  TrashOutline
} from '@vicons/ionicons5';
import RouteRuleDisplay from './RouteRuleDisplay.vue';
import ToolDetailDisplay from './ToolDetailDisplay.vue';
import ToolEditForm from './ToolEditForm.vue';
import { McpTool, McpToolEditModel } from '@/types/mcpserver';

interface Props {
  tool: McpTool;
  disabled?: boolean;
  showActions?: boolean;
}

interface Emits {
  (e: 'edit', tool: McpTool): void;
  (e: 'delete', tool: McpTool): void;
  (e: 'update', tool: McpTool): void;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  showActions: true
});

const emit = defineEmits<Emits>();

const { t } = useI18n();

// 状态管理
const showDetailModal = ref(false);
const showEditModal = ref(false);
const isEditing = ref(false);
const editingTool = ref<McpToolEditModel>({
  id: props.tool.id,
  toolName: props.tool.toolName,
  toolKey: { ...props.tool.toolKey },
  toolVersion: props.tool.toolVersion,
  routeRule: props.tool.routeRule ? { ...props.tool.routeRule } : undefined,
  spec: props.tool.spec ? { ...props.tool.spec } : undefined
});

// 计算属性
const toolDisplayName = computed(() => {
  return `${props.tool.toolKey.group}/${props.tool.toolName}`;
});

// 事件处理
const handleCardClick = () => {
  if (!props.disabled) {
    showDetailModal.value = true;
  }
};

const handleEdit = () => {
  if (!props.disabled) {
    // 重置编辑数据
    editingTool.value = {
      id: props.tool.id,
      toolName: props.tool.toolName,
      toolKey: { ...props.tool.toolKey },
      toolVersion: props.tool.toolVersion,
      routeRule: props.tool.routeRule ? { ...props.tool.routeRule } : undefined,
      spec: props.tool.spec ? { ...props.tool.spec } : undefined
    };
    
    showEditModal.value = true;
    isEditing.value = true;
  }
};

const handleDelete = () => {
  if (!props.disabled) {
    emit('delete', props.tool);
  }
};

const handleSave = (updatedTool: McpToolEditModel) => {
  // 将编辑模型转换为 McpTool
  const savedTool: McpTool = {
    id: updatedTool.id || props.tool.id,
    toolName: updatedTool.toolName,
    toolKey: updatedTool.toolKey,
    toolVersion: updatedTool.toolVersion,
    routeRule: updatedTool.routeRule || props.tool.routeRule,
    spec: updatedTool.spec || props.tool.spec
  };
  
  emit('update', savedTool);
  showEditModal.value = false;
  isEditing.value = false;
};

const handleCancelEdit = () => {
  showEditModal.value = false;
  isEditing.value = false;
};
</script>

<style scoped>
.mcp-tool-component {
  width: 100%;
}

.tool-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e5e7eb;
}

.tool-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.tool-card--editing {
  border-color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.tool-card--disabled {
  cursor: default;
  opacity: 0.8;
}

.tool-card--disabled:hover {
  border-color: #e5e7eb;
  box-shadow: none;
}

.tool-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.tool-basic-info {
  margin-top: 8px;
}

.tool-basic-info :deep(.n-descriptions-item-label) {
  font-weight: 500;
  color: #6b7280;
}

.tool-basic-info :deep(.n-descriptions-item-content) {
  color: #374151;
}
</style>