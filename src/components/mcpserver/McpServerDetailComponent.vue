<template>
  <div class="mcp-server-detail-component">
    <n-card
      v-if="serverData"
      :title="t('mcpserverdetailcomponent.server_info')"
      :bordered="false"
    >
      <template #header-extra>
        <n-space>
          <n-tag v-if="mode !== 'detail'" type="info" size="small">
            {{ mode === 'update' ? '编辑模式' : '创建模式' }}
          </n-tag>

          <!-- 文本编辑图标按钮 -->
          <n-button
            text
            type="primary"
            @click="showYamlEditor = true"
            :title="t('mcpserverdetailcomponent.yaml_editor')"
          >
            <n-icon size="18">
              <EditIcon />
            </n-icon>
            YAML
          </n-button>
        </n-space>
      </template>

      <!-- 基础信息区域 -->
      <n-form
        v-if="mode !== 'detail'"
        ref="formRef"
        :model="serverData"
        :rules="formRules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item :label="t('mcpserverdetailcomponent.id')" path="id">
          <n-input :value="serverData.id.toString()" disabled />
        </n-form-item>

        <n-form-item
          :label="t('mcpserverdetailcomponent.unique_key')"
          path="uniqueKey"
        >
          <n-input
            v-model:value="serverData.uniqueKey"
            :disabled="mode === 'update'"
            :placeholder="mode === 'create' ? '可选，不填时后端会自动生成' : ''"
          />
        </n-form-item>

        <n-form-item
          :label="t('mcpserverdetailcomponent.namespace')"
          path="namespace"
        >
          <n-input
            v-model:value="serverData.namespace"
            :disabled="mode === 'update' || mode === 'create'"
          />
        </n-form-item>

        <n-form-item :label="t('mcpserverdetailcomponent.name')" path="name">
          <n-input
            v-model:value="serverData.name"
            placeholder="请输入服务器名称"
            :disabled="isFormReadonly"
          />
        </n-form-item>

        <n-form-item
          :label="t('mcpserverdetailcomponent.description')"
          path="description"
        >
          <n-input
            v-model:value="serverData.description"
            type="textarea"
            placeholder="请输入服务器描述"
            :rows="3"
            :disabled="isFormReadonly"
          />
        </n-form-item>

        <n-form-item
          :label="t('mcpserverdetailcomponent.auth_keys')"
          path="authKeys"
        >
          <n-dynamic-tags
            v-model:value="serverData.authKeys"
            :disabled="isFormReadonly"
          />
        </n-form-item>
      </n-form>

      <n-descriptions v-else :column="2" label-placement="left">
        <n-descriptions-item :label="t('mcpserverdetailcomponent.id')">
          <n-text>{{ serverData.id }}</n-text>
        </n-descriptions-item>

        <n-descriptions-item :label="t('mcpserverdetailcomponent.unique_key')">
          <n-text>{{ serverData.uniqueKey || '-' }}</n-text>
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

        <n-descriptions-item
          :label="t('mcpserverdetailcomponent.last_modified')"
        >
          <n-text>{{ formatTime(serverData.lastModifiedMillis) }}</n-text>
        </n-descriptions-item>
      </n-descriptions>

      <!-- MCP 地址规则提示 -->
      <n-divider />
      <div class="mcp-address-rules">
        <div
          class="address-rules-header"
          @click="toggleAddressRules"
          style="
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
          "
        >
          <h4 style="margin: 0; color: #666; font-size: 14px">
            MCP 服务访问地址规则
          </h4>
          <n-icon
            :size="16"
            :color="'#666'"
            :style="{
              transform: addressRulesExpanded
                ? 'rotate(180deg)'
                : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </n-icon>
        </div>

        <div v-show="addressRulesExpanded" class="address-rules-content">
          <n-space vertical :size="6">
            <div class="address-rule-item">
              <n-text strong style="font-size: 13px">Streamable HTTP:</n-text>
              <n-code style="margin-left: 8px; font-size: 12px">
                http://&#123;nacos_api_host&#125;/rnacos/mcp/&#123;server_unique_key&#125;/&#123;auth_key&#125;
              </n-code>
            </div>
            <div class="address-rule-item">
              <n-text strong style="font-size: 13px">SSE:</n-text>
              <n-code style="margin-left: 8px; font-size: 12px">
                http://&#123;nacos_api_host&#125;/rnacos/mcp/sse/&#123;server_unique_key&#125;/&#123;auth_key&#125;
              </n-code>
            </div>
            <div class="address-rule-note">
              <n-text depth="3" style="font-size: 11px; line-height: 1.4">
                注意：请将 &#123;nacos_api_host&#125; 替换为实际的 Nacos API
                地址，&#123;server_unique_key&#125;
                替换为上述唯一标识，&#123;auth_key&#125;
                替换为认证密钥中的任意一个
              </n-text>
            </div>
          </n-space>
        </div>
      </div>

      <!-- 服务工具区域 -->
      <div class="server-tools-section">
        <n-divider />
        <n-tabs
          v-model:value="activeTab"
          type="line"
          animated
          :default-value="defaultTab"
        >
          <n-tab-pane
            name="release"
            :tab="t('mcpserverdetailcomponent.release_tools')"
          >
            <div v-if="serverData.releaseValue" class="tools-content">
              <mcp-server-value-component
                :server-value="serverData.releaseValue"
                mode="detail"
              />
            </div>
            <div v-else class="no-release-content">
              <n-empty
                :description="t('mcpserverdetailcomponent.no_release_version')"
              />
            </div>
          </n-tab-pane>

          <n-tab-pane
            name="current"
            :tab="t('mcpserverdetailcomponent.current_tools')"
          >
            <div v-if="serverData.currentValue" class="tools-content">
              <mcp-server-value-component
                :server-value="serverData.currentValue"
                :mode="mode === 'detail' ? 'detail' : 'update'"
                :show-publish-button="
                  mode === 'update' && webResources.canUpdateMcpServer
                "
                @publish-server="handlePublishServer"
              />
            </div>
            <div v-else class="no-current-content">
              <n-empty
                :description="t('mcpserverdetailcomponent.no_current_version')"
              />
            </div>
          </n-tab-pane>

          <n-tab-pane
            name="history"
            :tab="t('mcpserverdetailcomponent.history_tools')"
          >
            <div
              v-if="serverData.histories && serverData.histories.length > 0"
              class="tools-content"
            >
              <mcp-server-history-list
                :histories="serverData.histories"
                :server-id="serverData.id"
                @view-detail="handleViewHistoryDetail"
                @publish-history="handlePublishHistory"
              />
            </div>
            <div v-else class="no-history-content">
              <n-empty
                :description="t('mcpserverdetailcomponent.no_history_version')"
              />
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>

      <!-- 操作按钮区域 -->
      <div v-if="showActions" class="action-buttons">
        <n-divider />
        <n-space justify="end">
          <n-button v-if="mode !== 'detail'" @click="handleCancel">
            {{ t('common.cancel') }}
          </n-button>
          <n-button
            v-if="mode === 'update' && webResources.canUpdateMcpServer"
            type="primary"
            :loading="loading"
            @click="handleSave"
          >
            {{ t('common.save') }}
          </n-button>
          <n-button
            v-if="mode === 'create' && webResources.canUpdateMcpServer"
            type="primary"
            :loading="loading"
            @click="handleCreate"
          >
            {{ t('common.create') }}
          </n-button>
        </n-space>
      </div>
    </n-card>

    <!-- 数据加载状态 -->
    <n-card v-else :bordered="false">
      <n-skeleton text :repeat="5" />
    </n-card>

    <!-- YAML 编辑器模态窗口 -->
    <yaml-editor-modal
      v-model:visible="showYamlEditor"
      :server-data="serverData"
      :mode="mode"
      :current-namespace="serverData?.namespace || ''"
      @update:success="handleYamlUpdateSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NText,
  NTag,
  NSpace,
  NDivider,
  NForm,
  NFormItem,
  NInput,
  NDynamicTags,
  NButton,
  NTabs,
  NTabPane,
  NEmpty,
  NSkeleton,
  NCode,
  NIcon,
  type FormInst,
  type FormRules
} from 'naive-ui';
import { useMessage } from 'naive-ui';
import McpServerValueComponent from '@/components/mcpserver/McpServerValueComponent.vue';
import McpServerHistoryList from '@/components/mcpserver/McpServerHistoryList.vue';
import YamlEditorModal from '@/components/mcpserver/YamlEditorModal.vue';
import {
  McpServerDto,
  McpServerParams,
  McpServerValue,
  McpTool
} from '@/types/mcpserver';
import { mcpServerApi } from '@/api/mcpserver';
import { useWebResources } from '@/data/resources';
import { CreateOutline as EditIcon } from '@vicons/ionicons5';
const { t } = useI18n();
const message = useMessage();
const webResources = useWebResources();

