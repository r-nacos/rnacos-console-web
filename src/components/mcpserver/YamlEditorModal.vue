<template>
  <n-modal v-model:show="visible" preset="card" :title="t('mcpserver.yaml_editor')" size="huge" :mask-closable="false"
    :closable="false" style="width: 90%; max-width: 1200px; height: 80vh;">
    <div class="yaml-editor-container">
      <!-- 编辑器区域 -->
      <div class="editor-section">
        <div class="editor-wrapper" @click="focusEditor">
          <div @click="stopPropagation">
            <code-mirror v-model="yamlContent" :foucsValue="focusValue" :lang="yamlLang" :extensions="extensions"
              :readonly="false" :basic="true" :tab="true" :wrap="true" style="height: 60vh;" />
          </div>
        </div>
      </div>

      <!-- 验证状态和错误显示 -->
      <div class="validation-section">
        <!-- 验证进度指示器 -->
        <div v-if="validating" class="validation-progress">
          <n-alert type="info" :show-icon="true" style="margin-bottom: 8px">
            <template #icon>
              <n-spin size="small" />
            </template>
            {{ t('mcpserverdetailcomponent.yaml_validation_in_progress') }}
          </n-alert>
        </div>

        <!-- 验证错误显示 -->
        <div v-if="validationErrors.length > 0" class="validation-errors">
          <n-alert type="error" :show-icon="true" style="margin-bottom: 8px">
            <template #header>
              <n-space align="center">
                <span>{{ t('mcpserverdetailcomponent.yaml_validation_errors') }}</span>
                <n-tag type="error" size="small">{{ validationErrors.length }}</n-tag>
              </n-space>
            </template>
            <div class="error-list">
              <div v-for="(error, index) in validationErrors" :key="index" class="error-item">
                <n-icon size="14" color="#d03050" style="margin-right: 6px;">
                  <CloseCircleOutline />
                </n-icon>
                <span>{{ error }}</span>
              </div>
            </div>
          </n-alert>
        </div>

        <!-- 验证警告显示 -->
        <div v-if="validationWarnings.length > 0" class="validation-warnings">
          <n-alert type="warning" :show-icon="true" style="margin-bottom: 8px">
            <template #header>
              <n-space align="center">
                <span>{{ t('mcpserverdetailcomponent.yaml_validation_warnings') }}</span>
                <n-tag type="warning" size="small">{{ validationWarnings.length }}</n-tag>
              </n-space>
            </template>
            <div class="warning-list">
              <div v-for="(warning, index) in validationWarnings" :key="index" class="warning-item">
                <n-icon size="14" color="#f0a020" style="margin-right: 6px;">
                  <WarningOutline />
                </n-icon>
                <span>{{ warning }}</span>
              </div>
            </div>
          </n-alert>
        </div>

        <!-- 成功状态显示 -->
        <div
          v-if="validationErrors.length === 0 && validationWarnings.length === 0 && yamlContent.trim() && !validating"
          class="validation-success">
          <n-alert type="success" :show-icon="true" style="margin-bottom: 8px">
            <template #header>
              {{ t('mcpserverdetailcomponent.yaml_no_errors') }}
            </template>
          </n-alert>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="action-section">
        <n-space justify="end">
          <n-button @click="copyToClipboard" :disabled="!yamlContent">
            <template #icon>
              <n-icon>
                <CopyIcon />
              </n-icon>
            </template>
            {{ t('common.copy') }}
          </n-button>
          <n-button @click="handleCancel">
            {{ t('common.cancel') }}
          </n-button>
          <n-button type="primary" @click="handleUpdate" :loading="updating" :disabled="!isValid">
            {{ t('common.update') }}
          </n-button>
        </n-space>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NModal,
  NAlert,
  NSpace,
  NButton,
  NIcon,
  NSpin,
  NTag,
  useMessage,
  useDialog
} from 'naive-ui';
import { CopyOutline as CopyIcon, CloseCircleOutline, WarningOutline } from '@vicons/ionicons5';
import CodeMirror from '@/components/config/CodeMirror';
import { solarizedDark } from '@/components/config/cm6theme';
import { namespaceStore } from '@/data/namespace';
import { yaml } from '@codemirror/lang-yaml';
import * as YAML from 'js-yaml';
import type { McpTool } from '@/types/mcpserver';
import { toolSpecApi } from '@/api/toolspec';

