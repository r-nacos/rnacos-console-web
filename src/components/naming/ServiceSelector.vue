<template>
  <n-modal
    v-model:show="visible"
    :mask-closable="true"
    preset="card"
    style="max-width: 900px; max-height: 85vh"
    :title="t('service.select_service')"
    :bordered="false"
    :segmented="{
      content: true,
      footer: 'soft'
    }"
  >
    <n-space vertical>
      <!-- 搜索表单 -->
      <n-form :model="searchForm" label-placement="left" :show-label="false">
        <n-grid :cols="24" :x-gap="12">
          <n-form-item-gi :span="6">
            <n-input
              :value="namespace || namespaceStore.current.value.namespaceId"
              :placeholder="t('namespace.namespace')"
              readonly
            >
              <template #prefix>
                <n-icon size="14"><funnel-outline /></n-icon>
              </template>
            </n-input>
          </n-form-item-gi>
          <n-form-item-gi :span="6">
            <n-input
              v-model:value="searchForm.serviceNameParam"
              :placeholder="t('service.name')"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi :span="6">
            <n-input
              v-model:value="searchForm.groupNameParam"
              :placeholder="t('service.groupName')"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi :span="6">
            <n-button type="primary" block @click="handleSearch">
              <template #icon>
                <n-icon><search-outline /></n-icon>
              </template>
              {{ t('common.query') }}
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
          :type="searchForm.groupNameParam === group ? 'primary' : 'default'"
          checkable
          :checked="searchForm.groupNameParam === group"
          @update:checked="(checked) => handleGroupTagClick(group, checked)"
        >
          {{ group }}
        </n-tag>
        <n-tag
          v-if="searchForm.groupNameParam"
          type="error"
          @click="clearGroupFilter"
        >
          清除筛选
        </n-tag>
      </n-space>

      <!-- 服务列表 -->
      <n-spin :show="loading">
        <n-data-table
          :columns="columns"
          :data="services"
          :pagination="pagination"
          :bordered="false"
          :max-height="450"
          :row-key="(row) => `${row.groupName}-${row.name}`"
        />
      </n-spin>

      <!-- 空状态 -->
      <n-empty
        v-if="!loading && services.length === 0"
        description="未找到匹配的服务"
      >
        <template #extra>
          <n-button @click="handleClearFilters">清除所有筛选条件</n-button>
        </template>
      </n-empty>
    </n-space>

    <template #footer>
      <n-space justify="space-between">
        <n-text depth="3"> 共找到 {{ pagination.itemCount }} 个服务 </n-text>
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
  NText,
  NTag,
  NEmpty,
  useMessage
} from 'naive-ui';
import { SearchOutline, FunnelOutline } from '@vicons/ionicons5';
import {
  namingApi,
  IServiceQueryPageParam,
  IServiceQueryItem
} from '@/api/naming';
import { namespaceStore } from '@/data/namespace';

interface Props {
  visible: boolean;
  namespace?: string; // 可选：指定命名空间筛选，如果不指定则使用namespaceStore.current.value.namespaceId
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (
    e: 'select',
    serviceInfo: { namespaceId: string; groupName: string; serviceName: string }
  ): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<Emits>();

const { t } = useI18n();
const message = useMessage();

// 搜索表单
const searchForm = ref({
  serviceNameParam: '',
  groupNameParam: ''
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
    loadServices();
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize;
    pagination.value.page = 1;
    loadServices();
  }
});