interface Props {
  serverData: McpServerDto;
  mode?: 'detail' | 'update' | 'create';
  showActions?: boolean;
}

interface Emits {
  (e: 'save:success', data: McpServerDto): void;
  (e: 'create:success', data: McpServerDto): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'detail',
  showActions: true
});

const emit = defineEmits<Emits>();

const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const activeTab = ref('');
const addressRulesExpanded = ref(true);
const showYamlEditor = ref(false);

// 切换地址规则展开/收缩状态
const toggleAddressRules = () => {
  addressRulesExpanded.value = !addressRulesExpanded.value;
};

// 计算表单是否为只读模式
const isFormReadonly = computed(() => {
  return props.mode === 'detail' || !webResources.canUpdateMcpServer;
});

// 计算默认显示的tab
const defaultTab = computed(() => {
  if (!props.serverData) {
    return 'current';
  }

  if (props.mode === 'detail') {
    // 查看模式默认显示已发布版本，如果没有则显示当前版本
    return props.serverData.releaseValue ? 'release' : 'current';
  } else {
    // 编辑模式默认显示当前版本
    return 'current';
  }
});

// 表单验证规则
const formRules: FormRules = {
  name: [
    {
      required: true,
      message: t('validation.required', { field: '服务器名称' })
    }
  ],
  namespace: [
    {
      required: false,
      message: t('validation.required', { field: '命名空间' })
    }
  ],
  description: [
    { required: true, message: t('validation.required', { field: '描述' }) }
  ],
  authKeys: [
    {
      required: true,
      type: 'array',
      min: 1,
      message: t('validation.required', { field: '认证密钥' })
    }
  ]
};