const { t } = useI18n();
const message = useMessage();
const dialog = useDialog();

// Props 和 Emits 定义
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  serverData: {
    type: Object,
    required: true
  },
  currentNamespace: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:visible', 'update:success']);

// 响应式数据
const yamlContent = ref('');
const originalYamlContent = ref('');
const updating = ref(false);
const validating = ref(false);
const validationErrors = ref<string[]>([]);
const validationWarnings = ref<string[]>([]);
const focusValue = ref(0);

// CodeMirror 配置
const extensions = [solarizedDark];
const yamlLang = yaml();

// 计算属性
const visible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value)
});

// 验证状态
const isValid = computed(() => {
  // 如果内容为空，不允许更新
  if (!yamlContent.value.trim()) {
    return false;
  }
  
  // 如果内容没有改变，允许更新（相当于确认操作）
  if (yamlContent.value === originalYamlContent.value) {
    return true;
  }
  
  // 如果内容有改变，需要验证通过才能更新
  return validationErrors.value.length === 0;
});

// 检查是否有未保存的更改
const hasUnsavedChanges = computed(() => {
  return yamlContent.value !== originalYamlContent.value;
});

// 生成 YAML 内容
const generateYamlContent = (): string => {
  if (!props.serverData) {
    return '';
  }

  const yamlData = {
    uniqueKey: props.serverData.uniqueKey || '',
    name: props.serverData.name || '',
    description: props.serverData.description || '',
    authKeys: props.serverData.authKeys || [],
    tools: (props.serverData.currentValue?.tools || []).map((tool: McpTool) => ({
      toolName: tool.toolKey.toolName,
      toolGroup: tool.toolKey.group,
      routeRule: {
        protocol: tool.routeRule.protocol,
        url: tool.routeRule.url,
        method: tool.routeRule.method,
        convertType: tool.routeRule.convertType,
        serviceGroup: tool.routeRule.serviceGroup,
        serviceName: tool.routeRule.serviceName,
        ruleType: tool.routeRule.ruleType,
        additionHeaders: tool.routeRule.additionHeaders || {}
      }
    }))
  };

  try {
    // 使用 js-yaml 库进行字符串化
    return YAML.dump(yamlData, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false
    });
  } catch (error) {
    console.error('生成 YAML 内容失败:', error);
    return '';
  }
};

// YAML 数据验证结果接口
interface ValidationResult {
  errors: string[];
  warnings: string[];
}

