<template>
  <div class="tool-detail-display">
    <n-space vertical size="large">
      <!-- 基本信息 -->
      <n-card title="基本信息" size="small">
        <n-descriptions :column="2" label-placement="left">
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
          <n-descriptions-item :label="'工具ID'">
            {{ tool.id }}
          </n-descriptions-item>
          <n-descriptions-item :label="'工具键'">
            {{ formatToolKey(tool.toolKey) }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <!-- 路由规则 -->
      <n-card title="路由规则" size="small">
        <div v-if="tool.routeRule" class="route-rule-detail">
          <n-descriptions :column="2" label-placement="left">
            <n-descriptions-item label="协议">
              <n-tag :type="getProtocolTagType(tool.routeRule.protocol)">
                {{ tool.routeRule.protocol }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="方法">
              <n-tag :type="getMethodTagType(tool.routeRule.method)">
                {{ tool.routeRule.method }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="URL" :span="2">
              <n-text code>{{ tool.routeRule.url || '-' }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item label="转换类型">
              <n-tag v-if="tool.routeRule.convertType !== 'NONE'" type="info">
                {{ tool.routeRule.convertType }}
              </n-tag>
              <n-text v-else depth="3">无转换</n-text>
            </n-descriptions-item>
            <n-descriptions-item label="服务信息">
              <div v-if="hasServiceInfo" class="service-info">
                <n-space vertical size="small">
                  <div v-if="tool.routeRule.serviceNamespace">
                    <n-text depth="2">命名空间: </n-text>
                    <n-text>{{ tool.routeRule.serviceNamespace }}</n-text>
                  </div>
                  <div v-if="tool.routeRule.serviceGroup">
                    <n-text depth="2">服务组: </n-text>
                    <n-text>{{ tool.routeRule.serviceGroup }}</n-text>
                  </div>
                  <div v-if="tool.routeRule.serviceName">
                    <n-text depth="2">服务名: </n-text>
                    <n-text>{{ tool.routeRule.serviceName }}</n-text>
                  </div>
                </n-space>
              </div>
              <n-text v-else depth="3">-</n-text>
            </n-descriptions-item>
          </n-descriptions>

          <!-- 额外头部信息 -->
          <div v-if="hasAdditionalHeaders" class="additional-headers">
            <n-divider title-placement="left">额外头部</n-divider>
            <n-code
              :code="formatHeaders(tool.routeRule.additionHeaders)"
              language="json"
            />
          </div>

          <!-- 规则配置 -->
          <div v-if="tool.routeRule.config" class="rule-config">
            <n-divider title-placement="left">规则配置</n-divider>
            <n-code
              :code="formatConfig(tool.routeRule.config)"
              language="json"
            />
          </div>
        </div>
        <n-empty v-else description="未配置路由规则" />
      </n-card>

      <!-- 工具规范 -->
      <n-card title="工具规范" size="small">
        <div v-if="tool.spec" class="tool-spec-detail">
          <n-descriptions :column="1" label-placement="left">
            <n-descriptions-item label="函数名称">
              {{ tool.spec.name }}
            </n-descriptions-item>
            <n-descriptions-item label="函数描述">
              {{ tool.spec.description || '-' }}
            </n-descriptions-item>
          </n-descriptions>

          <!-- 参数规范 -->
          <div v-if="tool.spec.inputSchema" class="parameters-spec">
            <n-divider title-placement="left">参数规范</n-divider>
            <n-code
              :code="formatParameters(tool.spec.inputSchema)"
              language="json"
            />
          </div>
        </div>
        <n-empty v-else description="未配置工具规范" />
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NSpace,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NTag,
  NText,
  NCode,
  NDivider,
  NEmpty
} from 'naive-ui';
import { McpTool, ToolKey, JsonSchema } from '@/types/mcpserver';

interface Props {
  tool: McpTool;
}

const props = defineProps<Props>();

const { t } = useI18n();

// 计算属性
const hasServiceInfo = computed(() => {
  return (
    props.tool.routeRule &&
    (props.tool.routeRule.serviceNamespace ||
      props.tool.routeRule.serviceGroup ||
      props.tool.routeRule.serviceName)
  );
});

const hasAdditionalHeaders = computed(() => {
  return (
    props.tool.routeRule?.additionHeaders &&
    Object.keys(props.tool.routeRule.additionHeaders).length > 0
  );
});

// 工具函数
const formatToolKey = (toolKey: ToolKey) => {
  return `${toolKey.namespace}/${toolKey.group}/${toolKey.toolName}`;
};

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

const formatHeaders = (headers: Record<string, string>) => {
  return JSON.stringify(headers, null, 2);
};

const formatConfig = (config: any) => {
  return JSON.stringify(config, null, 2);
};

const formatParameters = (inputSchema: JsonSchema) => {
  return JSON.stringify(inputSchema, null, 2);
};
</script>

<style scoped>
.tool-detail-display {
  width: 100%;
}

.route-rule-detail,
.tool-spec-detail {
  width: 100%;
}

.service-info {
  width: 100%;
}

.additional-headers,
.rule-config,
.parameters-spec {
  margin-top: 16px;
}

.additional-headers :deep(.n-code),
.rule-config :deep(.n-code),
.parameters-spec :deep(.n-code) {
  max-height: 200px;
  overflow-y: auto;
}
</style>
