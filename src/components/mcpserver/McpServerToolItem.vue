<template>
  <div class="mcp-server-tool-item">
    <n-card class="tool-card" :bordered="false">
      <!-- 基础信息部分 - 默认展示 -->
      <div class="basic-info">
        <n-space align="center" :size="12">
          <n-icon size="20" color="#18a058">
            <construct-outline />
          </n-icon>
          <n-text strong class="tool-name">{{ tool.toolName }}</n-text>
          <n-tag size="small" type="info">{{ tool.toolKey.group }}</n-tag>
          <n-tag size="small" type="warning">v{{ tool.toolVersion }}</n-tag>
        </n-space>
      </div>

      <!-- 工具参数信息部分 - 默认只显示标题，可点击展开 -->
      <div class="tool-spec-section">
        <div
          class="section-header clickable"
          @click="toggleToolSpecExpanded"
        >
          <n-space align="center" :size="8">
            <n-icon size="16" :color="isToolSpecExpanded ? '#18a058' : '#999'">
              <chevron-down v-if="isToolSpecExpanded" />
              <chevron-forward v-else />
            </n-icon>
            <n-text strong>工具参数信息</n-text>
          </n-space>
        </div>
        
        <n-collapse-transition :show="isToolSpecExpanded">
          <div class="tool-spec-content">
            <n-space vertical :size="8">
              <div class="info-item">
                <n-text depth="3" class="label">函数名:</n-text>
                <n-text>{{ tool.spec.name }}</n-text>
              </div>
              <div class="info-item">
                <n-text depth="3" class="label">描述:</n-text>
                <n-text>{{ tool.spec.description || '-' }}</n-text>
              </div>
              <div class="info-item">
                <n-text depth="3" class="label">参数:</n-text>
                <n-code
                  :code="formatJson(tool.spec.parameters)"
                  language="json"
                  :word-wrap="true"
                  class="params-code"
                />
              </div>
            </n-space>
          </div>
        </n-collapse-transition>
      </div>

      <!-- 路由工具部分 - 默认只显示标题，可点击展开 -->
      <div class="route-rule-section">
        <div
          class="section-header clickable"
          @click="toggleRouteRuleExpanded"
        >
          <n-space align="center" :size="8">
            <n-icon size="16" :color="isRouteRuleExpanded ? '#18a058' : '#999'">
              <chevron-down v-if="isRouteRuleExpanded" />
              <chevron-forward v-else />
            </n-icon>
            <n-text strong>路由工具</n-text>
          </n-space>
        </div>
        
        <n-collapse-transition :show="isRouteRuleExpanded">
          <div class="route-rule-content">
            <n-space vertical :size="8">
              <div class="info-item">
                <n-text depth="3" class="label">协议:</n-text>
                <n-text>{{ tool.routeRule.protocol }}</n-text>
              </div>
              <div class="info-item">
                <n-text depth="3" class="label">URL:</n-text>
                <n-text>{{ tool.routeRule.url || '-' }}</n-text>
              </div>
              <div class="info-item">
                <n-text depth="3" class="label">方法:</n-text>
                <n-tag size="small" :type="getMethodTagType(tool.routeRule.method)">
                  {{ tool.routeRule.method }}
                </n-tag>
              </div>
              <div class="info-item">
                <n-text depth="3" class="label">转换类型:</n-text>
                <n-text>{{ tool.routeRule.convertType }}</n-text>
              </div>
              <div class="info-item">
                <n-text depth="3" class="label">服务信息:</n-text>
                <n-space vertical :size="2">
                  <div class="service-info-item">
                    <n-text depth="3" class="sub-label">服务名:</n-text>
                    <n-text>{{ tool.routeRule.serviceName }}</n-text>
                  </div>
                  <div class="service-info-item">
                    <n-text depth="3" class="sub-label">服务分组:</n-text>
                    <n-text>{{ tool.routeRule.serviceGroup }}</n-text>
                  </div>
                </n-space>
              </div>
              <div v-if="Object.keys(tool.routeRule.additionHeaders).length > 0" class="info-item">
                <n-text depth="3" class="label">附加头:</n-text>
                <n-space vertical :size="2">
                  <div
                    v-for="(value, key) in tool.routeRule.additionHeaders"
                    :key="key"
                    class="header-item"
                  >
                    <n-text depth="3" class="sub-label">{{ key }}:</n-text>
                    <n-text>{{ value }}</n-text>
                  </div>
                </n-space>
              </div>
            </n-space>
          </div>
        </n-collapse-transition>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  NSpace, 
  NCard, 
  NText, 
  NIcon, 
  NTag, 
  NCollapseTransition, 
  NCode 
} from 'naive-ui';
import {
  ConstructOutline,
  ChevronDown,
  ChevronForward
} from '@vicons/ionicons5';
import { McpTool } from '@/types/mcpserver';

interface Props {
  tool: McpTool;
}

const props = defineProps<Props>();

// 展开状态管理
const isRouteRuleExpanded = ref(false);
const isToolSpecExpanded = ref(false);

// 切换路由规则展开状态
const toggleRouteRuleExpanded = () => {
  isRouteRuleExpanded.value = !isRouteRuleExpanded.value;
};

// 切换工具规范展开状态
const toggleToolSpecExpanded = () => {
  isToolSpecExpanded.value = !isToolSpecExpanded.value;
};

// 获取HTTP方法的标签类型
const getMethodTagType = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'success';
    case 'POST':
      return 'warning';
    case 'PUT':
      return 'info';
    case 'DELETE':
      return 'error';
    default:
      return 'default';
  }
};

// 格式化附加头信息
const formatHeaders = (headers: Record<string, string>) => {
  return JSON.stringify(headers, null, 2);
};

// 格式化JSON数据
const formatJson = (data: any) => {
  return JSON.stringify(data, null, 2);
};
</script>

<style scoped>
.mcp-server-tool-item {
  margin-bottom: 16px;
}

.tool-card {
  transition: all 0.3s ease;
}

.tool-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.basic-info {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 12px;
}

.tool-name {
  font-size: 16px;
  color: #333;
}

.section-header {
  padding: 8px 0;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.section-header:hover {
  color: #18a058;
}

.section-header.clickable {
  display: flex;
  align-items: center;
}

.route-rule-section,
.tool-spec-section {
  margin-top: 12px;
}

.route-rule-content,
.tool-spec-content {
  padding-left: 24px;
  padding-top: 8px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 4px;
}

.label {
  min-width: 80px;
  margin-right: 8px;
  flex-shrink: 0;
}

.sub-label {
  min-width: 60px;
  margin-right: 8px;
  flex-shrink: 0;
}

.service-info-item,
.header-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2px;
}

.params-code {
  margin-top: 4px;
  background: #f8f9fa;
  border-radius: 4px;
  padding: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .label {
    min-width: auto;
    margin-right: 0;
    margin-bottom: 4px;
    font-weight: 500;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .tool-card {
    background: #1f2937;
    border-color: #374151;
  }
  
  .basic-info {
    border-bottom-color: #374151;
  }
  
  .tool-name {
    color: #f3f4f6;
  }
  
  .params-code {
    background: #374151;
  }
}
</style>