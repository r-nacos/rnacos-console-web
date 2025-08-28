<template>
  <div class="mcp-server-history-list">
    <n-data-table
      :columns="columns"
      :data="histories"
      :pagination="pagination"
      :bordered="false"
      :striped="true"
      size="small"
    />

    <!-- 历史记录详情抽屉 -->
    <n-drawer v-model:show="showDetailDrawer" :width="800" :placement="'right'">
      <n-drawer-content
        :title="t('mcpserverdetailcomponent.history_detail')"
        closable
      >
        <div v-if="selectedHistory">
          <mcp-server-value-component
            :server-value="selectedHistory"
            mode="detail"
          />
        </div>
        <template #footer>
          <n-button @click="closeDetailDrawer">
            {{ t('mcpserverdetailcomponent.close') }}
          </n-button>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NDataTable,
  NDrawer,
  NDrawerContent,
  NButton,
  NSpace,
  useMessage,
  useDialog
} from 'naive-ui';
import McpServerValueComponent from './McpServerValueComponent.vue';
import { McpServerValue } from '@/types/mcpserver';
import { mcpServerApi } from '@/api/mcpserver';

const { t } = useI18n();
const message = useMessage();
const dialog = useDialog();

interface Props {
  histories: McpServerValue[];
  serverId: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'viewDetail', history: McpServerValue): void;
  (e: 'publishHistory', history: McpServerValue): void;
}>();

// 状态变量
const showDetailDrawer = ref(false);
const selectedHistory = ref<McpServerValue | null>(null);

// 分页配置
const pagination = {
  pageSize: 10
};

// 格式化时间
const formatTime = (timestamp: number) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// 查看历史记录详情
const handleViewDetail = (history: McpServerValue) => {
  selectedHistory.value = history;
  showDetailDrawer.value = true;
  emit('viewDetail', history);
};

// 关闭详情抽屉
const closeDetailDrawer = () => {
  showDetailDrawer.value = false;
  selectedHistory.value = null;
};

// 发布历史版本
const handlePublishHistory = (history: McpServerValue) => {
  dialog.warning({
    title: t('mcpserverdetailcomponent.confirm_publish_history'),
    content: t('mcpserverdetailcomponent.confirm_publish_history_content'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        const success =
          await mcpServerApi.publishHistoryMcpServerWithErrorHandling({
            id: props.serverId,
            historyValueId: history.id
          });

        if (success) {
          message.success(
            t('mcpserverdetailcomponent.publish_history_success')
          );
          emit('publishHistory', history);
        } else {
          message.error(t('mcpserverdetailcomponent.publish_history_failed'));
        }
      } catch (error) {
        console.error('发布历史版本失败:', error);
        message.error(t('mcpserverdetailcomponent.publish_history_failed'));
      }
    }
  });
};

// 表格列定义
const columns = computed(() => [
  {
    title: t('mcpserverdetailcomponent.history_id'),
    key: 'id',
    width: 80
  },
  {
    title: t('mcpserverdetailcomponent.history_name'),
    key: 'description',
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: t('mcpserverdetailcomponent.history_description'),
    key: 'description',
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: t('mcpserverdetailcomponent.history_create_time'),
    key: 'createTime',
    width: 150,
    render: (row: McpServerValue) => formatTime(row.createTime || 0)
  },
  {
    title: t('mcpserverdetailcomponent.history_last_modified'),
    key: 'updateTime',
    width: 150,
    render: (row: McpServerValue) => formatTime(row.updateTime)
  },
  {
    title: t('mcpserverdetailcomponent.history_tools_count'),
    key: 'toolsCount',
    width: 100,
    render: (row: McpServerValue) => row.tools?.length || 0
  },
  {
    title: t('common.operation'),
    key: 'actions',
    width: 200,
    render: (row: McpServerValue) => {
      return h(
        NSpace,
        { size: 'small' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                onClick: () => handleViewDetail(row)
              },
              {
                default: () => t('mcpserverdetailcomponent.view_history_detail')
              }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'success',
                onClick: () => handlePublishHistory(row)
              },
              { default: () => t('mcpserverdetailcomponent.publish_history') }
            )
          ]
        }
      );
    }
  }
]);
</script>

<style scoped>
.mcp-server-history-list {
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 8px;
}
</style>
