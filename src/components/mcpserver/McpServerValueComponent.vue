<template>
  <div class="mcp-server-value-component">
    <n-card :bordered="false" class="value-card">
      <!-- 基础信息部分 -->
      <div class="basic-info-section">
        <n-card title="基础信息" size="small" class="info-card">
          <n-space vertical :size="12">
            <div class="info-item">
              <n-text depth="3" class="label">ID:</n-text>
              <n-text>{{ serverValue.id }}</n-text>
            </div>
            <div class="info-item">
              <n-text depth="3" class="label">更新时间:</n-text>
              <n-text>{{ formatUpdateTime(serverValue.updateTime) }}</n-text>
            </div>
            <div class="info-item">
              <n-text depth="3" class="label">发布状态:</n-text>
              <n-tag :type="serverValue.isRelease ? 'success' : 'warning'">
                {{ serverValue.isRelease ? '已发布' : '未发布' }}
              </n-tag>
            </div>
          </n-space>
        </n-card>
      </div>

      <!-- 工具列表部分 -->
      <div class="tools-section">
        <n-card title="工具列表" size="small" class="tools-card">
          <template #header-extra>
            <n-text depth="3">共 {{ serverValue.tools.length }} 个工具</n-text>
          </template>
          
          <div class="tools-container">
            <mcp-server-tool-item
              v-for="tool in serverValue.tools"
              :key="tool.id"
              :tool="tool"
              mode="detail"
            />
            
            <n-empty v-if="serverValue.tools.length === 0" description="暂无工具" />
          </div>
        </n-card>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { McpServerValue } from '@/types/mcpserver';
import {
  NCard,
  NText,
  NEmpty
} from 'naive-ui';
import McpServerToolItem from './McpServerToolItem.vue';

interface Props {
  serverValue: McpServerValue;
}

defineProps<Props>();

// 格式化更新时间
const formatUpdateTime = (timestamp: number) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return date.toLocaleString();
};
</script>

<style scoped>
.mcp-server-value-component {
  padding: 16px;
}

.value-card {
  background: #f8f9fa;
}

.basic-info-section,
.tools-section {
  margin-bottom: 16px;
}

.info-card,
.tools-card {
  background: #ffffff;
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  min-width: 80px;
  margin-right: 12px;
  font-weight: 500;
}

.tools-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mcp-server-value-component {
    padding: 8px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .label {
    min-width: auto;
    margin-right: 0;
    margin-bottom: 4px;
  }
  
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .value-card {
    background: #1f2937;
  }
  
  .info-card,
  .tools-card {
    background: #374151;
  }
  
}
</style>