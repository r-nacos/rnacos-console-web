<template>
  <div class="mcpserver-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <n-space align="center">
        <n-button text @click="handleBack">
          <template #icon>
            <n-icon><arrow-back-outline /></n-icon>
          </template>
          {{ t('mcpserver.back_to_list') }}
        </n-button>
        <n-divider vertical />
        <n-h2 style="margin: 0">{{ getPageTitle }}</n-h2>
        <n-tag :type="getModeTagType">{{ getModeTag }}</n-tag>
      </n-space>

      <n-space>
        <n-button v-if="!isEditMode && !isCreateMode" @click="enterEditMode">
          <template #icon>
            <n-icon><edit-outline /></n-icon>
          </template>
          {{ t('common.edit') }}
        </n-button>

        <n-button
          v-if="!isEditMode && !isCreateMode"
          type="primary"
          @click="publishCurrentVersion"
          :loading="publishLoading"
        >
          <template #icon>
            <n-icon><rocket-outline /></n-icon>
          </template>
          {{ t('mcpserver.publish_current_version') }}
        </n-button>

        <n-button v-if="!isEditMode && !isCreateMode" @click="showHistoryList">
          <template #icon>
            <n-icon><time-outline /></n-icon>
          </template>
          {{ t('mcpserver.view_history') }}
        </n-button>

        <n-button v-if="isEditMode || isCreateMode" @click="cancelEdit">
          {{ t('common.cancel') }}
        </n-button>

        <n-button
          v-if="isEditMode || isCreateMode"
          type="primary"
          :loading="submitting"
          @click="saveChanges"
        >
          <template #icon>
            <n-icon><checkmark-outline /></n-icon>
          </template>
          {{ isCreateMode ? t('common.create') : t('common.save') }}
        </n-button>
      </n-space>
    </div>

    <!-- 页面内容 -->
    <n-spin :show="loading">
      <div v-if="serverData || isCreateMode" class="page-content">
        <!-- 基础信息卡片 -->
        <n-card :title="t('mcpserver.basic_info')" class="info-card">
          <template v-if="isEditMode || isCreateMode">
            <mcp-server-form
              ref="mcpServerFormRef"
              v-model="formModel"
              @validate="handleFormValidate"
            />
          </template>

          <template v-else>
            <n-descriptions
              :column="3"
              label-placement="left"
              :label-align="'right'"
            >
              <n-descriptions-item :label="t('mcpserver.server_id')">
                {{ serverData?.id }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('mcpserver.server_name')">
                {{ serverData?.name }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('namespace.namespace')">
                {{ serverData?.namespace }}
              </n-descriptions-item>
              <n-descriptions-item
                :label="t('mcpserver.server_description')"
                :span="3"
              >
                {{ serverData?.description || '-' }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('mcpserver.auth_keys')" :span="3">
                <n-space>
                  <n-tag
                    v-for="(key, index) in serverData?.authKeys || []"
                    :key="index"
                    size="small"
                  >
                    {{ key }}
                  </n-tag>
                </n-space>
              </n-descriptions-item>
              <n-descriptions-item :label="t('mcpserver.create_time')">
                {{ formatTime(serverData?.createTime) }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('mcpserver.update_time')">
                {{
                  formatTime(
                    serverData?.updateTime || serverData?.lastModifiedMillis
                  )
                }}
              </n-descriptions-item>
            </n-descriptions>
          </template>
        </n-card>

        <!-- 当前服务内容卡片 -->
        <n-card
          :title="t('mcpserver.current_service_content')"
          class="info-card"
        >
          <mcpserver-value-display
            ref="mcpServerValueDisplayRef"
            :value-data="currentValueData"
            :edit-mode="isEditMode || isCreateMode"
            :allow-edit="true"
            :allow-publish="false"
            :show-actions="false"
            :show-version-info="false"
            :namespace="serverData?.namespace || formModel.namespace"
            @update:tools="handleToolsUpdate"
            @tool-add="handleToolAdd"
            @tool-edit="handleToolEdit"
            @tool-delete="handleToolDelete"
            @enter-edit-mode="enterEditMode"
          />
        </n-card>
      </div>

      <div
        v-else-if="!loading && !serverData && !isCreateMode"
        class="error-state"
      >
        <n-result
          status="error"
          :title="t('error.data_not_found')"
          :description="t('mcpserver.server_not_found')"
        >
          <template #footer>
            <n-space>
              <n-button @click="loadServerData">
                {{ t('common.refresh') }}
              </n-button>
              <n-button type="primary" @click="handleBack">
                {{ t('mcpserver.back_to_list') }}
              </n-button>
            </n-space>
          </template>
        </n-result>
      </div>
    </n-spin>

    <!-- 历史版本抽屉 -->
    <n-drawer v-model:show="showHistory" width="80%">
      <n-drawer-content :title="t('mcpserver.history_versions')">
        <mcpserver-history-list
          v-if="showHistory && serverId"
          :server-id="serverId"
          @publish-version="handlePublishHistoryVersion"
          @view-version="handleViewHistoryVersion"
        />
      </n-drawer-content>
    </n-drawer>

    <!-- 版本内容查看弹窗 -->
    <n-modal
      v-model:show="showVersionModal"
      style="width: 90%; max-width: 1200px"
    >
      <n-card
        :title="t('mcpserver.version_content')"
        :bordered="false"
        size="huge"
      >
        <template #header-extra>
          <n-button quaternary circle @click="showVersionModal = false">
            <template #icon>
              <n-icon><close-outline /></n-icon>
            </template>
          </n-button>
        </template>

        <mcpserver-value-display
          v-if="selectedVersionData"
          :value-data="selectedVersionData"
          :edit-mode="false"
          :allow-edit="false"
          :allow-rollback="true"
          :show-version-info="true"
          :show-actions="true"
          @rollback-version="handleRollbackVersion"
        />
      </n-card>
    </n-modal>

    <!-- 确认对话框 -->
    <n-modal
      v-model:show="showConfirmDialog"
      preset="dialog"
      :title="confirmDialog.title"
      :content="confirmDialog.content"
      :positive-text="t('common.confirm')"
      :negative-text="t('common.cancel')"
      @positive-click="confirmDialog.onConfirm"
      @negative-click="confirmDialog.onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  watch,
  withDefaults,
  defineProps
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import {
  NSpace,
  NButton,
  NIcon,
  NDivider,
  NH2,
  NTag,
  NSpin,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NDrawer,
  NDrawerContent,
  NModal,
  useMessage
} from 'naive-ui';
import {
  ArrowBackOutline,
  CreateOutline as EditOutline,
  CheckmarkOutline,
  RocketOutline,
  TimeOutline,
  CloseOutline
} from '@vicons/ionicons5';
import { useWebResources } from '@/data/resources';
import { namespaceStore } from '@/data/namespace';
import { mcpServerApi } from '@/api/mcpserver';
import {
  convertApiDataToFormModel,
  convertFormModelToApiParams
} from '@/api/mcpserver';
import {
  McpServerDto,
  McpServerFormModel,
  McpServerValue,
  McpServerValueDto,
  McpTool,
  ToolSpecInfo,
  McpToolEditModel,
  McpSimpleToolParams
} from '@/types/mcpserver';
import McpServerForm from '@/components/mcpserver/McpServerForm.vue';
import McpServerValueDisplay from '@/components/mcpserver/McpServerValueDisplay.vue';
import McpServerHistoryList from '@/components/mcpserver/McpServerHistoryList.vue';
import { printApiError } from '@/utils/request';

// 定义 props
interface Props {
  model?: McpServerFormModel;
}

// 定义 emits
interface Emits {
  (e: 'submit-success'): void;
  (e: 'cancel'): void;
  (e: 'close'): void;
}

const props = withDefaults(defineProps<Props>(), {
  model: undefined
});

const emit = defineEmits<Emits>();

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const message = useMessage();
const webResources = useWebResources();

// 页面状态
const loading = ref(false);
const submitting = ref(false);
const publishLoading = ref(false);
const isEditMode = ref(false);
const serverData = ref<McpServerDto | null>(null);
const formModel = ref<McpServerFormModel>({
  id: 0,
  namespace: '',
  name: '',
  description: '',
  authKeys: [],
  tools: [],
  currentValue: undefined,
  mode: 'detail'
});
const formValid = ref(false);
const mcpServerFormRef = ref();
const mcpServerValueDisplayRef = ref();

// 历史版本相关状态
const showHistory = ref(false);
const showVersionModal = ref(false);
const selectedVersionData = ref<McpServerValueDto | null>(null);

// 确认对话框状态
const showConfirmDialog = ref(false);
const confirmDialog = ref({
  title: '',
  content: '',
  onConfirm: () => {},
  onCancel: () => {
    showConfirmDialog.value = false;
  }
});

// 从路由参数获取服务器ID
const serverId = computed(() => {
  // 如果有 props.model，优先使用 props 中的 id
  if (props.model?.id) {
    return props.model.id;
  }
  // 否则从路由参数获取
  const id = Number(route.query.id || route.params.id || 0);
  return id > 0 ? id : null;
});

// 判断是否为创建模式
const isCreateMode = computed(() => {
  return formModel.value.mode === 'create' || (!serverId.value && !props.model);
});

// 页面标题
const getPageTitle = computed(() => {
  if (isCreateMode.value) {
    return t('mcpserver.create_server');
  }
  return serverData.value?.name || t('mcpserver.mcpserver_detail');
});

// 模式标签
const getModeTag = computed(() => {
  if (isCreateMode.value) {
    return t('mcpserver.create_mode');
  }
  if (isEditMode.value) {
    return t('mcpserver.edit_mode');
  }
  return t('mcpserver.view_mode');
});

// 模式标签类型
const getModeTagType = computed(() => {
  if (isCreateMode.value) {
    return 'success';
  }
  if (isEditMode.value) {
    return 'warning';
  }
  return 'info';
});

// 当前值数据
const currentValueData = computed(() => {
  // 查看模式下，如果有serverData，使用currentValue；否则尝试从props.model构造
  if (formModel.value?.currentValue) {
    console.log('currentValueData:', formModel.value.currentValue);
    return formModel.value.currentValue;
  }

  console.log('currentValueData: default');

  return {
    id: 0,
    description: formModel.value.description || '',
    tools: [],
    opUser: '',
    updateTime: Date.now(),
    createTime: Date.now(),
    isRelease: false
  } as McpServerValue;
});

// 权限检查
const canUpdateConfig = computed(() => {
  return webResources.canUpdateConfig;
});

// 格式化时间
const formatTime = (timestamp?: number) => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleString('zh-CN');
};

// 加载服务器数据
const loadServerData = async () => {
  if (!serverId.value) {
    return;
  }

  loading.value = true;
  try {
    const data = await mcpServerApi.getMcpServerWithErrorHandling(
      serverId.value
    );
    console.log('McpServer data:', data);
    if (data) {
      serverData.value = data;
      formModel.value = convertApiDataToFormModel(data, 'detail');
    } else {
      message.error(t('error.SYSTEM_ERROR'));
    }
  } catch (error) {
    console.error('Failed to load McpServer data:', error);
    message.error(t('error.SYSTEM_ERROR'));
  } finally {
    loading.value = false;
  }
};

// 返回列表
const handleBack = () => {
  router.push('/manage/mcpserver');
};

// 进入编辑模式
const enterEditMode = () => {
  isEditMode.value = true;
  formModel.value.mode = 'edit';
};

// 取消编辑
const cancelEdit = () => {
  if (isCreateMode.value) {
    // 创建模式下取消
    if (route.name === 'McpServerDetail') {
      // 如果是直接访问详情页创建，返回列表页
      handleBack();
    } else {
      // 如果是从列表页弹窗创建，触发取消事件
      emit('cancel');
    }
    return;
  }

  // 编辑模式下显示确认对话框，防止意外丢失编辑内容
  confirmDialog.value = {
    title: t('mcpserver.confirm_cancel_edit_title'),
    content: t('mcpserver.confirm_cancel_edit_content'),
    onConfirm: () => {
      // 重置编辑状态
      isEditMode.value = false;
      formModel.value.mode = 'detail';

      // 重置表单数据为原始数据
      if (serverData.value) {
        formModel.value = convertApiDataToFormModel(serverData.value, 'detail');
      }

      // 重置McpServerValueDisplay组件的编辑状态
      const valueDisplayRef = mcpServerValueDisplayRef.value;
      if (valueDisplayRef) {
        valueDisplayRef.resetEditState();
      }

      showConfirmDialog.value = false;
      message.info(t('mcpserver.edit_cancelled'));
    },
    onCancel: () => {
      showConfirmDialog.value = false;
    }
  };
  showConfirmDialog.value = true;
};

// 处理表单验证
const handleFormValidate = (isValid: boolean) => {
  formValid.value = isValid;
};

// 处理工具更新
const handleToolsUpdate = (tools: McpTool[]) => {
  // 将工具数据转换为表单模型格式
  formModel.value.tools = tools.map((tool) => ({
    id: tool.id,
    toolName: tool.toolName,
    namespace: tool.toolKey.namespace,
    group: tool.toolKey.group,
    toolVersion: tool.toolVersion,
    routeRule: tool.routeRule
  }));
};

// 处理工具添加（通过ToolSpec选择）
const handleToolAdd = (toolSpec: ToolSpecInfo) => {
  // 检查是否已存在相同的工具
  const existingTool = formModel.value.tools.find(
    (tool) =>
      tool.toolName === toolSpec.toolName &&
      tool.namespace === toolSpec.namespace &&
      tool.group === toolSpec.group
  );

  if (existingTool) {
    message.warning(t('mcpserver.tool_already_exists'));
    return;
  }

  // 创建新工具并添加到表单模型
  const newTool: McpSimpleToolParams = {
    id: Date.now(), // 临时ID，保存时由后端生成
    toolName: toolSpec.toolName,
    namespace: toolSpec.namespace,
    group: toolSpec.group,
    toolVersion: toolSpec.version,
    routeRule: {
      protocol: 'HTTP',
      url: '',
      method: 'POST',
      additionHeaders: {},
      convertType: 'NONE',
      serviceNamespace: toolSpec.namespace,
      serviceGroup: toolSpec.group,
      serviceName: toolSpec.toolName
    }
  };

  formModel.value.tools.push(newTool);
  message.success(t('mcpserver.tool_added_success'));

  // 触发表单验证更新
  setTimeout(() => {
    const formRef = mcpServerFormRef.value;
    if (formRef) {
      formRef.validateForm();
    }
  }, 100);
};

// 处理工具编辑
const handleToolEdit = (toolId: number, updatedTool: McpToolEditModel) => {
  const index = formModel.value.tools.findIndex((tool) => tool.id === toolId);
  if (index !== -1) {
    // 更新工具数据
    formModel.value.tools[index] = {
      id: updatedTool.id || toolId,
      toolName: updatedTool.toolName,
      namespace: updatedTool.toolKey.namespace,
      group: updatedTool.toolKey.group,
      toolVersion: updatedTool.toolVersion,
      routeRule: updatedTool.routeRule
    };
    message.success(t('mcpserver.tool_updated_success'));
  }
};

// 处理工具删除
const handleToolDelete = (toolId: number) => {
  const toolIndex = formModel.value.tools.findIndex(
    (tool) => tool.id === toolId
  );
  if (toolIndex === -1) {
    message.error(t('mcpserver.tool_not_found'));
    return;
  }

  const tool = formModel.value.tools[toolIndex];

  // 显示确认对话框
  confirmDialog.value = {
    title: t('mcpserver.confirm_delete_tool_title'),
    content: t('mcpserver.confirm_delete_tool_content', {
      name: tool.toolName,
      group: tool.group
    }),
    onConfirm: () => {
      // 执行删除
      formModel.value.tools.splice(toolIndex, 1);
      message.success(t('mcpserver.tool_deleted_success'));
      showConfirmDialog.value = false;
    },
    onCancel: () => {
      showConfirmDialog.value = false;
    }
  };
  showConfirmDialog.value = true;
};

// 处理工具配置验证
const validateToolConfiguration = (): boolean => {
  // 如果有McpServerValueDisplay组件的引用，使用其验证方法
  const valueDisplayRef = mcpServerValueDisplayRef.value;
  if (valueDisplayRef && (isEditMode.value || isCreateMode.value)) {
    const validation = valueDisplayRef.validateCurrentConfiguration();
    if (!validation.isValid) {
      // 显示详细的验证错误信息
      const errorMessages: string[] = [];
      Object.entries(validation.errors).forEach(([toolId, errors]) => {
        const tool = formModel.value.tools.find(
          (t) => t.id?.toString() === toolId
        );
        const toolName = tool?.toolName || `工具ID: ${toolId}`;
        if (Array.isArray(errors)) {
          errorMessages.push(`${toolName}: ${errors.join(', ')}`);
        }
      });

      message.error(`工具配置验证失败：\n${errorMessages.join('\n')}`);
      return false;
    }
    return true;
  }

  // 回退到原有的验证逻辑
  const validationErrors: string[] = [];

  for (const tool of formModel.value.tools) {
    const toolName = tool.toolName || t('mcpserver.unnamed_tool');

    // 检查必填字段
    if (!tool.toolName?.trim()) {
      validationErrors.push(
        t('mcpserver.tool_name_required', { name: toolName })
      );
    }

    if (!tool.namespace?.trim()) {
      validationErrors.push(
        t('mcpserver.tool_namespace_required', { name: toolName })
      );
    }

    if (!tool.group?.trim()) {
      validationErrors.push(
        t('mcpserver.tool_group_required', { name: toolName })
      );
    }

    // 检查路由规则
    if (tool.routeRule) {
      if (!tool.routeRule.protocol?.trim()) {
        validationErrors.push(
          t('mcpserver.tool_protocol_required', { name: toolName })
        );
      }

      if (!tool.routeRule.method?.trim()) {
        validationErrors.push(
          t('mcpserver.tool_method_required', { name: toolName })
        );
      }

      // 如果是HTTP/HTTPS协议，URL是必填的
      if (
        ['HTTP', 'HTTPS'].includes(tool.routeRule.protocol) &&
        !tool.routeRule.url?.trim()
      ) {
        validationErrors.push(
          t('mcpserver.tool_url_required', { name: toolName })
        );
      }
    } else {
      validationErrors.push(
        t('mcpserver.tool_route_rule_required', { name: toolName })
      );
    }
  }

  if (validationErrors.length > 0) {
    message.error(
      t('mcpserver.tool_validation_failed') +
        ':\n' +
        validationErrors.join('\n')
    );
    return false;
  }

  return true;
};

// 保存修改
const saveChanges = async () => {
  // 首先验证基础表单
  if (!formValid.value) {
    message.error(t('mcpserver.form_validation_error'));
    // 尝试触发表单验证以显示具体错误
    const formRef = mcpServerFormRef.value;
    if (formRef) {
      try {
        await formRef.validateForm();
      } catch (error) {
        // 验证失败，错误信息已经显示在表单中
      }
    }
    return;
  }

  // 验证必填字段
  if (!formModel.value.name?.trim()) {
    message.error(t('mcpserver.name_required'));
    return;
  }

  if (!formModel.value.namespace?.trim()) {
    message.error(t('namespace.namespace_required'));
    return;
  }

  if (
    !formModel.value.authKeys ||
    formModel.value.authKeys.length === 0 ||
    formModel.value.authKeys.some((key) => !key?.trim())
  ) {
    message.error(t('mcpserver.auth_keys_required'));
    return;
  }

  // 验证工具配置
  if (!validateToolConfiguration()) {
    return;
  }

  // 从McpServerValueDisplay组件获取最新的工具配置
  const valueDisplayRef = mcpServerValueDisplayRef.value;
  if (valueDisplayRef && (isEditMode.value || isCreateMode.value)) {
    const currentTools = valueDisplayRef.getCurrentTools();

    // 将工具数据同步到表单模型
    formModel.value.tools = currentTools.map((tool: McpTool) => ({
      id: tool.id,
      toolName: tool.toolName,
      namespace: tool.toolKey.namespace,
      group: tool.toolKey.group,
      toolVersion: tool.toolVersion,
      routeRule: tool.routeRule
    }));
  }

  submitting.value = true;
  try {
    const apiParams = convertFormModelToApiParams(formModel.value);
    let success = false;
    let createdId: number | null = null;

    if (isCreateMode.value) {
      // 创建新服务器
      createdId = await mcpServerApi.addMcpServerWithErrorHandling(apiParams);
      success = createdId !== null;
      if (success) {
        message.success(t('mcpserver.create_success'));

        // 创建成功后的处理
        if (route.name === 'McpServerDetail') {
          // 如果是直接访问详情页创建，跳转到列表页
          router.push('/manage/mcpserver');
        } else {
          // 如果是从列表页弹窗创建，触发成功事件让父组件处理
          emit('submit-success');
        }
      }
    } else {
      // 更新现有服务器
      success = await mcpServerApi.updateMcpServerWithErrorHandling(apiParams);
      if (success) {
        message.success(t('mcpserver.update_success'));
        // 重新加载数据
        await loadServerData();
        isEditMode.value = false;
        formModel.value.mode = 'detail';
      }
    }

    if (!success) {
      const errorMsg = isCreateMode.value
        ? t('mcpserver.create_failed')
        : t('mcpserver.update_failed');
      message.error(errorMsg);
    }
  } catch (error) {
    console.error('Failed to save McpServer:', error);
    printApiError(error);
    const errorMsg = isCreateMode.value
      ? t('mcpserver.create_failed')
      : t('mcpserver.update_failed');
    message.error(errorMsg);
  } finally {
    submitting.value = false;
  }
};

// 发布当前版本
const publishCurrentVersion = () => {
  if (!serverId.value) return;

  confirmDialog.value = {
    title: t('mcpserver.confirm_publish_title'),
    content: t('mcpserver.confirm_publish_content'),
    onConfirm: async () => {
      publishLoading.value = true;
      try {
        const success =
          await mcpServerApi.publishCurrentMcpServerWithErrorHandling(
            serverId.value!
          );
        if (success) {
          message.success(t('mcpserver.publish_success'));
          await loadServerData(); // 重新加载数据
        } else {
          message.error(t('mcpserver.publish_failed'));
        }
      } catch (error) {
        console.error('Failed to publish current version:', error);
        message.error(t('mcpserver.publish_failed'));
      } finally {
        publishLoading.value = false;
        showConfirmDialog.value = false;
      }
    },
    onCancel: () => {
      showConfirmDialog.value = false;
    }
  };
  showConfirmDialog.value = true;
};

// 显示历史版本列表
const showHistoryList = () => {
  showHistory.value = true;
};

// 处理发布历史版本
const handlePublishHistoryVersion = async (versionId: number) => {
  if (!serverId.value) return;

  try {
    const success = await mcpServerApi.publishHistoryMcpServerWithErrorHandling(
      {
        id: serverId.value,
        historyValueId: versionId
      }
    );

    if (success) {
      message.success(t('mcpserver.publish_history_success'));
      await loadServerData(); // 重新加载数据
      showHistory.value = false; // 关闭历史版本抽屉
    } else {
      message.error(t('mcpserver.publish_history_failed'));
    }
  } catch (error) {
    console.error('Failed to publish history version:', error);
    message.error(t('mcpserver.publish_history_failed'));
  }
};

// 处理查看历史版本
const handleViewHistoryVersion = (version: McpServerValueDto) => {
  selectedVersionData.value = version;
  showVersionModal.value = true;
};

// 处理回滚版本
const handleRollbackVersion = () => {
  if (!selectedVersionData.value) return;

  handlePublishHistoryVersion(selectedVersionData.value.id);
  showVersionModal.value = false;
};

// 初始化数据
const initializeData = () => {
  if (props.model) {
    // 如果有 props 数据，直接使用
    formModel.value = { ...props.model };
    // 如果 props.model 有完整的服务器数据，也设置 serverData
    if (props.model.id && props.model.name) {
      const tools = props.model.tools || [];
      // 将 McpSimpleToolParams[] 转换为 McpTool[]
      const convertedTools: McpTool[] = tools.map((tool) => ({
        id: tool.id || Date.now(),
        toolName: tool.toolName,
        toolKey: {
          namespace: tool.namespace,
          group: tool.group,
          toolName: tool.toolName
        },
        toolVersion: tool.toolVersion || 1,
        spec: {
          name: tool.toolName,
          description: tool.toolName,
          parameters: {
            type: 'object',
            properties: {},
            description: `Parameters for ${tool.toolName}`
          }
        },
        routeRule: tool.routeRule || {
          protocol: 'HTTP',
          url: '',
          method: 'POST',
          additionHeaders: {},
          convertType: 'NONE',
          serviceNamespace: tool.namespace,
          serviceGroup: tool.group,
          serviceName: tool.toolName
        }
      }));

      serverData.value = {
        id: props.model.id,
        namespace: props.model.namespace,
        name: props.model.name,
        description: props.model.description || '',
        authKeys: [...props.model.authKeys],
        tools: convertedTools,
        createTime: Date.now(),
        lastModifiedMillis: Date.now(),
        updateTime: Date.now()
      } as McpServerDto;
    }
  } else if (serverId.value) {
    // 如果没有 props 数据但有路由 ID，从 API 加载数据
    loadServerData();
  } else {
    // 创建模式 - 初始化空表单
    initializeCreateMode();
  }
};

// 初始化创建模式
const initializeCreateMode = () => {
  // 获取当前命名空间作为默认值
  const currentNamespace = namespaceStore?.current?.value?.namespaceId || '';

  formModel.value = {
    id: 0,
    namespace: currentNamespace,
    name: '',
    description: '',
    authKeys: [''],
    tools: [],
    mode: 'create'
  };

  // 清空服务器数据
  serverData.value = null;

  // 重置验证状态
  formValid.value = false;

  // 重置UI状态
  isEditMode.value = false;
  showHistory.value = false;
  showVersionModal.value = false;
  selectedVersionData.value = null;

  // 重置确认对话框状态
  showConfirmDialog.value = false;
};

// 监听 props.model 的变化
watch(
  () => props.model,
  () => {
    initializeData();
  },
  { immediate: true, deep: true }
);

// 重置表单到创建模式
const resetToCreateMode = () => {
  initializeCreateMode();

  // 重置子组件状态
  const valueDisplayRef = mcpServerValueDisplayRef.value;
  if (valueDisplayRef) {
    valueDisplayRef.resetEditState();
  }

  const formRef = mcpServerFormRef.value;
  if (formRef) {
    // 延迟重置表单验证状态
    setTimeout(() => {
      formRef.validateForm();
    }, 100);
  }
};

// 暴露方法给父组件
defineExpose({
  resetToCreateMode,
  initializeCreateMode,
  saveChanges,
  cancelEdit
});

// 页面挂载时初始化数据
onMounted(() => {
  initializeData();
});
</script>

<style scoped>
.mcpserver-detail-page {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  min-height: 300px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mcpserver-detail-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    padding: 16px;
  }

  .page-header > :first-child {
    align-self: flex-start;
  }

  .page-header > :last-child {
    align-self: flex-end;
  }

  .page-content {
    gap: 16px;
  }

  .info-card {
    margin-bottom: 16px;
  }
}

@media (max-width: 480px) {
  .mcpserver-detail-page {
    padding: 8px;
  }

  .page-header {
    padding: 12px;
  }

  .page-header > :last-child {
    align-self: stretch;
  }

  .page-header > :last-child .n-space {
    justify-content: stretch;
  }

  .page-header > :last-child .n-space .n-button {
    flex: 1;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .page-header {
    background-color: #1f2937;
    border-color: #374151;
  }

  .info-card {
    border-color: #374151;
  }
}
</style>
