<template>
  <div class="mcp-server-detail-component">
    <n-card :title="t('mcpserverdetailcomponent.server_info')" :bordered="false">
      <template #header-extra>
        <n-tag :type="serverData.currentValue?.isRelease ? 'success' : 'warning'" size="small">
          {{ serverData.currentValue?.isRelease ? t('mcpserverdetailcomponent.published') : t('mcpserverdetailcomponent.unpublished') }}
        </n-tag>
      </template>

      <!-- 基础信息区域 -->
      <n-descriptions :column="2" label-placement="left">
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
        
        <n-descriptions-item :label="t('mcpserverdetailcomponent.last_modified')">
          <n-text>{{ formatTime(serverData.lastModifiedMillis) }}</n-text>
        </n-descriptions-item>
      </n-descriptions>

      <!-- 当前服务工具区域 -->
      <div v-if="serverData.currentValue" class="current-tools-section">
        <n-divider />
        <h3 class="tools-title">{{ t('mcpserverdetailcomponent.current_tools') }}</h3>
        <mcp-server-value-component
          :server-value="serverData.currentValue"
          mode="detail"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NText,
  NTag,
  NSpace,
  NDivider
} from 'naive-ui';
import McpServerValueComponent from '@/components/mcpserver/McpServerValueComponent.vue';
import { McpServerDto } from '@/types/mcpserver';

const { t } = useI18n();

interface Props {
  serverData: McpServerDto;
}

const props = defineProps<Props>();

// 格式化时间
const formatTime = (timestamp: number) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return date.toLocaleString();
};
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

/* 响应式设计 */
@media (max-width: 768px) {
  .mcp-server-detail-component {
    padding: 8px;
  }
}
</style>