// 监听模式变化
watch(
  () => props.mode,
  () => {
    // 根据模式设置默认tab
    activeTab.value = defaultTab.value;
  },
  { immediate: true }
);

/*
// 监听serverData变化
watch(
  () => props.serverData,
  () => {
    // 根据数据设置默认tab
    activeTab.value = defaultTab.value;
  },
  { deep: true }
);
*/

// 将McpServerDto转换为McpServerParams
const convertToParams = (): McpServerParams => {
  if (!props.serverData) {
    throw new Error('Server data is not available');
  }

  // 转换tools从McpTool到McpSimpleToolParams
  const tools = (props.serverData.currentValue?.tools || []).map((tool) => ({
    id: tool.id,
    toolName: tool.toolName,
    namespace: tool.toolKey.namespace,
    group: tool.toolKey.group,
    toolVersion: tool.toolVersion,
    routeRule: tool.routeRule
  }));

  const params: McpServerParams = {
    id: props.mode === 'create' ? undefined : props.serverData.id,
    namespace: props.serverData.namespace,
    name: props.serverData.name,
    description: props.serverData.description,
    authKeys: props.serverData.authKeys,
    tools: tools
  };

  // 只在创建模式且uniqueKey有值时才添加uniqueKey属性
  if (props.mode === 'create' && props.serverData.uniqueKey) {
    params.uniqueKey = props.serverData.uniqueKey;
  }
  return params;
};

