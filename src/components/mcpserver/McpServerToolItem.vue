<template>
  <div class="mcp-server-tool-item">
    <n-card class="tool-card" :bordered="false">
      <!-- 基础信息部分 - 默认展示 -->
      <div class="basic-info">
        <n-space align="center" :size="12" justify="space-between">
          <n-space align="center" :size="12">
            <n-icon size="20" color="#18a058">
              <construct-outline />
            </n-icon>
            <n-text strong class="tool-name">{{ tool.toolName }}</n-text>
            <n-tag size="small" type="info">{{ tool.toolKey.group }}</n-tag>
            <n-tag size="small" type="warning">v{{ tool.toolVersion }}</n-tag>
          </n-space>

          <!-- 编辑按钮 - 仅在update或create模式下显示 -->
          <n-button
            v-if="mode !== 'detail'"
            quaternary
            circle
            size="small"
            type="primary"
            @click="openEditDrawer"
          >
            <template #icon>
              <n-icon><create-outline /></n-icon>
            </template>
          </n-button>
        </n-space>
      </div>

      <!-- 工具参数信息部分 - 默认只显示标题，可点击展开 -->
      <div class="tool-spec-section">
        <div class="section-header clickable" @click="toggleToolSpecExpanded">
          <n-space align="center" :size="8">
            <n-icon size="16" :color="isToolSpecExpanded ? '#18a058' : '#999'">
              <chevron-down v-if="isToolSpecExpanded" />
              <chevron-forward v-else />
            </n-icon>
            <n-text strong>{{
              t('mcpservertollitem.tool_params_info')
            }}</n-text>
          </n-space>
        </div>

        <n-collapse-transition :show="isToolSpecExpanded">
          <div class="tool-spec-content">
            <n-space vertical :size="8">
              <div class="info-item">
                <n-text depth="3" class="label"
                  >{{ t('mcpservertollitem.function_name') }}:</n-text
                >
                <n-text>{{ tool.spec.name }}</n-text>
              </div>
              <div class="info-item">
                <n-text depth="3" class="label"
                  >{{ t('mcpservertollitem.description') }}:</n-text
                >
                <n-text>{{ tool.spec.description || '-' }}</n-text>
              </div>
              <div class="info-item">
                <n-text depth="3" class="label"
                  >{{ t('mcpservertollitem.params') }}:</n-text
                >
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
        <div class="section-header clickable" @click="toggleRouteRuleExpanded">
          <n-space align="center" :size="8">
            <n-icon size="16" :color="isRouteRuleExpanded ? '#18a058' : '#999'">
              <chevron-down v-if="isRouteRuleExpanded" />
              <chevron-forward v-else />
            </n-icon>
            <n-text strong>{{ t('mcpservertollitem.route_tool') }}</n-text>
          </n-space>
        </div>

        <n-collapse-transition :show="isRouteRuleExpanded">
          <div class="route-rule-content">
            <n-space vertical :size="8">
              <div class="info-item">
                <n-text depth="3" class="label"
                  >{{ t('mcpservertollitem.protocol') }}:</n-text
                >
                <n-text>{{ tool.routeRule.protocol }}</n-text>
              </div>
              <div class="info-item">
                <n-text depth="3" class="label"
                  >{{ t('mcpservertollitem.url') }}:</n-text
                >
                <n-space align="center" :size="4">
                  <n-text>{{ tool.routeRule.url || '-' }}</n-text>
                  <n-tooltip
                    trigger="hover"
                    :style="{ backgroundColor: '#f0f9ff', color: '#333333' }"
                  >
                    <template #trigger>
                      <n-icon size="16" color="#999999" style="cursor: help">
                        <information-circle-outline />
                      </n-icon>
                    </template>
                    <div style="padding: 8px">
                      <n-text strong style="color: #1e40af">{{
                        t('mcpservertollitem.support_template_vars')
                      }}</n-text>
                      <br />
                      <n-text
                        >• {IP} -
                        {{ t('mcpservertollitem.ip_address') }}</n-text
                      >
                      <br />
                      <n-text
                        >• {PORT} - {{ t('mcpservertollitem.port') }}</n-text
                      >
                      <br />
                      <n-text
                        >• {IP_PORT} -
                        {{ t('mcpservertollitem.ip_port') }}</n-text
                      >
                    </div>
                  </n-tooltip>
                </n-space>
              </div>
              <div class="info-item">
                <n-text depth="3" class="label"
                  >{{ t('mcpservertollitem.method') }}:</n-text
                >
                <n-tag
                  size="small"
                  :type="getMethodTagType(tool.routeRule.method)"
                >
                  {{ tool.routeRule.method }}
                </n-tag>
              </div>
              <div class="info-item">
                <n-text depth="3" class="label"
                  >{{ t('mcpservertollitem.convert_type') }}:</n-text
                >
                <n-text>{{ tool.routeRule.convertType }}</n-text>
              </div>
              <div class="info-item">
                <n-text depth="3" class="label"
                  >{{ t('mcpservertollitem.service_info') }}:</n-text
                >
                <n-space vertical :size="2">
                  <div class="service-info-item">
                    <n-text depth="3" class="sub-label"
                      >{{ t('mcpservertollitem.service_name') }}:</n-text
                    >
                    <n-text>{{ tool.routeRule.serviceName }}</n-text>
                  </div>
                  <div class="service-info-item">
                    <n-text depth="3" class="sub-label"
                      >{{ t('mcpservertollitem.service_group') }}:</n-text
                    >
                    <n-text>{{ tool.routeRule.serviceGroup }}</n-text>
                  </div>
                </n-space>
              </div>
              <div
                v-if="Object.keys(tool.routeRule.additionHeaders).length > 0"
                class="info-item"
              >
                <n-text depth="3" class="label"
                  >{{ t('mcpservertollitem.additional_headers') }}:</n-text
                >
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

    <!-- 编辑抽屉 -->
    <n-drawer
      v-model:show="showEditDrawer"
      :width="600"
      placement="right"
      :mask-closable="false"
    >
      <n-drawer-content
        :title="drawerTitle"
        :closable="true"
        body-content-style="padding: 16px"
      >
        <n-form
          ref="formRef"
          :model="editForm"
          :rules="formRules"
          label-placement="left"
          label-width="100"
        >
          <!-- 工具选择部分 -->
          <n-form-item
            :label="t('mcpservertollitem.tool_selection')"
            path="toolSpec"
          >
            <n-space vertical style="width: 100%">
              <n-button
                @click="showToolSpecSelector = true"
                type="primary"
                dashed
              >
                <template #icon>
                  <n-icon><add-outline /></n-icon>
                </template>
                {{
                  selectedToolSpecName ||
                  t('mcpservertollitem.select_tool_spec')
                }}
              </n-button>

              <n-alert v-if="selectedToolSpec" type="info" :show-icon="false">
                <template #header>
                  <n-space align="center">
                    <n-icon><information-circle-outline /></n-icon>
                    <span>{{ t('mcpservertollitem.selected_tool') }}</span>
                  </n-space>
                </template>
                <div>
                  <p>
                    <strong>{{ t('mcpservertollitem.namespace') }}:</strong>
                    {{ selectedToolSpec.namespace }}
                  </p>
                  <p>
                    <strong>{{ t('mcpservertollitem.group') }}:</strong>
                    {{ selectedToolSpec.group }}
                  </p>
                  <p>
                    <strong>{{ t('mcpservertollitem.tool_name') }}:</strong>
                    {{ selectedToolSpec.toolName }}
                  </p>
                  <p>
                    <strong>{{ t('mcpservertollitem.version') }}:</strong>
                    {{ selectedToolSpec.version }}
                  </p>
                  <p>
                    <strong>{{ t('mcpservertollitem.description') }}:</strong>
                    {{ selectedToolSpec.description }}
                  </p>
                </div>
              </n-alert>
            </n-space>
          </n-form-item>

          <!-- 路由规则配置 -->
          <n-divider>{{ t('mcpservertollitem.route_rule_config') }}</n-divider>

          <n-form-item
            :label="t('mcpservertollitem.protocol')"
            path="routeRule.protocol"
          >
            <n-select
              v-model:value="editForm.routeRule.protocol"
              :options="protocolOptions"
              :placeholder="t('mcpservertollitem.select_protocol')"
            />
          </n-form-item>

          <n-form-item :label="t('mcpservertollitem.url')" path="routeRule.url">
            <n-input
              v-model:value="editForm.routeRule.url"
              :placeholder="t('mcpservertollitem.input_url')"
            />
            <template #feedback>
              <n-text depth="3" style="font-size: 12px; line-height: 1.4">
                {{ t('mcpservertollitem.support_template_vars') }} {IP}（{{
                  t('mcpservertollitem.ip_address')
                }}）、{PORT}（{{ t('mcpservertollitem.port') }}）、{IP_PORT}（{{
                  t('mcpservertollitem.ip_port')
                }}）
              </n-text>
            </template>
          </n-form-item>

          <n-form-item
            :label="t('mcpservertollitem.method')"
            path="routeRule.method"
          >
            <n-select
              v-model:value="editForm.routeRule.method"
              :options="methodOptions"
              :placeholder="t('mcpservertollitem.select_http_method')"
            />
          </n-form-item>

          <n-form-item
            :label="t('mcpservertollitem.convert_type')"
            path="routeRule.convertType"
          >
            <n-select
              v-model:value="editForm.routeRule.convertType"
              :options="convertTypeOptions"
              :placeholder="t('mcpservertollitem.select_convert_type')"
            />
          </n-form-item>

          <n-form-item
            :label="t('mcpservertollitem.service_namespace')"
            path="routeRule.serviceNamespace"
          >
            <n-input
              :value="selectedToolSpec?.namespace || ''"
              :placeholder="t('mcpservertollitem.service_namespace')"
              disabled
            />
          </n-form-item>

          <n-form-item
            :label="t('mcpservertollitem.service_group')"
            path="routeRule.serviceGroup"
          >
            <n-input
              v-model:value="editForm.routeRule.serviceGroup"
              :placeholder="t('mcpservertollitem.input_service_group')"
            />
          </n-form-item>

          <n-form-item
            :label="t('mcpservertollitem.service_name')"
            path="routeRule.serviceName"
          >
            <n-input
              v-model:value="editForm.routeRule.serviceName"
              :placeholder="t('mcpservertollitem.input_service_name')"
            />
          </n-form-item>

          <n-form-item
            :label="t('mcpservertollitem.additional_headers')"
            path="routeRule.additionHeaders"
          >
            <n-dynamic-input
              v-model:value="editForm.routeRule.additionHeaders"
              preset="pair"
              :key-placeholder="t('mcpservertollitem.header_name')"
              :value-placeholder="t('mcpservertollitem.header_value')"
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <n-space justify="end">
            <n-button @click="closeEditDrawer">{{
              t('mcpservertollitem.cancel')
            }}</n-button>
            <n-button type="primary" @click="saveTool">{{
              t('mcpservertollitem.save')
            }}</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>

    <!-- 工具选择器 -->
    <tool-spec-selector
      v-model:visible="showToolSpecSelector"
      :selected-tool-specs="[]"
      @select="handleToolSpecSelect"
      @cancel="handleToolSpecCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NSpace,
  NCard,
  NText,
  NIcon,
  NTag,
  NCollapseTransition,
  NCode,
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NDivider,
  NDynamicInput,
  NAlert,
  useMessage
} from 'naive-ui';
import {
  ConstructOutline,
  ChevronDown,
  ChevronForward,
  CreateOutline,
  AddOutline,
  InformationCircleOutline
} from '@vicons/ionicons5';
import { McpTool, ToolSpecInfo } from '@/types/mcpserver';
import ToolSpecSelector from '@/components/mcpserver/ToolSpecSelector.vue';