// YAML 数据验证
const validateYamlData = (data: any): ValidationResult => {
  const result: ValidationResult = {
    errors: [],
    warnings: []
  };

  if (!data || typeof data !== 'object') {
    result.errors.push(t('mcpserverdetailcomponent.yaml_content_must_be_object'));
    return result;
  }

  // 验证必需字段
  if (!data.uniqueKey) {
    result.errors.push(t('mcpserverdetailcomponent.yaml_field_required', { field: 'uniqueKey' }));
  } else if (typeof data.uniqueKey !== 'string') {
    result.errors.push(t('mcpserverdetailcomponent.yaml_field_type_error', { field: 'uniqueKey (应为字符串)' }));
  }

  if (!data.name) {
    result.errors.push(t('mcpserverdetailcomponent.yaml_field_required', { field: 'name' }));
  } else if (typeof data.name !== 'string') {
    result.errors.push(t('mcpserverdetailcomponent.yaml_field_type_error', { field: 'name (应为字符串)' }));
  }

  if (data.description !== undefined && typeof data.description !== 'string') {
    result.errors.push(t('mcpserverdetailcomponent.yaml_field_type_error', { field: 'description (应为字符串)' }));
  }

  if (data.authKeys !== undefined && !Array.isArray(data.authKeys)) {
    result.errors.push(t('mcpserverdetailcomponent.yaml_field_type_error', { field: 'authKeys (应为数组)' }));
  } else if (Array.isArray(data.authKeys)) {
    // 验证 authKeys 数组中的每个元素
    data.authKeys.forEach((key: any, index: number) => {
      if (typeof key !== 'string') {
        result.errors.push(t('mcpserverdetailcomponent.yaml_field_type_error', { field: `authKeys[${index}] (应为字符串)` }));
      }
    });

    // 检查空的认证密钥
    if (data.authKeys.length === 0) {
      result.warnings.push('建议至少配置一个认证密钥');
    }
  }

  if (!Array.isArray(data.tools)) {
    result.errors.push(t('mcpserverdetailcomponent.yaml_field_type_error', { field: 'tools (应为数组)' }));
  } else {
    // 验证工具数组中的每个工具
    const toolKeys = new Set<string>();

    data.tools.forEach((tool: any, index: number) => {
      if (!tool || typeof tool !== 'object') {
        result.errors.push(`工具 [${index}] 必须是对象`);
        return;
      }

      const toolDisplayName = tool.toolName || `工具[${index}]`;

      if (!tool.toolName) {
        result.errors.push(`${toolDisplayName}: ${t('mcpserverdetailcomponent.yaml_field_required', { field: 'toolName' })}`);
      } else if (typeof tool.toolName !== 'string') {
        result.errors.push(`${toolDisplayName}: ${t('mcpserverdetailcomponent.yaml_field_type_error', { field: 'toolName (应为字符串)' })}`);
      }

      if (!tool.toolGroup) {
        result.errors.push(`${toolDisplayName}: ${t('mcpserverdetailcomponent.yaml_field_required', { field: 'toolGroup' })}`);
      } else if (typeof tool.toolGroup !== 'string') {
        result.errors.push(`${toolDisplayName}: ${t('mcpserverdetailcomponent.yaml_field_type_error', { field: 'toolGroup (应为字符串)' })}`);
      }

      // 检查工具名称和组的唯一性
      if (tool.toolName && tool.toolGroup) {
        const toolKey = `${tool.toolName}:${tool.toolGroup}`;
        if (toolKeys.has(toolKey)) {
          result.errors.push(`${t('mcpserverdetailcomponent.yaml_duplicate_tool')}: "${tool.toolName}" (组: "${tool.toolGroup}")`);
        } else {
          toolKeys.add(toolKey);
        }
      }

      if (!tool.routeRule || typeof tool.routeRule !== 'object') {
        result.errors.push(`${toolDisplayName}: ${t('mcpserverdetailcomponent.yaml_field_required', { field: 'routeRule (应为对象)' })}`);
      } else {
        const routeRule = tool.routeRule;
        const requiredFields = ['protocol', 'url', 'method', 'convertType', 'serviceGroup', 'serviceName'];

        requiredFields.forEach(field => {
          if (!routeRule[field]) {
            result.errors.push(`${toolDisplayName}: ${t('mcpserverdetailcomponent.yaml_field_required', { field: `routeRule.${field}` })}`);
          } else if (typeof routeRule[field] !== 'string') {
            result.errors.push(`${toolDisplayName}: ${t('mcpserverdetailcomponent.yaml_field_type_error', { field: `routeRule.${field} (应为字符串)` })}`);
          }
        });

        // 验证 protocol 值
        if (routeRule.protocol && !['http', 'https'].includes(routeRule.protocol.toLowerCase())) {
          result.errors.push(`${toolDisplayName}: ${t('mcpserverdetailcomponent.yaml_invalid_protocol')} (当前值: ${routeRule.protocol})`);
        }

        // 验证 method 值
        if (routeRule.method && !['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(routeRule.method.toUpperCase())) {
          result.errors.push(`${toolDisplayName}: ${t('mcpserverdetailcomponent.yaml_invalid_method')} (当前值: ${routeRule.method})`);
        }

        // 验证 URL 格式
        if (routeRule.url) {
          const isValidUrl = routeRule.url.startsWith('/') ||
            routeRule.url.startsWith('http://') ||
            routeRule.url.startsWith('https://');
          if (!isValidUrl) {
            result.errors.push(`${toolDisplayName}: ${t('mcpserverdetailcomponent.yaml_invalid_url')} - URL 必须以 '/'、'http://' 或 'https://' 开头 (当前值: ${routeRule.url})`);
          }

          // 检查 URL 中的模板变量
          const templateVars = routeRule.url.match(/\{\{[^}]+\}\}/g);
          if (templateVars) {
            const supportedVars = ['{{ip}}', '{{port}}', '{{ip_port}}'];
            const unsupportedVars = templateVars.filter((v: string) => !supportedVars.includes(v));
            if (unsupportedVars.length > 0) {
              result.warnings.push(`${toolDisplayName}: URL 中包含不支持的模板变量: ${unsupportedVars.join(', ')}，支持的变量: ${supportedVars.join(', ')}`);
            }
          }
        }

        // 验证 convertType 值
        if (routeRule.convertType && !['NONE', 'FORM_TO_JSON', 'CUSTOM'].includes(routeRule.convertType)) {
          result.warnings.push(`${toolDisplayName}: convertType 值可能不正确 (当前值: ${routeRule.convertType})，建议使用: NONE, FORM_TO_JSON, CUSTOM`);
        }

        if (routeRule.additionHeaders !== undefined && typeof routeRule.additionHeaders !== 'object') {
          result.errors.push(`${toolDisplayName}: ${t('mcpserverdetailcomponent.yaml_field_type_error', { field: 'routeRule.additionHeaders (应为对象)' })}`);
        } else if (routeRule.additionHeaders) {
          // 验证 headers 对象中的每个值
          Object.entries(routeRule.additionHeaders).forEach(([key, value]) => {
            if (typeof value !== 'string') {
              result.errors.push(`${toolDisplayName}: ${t('mcpserverdetailcomponent.yaml_field_type_error', { field: `routeRule.additionHeaders.${key} (应为字符串)` })}`);
            }
          });
        }
      }
    });

    // 检查工具数量
    if (data.tools.length === 0) {
      result.warnings.push('当前没有配置任何工具，建议至少配置一个工具');
    } else if (data.tools.length > 50) {
      result.warnings.push(`工具数量较多 (${data.tools.length} 个)，可能影响性能`);
    }
  }

  return result;
};

