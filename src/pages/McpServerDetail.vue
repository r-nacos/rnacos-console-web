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
        <n-h2 style="margin: 0">{{ t('mcpserver.mcpserver_detail') }}</n-h2>
        <n-tag v-if="isEditMode" type="warning">{{ t('mcpserver.edit_mode') }}</n-tag>
        <n-tag v-else type="info">{{ t('mcpserver.view_mode') }}</n-tag>
      </n-space>
      
      <n-space v-if="!isEditMode">
        <n-button 
          type="primary" 
          @click="enterEditMode"
        >
          <template #icon>
            <n-icon><edit-outline /></n-icon>
          </template>
          {{ t('common.edit') }}
        </n-button>
      </n-space>
      
      <n-space v-else>
        <n-button @click="cancelEdit">
          {{ t('mcpserver.cancel_edit') }}
        </n-button>
        <n-button 
          type="primary" 
          :loading="submitting" 
          @click="saveChanges"
        >
          <template #icon>
            <n-icon><checkmark-outline /></n-icon>
          </template>
          {{ t('mcpserver.save_changes') }}
        </n-button>
      </n-space>
    </div>
    
    <!-- 页面内容 -->
    <n-spin :show="loading">
      <div v-if="serverData" class="page-content">
        <!-- 基础信息部分 -->
        <n-card :title="t('mcpserver.basic_info')" class="info-card">
          <template v-if="!isEditMode">
            <n-descriptions :column="3" label-placement="left" :label-align="'right'">
              <n-descriptions-item :label="t('mcpserver.server_id')">
                {{ serverData.id }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('mcpserver.server_name')">
                {{ serverData.name }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('namespace.namespace')">
                {{ serverData.namespace }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('mcpserver.server_description')" :span="3">
                {{ serverData.description || '-' }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('mcpserver.auth_keys')" :span="3">
                <n-space>
                  <n-tag v-for="(key, index) in serverData.authKeys" :key="index" size="small">
                    {{ key }}
                  </n-tag>
                </n-space>
              </n-descriptions-item>
              <n-descriptions-item :label="t('mcpserver.create_time')">
                {{ formatTime(serverData.createTime) }}
              </n-descriptions-item>
              <n-descriptions-item :label="t('mcpserver.update_time')">
                {{ formatTime(serverData.updateTime) }}
              </n-descriptions-item>
            </n-descriptions>
          </template>
          
          <!-- 编辑模式下的表单 -->
          <template v-else>
            <mcp-server-form
              ref="mcpServerFormRef"
              v-model="formModel"
              @validate="handleFormValidate"
            />
          </template>
        </n-card>
        
        <!-- 工具信息部分 -->
        <n-card :title="t('mcpserver.tool_info')" class="info-card">
          <div v-if="!isEditMode">
            <n-spin :show="toolsLoading" :description="t('mcpserver.loading_tools')">
              <div v-if="serverData.tools && serverData.tools.length > 0">
                <n-space vertical>
                <n-card
                  v-for="(tool, index) in serverData.tools"
                  :key="index"
                  class="tool-card"
                >
                  <template #header>
                    <n-space align="center">
                      <n-icon size="18" color="#18a058">
                        <construct-outline />
                      </n-icon>
                      <span class="tool-name">{{ tool.toolName }}</span>
                      <n-tag size="small" type="info">{{ tool.group }}</n-tag>
                      <n-tag size="small" type="success">{{ tool.namespace }}</n-tag>
                      <n-tag size="small" type="warning">v{{ tool.toolVersion || 1 }}</n-tag>
                    </n-space>
                  </template>
                  
                  <n-descriptions :column="2" label-placement="left" :label-align="'right'" class="tool-descriptions">
                    <n-descriptions-item :label="t('mcpserver.tool_name')">
                      <n-text strong>{{ tool.toolName }}</n-text>
                    </n-descriptions-item>
                    <n-descriptions-item :label="t('mcpserver.tool_group')">
                      <n-text>{{ tool.group }}</n-text>
                    </n-descriptions-item>
                    <n-descriptions-item :label="t('namespace.namespace')">
                      <n-text>{{ tool.namespace }}</n-text>
                    </n-descriptions-item>
                    <n-descriptions-item :label="t('mcpserver.tool_version')">
                      <n-text>v{{ tool.toolVersion || 1 }}</n-text>
                    </n-descriptions-item>
                    <n-descriptions-item :label="t('mcpserver.route_rule')" :span="2">
                      <div v-if="tool.routeRule" class="route-rule-display">
                        <n-space align="center" :wrap="false">
                          <n-tag :type="getRouteRuleTagType(tool.routeRule.ruleType)" size="small">
                            {{ getRouteRuleLabel(tool.routeRule.ruleType) }}
                          </n-tag>
                          <n-divider vertical />
                          <n-popover
                            v-if="tool.routeRule.config && Object.keys(tool.routeRule.config).length > 0"
                            :width="300"
                            trigger="hover"
                          >
                            <template #trigger>
                              <n-button text size="small" type="info">
                                <template #icon>
                                  <n-icon><eye-outline /></n-icon>
                                </template>
                                {{ t('common.detail') }}
                              </n-button>
                            </template>
                            <n-code :code="formatRouteRuleConfig(tool.routeRule.config)" language="json" :word-wrap="true" />
                          </n-popover>
                          <n-text v-else depth="3" italic>{{ t('common.no_config') }}</n-text>
                        </n-space>
                      </div>
                      <n-text v-else depth="3" italic>-</n-text>
                    </n-descriptions-item>
                  </n-descriptions>
                </n-card>
              </n-space>
            </div>
            <div v-else class="empty-state">
              <n-empty
                :description="t('mcpserver.no_tools')"
                size="large"
              >
                <template #extra>
                  <n-button v-if="canUpdateConfig" type="primary" @click="enterEditMode">
                    <template #icon>
                      <n-icon><add-outline /></n-icon>
                    </template>
                    {{ t('mcpserver.add_tool') }}
                  </n-button>
                </template>
              </n-empty>
            </div>
            </n-spin>
          </div>
          
          <!-- 编辑模式下的工具配置 -->
          <template v-else>
            <tool-config-list
              v-model:tools="formModel.tools"
              mode="edit"
              :disabled="false"
            />
          </template>
        </n-card>
      </div>
      
      <div v-else-if="!loading && !serverData" class="error-state">
        <n-result
          status="error"
          :title="t('error.SYSTEM_ERROR')"
          :description="t('error.SYSTEM_ERROR')"
        >
          <template #footer>
            <n-button @click="loadServerData">{{ t('common.refresh') }}</n-button>
          </template>
        </n-result>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, withDefaults, defineProps } from 'vue';

// 定义 props
interface Props {
  model?: McpServerFormModel;
}


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
  NText,
  NEmpty,
  NResult,
  NCode,
  NPopover
} from 'naive-ui';
import {
  ArrowBackOutline,
  CreateOutline as EditOutline,
  CheckmarkOutline,
  ConstructOutline,
  AddOutline,
  EyeOutline
} from '@vicons/ionicons5';
import { useWebResources } from '@/data/resources';
import { mcpServerApi } from '@/api/mcpserver';
import { convertApiDataToFormModel, convertFormModelToApiParams } from '@/api/mcpserver';
import { McpServerDto, McpServerFormModel } from '@/types/mcpserver';
import McpServerForm from '@/components/mcpserver/McpServerForm.vue';
import ToolConfigList from '@/components/mcpserver/ToolConfigList.vue';
import { useMessage } from 'naive-ui';
import { printApiError } from '@/utils/request';

// 定义 props
interface Props {
  model?: McpServerFormModel;
}

const props = withDefaults(defineProps<Props>(), {
  model: undefined
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const message = useMessage();
const webResources = useWebResources();

// 页面状态
const loading = ref(false);
const submitting = ref(false);
const isEditMode = ref(false);
const serverData = ref<McpServerDto | null>(null);
const toolsLoading = ref(false);
const formModel = ref<McpServerFormModel>({
  id: 0,
  namespace: '',
  name: '',
  description: '',
  authKeys: [],
  tools: [],
  mode: 'detail'
});
const formValid = ref(false);
const mcpServerFormRef = ref();

// 从路由参数获取服务器ID
const serverId = computed(() => {
  // 如果有 props.model，优先使用 props 中的 id
  if (props.model?.id) {
    return props.model.id;
  }
  // 否则从路由参数获取
  return Number(route.query.id || route.params.id || 0);
});

// 权限检查
const canUpdateConfig = computed(() => {
  return webResources.canUpdateConfig;
});

// 格式化时间
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

// 获取路由规则标签类型
const getRouteRuleTagType = (ruleType: string) => {
  switch (ruleType) {
    case 'direct':
      return 'success';
    case 'weighted':
      return 'warning';
    case 'conditional':
      return 'info';
    default:
      return 'default';
  }
};

// 获取路由规则标签文本
const getRouteRuleLabel = (ruleType: string) => {
  switch (ruleType) {
    case 'direct':
      return '直连';
    case 'weighted':
      return '加权';
    case 'conditional':
      return '条件';
    default:
      return ruleType;
  }
};

// 格式化路由规则配置
const formatRouteRuleConfig = (config: Record<string, any>) => {
  return JSON.stringify(config, null, 2);
};

// 加载服务器数据
const loadServerData = async () => {
  if (!serverId.value) {
    // 如果没有有效的服务器 ID，不显示错误，直接返回
    // 这种情况通常发生在组件被嵌入到列表页面但还没有选择具体服务器时
    return;
  }
  
  loading.value = true;
  toolsLoading.value = true;
  try {
    const data = await mcpServerApi.getMcpServerWithErrorHandling(serverId.value);
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
    // 延迟关闭工具加载状态，以提供更好的用户体验
    setTimeout(() => {
      toolsLoading.value = false;
    }, 300);
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
  isEditMode.value = false;
  formModel.value.mode = 'detail';
  // 重置表单数据为原始数据
  if (serverData.value) {
    formModel.value = convertApiDataToFormModel(serverData.value, 'detail');
  }
};

// 处理表单验证
const handleFormValidate = (isValid: boolean) => {
  formValid.value = isValid;
};

// 保存修改
const saveChanges = async () => {
  if (!formValid.value) {
    message.error(t('mcpserver.form_validation_error'));
    return;
  }
  
  submitting.value = true;
  try {
    const apiParams = convertFormModelToApiParams(formModel.value);
    let success = false;
    
    if (formModel.value.mode === 'create') {
      // 创建新服务器
      const result = await mcpServerApi.addMcpServerWithErrorHandling(apiParams);
      success = result !== null;
      if (success) {
        message.success(t('mcpserver.create_success'));
        // 创建成功后跳转到列表页面
        router.push('/manage/mcpserver');
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
      message.error(formModel.value.mode === 'create'
        ? t('mcpserver.create_failed')
        : t('mcpserver.update_failed'));
    }
  } catch (error) {
    console.error('Failed to save McpServer:', error);
    printApiError(error);
    message.error(formModel.value.mode === 'create'
      ? t('mcpserver.create_failed')
      : t('mcpserver.update_failed'));
  } finally {
    submitting.value = false;
  }
};

// 验证表单
const validateForm = async () => {
  if (mcpServerFormRef.value) {
    return await mcpServerFormRef.value.validateForm();
  }
  return false;
};

// 初始化数据
const initializeData = () => {
  if (props.model) {
    // 如果有 props 数据，直接使用
    formModel.value = { ...props.model };
    // 如果 props.model 有完整的服务器数据，也设置 serverData
    if (props.model.id && props.model.name) {
      serverData.value = {
        id: props.model.id,
        namespace: props.model.namespace,
        name: props.model.name,
        description: props.model.description || '',
        authKeys: [...props.model.authKeys],
        tools: [...props.model.tools],
        createTime: Date.now(), // 这些字段在 props 中可能不存在
        updateTime: Date.now()
      } as McpServerDto;
    }
  } else if (serverId.value) {
    // 如果没有 props 数据但有路由 ID，从 API 加载数据
    loadServerData();
  }
};

// 监听 props.model 的变化
watch(() => props.model, () => {
  initializeData();
}, { immediate: true, deep: true });

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
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  margin-bottom: 16px;
}

.tool-card {
  margin-bottom: 12px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.route-rule-display {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}

.tool-name {
  font-weight: 600;
  color: #18a058;
}

.tool-descriptions {
  margin-top: 8px;
}

.tool-card {
  transition: all 0.3s ease;
  border-left: 4px solid #18a058;
}

.tool-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
  min-height: 200px;
}

.empty-state .n-empty {
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .mcpserver-detail-page {
    padding: 8px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .tool-descriptions {
    font-size: 14px;
  }
  
  .route-rule-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>