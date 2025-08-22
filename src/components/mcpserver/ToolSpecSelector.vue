<template>
  <n-modal
    v-model:show="visible"
    :mask-closable="true"
    preset="card"
    style="max-width: 900px; max-height: 85vh"
    :title="t('mcpserver.select_toolspec')"
    :bordered="false"
    :segmented="{
      content: true,
      footer: 'soft'
    }"
  >
    <n-space vertical>
      <!-- 命名空间筛选提示 -->
      <n-alert v-if="namespace" type="info" :show-icon="false">
        <template #header>
          <n-space align="center">
            <n-icon><funnel-outline /></n-icon>
            <span>当前筛选命名空间: {{ namespace }}</span>
          </n-space>
        </template>
        只显示命名空间为 "{{ namespace }}" 的 ToolSpec
      </n-alert>

      <!-- 搜索表单 -->
      <n-form :model="searchForm" label-placement="left" :show-label="false">
        <n-grid :cols="24" :x-gap="12">
          <n-form-item-gi :span="6">
            <n-input
              v-model:value="searchForm.namespaceFilter"
              :placeholder="t('namespace.namespace')"
              :disabled="!!namespace"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi :span="6">
            <n-input
              v-model:value="searchForm.groupFilter"
              :placeholder="t('toolspec.group')"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi :span="6">
            <n-input
              v-model:value="searchForm.toolNameFilter"
              :placeholder="t('toolspec.tool_name')"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi :span="6">
            <n-button type="primary" block @click="handleSearch">
              <template #icon>
                <n-icon><search-outline /></n-icon>
              </template>
              {{ t('common.search') }}
            </n-button>
          </n-form-item-gi>
        </n-grid>
      </n-form>

      <!-- 快速筛选标签 -->
      <n-space v-if="availableGroups.length > 0">
        <n-text depth="3">快速筛选组:</n-text>
        <n-tag
          v-for="group in availableGroups"
          :key="group"
          :type="searchForm.groupFilter === group ? 'primary' : 'default'"
          checkable
          :checked="searchForm.groupFilter === group"
          @update:checked="(checked) => handleGroupTagClick(group, checked)"
        >
          {{ group }}
        </n-tag>
        <n-tag
          v-if="searchForm.groupFilter"
          type="error"
          @click="clearGroupFilter"
        >
          清除筛选
        </n-tag>
      </n-space>

      <!-- ToolSpec 列表 -->
      <n-spin :show="loading">
        <n-data-table
          :columns="columns"
          :data="toolSpecs"
          :pagination="pagination"
          :bordered="false"
          :max-height="450"
          :row-key="(row) => `${row.namespace}-${row.group}-${row.toolName}`"
        />
      </n-spin>

      <!-- 空状态 -->
      <n-empty
        v-if="!loading && toolSpecs.length === 0"
        description="未找到匹配的 ToolSpec"
      >
        <template #extra>
          <n-button @click="handleClearFilters">清除所有筛选条件</n-button>
        </template>
      </n-empty>
    </n-space>

    <template #footer>
      <n-space justify="space-between">
        <n-text depth="3">
          共找到 {{ pagination.itemCount }} 个 ToolSpec
        </n-text>
        <n-space>
          <n-button @click="handleCancel">{{ t('common.cancel') }}</n-button>
        </n-space>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, h } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NModal,
  NSpace,
  NForm,
  NGrid,
  NFormItemGi,
  NInput,
  NButton,
  NIcon,
  NSpin,
  NDataTable,
  NAlert,
  NText,
  NTag,
  NEmpty,
  useDialog,
  useMessage
} from 'naive-ui';
import { SearchOutline, FunnelOutline } from '@vicons/ionicons5';
import { toolSpecApi, IToolSpecQueryParam, IToolSpec } from '@/api/toolspec';
import {
  ToolSpecInfo,
  McpToolEditModel,
  ToolKey,
  ToolRouteRule
} from '@/types/mcpserver';

interface Props {
  visible: boolean;
  selectedToolSpecs?: ToolSpecInfo[];
  namespace?: string; // 新增：指定命名空间筛选
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'select', toolSpec: ToolSpecInfo): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectedToolSpecs: () => []
});
const emit = defineEmits<Emits>();