// 解析 YAML 内容
const parseYamlContent = (content: string): any => {
  try {
    validationErrors.value = [];
    validationWarnings.value = [];

    if (!content.trim()) {
      validationErrors.value.push(t('mcpserverdetailcomponent.yaml_content_empty'));
      return null;
    }

    // 使用 js-yaml 解析 YAML 内容
    const parsedData = YAML.load(content, {
      // 安全模式，防止执行任意代码
      schema: YAML.CORE_SCHEMA,
      // 不允许重复的键
      json: true
    });

    // 检查解析结果
    if (parsedData === null || parsedData === undefined) {
      validationErrors.value.push('YAML 内容解析为空值');
      return null;
    }

    // 验证解析后的数据结构
    const validationResult = validateYamlData(parsedData);
    validationErrors.value = validationResult.errors;
    validationWarnings.value = validationResult.warnings;

    if (validationResult.errors.length > 0) {
      return null;
    }

    return parsedData;
  } catch (error) {
    let errorMessage = '';
    let errorType = t('mcpserverdetailcomponent.yaml_parse_error');

    if (error instanceof YAML.YAMLException) {
      // YAML 语法错误
      errorType = t('mcpserverdetailcomponent.yaml_syntax_error');
      const mark = error.mark;
      if (mark) {
        errorMessage = `第 ${mark.line + 1} 行，第 ${mark.column + 1} 列: ${error.reason}`;

        // 提供更友好的错误提示
        if (error.reason?.includes('unexpected')) {
          errorMessage += '\n提示：请检查 YAML 语法，确保缩进正确且使用空格而非制表符';
        } else if (error.reason?.includes('duplicate')) {
          errorMessage += '\n提示：发现重复的键，请检查并移除重复项';
        } else if (error.reason?.includes('mapping')) {
          errorMessage += '\n提示：对象格式错误，请检查键值对的格式';
        }
      } else {
        errorMessage = error.reason || error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;

      // 针对常见错误提供友好提示
      if (errorMessage.includes('Unexpected token')) {
        errorMessage += '\n提示：可能存在语法错误，请检查引号、括号是否匹配';
      }
    } else {
      errorMessage = String(error);
    }

    validationErrors.value = [`${errorType}: ${errorMessage}`];
    validationWarnings.value = [];
    return null;
  }
};

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(yamlContent.value);
    message.success(t('common.copy_success'));
  } catch (error) {
    console.error('复制失败:', error);
    message.error(t('common.copy_failed'));
  }
};

