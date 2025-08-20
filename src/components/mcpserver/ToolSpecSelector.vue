<template>
  <n-modal
    v-model:show="visible"
    :mask-closable="true"
    preset="card"
    style="max-width: 800px; max-height: 80vh"
    :title="t('mcpserver.select_toolspec')"
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
          <n-form-item-gi :span="8">
            <n-input
              v-model:value="searchForm.groupFilter"
              :placeholder="t('toolspec.group')"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi :span="8">
            <n-input
              v-model:value="searchForm.toolNameFilter"
              :placeholder="t('toolspec.tool_name')"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi :span="8">
            <n-button type="primary" block @click="handleSearch">
              <template #icon>
                <n-icon><search-outline /></n-icon>
              </template>
              {{ t('common.search') }}
            </n-button>
          </n-form-item-gi>
        </n-grid>
      </n-form>
      
      <!-- ToolSpec 列表 -->
      <n-spin :show="loading">
        <n-data-table
          :columns="columns"
          :data="toolSpecs"
          :pagination="pagination"
          :bordered="false"
          :max-height="400"
        />
      </n-spin>
    </n-space>
    
    <template #footer>
      <n-space justify="end">
        <n-button @click="handleCancel">{{ t('common.cancel') }}</n-button>
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
  useDialog
} from 'naive-ui';
import { SearchOutline } from '@vicons/ionicons5';
import { toolSpecApi, IToolSpecQueryParam, IToolSpec } from '@/api/toolspec';
import { ToolSpecInfo } from '@/types/mcpserver';

interface Props {
  visible: boolean;
  selectedToolSpecs: ToolSpecInfo[];
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'select', toolSpec: ToolSpecInfo): void;
  (e: 'cancel'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const dialog = useDialog();

// 搜索表单
const searchForm = ref({
  groupFilter: '',
  toolNameFilter: ''
});

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
const columns = [
  {
    title: t('namespace.namespace'),
    key: 'namespace',
    width: 150
  },
  {
    title: t('toolspec.group'),
    key: 'group',
    width: 150
  },
  {
    title: t('toolspec.tool_name'),
    key: 'toolName',
    width: 150
  },
  {
    title: t('toolspec.name'),
    key: 'name',
    width: 200
  },
  {
    title: t('toolspec.description'),
    key: 'description',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: t('toolspec.version'),
    key: 'version',
    width: 80
  },
  {
    title: t('common.operation'),
    key: 'actions',
    width: 100,
    render: (row: IToolSpec) => {
      const isSelected = props.selectedToolSpecs.some(
        spec => spec.namespace === row.namespace && 
               spec.group === row.group && 
               spec.toolName === row.toolName
      );
      
      return h(
        NButton,
        {
          size: 'small',
          type: 'primary',
          disabled: isSelected,
          onClick: () => handleSelect(row)
        },
        { default: () => isSelected ? t('common.selected') : t('common.select') }
      );
    }
  }
];

// 加载 ToolSpec 列表
const loadToolSpecs = async () => {
  loading.value = true;
  try {
    const params: IToolSpecQueryParam = {
      pageNo: pagination.value.page,
      pageSize: pagination.value.pageSize,
      groupFilter: searchForm.value.groupFilter || undefined,
      toolNameFilter: searchForm.value.toolNameFilter || undefined
    };
    
    const result = await toolSpecApi.queryToolSpecPageWithErrorHandling(params);
    if (result) {
      toolSpecs.value = result.list;
      pagination.value.itemCount = result.totalCount;
    }
  } catch (error) {
    console.error('Failed to load ToolSpecs:', error);
  } finally {
    loading.value = false;
  }
};

// 搜索处理
const handleSearch = () => {
  pagination.value.page = 1;
  loadToolSpecs();
};

// 选择处理
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
  
  emit('select', selectedToolSpec);
};

// 取消处理
const handleCancel = () => {
  emit('cancel');
  visible.value = false;
};

// 监听 visible 变化
watch(visible, (newValue) => {
  if (newValue) {
    loadToolSpecs();
  }
});

// 组件挂载时加载数据
onMounted(() => {
  if (visible.value) {
    loadToolSpecs();
  }
});
</script>

<style scoped>
/* 添加必要的样式 */
</style>