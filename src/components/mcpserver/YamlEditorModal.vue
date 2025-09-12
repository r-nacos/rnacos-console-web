<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    :title="t('mcpserver.yaml_editor')"
    size="huge"
    :mask-closable="false"
    :closable="false"
    style="width: 90%; max-width: 1200px; height: 80vh"
  >
    <div class="yaml-editor-container">
      <!-- 编辑器区域 -->
      <div class="editor-section">
        <div class="editor-wrapper" @click="focusEditor">
          <div @click="stopPropagation">
            <code-mirror
              v-model="yamlContent"
              :foucsValue="focusValue"
              :lang="yamlLang"
              :extensions="extensions"
              :readonly="false"
              :basic="true"
              :tab="true"
              :wrap="true"
            />
          </div>
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
          <n-button
            v-if="mode !== 'detail'"
            type="primary"
            @click="handleUpdate"
          >
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
import {
  CopyOutline as CopyIcon,
  CloseCircleOutline,
  WarningOutline
} from '@vicons/ionicons5';
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
  mode: {
    type: String,
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
    tools: (props.serverData.currentValue?.tools || []).map(
      (tool: McpTool) => ({
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
      })
    )
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
    result.errors.push(
      t('mcpserverdetailcomponent.yaml_content_must_be_object')
    );
    return result;
  }

  // 验证必需字段
  if (!data.uniqueKey) {
    result.errors.push(
      t('mcpserverdetailcomponent.yaml_field_required', { field: 'uniqueKey' })
    );
  } else if (typeof data.uniqueKey !== 'string') {
    result.errors.push(
      t('mcpserverdetailcomponent.yaml_field_type_error', {
        field: 'uniqueKey (应为字符串)'
      })
    );
  }

  if (!data.name) {
    result.errors.push(
      t('mcpserverdetailcomponent.yaml_field_required', { field: 'name' })
    );
  } else if (typeof data.name !== 'string') {
    result.errors.push(
      t('mcpserverdetailcomponent.yaml_field_type_error', {
        field: 'name (应为字符串)'
      })
    );
  }

  if (data.description !== undefined && typeof data.description !== 'string') {
    result.errors.push(
      t('mcpserverdetailcomponent.yaml_field_type_error', {
        field: 'description (应为字符串)'
      })
    );
  }

  if (data.authKeys !== undefined && !Array.isArray(data.authKeys)) {
    result.errors.push(
      t('mcpserverdetailcomponent.yaml_field_type_error', {
        field: 'authKeys (应为数组)'
      })
    );
  } else if (Array.isArray(data.authKeys)) {
    // 验证 authKeys 数组中的每个元素
    data.authKeys.forEach((key: any, index: number) => {
      if (typeof key !== 'string') {
        result.errors.push(
          t('mcpserverdetailcomponent.yaml_field_type_error', {
            field: `authKeys[${index}] (应为字符串)`
          })
        );
      }
    });

    // 检查空的认证密钥
    if (data.authKeys.length === 0) {
      result.warnings.push(
        t('mcpserverdetailcomponent.yaml_auth_keys_warning')
      );
    }
  }

  if (!Array.isArray(data.tools)) {
    result.errors.push(
      t('mcpserverdetailcomponent.yaml_field_type_error', {
        field: 'tools (应为数组)'
      })
    );
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
        result.errors.push(
          `${toolDisplayName}: ${t(
            'mcpserverdetailcomponent.yaml_field_required',
            { field: 'toolName' }
          )}`
        );
      } else if (typeof tool.toolName !== 'string') {
        result.errors.push(
          `${toolDisplayName}: ${t(
            'mcpserverdetailcomponent.yaml_field_type_error',
            { field: 'toolName (应为字符串)' }
          )}`
        );
      }

      if (!tool.toolGroup) {
        result.errors.push(
          `${toolDisplayName}: ${t(
            'mcpserverdetailcomponent.yaml_field_required',
            { field: 'toolGroup' }
          )}`
        );
      } else if (typeof tool.toolGroup !== 'string') {
        result.errors.push(
          `${toolDisplayName}: ${t(
            'mcpserverdetailcomponent.yaml_field_type_error',
            { field: 'toolGroup (应为字符串)' }
          )}`
        );
      }

      // 检查工具名称和组的唯一性
      if (tool.toolName && tool.toolGroup) {
        const toolKey = `${tool.toolName}:${tool.toolGroup}`;
        if (toolKeys.has(toolKey)) {
          result.errors.push(
            `${t('mcpserverdetailcomponent.yaml_duplicate_tool')}: "${
              tool.toolName
            }" (组: "${tool.toolGroup}")`
          );
        } else {
          toolKeys.add(toolKey);
        }
      }

      if (!tool.routeRule || typeof tool.routeRule !== 'object') {
        result.errors.push(
          `${toolDisplayName}: ${t(
            'mcpserverdetailcomponent.yaml_field_required',
            { field: 'routeRule (应为对象)' }
          )}`
        );
      } else {
        const routeRule = tool.routeRule;
        const requiredFields = [
          'protocol',
          'url',
          'method',
          'convertType',
          'serviceGroup',
          'serviceName'
        ];

        requiredFields.forEach((field) => {
          if (!routeRule[field]) {
            result.errors.push(
              `${toolDisplayName}: ${t(
                'mcpserverdetailcomponent.yaml_field_required',
                { field: `routeRule.${field}` }
              )}`
            );
          } else if (typeof routeRule[field] !== 'string') {
            result.errors.push(
              `${toolDisplayName}: ${t(
                'mcpserverdetailcomponent.yaml_field_type_error',
                { field: `routeRule.${field} (应为字符串)` }
              )}`
            );
          }
        });

        // 验证 protocol 值
        if (
          routeRule.protocol &&
          !['http', 'https'].includes(routeRule.protocol.toLowerCase())
        ) {
          result.errors.push(
            `${toolDisplayName}: ${t(
              'mcpserverdetailcomponent.yaml_invalid_protocol'
            )} (当前值: ${routeRule.protocol})`
          );
        }

        // 验证 method 值
        if (
          routeRule.method &&
          !['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(
            routeRule.method.toUpperCase()
          )
        ) {
          result.errors.push(
            `${toolDisplayName}: ${t(
              'mcpserverdetailcomponent.yaml_invalid_method'
            )} (当前值: ${routeRule.method})`
          );
        }

        // 验证 URL 格式
        if (routeRule.url) {
          const isValidUrl =
            routeRule.url.startsWith('/') ||
            routeRule.url.startsWith('http://') ||
            routeRule.url.startsWith('https://');
          if (!isValidUrl) {
            result.errors.push(
              `${toolDisplayName}: ${t(
                'mcpserverdetailcomponent.yaml_invalid_url'
              )} - URL 必须以 '/'、'http://' 或 'https://' 开头 (当前值: ${
                routeRule.url
              })`
            );
          }

          // 检查 URL 中的模板变量
          const templateVars = routeRule.url.match(/\{\{[^}]+\}\}/g);
          if (templateVars) {
            const supportedVars = ['{{ip}}', '{{port}}', '{{ip_port}}'];
            const unsupportedVars = templateVars.filter(
              (v: string) => !supportedVars.includes(v)
            );
            if (unsupportedVars.length > 0) {
              result.warnings.push(
                `${toolDisplayName}: ${t(
                  'mcpserverdetailcomponent.yaml_unsupported_template_vars',
                  {
                    vars: unsupportedVars.join(', '),
                    supported: supportedVars.join(', ')
                  }
                )}`
              );
            }
          }
        }

        // 验证 convertType 值
        if (
          routeRule.convertType &&
          !['NONE', 'JSON_TO_FORM', 'JSON_TO_URL', 'CUSTOM'].includes(
            routeRule.convertType
          )
        ) {
          result.warnings.push(
            `${toolDisplayName}: ${t(
              'mcpserverdetailcomponent.yaml_convert_type_warning',
              { value: routeRule.convertType }
            )}`
          );
        }

        if (
          routeRule.additionHeaders !== undefined &&
          typeof routeRule.additionHeaders !== 'object'
        ) {
          result.errors.push(
            `${toolDisplayName}: ${t(
              'mcpserverdetailcomponent.yaml_field_type_error',
              { field: 'routeRule.additionHeaders (应为对象)' }
            )}`
          );
        } else if (routeRule.additionHeaders) {
          // 验证 headers 对象中的每个值
          Object.entries(routeRule.additionHeaders).forEach(([key, value]) => {
            if (typeof value !== 'string') {
              result.errors.push(
                `${toolDisplayName}: ${t(
                  'mcpserverdetailcomponent.yaml_field_type_error',
                  { field: `routeRule.additionHeaders.${key} (应为字符串)` }
                )}`
              );
            }
          });
        }
      }
    });

    // 检查工具数量
    if (data.tools.length === 0) {
      result.warnings.push(t('mcpserverdetailcomponent.yaml_no_tools_warning'));
    } else if (data.tools.length > 50) {
      result.warnings.push(
        t('mcpserverdetailcomponent.yaml_too_many_tools_warning', {
          count: data.tools.length
        })
      );
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
      const errorMsg = t('mcpserverdetailcomponent.yaml_content_empty');
      validationErrors.value.push(errorMsg);
      message.error(errorMsg);
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
      const errorMsg = 'YAML 内容解析为空值';
      validationErrors.value.push(errorMsg);
      message.error(errorMsg);
      return null;
    }

    // 验证解析后的数据结构
    const validationResult = validateYamlData(parsedData);
    validationErrors.value = validationResult.errors;
    validationWarnings.value = validationResult.warnings;

    // 通过message显示错误和警告
    if (validationResult.errors.length > 0) {
      validationResult.errors.forEach((error) => {
        message.error(error, { duration: 5000 });
      });
      return null;
    }

    if (validationResult.warnings.length > 0) {
      validationResult.warnings.forEach((warning) => {
        message.warning(warning, { duration: 4000 });
      });
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
        errorMessage = `第 ${mark.line + 1} 行，第 ${mark.column + 1} 列: ${
          error.reason
        }`;

        // 提供更友好的错误提示
        if (error.reason?.includes('unexpected')) {
          errorMessage +=
            '\n提示：请检查 YAML 语法，确保缩进正确且使用空格而非制表符';
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

    const fullErrorMsg = `${errorType}: ${errorMessage}`;
    validationErrors.value = [fullErrorMsg];
    validationWarnings.value = [];
    message.error(fullErrorMsg, { duration: 6000 });
    return null;
  }
};

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(yamlContent.value);
    message.success(t('common.copy_success'));
  } catch (error) {
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
      content: t(
        'mcpserver.unsaved_changes_warning',
        '您有未保存的更改，确定要取消吗？'
      ),
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
    } else {
      const warningMsg = `${t(
        'mcpserverdetailcomponent.yaml_tool_spec_not_found'
      )}: ${toolKey}`;
      result.warnings.push(warningMsg);

      // 使用默认规格
      tool.spec = createDefaultToolSpec(yamlTool.toolName);
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const warningMsg = `${t(
      'mcpserverdetailcomponent.yaml_tool_spec_fetch_failed'
    )}: ${toolKey} - ${errorMsg}`;
    result.warnings.push(warningMsg);

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
    currentTools.forEach((tool) => {
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
            convertType: yamlTool.routeRule.convertType as
              | 'NONE'
              | 'JSON_TO_FORM'
              | 'JSON_TO_URL'
              | 'CUSTOM',
            additionHeaders: yamlTool.routeRule.additionHeaders || {}
          }
        };

        // 尝试获取工具规格
        await fetchToolSpecWithErrorHandling(
          updatedTool,
          yamlTool,
          namespace,
          result
        );

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
            convertType: yamlTool.routeRule.convertType as
              | 'NONE'
              | 'JSON_TO_FORM'
              | 'JSON_TO_URL'
              | 'CUSTOM',
            additionHeaders: yamlTool.routeRule.additionHeaders || {}
          },
          spec: {
            name: yamlTool.toolName,
            description: `Tool: ${yamlTool.toolName}`,
            inputSchema: {}
          }
        };

        // 尝试获取工具规格
        await fetchToolSpecWithErrorHandling(
          newTool,
          yamlTool,
          namespace,
          result
        );

        updatedTools.push(newTool);
        result.addedTools++;
      }
    }

    // 统计被删除的工具数量（剩余在 toolMap 中的工具）
    result.removedTools = toolMap.size;

    // 如果有工具被删除，记录警告信息
    if (result.removedTools > 0) {
      const removedToolNames = Array.from(toolMap.keys());
      result.warnings.push(
        t('mcpserverdetailcomponent.yaml_tools_will_be_removed', {
          tools: removedToolNames.join(', ')
        })
      );
    }

    result.updatedToolsList = updatedTools;
  } catch (error) {
    result.success = false;
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(
      t('mcpserverdetailcomponent.yaml_error_general', {
        message: errorMessage
      })
    );
  }

  return result;
};