const { t } = useI18n();
const dialog = useDialog();
const message = useMessage();

// 搜索表单
const searchForm = ref({
  namespaceFilter: '',
  groupFilter: '',
  toolNameFilter: ''
});

// 可用的组列表（用于快速筛选）
const availableGroups = ref<string[]>([]);

// 分页配置
const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  showQuickJumper: true,
  onChange: (page: number) => {
    pagination.value.page = page;
    loadToolSpecs();
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize;
    pagination.value.page = 1;
    loadToolSpecs();
  }
});

// 数据状态
const loading = ref(false);
const toolSpecs = ref<IToolSpec[]>([]);

// 计算属性
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// 表格列定义
const columns = computed(() =>
  [
    {
      title: t('namespace.namespace'),
      key: 'namespace',
      width: props.namespace ? 0 : 120, // 如果指定了命名空间，隐藏此列
      render: (row: IToolSpec) => (props.namespace ? null : row.namespace)
    },
    {
      title: t('toolspec.group'),
      key: 'group',
      width: 120,
      render: (row: IToolSpec) =>
        h(NTag, { type: 'info', size: 'small' }, { default: () => row.group })
    },
    {
      title: t('toolspec.tool_name'),
      key: 'toolName',
      width: 150,
      render: (row: IToolSpec) =>
        h('span', { style: 'font-weight: 500; color: #18a058;' }, row.toolName)
    },
    {
      title: t('toolspec.name'),
      key: 'name',
      width: 180,
      ellipsis: true
    },
    {
      title: t('toolspec.description'),
      key: 'description',
      ellipsis: true
    },
    {
      title: t('toolspec.version'),
      key: 'version',
      width: 80,
      render: (row: IToolSpec) =>
        h(
          NTag,
          { type: 'success', size: 'small' },
          { default: () => `v${row.version}` }
        )
    },
    {
      title: t('common.operation'),
      key: 'actions',
      width: 120,
      render: (row: IToolSpec) => {
        const isSelected = props.selectedToolSpecs?.some(
          (spec) =>
            spec.namespace === row.namespace &&
            spec.group === row.group &&
            spec.toolName === row.toolName
        );

        return h(
          NButton,
          {
            size: 'small',
            type: isSelected ? 'default' : 'primary',
            disabled: isSelected,
            onClick: () => handleSelect(row)
          },
          {
            default: () =>
              isSelected ? t('common.selected') : t('common.select')
          }
        );
      }
    }
  ].filter((col) => col.width !== 0)
); // 过滤掉隐藏的列

// 加载 ToolSpec 列表
const loadToolSpecs = async () => {
  loading.value = true;
  try {
    const params: IToolSpecQueryParam = {
      pageNo: pagination.value.page,
      pageSize: pagination.value.pageSize,
      // 如果指定了命名空间，优先使用指定的命名空间
      namespaceId:
        props.namespace || searchForm.value.namespaceFilter || undefined,
      groupFilter: searchForm.value.groupFilter || undefined,
      toolNameFilter: searchForm.value.toolNameFilter || undefined
    };

    const result = await toolSpecApi.queryToolSpecPageWithErrorHandling(params);
    if (result) {
      toolSpecs.value = result.list;
      pagination.value.itemCount = result.totalCount;

      // 更新可用的组列表
      updateAvailableGroups(result.list);
    }
  } catch (error) {
    console.error('Failed to load ToolSpecs:', error);
    message.error('加载 ToolSpec 列表失败');
  } finally {
    loading.value = false;
  }
};

// 更新可用的组列表
const updateAvailableGroups = (specs: IToolSpec[]) => {
  const groups = new Set<string>();
  specs.forEach((spec) => {
    if (spec.group) {
      groups.add(spec.group);
    }
  });
  availableGroups.value = Array.from(groups).sort();
};

// 搜索处理
const handleSearch = () => {
  pagination.value.page = 1;
  loadToolSpecs();
};

// 选择处理 - 自动填充工具信息
const handleSelect = (toolSpec: IToolSpec) => {
  const selectedToolSpec: ToolSpecInfo = {
    namespace: toolSpec.namespace,
    group: toolSpec.group,
    toolName: toolSpec.toolName,
    name: toolSpec.name,
    description: toolSpec.description,
    version: toolSpec.version,
    function: toolSpec.function
  };

  // 显示选择成功的消息
  message.success(`已选择工具: ${toolSpec.toolName} (${toolSpec.group})`);

  emit('select', selectedToolSpec);

  // 选择后自动关闭弹窗
  visible.value = false;
};