// 格式化时间
const formatTime = (timestamp: number) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// 处理保存
const handleSave = async () => {
  if (!props.serverData) return;

  try {
    await formRef.value?.validate();
    loading.value = true;

    const params = convertToParams();
    const success = await mcpServerApi.updateMcpServerWithErrorHandling(params);

    if (success) {
      // 获取最新数据并直接更新 props.serverData
      const updatedServer = await mcpServerApi.getMcpServerWithErrorHandling(
        props.serverData.id
      );
      if (updatedServer) {
        Object.assign(props.serverData, updatedServer);
        emit('save:success', updatedServer);
      }
    }
  } catch (error) {
    console.error('保存失败:', error);
  } finally {
    loading.value = false;
  }
};

// 处理创建
const handleCreate = async () => {
  if (!props.serverData) return;

  try {
    await formRef.value?.validate();
    loading.value = true;

    const params = convertToParams();
    const newId = await mcpServerApi.addMcpServerWithErrorHandling(params);

    if (newId) {
      // 获取新创建的服务器数据并直接更新 props.serverData
      const newServer = await mcpServerApi.getMcpServerWithErrorHandling(newId);
      if (newServer) {
        Object.assign(props.serverData, newServer);
        emit('create:success', newServer);
      }
    }
  } catch (error) {
    console.error('创建失败:', error);
  } finally {
    loading.value = false;
  }
};

// 处理取消
const handleCancel = () => {
  emit('cancel');
};

// 比较工具是否相同（通过id判断工具是否一样，另外还需要对比工具的路由信息内容是否完全一样）
const areToolsEqual = (tools1: McpTool[], tools2: McpTool[]): boolean => {
  if (tools1.length !== tools2.length) {
    return false;
  }

  // 按id排序后比较
  const sortedTools1 = [...tools1].sort((a, b) => a.id - b.id);
  const sortedTools2 = [...tools2].sort((a, b) => a.id - b.id);

  return sortedTools1.every((tool, index) => {
    const otherTool = sortedTools2[index];

    // 比较工具ID
    if (tool.id !== otherTool.id) {
      return false;
    }

    // 比较路由信息
    const route1 = tool.routeRule;
    const route2 = otherTool.routeRule;

    // 比较基本路由字段
    if (
      route1.protocol !== route2.protocol ||
      route1.url !== route2.url ||
      route1.method !== route2.method ||
      route1.convertType !== route2.convertType ||
      route1.serviceNamespace !== route2.serviceNamespace ||
      route1.serviceGroup !== route2.serviceGroup ||
      route1.serviceName !== route2.serviceName
    ) {
      return false;
    }

    // 比较可选字段
    if (route1.ruleType !== route2.ruleType) {
      return false;
    }

    // 比较additionHeaders对象
    const headers1 = route1.additionHeaders || {};
    const headers2 = route2.additionHeaders || {};
    const headerKeys1 = Object.keys(headers1);
    const headerKeys2 = Object.keys(headers2);

    if (headerKeys1.length !== headerKeys2.length) {
      return false;
    }

    for (const key of headerKeys1) {
      if (headers1[key] !== headers2[key]) {
        return false;
      }
    }

    // 比较config对象（如果存在）
    if (route1.config !== route2.config) {
      // 使用JSON字符串化比较，确保对象内容一致
      return JSON.stringify(route1.config) === JSON.stringify(route2.config);
    }

    return true;
  });
};