// 更新服务器数据对象
const updateServerData = (
  parsedData: any,
  toolUpdateResult: ToolUpdateResult
): any => {
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

  return updatedServerData;
};

// 处理更新操作
const handleUpdate = async () => {
  parseYamlContentSilent(yamlContent.value);

  let isNotify = false;
  // 检查验证错误和警告，通过 window.$message 提示用户
  if (validationErrors.value.length > 0) {
    window.$message?.error(validationErrors.value.join('\n'), {
      duration: 5000
    });
    isNotify = true;
  }

  if (validationWarnings.value.length > 0) {
    window.$message?.warning(validationWarnings.value.join('\n'), {
      duration: 4000
    });
    isNotify = true;
  }

  if (!isValid.value) {
    if (!isNotify) {
      message.error(t('mcpserverdetailcomponent.yaml_content_invalid'));
    }
    return;
  }

  updating.value = true;

  // 显示更新进度提示
  const loadingMessage = message.loading(
    t('mcpserverdetailcomponent.yaml_update_processing'),
    {
      duration: 0 // 持续显示直到手动关闭
    }
  );

  try {
    // 清除之前的定时器
    if (validationTimer) {
      window.clearTimeout(validationTimer);
      validationTimer = null;
    }

    // 解析YAML内容
    const parsedData = parseYamlContent(yamlContent.value);
    if (!parsedData) {
      loadingMessage.destroy();
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
      message.error(
        `${t('mcpserverdetailcomponent.yaml_update_failed')}: ${errorMsg}`,
        {
          duration: 10000
        }
      );
      return;
    }

    // 处理警告信息
    if (toolUpdateResult.warnings.length > 0) {
      // 显示警告给用户，但限制数量避免过多提示
      const maxWarningsToShow = 3;
      const warningsToShow = toolUpdateResult.warnings.slice(
        0,
        maxWarningsToShow
      );

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
        const remainingCount =
          toolUpdateResult.warnings.length - maxWarningsToShow;
        dialog.warning({
          title: t('mcpserverdetailcomponent.yaml_update_warnings_title'),
          content: `${t('mcpserverdetailcomponent.yaml_warnings_found', {
            count: toolUpdateResult.warnings.length
          })}\n\n${warningsToShow.join('\n')}\n\n${t(
            'mcpserverdetailcomponent.yaml_warnings_truncated',
            { count: remainingCount }
          )}`,
          positiveText: t('mcpserverdetailcomponent.yaml_confirm_button'),
          style: 'width: 600px; max-width: 90vw;'
        });
      }
    }

    // 更新 serverData 对象
    const updatedServerData = updateServerData(parsedData, toolUpdateResult);

    // 显示更新统计信息
    const updateSummary = t(
      'mcpserverdetailcomponent.yaml_tool_update_summary',
      {
        updated: toolUpdateResult.updatedTools,
        added: toolUpdateResult.addedTools,
        removed: toolUpdateResult.removedTools
      }
    );

    // 显示成功消息
    message.success(
      `${t('mcpserverdetailcomponent.yaml_update_success')} - ${updateSummary}`,
      {
        duration: 5000
      }
    );

    emit('update:success', updatedServerData);
    visible.value = false;
  } catch (error) {
    loadingMessage.destroy();

    let errorMessage = '';
    if (error instanceof Error) {
      errorMessage = error.message;

      // 针对常见错误提供友好提示
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage +=
          '\n' + t('mcpserverdetailcomponent.yaml_error_network_hint');
      } else if (errorMessage.includes('timeout')) {
        errorMessage +=
          '\n' + t('mcpserverdetailcomponent.yaml_error_timeout_hint');
      } else if (errorMessage.includes('permission')) {
        errorMessage +=
          '\n' + t('mcpserverdetailcomponent.yaml_error_permission_hint');
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

// 静默验证YAML内容（不显示message提示）
const parseYamlContentSilent = (content: string): any => {
  try {
    validationErrors.value = [];
    validationWarnings.value = [];

    if (!content.trim()) {
      validationErrors.value.push(
        t('mcpserverdetailcomponent.yaml_content_empty')
      );
      return null;
    }

    // 使用 js-yaml 解析 YAML 内容
    const parsedData = YAML.load(content, {
      schema: YAML.CORE_SCHEMA,
      json: true
    });

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
      errorType = t('mcpserverdetailcomponent.yaml_syntax_error');
      const mark = error.mark;
      if (mark) {
        errorMessage = `第 ${mark.line + 1} 行，第 ${mark.column + 1} 列: ${
          error.reason
        }`;
      } else {
        errorMessage = error.reason || error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }

    validationErrors.value = [`${errorType}: ${errorMessage}`];
    validationWarnings.value = [];
    return null;
  }
};
</script>

<style scoped>
.yaml-editor-container {
  display: flex;
  flex-direction: column;
  height: calc(80vh - 120px);
  /* 减去模态框头部和边距的高度 */
}

.editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  /* 允许flex子项收缩 */
}

.editor-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: scroll;
  background-color: #002b36;
}

.editor-wrapper > div {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.editor-wrapper :deep(.cm-editor) {
  flex: 1;
  height: auto !important;
}

.action-section {
  flex-shrink: 0;
  padding-top: 16px;
  border-top: 1px solid var(--n-border-color);
  margin-top: 16px;
}
</style>