// 处理取消操作
const handleCancel = () => {
  // 检查是否有未保存的更改
  if (hasUnsavedChanges.value) {
    // 显示确认对话框
    dialog.warning({
      title: t('common.confirm'),
      content: t('mcpserver.unsaved_changes_warning', '您有未保存的更改，确定要取消吗？'),
      positiveText: t('common.confirm'),
      negativeText: t('common.cancel'),
      onPositiveClick: () => {
        // 用户确认取消，关闭模态窗口
        visible.value = false;
      },
      onNegativeClick: () => {
        // 用户选择不取消，什么都不做
      }
    });
  } else {
    // 没有未保存的更改，直接关闭
    visible.value = false;
  }
};

// YAML 工具数据接口定义
interface YamlToolData {
  toolName: string;
  toolGroup: string;
  routeRule: {
    protocol: string;
    url: string;
    method: string;
    convertType: string;
    serviceGroup: string;
    serviceName: string;
    ruleType?: string;
    additionHeaders: Record<string, string>;
  };
}

// 工具更新结果接口
interface ToolUpdateResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  updatedTools: number;
  addedTools: number;
  removedTools: number;
  updatedToolsList: McpTool[];
}

// 获取工具规格的辅助函数
const fetchToolSpecWithErrorHandling = async (
  tool: McpTool,
  yamlTool: YamlToolData,
  namespace: string,
  result: ToolUpdateResult
): Promise<void> => {
  const toolKey = `${namespace}/${yamlTool.toolGroup}/${yamlTool.toolName}`;

  try {
    const toolSpec = await toolSpecApi.getToolSpecWithErrorHandling({
      namespace: namespace,
      group: yamlTool.toolGroup,
      toolName: yamlTool.toolName
    });

    if (toolSpec && toolSpec.function) {
      tool.spec = toolSpec.function;
      console.log(`✓ 成功获取工具规格: ${toolKey}`);
    } else {
      const warningMsg = `${t('mcpserverdetailcomponent.yaml_tool_spec_not_found')}: ${toolKey}`;
      result.warnings.push(warningMsg);
      console.warn(`⚠ ${warningMsg}`);

      // 使用默认规格
      tool.spec = createDefaultToolSpec(yamlTool.toolName);
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const warningMsg = `${t('mcpserverdetailcomponent.yaml_tool_spec_fetch_failed')}: ${toolKey} - ${errorMsg}`;
    result.warnings.push(warningMsg);
    console.warn(`⚠ ${warningMsg}`, error);

    // 使用默认规格
    tool.spec = createDefaultToolSpec(yamlTool.toolName);
  }
};

// 创建默认工具规格
const createDefaultToolSpec = (toolName: string) => ({
  name: toolName,
  description: `Tool: ${toolName}`,
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  }
});