// 处理发布服务
const handlePublishServer = async () => {
  if (!props.serverData) return;

  try {
    // 检查是否有当前值
    if (!props.serverData.currentValue) {
      message.warning('当前没有可发布的版本');
      return;
    }

    // 检查是否有已发布版本
    if (props.serverData.releaseValue) {
      // 比较当前版本和已发布版本的tools是否相同
      const currentTools = props.serverData.currentValue.tools || [];
      const releaseTools = props.serverData.releaseValue.tools || [];

      if (areToolsEqual(currentTools, releaseTools)) {
        message.warning('工具没有变化，无需发布');
        return;
      }
    }

    // 先调用更新服务接口，确保发布的是当前最新内容
    const params = convertToParams();
    const updateSuccess =
      await mcpServerApi.updateMcpServerWithErrorHandling(params);

    if (!updateSuccess) {
      message.error('更新服务失败，无法发布');
      return;
    }

    // 调用发布API
    const publishSuccess =
      await mcpServerApi.publishCurrentMcpServerWithErrorHandling(
        props.serverData.id
      );

    if (publishSuccess) {
      message.success('发布成功');

      // 获取最新数据并直接更新 props.serverData
      const updatedServer = await mcpServerApi.getMcpServerWithErrorHandling(
        props.serverData.id
      );
      if (updatedServer) {
        Object.assign(props.serverData, updatedServer);
      }
    }
  } catch (error) {
    message.error('发布失败');
  }
};

// 处理查看历史记录详情
const handleViewHistoryDetail = (history: McpServerValue) => {
  console.log('查看历史记录详情:', history);
  // 这里可以添加打开详情抽屉的逻辑
};

// 处理发布历史版本
const handlePublishHistory = async (history: McpServerValue) => {
  try {
    const success = await mcpServerApi.publishHistoryMcpServerWithErrorHandling(
      {
        id: props.serverData.id,
        historyValueId: history.id
      }
    );

    if (success) {
      message.success(t('mcpserverdetailcomponent.publish_history_success'));

      // 获取最新数据并直接更新 props.serverData
      const updatedServer = await mcpServerApi.getMcpServerWithErrorHandling(
        props.serverData.id
      );
      if (updatedServer) {
        Object.assign(props.serverData, updatedServer);
      }
    } else {
      message.error(t('mcpserverdetailcomponent.publish_history_failed'));
    }
  } catch (error) {
    console.error('发布历史版本失败:', error);
    message.error(t('mcpserverdetailcomponent.publish_history_failed'));
  }
};

// 处理 YAML 编辑器更新成功
const handleYamlUpdateSuccess = (updatedData: McpServerDto) => {
  // 直接更新 props.serverData 对象
  Object.assign(props.serverData, updatedData);

  // 触发保存成功事件，通知父组件数据已更新
  // emit('save:success', updatedData);

  console.log('YAML 编辑器更新成功，数据已同步到组件');
};

onMounted(() => {
  // 设置初始tab
  activeTab.value = defaultTab.value;
});

// 暴露方法给父组件
defineExpose({
  handleSave,
  handleCreate,
  handleCancel
});
</script>

<style scoped>
.mcp-server-detail-component {
  width: 100%;
}

.server-tools-section {
  margin-top: 16px;
}

.tools-content {
  padding-top: 8px;
}

.no-release-content,
.no-current-content,
.no-history-content {
  padding: 32px 0;
  text-align: center;
}

.action-buttons {
  margin-top: 24px;
}

/* MCP 地址规则样式 */
.mcp-address-rules {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.address-rules-header {
  user-select: none;
}

.address-rules-header:hover {
  opacity: 0.8;
}

.address-rule-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.address-rule-note {
  margin-top: 6px;
  padding: 6px;
  background-color: #fff3cd;
  border-radius: 4px;
  border-left: 3px solid #ffc107;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mcp-server-detail-component {
    padding: 8px;
  }

  .address-rule-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .mcp-address-rules {
    padding: 12px;
  }
}
</style>
