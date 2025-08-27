<template>
  <div class="mcp-server-value-component">
    <!-- 工具列表标题和基础信息 -->
    <div class="tools-header">
      <div class="tools-title">
        <n-text class="title-text">{{
          t('mcpservaluecomponent.tools_list')
        }}</n-text>
        <n-text depth="3" class="tools-count">{{
          t('mcpservaluecomponent.tools_count', {
            count: serverValue.tools.length
          })
        }}</n-text>
      </div>
      <div class="basic-info-inline">
        <n-text depth="3" class="info-item"
          >{{ t('mcpservaluecomponent.id_label') }} {{ serverValue.id }}</n-text
        >
        <n-text depth="3" class="info-item"
          >{{ t('mcpservaluecomponent.update_label') }}
          {{ formatUpdateTime(serverValue.updateTime) }}</n-text
        >
        <n-tag
          :type="serverValue.isRelease ? 'success' : 'warning'"
          size="small"
        >
          {{
            serverValue.isRelease
              ? t('mcpservaluecomponent.published')
              : t('mcpservaluecomponent.unpublished')
          }}
        </n-tag>

        <!-- 编辑模式下的操作按钮 -->
        <n-space v-if="mode === 'update'" :size="8">
          <n-button type="primary" size="small" @click="addNewTool">
            <template #icon>
              <n-icon><add-outline /></n-icon>
            </template>
            {{ t('mcpservaluecomponent.add_tool') }}
          </n-button>
          <n-button type="success" size="small" @click="publishServer">
            <template #icon>
              <n-icon><cloud-upload-outline /></n-icon>
            </template>
            {{ t('mcpservaluecomponent.publish_server') }}
          </n-button>
        </n-space>
      </div>
    </div>

    <!-- 工具列表内容 -->
    <div class="tools-container">
      <div
        v-for="(tool, index) in serverValue.tools"
        :key="tool.id || `tool-${index}`"
        class="tool-item-wrapper"
      >
        <mcp-server-tool-item
          :tool="tool"
          :mode="mode === 'update' ? 'update' : 'detail'"
          @update:tool="(updatedTool) => updateTool(index, updatedTool)"
          @save="(params) => handleToolSave(index, params)"
        />

        <!-- 编辑模式下的删除按钮 -->
        <n-button
          v-if="mode === 'update'"
          class="delete-tool-btn"
          quaternary
          circle
          size="small"
          type="error"
          @click="deleteTool(index)"
        >
          <template #icon>
            <n-icon><trash-outline /></n-icon>
          </template>
        </n-button>
      </div>

      <n-empty
        v-if="serverValue.tools.length === 0"
        :description="t('mcpservaluecomponent.no_tools')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  McpServerValue,
  McpTool,
  McpSimpleToolParams
} from '@/types/mcpserver';
import {
  NText,
  NEmpty,
  NTag,
  NSpace,
  NButton,
  NIcon,
  useMessage
} from 'naive-ui';
import McpServerToolItem from './McpServerToolItem.vue';
import {
  AddOutline,
  TrashOutline,
  CloudUploadOutline
} from '@vicons/ionicons5';

const { t } = useI18n();

interface Props {
  serverValue: McpServerValue;
  mode?: 'detail' | 'update';
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'detail'
});

const emit = defineEmits<{
  (e: 'update:value', value: McpServerValue): void;
  (e: 'toolChange', toolIndex: number, tool: McpTool): void;
  (e: 'toolSave', toolIndex: number, params: McpSimpleToolParams): void;
  (e: 'toolDelete', toolIndex: number): void;
  (e: 'toolAdd', params: McpSimpleToolParams): void;
  (e: 'publishServer'): void;
}>();

const message = useMessage();

// 格式化更新时间
const formatUpdateTime = (timestamp: number) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// 添加新工具
const addNewTool = () => {
  const newTool: McpTool = {
    id: 0, // 临时ID，实际保存时由后端分配
    toolName: '',
    toolKey: {
      namespace: '',
      group: '',
      toolName: ''
    },
    toolVersion: 1,
    spec: {
      name: '',
      description: '',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    routeRule: {
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

  // 只更新 tools 数组，保留 serverValue 的其他属性
  const updatedValue = {
    ...props.serverValue,
    tools: [...props.serverValue.tools, newTool]
  };

  emit('update:value', updatedValue);
  emit('toolAdd', {
    toolName: '',
    namespace: '',
    group: '',
    routeRule: newTool.routeRule
  });
};

// 更新工具
const updateTool = (index: number, updatedTool: McpTool) => {
  const updatedTools = [...props.serverValue.tools];
  updatedTools[index] = updatedTool;

  // 只更新 tools 数组，保留 serverValue 的其他属性
  const updatedValue = {
    ...props.serverValue,
    tools: updatedTools
  };

  emit('update:value', updatedValue);
  emit('toolChange', index, updatedTool);
};

// 删除工具
const deleteTool = (index: number) => {
  const updatedTools = props.serverValue.tools.filter((_, i) => i !== index);

  // 只更新 tools 数组，保留 serverValue 的其他属性
  const updatedValue = {
    ...props.serverValue,
    tools: updatedTools
  };

  emit('update:value', updatedValue);
  emit('toolDelete', index);
  message.success(t('mcpservaluecomponent.tool_deleted_success'));
};

// 处理工具保存
const handleToolSave = (index: number, params: McpSimpleToolParams) => {
  emit('toolSave', index, params);
};

// 发布服务
const publishServer = () => {
  emit('publishServer');
};
</script>

<style scoped>
.mcp-server-value-component {
  padding: 16px;
}

.tools-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--n-border-color);
}

.tools-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-text {
  font-size: 16px;
  font-weight: 500;
}

.tools-count {
  font-size: 14px;
}

.basic-info-inline {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.info-item {
  opacity: 0.7;
}

.tools-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.tool-item-wrapper {
  position: relative;
}

.delete-tool-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.tool-item-wrapper:hover .delete-tool-btn {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mcp-server-value-component {
    padding: 8px;
  }

  .tools-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .basic-info-inline {
    flex-wrap: wrap;
    gap: 8px;
  }

  .tools-container {
    grid-template-columns: 1fr;
  }
}
</style>