// 实现工具数据更新逻辑
const updateToolsFromYaml = async (
  yamlTools: YamlToolData[],
  currentTools: McpTool[],
  namespace: string
): Promise<ToolUpdateResult> => {
  const result: ToolUpdateResult = {
    success: true,
    errors: [],
    warnings: [],
    updatedTools: 0,
    addedTools: 0,
    removedTools: 0,
    updatedToolsList: []
  };

  try {
    const updatedTools: McpTool[] = [];
    const toolMap = new Map<string, McpTool>();

    // 创建现有工具的映射，以 toolName + toolGroup 为联合主键
    currentTools.forEach(tool => {
      const key = `${tool.toolKey.toolName}:${tool.toolKey.group}`;
      toolMap.set(key, tool);
    });

    // 处理 YAML 中的工具
    for (const yamlTool of yamlTools) {
      const key = `${yamlTool.toolName}:${yamlTool.toolGroup}`;
      const existingTool = toolMap.get(key);

      if (existingTool) {
        // 更新现有工具
        const updatedTool: McpTool = {
          ...existingTool,
          toolName: yamlTool.toolName, // 更新工具名称
          toolKey: {
            ...existingTool.toolKey,
            namespace: namespace, // 设置正确的命名空间
            group: yamlTool.toolGroup,
            toolName: yamlTool.toolName
          },
          routeRule: {
            ...yamlTool.routeRule,
            serviceNamespace: namespace, // 设置服务命名空间
            convertType: yamlTool.routeRule.convertType as 'NONE' | 'FORM_TO_JSON' | 'CUSTOM',
            additionHeaders: yamlTool.routeRule.additionHeaders || {}
          }
        };

        // 尝试获取工具规格
        await fetchToolSpecWithErrorHandling(updatedTool, yamlTool, namespace, result);

        updatedTools.push(updatedTool);
        toolMap.delete(key); // 从映射中移除，剩余的将被删除
        result.updatedTools++;

      } else {
        // 创建新工具
        const newTool: McpTool = {
          id: 0, // 新工具ID为0，后端会分配新ID
          toolName: yamlTool.toolName,
          toolKey: {
            namespace: namespace,
            group: yamlTool.toolGroup,
            toolName: yamlTool.toolName
          },
          toolVersion: 1, // 新工具版本从1开始
          routeRule: {
            ...yamlTool.routeRule,
            serviceNamespace: namespace, // 设置服务命名空间
            convertType: yamlTool.routeRule.convertType as 'NONE' | 'FORM_TO_JSON' | 'CUSTOM',
            additionHeaders: yamlTool.routeRule.additionHeaders || {}
          },
          spec: {
            name: yamlTool.toolName,
            description: `Tool: ${yamlTool.toolName}`,
            inputSchema: {}
          }
        };

        // 尝试获取工具规格
        await fetchToolSpecWithErrorHandling(newTool, yamlTool, namespace, result);

        updatedTools.push(newTool);
        result.addedTools++;
      }
    }

    // 统计被删除的工具数量（剩余在 toolMap 中的工具）
    result.removedTools = toolMap.size;

    // 如果有工具被删除，记录警告信息
    if (result.removedTools > 0) {
      const removedToolNames = Array.from(toolMap.keys());
      result.warnings.push(`以下工具将被删除: ${removedToolNames.join(', ')}`);
    }

    result.updatedToolsList = updatedTools;

    console.log('工具更新结果:', {
      总工具数: updatedTools.length,
      更新工具数: result.updatedTools,
      新增工具数: result.addedTools,
      删除工具数: result.removedTools,
      警告数: result.warnings.length,
      成功获取规格的工具数: updatedTools.filter(tool => tool.spec && tool.spec.inputSchema && typeof tool.spec.inputSchema === 'object' && Object.keys(tool.spec.inputSchema).length > 1).length
    });

  } catch (error) {
    result.success = false;
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(`工具更新过程中发生错误: ${errorMessage}`);
    console.error('工具更新失败:', error);
  }

  return result;
};

// 更新服务器数据对象
const updateServerData = (parsedData: any, toolUpdateResult: ToolUpdateResult): any => {
  // 创建更新后的 serverData 对象
  const updatedServerData = {
    ...props.serverData,
    // 更新主属性
    uniqueKey: parsedData.uniqueKey,
    name: parsedData.name,
    description: parsedData.description || '',
    authKeys: parsedData.authKeys || [],
    // 确保命名空间设置正确
    namespace: namespaceStore.current.value.namespaceId,
    // 更新 currentValue.tools 数组
    currentValue: {
      ...props.serverData.currentValue,
      tools: toolUpdateResult.updatedToolsList
    }
  };

  console.log('更新后的服务器数据:', {
    主属性更新: {
      uniqueKey: `${props.serverData.uniqueKey} -> ${updatedServerData.uniqueKey}`,
      name: `${props.serverData.name} -> ${updatedServerData.name}`,
      description: `${props.serverData.description} -> ${updatedServerData.description}`,
      authKeys: `${JSON.stringify(props.serverData.authKeys)} -> ${JSON.stringify(updatedServerData.authKeys)}`,
      namespace: `${props.serverData.namespace} -> ${updatedServerData.namespace}`
    },
    工具数组更新: {
      原工具数量: props.serverData.currentValue?.tools?.length || 0,
      新工具数量: updatedServerData.currentValue.tools.length,
      更新统计: {
        更新: toolUpdateResult.updatedTools,
        新增: toolUpdateResult.addedTools,
        删除: toolUpdateResult.removedTools
      }
    }
  });

  return updatedServerData;
};

