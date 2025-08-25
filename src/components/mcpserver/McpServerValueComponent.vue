<template>
  <div class="mcp-server-value-component">
    <!-- 工具列表标题和基础信息 -->
    <div class="tools-header">
      <div class="tools-title">
        <n-text class="title-text">工具列表</n-text>
        <n-text depth="3" class="tools-count">共 {{ serverValue.tools.length }} 个工具</n-text>
      </div>
      <div class="basic-info-inline">
        <n-text depth="3" class="info-item">ID: {{ serverValue.id }}</n-text>
        <n-text depth="3" class="info-item">更新: {{ formatUpdateTime(serverValue.updateTime) }}</n-text>
        <n-tag :type="serverValue.isRelease ? 'success' : 'warning'" size="small">
          {{ serverValue.isRelease ? '已发布' : '未发布' }}
        </n-tag>
      </div>
    </div>
    
    <!-- 工具列表内容 -->
    <div class="tools-container">
      <mcp-server-tool-item
        v-for="tool in serverValue.tools"
        :key="tool.id"
        :tool="tool"
        mode="detail"
      />
      
      <n-empty v-if="serverValue.tools.length === 0" description="暂无工具" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { McpServerValue } from '@/types/mcpserver';
import {
  NText,
  NEmpty,
  NTag
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
}
</style>