// 数据状态
const loading = ref(false);
const services = ref<IServiceQueryItem[]>([]);

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
      key: 'namespaceId',
      width: props.namespace ? 0 : 120, // 如果指定了命名空间，隐藏此列
      render: (row: IServiceQueryItem) =>
        props.namespace
          ? null
          : props.namespace || namespaceStore.current.value.namespaceId
    },
    {
      title: t('service.groupName'),
      key: 'groupName',
      width: 120,
      render: (row: IServiceQueryItem) =>
        h(
          NTag,
          { type: 'info', size: 'small' },
          { default: () => row.groupName }
        )
    },
    {
      title: t('service.name'),
      key: 'name',
      width: 180,
      render: (row: IServiceQueryItem) =>
        h('span', { style: 'font-weight: 500; color: #18a058;' }, row.name)
    },
    {
      title: '实例数量',
      key: 'ip_count',
      width: 100,
      render: (row: IServiceQueryItem) =>
        h(
          NTag,
          { type: 'success', size: 'small' },
          { default: () => `${row.ip_count || 0}` }
        )
    },
    {
      title: '健康实例',
      key: 'healthy_instance_count',
      width: 100,
      render: (row: IServiceQueryItem) =>
        h(
          NTag,
          { type: 'warning', size: 'small' },
          { default: () => `${row.healthy_instance_count || 0}` }
        )
    },
    {
      title: '保护阈值',
      key: 'protect_threshold',
      width: 100,
      render: (row: IServiceQueryItem) =>
        h('span', {}, row.protect_threshold?.toString() || '0')
    },
    {
      title: t('common.operation'),
      key: 'actions',
      width: 120,
      render: (row: IServiceQueryItem) => {
        return h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            onClick: () => handleSelect(row)
          },
          {
            default: () => t('common.select')
          }
        );
      }
    }
  ].filter((col) => col.width !== 0)
);

// 加载服务列表
const loadServices = async () => {
  loading.value = true;
  try {
    const params: IServiceQueryPageParam = {
      pageNo: pagination.value.page,
      pageSize: pagination.value.pageSize,
      namespaceId:
        props.namespace || namespaceStore.current.value.namespaceId || '',
      serviceNameParam: searchForm.value.serviceNameParam || '',
      groupNameParam: searchForm.value.groupNameParam || ''
    };

    const result = await namingApi.queryServicePage(params);
    if (result.data.success && result.data.data) {
      services.value = result.data.data.list;
      pagination.value.itemCount = result.data.data.totalCount;
      updateAvailableGroups(services.value);
    } else {
      message.error('加载服务列表失败: ' + result.data.message);
    }
  } catch (error) {
    console.error('Failed to load services:', error);
    message.error('加载服务列表失败');
  } finally {
    loading.value = false;
  }
};

// 更新可用的组列表
const updateAvailableGroups = (servicesList: IServiceQueryItem[]) => {
  const groups = new Set<string>();
  servicesList.forEach((service) => {
    if (service.groupName) {
      groups.add(service.groupName);
    }
  });
  availableGroups.value = Array.from(groups).sort();
};

// 搜索处理
const handleSearch = () => {
  pagination.value.page = 1;
  loadServices();
};

// 选择处理
const handleSelect = (service: IServiceQueryItem) => {
  const selectedService = {
    namespaceId:
      props.namespace || namespaceStore.current.value.namespaceId || '',
    groupName: service.groupName,
    serviceName: service.name
  };

  message.success(`已选择服务: ${service.name} (${service.groupName})`);
  emit('select', selectedService);
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
    searchForm.value.groupNameParam = group;
  } else {
    searchForm.value.groupNameParam = '';
  }
  handleSearch();
};

// 清除组筛选
const clearGroupFilter = () => {
  searchForm.value.groupNameParam = '';
  handleSearch();
};

// 清除所有筛选条件
const handleClearFilters = () => {
  searchForm.value.serviceNameParam = '';
  searchForm.value.groupNameParam = '';
  handleSearch();
};

// 监听 visible 变化
watch(visible, (newValue) => {
  if (newValue) {
    searchForm.value.serviceNameParam = '';
    searchForm.value.groupNameParam = '';
    pagination.value.page = 1;
    loadServices();
  }
});

// 监听命名空间变化
watch(
  [() => props.namespace, () => namespaceStore.current.value.namespaceId],
  ([newNamespace, newStoreNamespace]) => {
    if (visible.value) {
      pagination.value.page = 1;
      loadServices();
    }
  }
);

// 组件挂载时加载数据
onMounted(() => {
  if (visible.value) {
    loadServices();
  }
});
</script>

<style scoped>
/* 服务选择器样式优化 */
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