const { t } = useI18n();

interface Props {
  tool: McpTool;
  mode?: 'detail' | 'update' | 'create';
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'detail'
});

const message = useMessage();

// 展开状态管理
const isRouteRuleExpanded = ref(false);
const isToolSpecExpanded = ref(false);

// 编辑抽屉相关
const showEditDrawer = ref(false);
const showToolSpecSelector = ref(false);
const selectedToolSpec = ref<ToolSpecInfo | null>(null);
const formRef = ref();

// 编辑表单数据
const editForm = ref({
  routeRule: {
    protocol: 'HTTP',
    url: '',
    method: 'GET',
    additionHeaders: [] as Array<{ key: string; value: string }>,
    convertType: 'NONE' as 'NONE' | 'FORM_TO_JSON' | 'CUSTOM',
    serviceNamespace: '',
    serviceGroup: '',
    serviceName: ''
  }
});

// 表单验证规则
const formRules = {
  routeRule: {
    protocol: {
      required: true,
      message: t('mcpservertollitem.select_protocol'),
      trigger: 'change'
    },
    url: {
      required: true,
      message: t('mcpservertollitem.input_url'),
      trigger: 'blur'
    },
    method: {
      required: true,
      message: t('mcpservertollitem.select_http_method'),
      trigger: 'change'
    },
    /*
    serviceNamespace: {
      required: true,
      message: t('mcpservertollitem.service_namespace'),
      trigger: 'blur'
    },
    */
    serviceGroup: {
      required: true,
      message: t('mcpservertollitem.input_service_group'),
      trigger: 'blur'
    },
    serviceName: {
      required: true,
      message: t('mcpservertollitem.input_service_name'),
      trigger: 'blur'
    }
  }
};