// 处理更新操作
const handleUpdate = async () => {
  if (!isValid.value) {
    message.error(t('mcpserverdetailcomponent.yaml_content_invalid'));
    return;
  }

  updating.value = true;

  // 显示更新进度提示
  const loadingMessage = message.loading(t('mcpserverdetailcomponent.yaml_update_processing'), {
    duration: 0 // 持续显示直到手动关闭
  });

  try {
    // 如果内容有改变但还没有验证过，先进行验证
    if (yamlContent.value !== originalYamlContent.value && validationErrors.value.length === 0 && validationWarnings.value.length === 0) {
      // 清除之前的定时器
      if (validationTimer) {
        window.clearTimeout(validationTimer);
        validationTimer = null;
      }
      
      // 立即进行验证
      const parsedData = parseYamlContent(yamlContent.value);
      if (!parsedData) {
        loadingMessage.destroy();
        message.error(t('mcpserverdetailcomponent.yaml_validation_failed'));
        return;
      }
    }

    // 重新解析以确保数据是最新的
    const parsedData = parseYamlContent(yamlContent.value);
    if (!parsedData) {
      loadingMessage.destroy();
      message.error(t('mcpserverdetailcomponent.yaml_validation_failed'));
      return;
    }

    // 更新工具列表
    const currentTools = props.serverData.currentValue?.tools || [];
    const toolUpdateResult = await updateToolsFromYaml(
      parsedData.tools || [],
      currentTools,
      namespaceStore.current.value.namespaceId
    );

    loadingMessage.destroy();

    if (!toolUpdateResult.success) {
      const errorMsg = toolUpdateResult.errors.join('\n');
      message.error(`${t('mcpserverdetailcomponent.yaml_update_failed')}: ${errorMsg}`, {
        duration: 10000
      });
      return;
    }

    // 处理警告信息
    if (toolUpdateResult.warnings.length > 0) {
      console.warn('工具更新警告:', toolUpdateResult.warnings);

      // 显示警告给用户，但限制数量避免过多提示
      const maxWarningsToShow = 3;
      const warningsToShow = toolUpdateResult.warnings.slice(0, maxWarningsToShow);

      // 使用对话框显示警告信息，提供更好的用户体验
      if (toolUpdateResult.warnings.length <= maxWarningsToShow) {
        // 警告数量较少，直接显示
        warningsToShow.forEach((warning, index) => {
          setTimeout(() => {
            message.warning(warning, { duration: 8000 });
          }, index * 500); // 错开显示时间
        });
      } else {
        // 警告数量较多，显示汇总
        const remainingCount = toolUpdateResult.warnings.length - maxWarningsToShow;
        dialog.warning({
          title: '更新警告',
          content: `发现 ${toolUpdateResult.warnings.length} 个警告：\n\n${warningsToShow.join('\n')}\n\n${t('mcpserverdetailcomponent.yaml_warnings_truncated', { count: remainingCount })}`,
          positiveText: '确定',
          style: 'width: 600px; max-width: 90vw;'
        });
      }
    }

    // 更新 serverData 对象
    const updatedServerData = updateServerData(parsedData, toolUpdateResult);

    // 显示更新统计信息
    const updateSummary = t('mcpserverdetailcomponent.yaml_tool_update_summary', {
      updated: toolUpdateResult.updatedTools,
      added: toolUpdateResult.addedTools,
      removed: toolUpdateResult.removedTools
    });

    console.log('✓ 更新完成:', {
      总工具数: toolUpdateResult.updatedToolsList.length,
      更新工具数: toolUpdateResult.updatedTools,
      新增工具数: toolUpdateResult.addedTools,
      删除工具数: toolUpdateResult.removedTools,
      警告数: toolUpdateResult.warnings.length
    });

    // 显示成功消息
    message.success(`${t('mcpserverdetailcomponent.yaml_update_success')} - ${updateSummary}`, {
      duration: 5000
    });

    emit('update:success', updatedServerData);
    visible.value = false;

  } catch (error) {
    loadingMessage.destroy();
    console.error('❌ 更新失败:', error);

    let errorMessage = '';
    if (error instanceof Error) {
      errorMessage = error.message;

      // 针对常见错误提供友好提示
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage += '\n提示：请检查网络连接或服务器状态';
      } else if (errorMessage.includes('timeout')) {
        errorMessage += '\n提示：请求超时，请稍后重试';
      } else if (errorMessage.includes('permission')) {
        errorMessage += '\n提示：权限不足，请联系管理员';
      }
    } else {
      errorMessage = String(error);
    }

    // 使用对话框显示详细错误信息
    dialog.error({
      title: t('mcpserverdetailcomponent.yaml_update_failed'),
      content: errorMessage,
      positiveText: '确定',
      style: 'width: 500px; max-width: 90vw;'
    });

  } finally {
    updating.value = false;
  }
};

