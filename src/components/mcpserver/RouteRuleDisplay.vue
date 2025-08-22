<template>
  <div class="route-rule-display">
    <div v-if="routeRule" class="route-rule-content">
      <n-space align="center" :wrap="false">
        <n-tag :type="getProtocolTagType(routeRule.protocol)" size="small">
          {{ routeRule.protocol }}
        </n-tag>
        <n-tag :type="getMethodTagType(routeRule.method)" size="small">
          {{ routeRule.method }}
        </n-tag>
        <n-text depth="2" class="route-url">
          {{ routeRule.url || '-' }}
        </n-text>
      </n-space>
      
      <div v-if="routeRule.convertType && routeRule.convertType !== 'NONE'" class="convert-type">
        <n-tag size="small" type="info">
          {{ routeRule.convertType }}
        </n-tag>
      </div>
      
      <div v-if="hasServiceInfo" class="service-info">
        <n-text depth="3" style="font-size: 12px;">
          {{ formatServiceInfo(routeRule) }}
        </n-text>
      </div>
    </div>
    
    <n-text v-else depth="3">-</n-text>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NSpace, NTag, NText } from 'naive-ui';
import { ToolRouteRule } from '@/types/mcpserver';

interface Props {
  routeRule?: ToolRouteRule;
}

const props = defineProps<Props>();

// 计算属性
const hasServiceInfo = computed(() => {
  return props.routeRule && (
    props.routeRule.serviceNamespace ||
    props.routeRule.serviceGroup ||
    props.routeRule.serviceName
  );
});

// 获取协议标签类型
const getProtocolTagType = (protocol: string) => {
  switch (protocol?.toUpperCase()) {
    case 'HTTP':
    case 'HTTPS':
      return 'success';
    case 'GRPC':
      return 'info';
    case 'TCP':
      return 'warning';
    default:
      return 'default';
  }
};

// 获取方法标签类型
const getMethodTagType = (method: string) => {
  switch (method?.toUpperCase()) {
    case 'GET':
      return 'info';
    case 'POST':
      return 'success';
    case 'PUT':
      return 'warning';
    case 'DELETE':
      return 'error';
    case 'PATCH':
      return 'primary';
    default:
      return 'default';
  }
};

// 格式化服务信息
const formatServiceInfo = (routeRule: ToolRouteRule) => {
  const parts = [];
  if (routeRule.serviceNamespace) {
    parts.push(`ns:${routeRule.serviceNamespace}`);
  }
  if (routeRule.serviceGroup) {
    parts.push(`group:${routeRule.serviceGroup}`);
  }
  if (routeRule.serviceName) {
    parts.push(`service:${routeRule.serviceName}`);
  }
  return parts.join(' | ');
};
</script>

<style scoped>
.route-rule-display {
  width: 100%;
}

.route-rule-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.route-url {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.convert-type {
  margin-top: 2px;
}

.service-info {
  margin-top: 2px;
}
</style>