// 选项数据
const protocolOptions = [{ label: 'HTTP', value: 'HTTP' }];

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' }
];

const convertTypeOptions = [
  { label: t('mcpservertollitem.no_conversion'), value: 'NONE' },
  { label: t('mcpservertollitem.form_to_json'), value: 'FORM_TO_JSON' },
  { label: t('mcpservertollitem.custom'), value: 'CUSTOM' }
];

// 计算属性
const drawerTitle = computed(() => {
  if (props.mode === 'create') return t('mcpservertollitem.create_tool');
  return t('mcpservertollitem.edit_tool');
});

const selectedToolSpecName = computed(() => {
  if (!selectedToolSpec.value) return '';
  return `${selectedToolSpec.value.namespace}/${selectedToolSpec.value.group}/${selectedToolSpec.value.toolName}`;
});

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

// 格式化JSON数据
const formatJson = (data: any) => {
  return JSON.stringify(data, null, 2);
};

// 打开编辑抽屉
const openEditDrawer = () => {
  // 初始化表单数据
  editForm.value = {
    routeRule: {
      protocol: props.tool.routeRule.protocol,
      url: props.tool.routeRule.url,
      method: props.tool.routeRule.method,
      additionHeaders: Object.entries(props.tool.routeRule.additionHeaders).map(
        ([key, value]) => ({
          key,
          value
        })
      ),
      convertType: props.tool.routeRule.convertType,
      serviceNamespace: props.tool.routeRule.serviceNamespace,
      serviceGroup: props.tool.routeRule.serviceGroup,
      serviceName: props.tool.routeRule.serviceName
    }
  };

  // 设置已选择的工具规范
  selectedToolSpec.value = {
    namespace: props.tool.toolKey.namespace,
    group: props.tool.toolKey.group,
    toolName: props.tool.toolName,
    name: props.tool.spec.name,
    description: props.tool.spec.description,
    version: props.tool.toolVersion,
    function: props.tool.spec
  };

  showEditDrawer.value = true;
};