// 编辑器焦点处理
const focusEditor = () => {
  focusValue.value += 1;
};

// 阻止事件冒泡
const stopPropagation = (e: Event) => {
  //e.stopPropagation();
  //return false;
};

// 防抖定时器
let validationTimer: number | null = null;

// 监听 visible 变化，初始化 YAML 内容
watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible && props.serverData) {
      nextTick(() => {
        const content = generateYamlContent();
        yamlContent.value = content;
        originalYamlContent.value = content; // 保存原始内容用于比较

        // 刚打开时不进行验证，只清除验证状态
        validationErrors.value = [];
        validationWarnings.value = [];
        validating.value = false;

        // 清除定时器
        if (validationTimer) {
          window.clearTimeout(validationTimer);
          validationTimer = null;
        }
      });
    } else if (!newVisible) {
      // 关闭时清理状态
      validating.value = false;
      if (validationTimer) {
        window.clearTimeout(validationTimer);
        validationTimer = null;
      }
    }
  },
  { immediate: true }
);

/*
// 监听 YAML 内容变化，进行实时验证
watch(
  yamlContent,
  (newContent) => {
    // 清除之前的定时器
    if (validationTimer) {
      window.clearTimeout(validationTimer);
      validating.value = false;
    }

    // 只有当内容与原始内容不同时才进行验证（即用户实际编辑了内容）
    if (newContent.trim() && newContent !== originalYamlContent.value) {
      // 显示验证进度
      validating.value = true;

      // 防抖验证，500ms 后执行（稍微延长时间，避免频繁验证）
      validationTimer = window.setTimeout(() => {
        try {
          parseYamlContent(newContent);
        } finally {
          validating.value = false;
        }
      }, 500);
    } else if (newContent === originalYamlContent.value) {
      // 如果内容恢复到原始状态，清除验证状态
      validationErrors.value = [];
      validationWarnings.value = [];
      validating.value = false;
    } else if (!newContent.trim()) {
      // 内容为空时立即清除错误和警告
      validationErrors.value = [];
      validationWarnings.value = [];
      validating.value = false;
    }
  }
);
*/

// 组件卸载时清理定时器
onUnmounted(() => {
  if (validationTimer) {
    window.clearTimeout(validationTimer);
    validationTimer = null;
  }
});
</script>

<style scoped>
.yaml-editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #002b36;
}

.editor-section {
  flex: 1;
  margin-bottom: 16px;
}

.editor-wrapper {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  background-color: #002b36;
}

.validation-section {
  margin-bottom: 16px;
}

.validation-progress {
  margin-bottom: 8px;
}

.validation-errors,
.validation-warnings,
.validation-success {
  margin-bottom: 8px;
}

.error-list,
.warning-list {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 8px;
}

.error-item,
.warning-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 4px;
  padding: 4px 0;
  line-height: 1.4;
  word-break: break-word;
}

.error-item:last-child,
.warning-item:last-child {
  margin-bottom: 0;
}

.action-section {
  flex-shrink: 0;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .yaml-editor-container {
    padding: 8px;
  }
}
</style>