// 取消处理
const handleCancel = () => {
  emit('cancel');
  visible.value = false;
};

// 组标签点击处理
const handleGroupTagClick = (group: string, checked: boolean) => {
  if (checked) {
    searchForm.value.groupFilter = group;
  } else {
    searchForm.value.groupFilter = '';
  }
  handleSearch();
};

// 清除组筛选
const clearGroupFilter = () => {
  searchForm.value.groupFilter = '';
  handleSearch();
};

// 清除所有筛选条件
const handleClearFilters = () => {
  searchForm.value.namespaceFilter = '';
  searchForm.value.groupFilter = '';
  searchForm.value.toolNameFilter = '';
  handleSearch();
};

// 监听 visible 变化
watch(visible, (newValue) => {
  if (newValue) {
    // 重置搜索表单（但保留命名空间筛选）
    if (!props.namespace) {
      searchForm.value.namespaceFilter = '';
    }
    searchForm.value.groupFilter = '';
    searchForm.value.toolNameFilter = '';
    pagination.value.page = 1;
    loadToolSpecs();
  }
});

// 监听命名空间变化
watch(
  () => props.namespace,
  (newNamespace) => {
    if (newNamespace && visible.value) {
      // 如果命名空间发生变化且弹窗是打开的，重新加载数据
      pagination.value.page = 1;
      loadToolSpecs();
    }
  }
);

// 组件挂载时加载数据
onMounted(() => {
  if (visible.value) {
    loadToolSpecs();
  }
});

// 工具函数：将 ToolSpec 转换为 McpTool 编辑模型
const convertToolSpecToMcpTool = (toolSpec: ToolSpecInfo): McpToolEditModel => {
  const toolKey: ToolKey = {
    namespace: toolSpec.namespace,
    group: toolSpec.group,
    toolName: toolSpec.toolName
  };

  // 创建默认的路由规则
  const defaultRouteRule: ToolRouteRule = {
    protocol: 'HTTP',
    url: '',
    method: 'POST',
    additionHeaders: {},
    convertType: 'NONE',
    serviceNamespace: toolSpec.namespace,
    serviceGroup: toolSpec.group,
    serviceName: toolSpec.toolName
  };

  return {
    toolName: toolSpec.toolName,
    toolKey: toolKey,
    toolVersion: toolSpec.version,
    routeRule: defaultRouteRule,
    spec: toolSpec.function
  };
};

// 工具函数：验证 ToolSpec 是否已被选择
const isToolSpecSelected = (
  toolSpec: IToolSpec,
  selectedSpecs: ToolSpecInfo[]
): boolean => {
  return selectedSpecs.some(
    (spec) =>
      spec.namespace === toolSpec.namespace &&
      spec.group === toolSpec.group &&
      spec.toolName === toolSpec.toolName
  );
};
</script>

<style scoped>
/* ToolSpec 选择器样式优化 */
.n-data-table {
  border-radius: 6px;
}

.n-data-table :deep(.n-data-table-th) {
  background-color: #fafafa;
  font-weight: 600;
}

.n-data-table :deep(.n-data-table-td) {
  border-bottom: 1px solid #f0f0f0;
}

.n-data-table :deep(.n-data-table-tr:hover .n-data-table-td) {
  background-color: #f8f9fa;
}

/* 快速筛选标签样式 */
.n-tag {
  cursor: pointer;
  transition: all 0.2s ease;
}

.n-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 搜索表单样式 */
.n-form {
  background-color: #fafafa;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
}

/* 命名空间筛选提示样式 */
.n-alert {
  margin-bottom: 16px;
}

/* 空状态样式 */
.n-empty {
  padding: 40px 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .n-modal {
    max-width: 95vw !important;
  }

  .n-form .n-grid {
    grid-template-columns: 1fr !important;
  }

  .n-form .n-form-item-gi {
    grid-column: span 24 !important;
    margin-bottom: 12px;
  }
}
</style>