// 关闭编辑抽屉
const closeEditDrawer = () => {
  showEditDrawer.value = false;
  selectedToolSpec.value = null;
};

// 处理工具规范选择
const handleToolSpecSelect = (toolSpec: ToolSpecInfo) => {
  selectedToolSpec.value = toolSpec;
  showToolSpecSelector.value = false;
};

// 处理工具规范选择取消
const handleToolSpecCancel = () => {
  showToolSpecSelector.value = false;
};

// 保存工具
const saveTool = async () => {
  try {
    await formRef.value?.validate();

    if (!selectedToolSpec.value) {
      message.error(t('mcpservertollitem.please_select_tool_spec'));
      return;
    }

    // 直接更新 props.tool，因为它已经是 ref 包装的
    Object.assign(props.tool, {
      toolName: selectedToolSpec.value.toolName,
      toolKey: {
        namespace: selectedToolSpec.value.namespace,
        group: selectedToolSpec.value.group,
        toolName: selectedToolSpec.value.toolName
      },
      toolVersion: selectedToolSpec.value.version,
      spec: selectedToolSpec.value.function,
      routeRule: {
        ...editForm.value.routeRule,
        additionHeaders: editForm.value.routeRule.additionHeaders.reduce(
          (acc, item) => {
            if (item.key && item.value) {
              acc[item.key] = item.value;
            }
            return acc;
          },
          {} as Record<string, string>
        )
      }
    });

    message.success(t('mcpservertollitem.save_success'));
    closeEditDrawer();
  } catch (error) {
    message.error(t('mcpservertollitem.save_failed'));
  }
};

// 由于 props.tool 已经是 ref 包装的，不需要额外的监听逻辑
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
