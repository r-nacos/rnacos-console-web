<template>
  <div class="tool-config-list">
    <n-space vertical>
      <n-button
        v-if="!disabled"
        type="primary"
        dashed
        @click="showToolSpecSelector = true"
      >
        <template #icon>
          <n-icon><add-outline /></n-icon>
        </template>
        {{ t('mcpserver.add_tool') }}
      </n-button>

      <div v-if="tools.length === 0" class="empty-state">
        <n-empty :description="t('mcpserver.no_tools')" />
      </div>

      <div v-else class="tools-container">
        <n-card
          v-for="(tool, index) in tools"
          :key="index"
          :class="[
            'tool-card',
            { editing: editingIndex === index, error: hasError(index) }
          ]"
        >
          <template #header>
            <n-space align="center">
              <span>{{ tool.toolName }}</span>
              <n-tag size="small">{{ tool.group }}</n-tag>
              <n-tag size="small" type="info">{{ tool.namespace }}</n-tag>
            </n-space>
          </template>

          <template #header-extra>
            <n-space v-if="!disabled">
              <n-button
                v-if="editingIndex !== index"
                size="small"
                quaternary
                @click="startEdit(index)"
              >
                <template #icon>
                  <n-icon><edit-outline /></n-icon>
                </template>
              </n-button>

              <n-button
                v-if="editingIndex === index"
                size="small"
                quaternary
                type="success"
                @click="saveEdit(index)"
              >
                <template #icon>
                  <n-icon><checkmark-outline /></n-icon>
                </template>
              </n-button>

              <n-button
                v-if="editingIndex === index"
                size="small"
                quaternary
                type="warning"
                @click="cancelEdit(index)"
              >
                <template #icon>
                  <n-icon><close-outline /></n-icon>
                </template>
              </n-button>

              <n-button
                size="small"
                quaternary
                type="error"
                @click="removeTool(index)"
              >
                <template #icon>
                  <n-icon><trash-outline /></n-icon>
                </template>
              </n-button>
            </n-space>
          </template>

          <div v-if="editingIndex === index" class="tool-edit-form">
            <n-form
              :model="editingTool"
              label-placement="left"
              label-width="80"
            >
              <n-form-item :label="t('mcpserver.tool_name')">
                <n-input v-model:value="editingTool.toolName" />
              </n-form-item>

              <n-form-item :label="t('mcpserver.tool_group')">
                <n-input v-model:value="editingTool.group" />
              </n-form-item>

              <n-form-item :label="t('namespace.namespace')">
                <n-input v-model:value="editingTool.namespace" />
              </n-form-item>

              <n-form-item :label="t('mcpserver.tool_version')">
                <n-input-number
                  v-model:value="editingTool.toolVersion"
                  :min="1"
                />
              </n-form-item>

              <n-form-item :label="t('mcpserver.route_rule')">
                <n-select
                  :value="editingTool.routeRule?.ruleType"
                  :options="routeRuleOptions"
                  @update:value="updateRouteRuleType"
                />
                <div
                  v-if="editingTool.routeRule?.ruleType"
                  class="route-rule-config"
                >
                  <n-input
                    v-model:value="routeRuleConfig"
                    type="textarea"
                    :placeholder="t('mcpserver.input_route_rule_config')"
                  />
                </div>
              </n-form-item>
            </n-form>
          </div>

          <div v-else class="tool-info">
            <n-descriptions
              :column="3"
              label-placement="left"
              :label-align="'right'"
            >
              <n-descriptions-item :label="t('mcpserver.tool_name')">
                {{ tool.toolName }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('mcpserver.tool_group')">
                {{ tool.group }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('namespace.namespace')">
                {{ tool.namespace }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('mcpserver.tool_version')">
                {{ tool.toolVersion || 1 }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('mcpserver.route_rule')" :span="2">
                <div v-if="tool.routeRule" class="route-rule-display">
                  <n-tag :type="getRouteRuleTagType(tool.routeRule.ruleType || 'direct')">
                    {{ tool.routeRule.ruleType || 'direct' }}
                  </n-tag>
                  <n-text depth="3" v-if="tool.routeRule.config">
                    {{ JSON.stringify(tool.routeRule.config) }}
                  </n-text>
                </div>
                <n-text v-else depth="3">-</n-text>
              </n-descriptions-item>
            </n-descriptions>
          </div>
        </n-card>
      </div>
    </n-space>

    <tool-spec-selector
      v-model:visible="showToolSpecSelector"
      :selected-tool-specs="selectedToolSpecs"
      @select="handleToolSpecSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NSpace,
  NButton,
  NIcon,
  NEmpty,
  NCard,
  NTag,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NDescriptions,
  NDescriptionsItem,
  NText
} from 'naive-ui';
import {
  AddOutline,
  CreateOutline as EditOutline,
  CheckmarkOutline,
  CloseOutline,
  TrashOutline
} from '@vicons/ionicons5';
import ToolSpecSelector from './ToolSpecSelector.vue';
import {
  McpSimpleToolParams,
  ToolRouteRule,
  ToolSpecInfo
} from '@/types/mcpserver';

interface Props {
  tools: McpSimpleToolParams[];
  mode: 'create' | 'edit' | 'detail';
  disabled?: boolean;
}

interface Emits {
  (e: 'update:tools', value: McpSimpleToolParams[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();

const showToolSpecSelector = ref(false);
const editingIndex = ref(-1);
const editingTool = ref<McpSimpleToolParams>({ ...defaultTool() });
const originalTool = ref<McpSimpleToolParams>({ ...defaultTool() });
const routeRuleConfig = ref('{}');

// 路由规则选项
const routeRuleOptions = [
  { label: 'Direct', value: 'direct' },
  { label: 'Weighted', value: 'weighted' },
  { label: 'Conditional', value: 'conditional' }
];

// 默认工具配置
function defaultTool(): McpSimpleToolParams {
  return {
    toolName: '',
    namespace: '',
    group: '',
    toolVersion: 1,
    routeRule: undefined
  };
}

// 已选择的 ToolSpec
const selectedToolSpecs = computed(() => {
  return props.tools.map((tool) => ({
    namespace: tool.namespace,
    group: tool.group,
    toolName: tool.toolName,
    name: '',
    description: '',
    version: tool.toolVersion || 1,
    function: {
      name: '',
      description: '',
      parameters: {}
    }
  }));
});

// 检查是否有错误
const hasError = (index: number) => {
  const tool = props.tools[index];
  return !tool.toolName || !tool.namespace || !tool.group;
};

// 获取路由规则标签类型
const getRouteRuleTagType = (ruleType: string) => {
  switch (ruleType) {
    case 'direct':
      return 'success';
    case 'weighted':
      return 'warning';
    case 'conditional':
      return 'info';
    default:
      return 'default';
  }
};

// 开始编辑
const startEdit = (index: number) => {
  editingIndex.value = index;
  editingTool.value = { ...props.tools[index] };
  originalTool.value = { ...props.tools[index] };
  routeRuleConfig.value = editingTool.value.routeRule
    ? JSON.stringify(editingTool.value.routeRule.config, null, 2)
    : '{}';
};

// 保存编辑
const saveEdit = (index: number) => {
  const updatedTools = [...props.tools];
  updatedTools[index] = { ...editingTool.value };

  // 解析路由规则配置
  if (routeRuleConfig.value.trim()) {
    try {
      const config = JSON.parse(routeRuleConfig.value);
      if (editingTool.value.routeRule) {
        editingTool.value.routeRule.config = config;
      } else {
        editingTool.value.routeRule = {
          protocol: 'HTTP',
          url: '',
          method: 'POST',
          additionHeaders: {},
          convertType: 'NONE',
          serviceNamespace: editingTool.value.namespace,
          serviceGroup: editingTool.value.group,
          serviceName: editingTool.value.toolName,
          ruleType: 'direct',
          config
        };
      }
    } catch (error) {
      console.error('Failed to parse route rule config:', error);
    }
  }

  emit('update:tools', updatedTools);
  editingIndex.value = -1;
};

// 取消编辑
const cancelEdit = (index: number) => {
  const updatedTools = [...props.tools];
  updatedTools[index] = { ...originalTool.value };
  emit('update:tools', updatedTools);
  editingIndex.value = -1;
};

// 移除工具
const removeTool = (index: number) => {
  const updatedTools = [...props.tools];
  updatedTools.splice(index, 1);
  emit('update:tools', updatedTools);
};

// 更新路由规则类型
const updateRouteRuleType = (value: string) => {
  if (!editingTool.value.routeRule) {
    editingTool.value.routeRule = {
      protocol: 'HTTP',
      url: '',
      method: 'POST',
      additionHeaders: {},
      convertType: 'NONE',
      serviceNamespace: editingTool.value.namespace,
      serviceGroup: editingTool.value.group,
      serviceName: editingTool.value.toolName,
      ruleType: value as 'direct' | 'weighted' | 'conditional',
      config: {}
    };
  } else {
    editingTool.value.routeRule.ruleType = value as
      | 'direct'
      | 'weighted'
      | 'conditional';
  }
};

// 处理 ToolSpec 选择
const handleToolSpecSelect = (toolSpec: ToolSpecInfo) => {
  const newTool: McpSimpleToolParams = {
    toolName: toolSpec.toolName,
    namespace: toolSpec.namespace,
    group: toolSpec.group,
    toolVersion: toolSpec.version,
    routeRule: undefined
  };

  emit('update:tools', [...props.tools, newTool]);
  showToolSpecSelector.value = false;
};

// 监听路由规则配置变化
watch(routeRuleConfig, (newValue) => {
  if (editingTool.value.routeRule && newValue.trim()) {
    try {
      editingTool.value.routeRule.config = JSON.parse(newValue);
    } catch (error) {
      // 忽略解析错误，在保存时处理
    }
  }
});
</script>

<style scoped>
.tool-config-list {
  width: 100%;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.tools-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tool-card {
  transition: all 0.3s;
}

.tool-card.editing {
  border-color: #bfdbfe;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.tool-card.error {
  border-color: #fecaca;
}

.tool-info,
.tool-edit-form {
  width: 100%;
}

.route-rule-display {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}
</style>
