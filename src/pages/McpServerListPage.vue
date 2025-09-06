<template>
  <div class="relative flex flex-col w-full h-full">
    <div
      class="flex flex-row items-center h-10 border-b border-gray-300 bg-white pr-3"
    >
      <div class="flex-1 text-sm leading-[30px] pl-4">
        <span>{{ t('mcpserver.mcpserver_list') }}</span>
      </div>
      <div class="flex-none">
        <NamespacePopSelect @change="queryList" />
      </div>
    </div>

    <div class="m-2">
      <div class="flex flex-col relative bg-white rounded-lg p-4">
        <n-card :bordered="false">
          <n-form label-placement="left" label-width="90">
            <n-grid cols="1 s:1 m:2 l:3 xl:3 2xl:4" responsive="screen">
              <n-gi>
                <n-form-item
                  :label="t('mcpserver.server_name')"
                  path="param.nameFilter"
                >
                  <n-input
                    v-model:value="param.nameFilter"
                    :placeholder="t('mcpserver.input_server_name')"
                    clearable
                    @keydown.enter.prevent
                    @keyup.enter="queryList"
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <!-- 占位符，使按钮靠右对齐 -->
              </n-gi>
              <n-gi>
                <n-space justify="end" class="ml-2">
                  <n-button tertiary @click="queryList">{{
                    t('common.query')
                  }}</n-button>
                  <n-button
                    v-if="webResources.canUpdateConfig"
                    type="info"
                    @click="showCreate"
                    >{{ t('common.add') }}</n-button
                  >
                </n-space>
              </n-gi>
            </n-grid>
          </n-form>
        </n-card>

        <n-data-table
          remote
          ref="table"
          :scroll-x="800"
          :bordered="false"
          :columns="columns"
          :data="data"
          :loading="loading"
          :pagination="pagination"
          :row-key="rowKey"
          @update:page="handlePageChange"
        />
      </div>
    </div>

    <Transition
      enter-from-class="translate-x-5 opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-5 opacity-0"
    >
      <SubContentFullPage
        v-show="useForm"
        :title="getDetailTitle"
        :submitName="
          model.mode === constant.FORM_MODE_CREATE
            ? t('common.confirm')
            : model.mode === constant.FORM_MODE_DETAIL
              ? t('common.return')
              : t('common.confirm')
        "
        @close="closeForm"
        @submit="submitForm"
      >
        <McpServerDetailComponent
          v-if="useForm"
          ref="mcpServerDetailRef"
          :server-data="model"
          :mode="getComponentMode"
          :show-actions="false"
          @save:success="handleSubmitSuccess"
          @create:success="handleSubmitSuccess"
          @cancel="handleFormCancel"
        />
      </SubContentFullPage>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { mcpServerApi } from '@/api/mcpserver';
import { namespaceStore } from '@/data/namespace';
import { useWebResources } from '@/data/resources';
import NamespacePopSelect from '@/components/namespace/NamespacePopSelect.vue';
import SubContentFullPage from '@/components/common/SubContentFullPage.vue';
import McpServerDetailComponent from '@/components/mcpserver/McpServerDetailComponent.vue';
import { createMcpServerColumns } from '@/components/mcpserver/McpServerColumns';
import { useI18n } from 'vue-i18n';
import { printApiError, handleApiResult } from '@/utils/request';
import { useProjectSettingStore } from '@/store/modules/projectSetting';
import { useDialog, useMessage } from 'naive-ui';
// @ts-ignore
import template from 'template_js';
import namespaceApi from '@/api/namespace';
import * as constant from '@/types/constant';
import { formatMcpServerForDisplay } from '@/api/mcpserver';
import type { McpServerDto } from '@/types/mcpserver';

const defaultModelValue: McpServerDto & { mode: string } = {
  id: 0,
  namespace: namespaceStore.current.value.namespaceId,
  name: '',
  description: '',
  authKeys: [],
  tools: [],
  currentValue: {
    id: 0,
    description: '',
    tools: [],
    opUser: '',
    updateTime: Date.now(),
    createTime: Date.now(),
    isRelease: false
  },
  releaseValue: {
    id: 0,
    description: '',
    tools: [],
    opUser: '',
    updateTime: Date.now(),
    createTime: Date.now(),
    isRelease: false
  },
  histories: [],
  mode: constant.FORM_MODE_CREATE,
  createTime: Date.now(),
  lastModifiedMillis: Date.now(),
  updateTime: Date.now()
};

const { t } = useI18n();
const dialog = useDialog();
const message = useMessage();
const projectSettingStore = useProjectSettingStore();

const webResources = useWebResources();

const data = ref<any[]>([]);
const loading = ref(false);
const useForm = ref(false);
const param = ref({
  nameFilter: '',
  pageNo: 1,
  pageSize: 20
});

const model = ref<McpServerDto & { mode: string }>({ ...defaultModelValue });

const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 20,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    param.value.pageSize = pageSize;
    doHandlePageChange(1);
  },
  prefix(info: { itemCount?: number }) {
    return t('common.total') + `: ${info.itemCount || 0}`;
  }
});

const rowKey = (rowData: any) => rowData.id;

const doQueryList = () => {
  return mcpServerApi.queryMcpServerPage({
    namespaceId: namespaceStore.current.value.namespaceId,
    nameFilter: param.value.nameFilter,
    pageNo: pagination.page,
    pageSize: pagination.pageSize
  });
};

const doHandlePageChange = (currentPage: number) => {
  pagination.page = currentPage;
  if (!loading.value) {
    loading.value = true;
    doQueryList()
      .then(handleApiResult)
      .then((page) => {
        if (page) {
          loading.value = false;
          const count = page.totalCount || 0;
          const pageSize = pagination.pageSize;
          data.value = (page.list || []).map((item: any) =>
            formatMcpServerForDisplay(item)
          );
          pagination.itemCount = count;
          pagination.pageCount = Math.max(1, Math.ceil(count / pageSize));
        }
      })
      .catch((error) => {
        loading.value = false;
        console.error('Failed to load McpServer list:', error);

        // Handle namespace permission error similar to ConfigListPage
        namespaceApi
          .queryList()
          .then(handleApiResult)
          .then((list) => {
            const firstNamespace = list?.[0];
            if (
              firstNamespace &&
              namespaceStore.current.value.namespaceId !==
                firstNamespace.namespaceId
            ) {
              namespaceStore.setCurrent({
                namespaceId: firstNamespace.namespaceId,
                namespaceName: firstNamespace.namespaceName
              });
              message.warning(
                template(t('namespace.namespace_permission_switch_notice'), {
                  name: firstNamespace.namespaceName || 'public'
                })
              );
              doHandlePageChange(1);
            } else {
              message.error(t('namespace.no_permission_and_no_namespaces'));
            }
          })
          .catch((namespaceError) => {
            console.error('Failed to load namespaces:', namespaceError);
            printApiError(namespaceError);
            // Reset data on complete failure
            data.value = [];
            pagination.itemCount = 0;
            pagination.pageCount = 1;
          });
      });
  }
};

const detailItem = async (row: any) => {
  try {
    const server = await mcpServerApi.getMcpServerWithErrorHandling(row.id);

    if (server) {
      // 从 currentValue.tools 或 tools 中获取工具数据，如果都不存在则使用空数组
      const tools = server.currentValue?.tools || server.tools || [];

      // 直接更新 model.value 的属性
      Object.assign(model.value, {
        id: server.id,
        namespace: server.namespace,
        name: server.name,
        description: server.description || '',
        authKeys: [...(server.authKeys || [])],
        tools: tools,
        currentValue: server.currentValue,
        releaseValue: server.releaseValue,
        histories: server.histories,
        mode: constant.FORM_MODE_DETAIL,
        createTime: server.createTime,
        lastModifiedMillis: server.lastModifiedMillis,
        updateTime: server.updateTime
      });
      useForm.value = true;
    }
  } catch (error) {
    printApiError(error);
  }
};

const updateItem = async (row: any) => {
  try {
    const server = await mcpServerApi.getMcpServerWithErrorHandling(row.id);

    if (server) {
      // 从 currentValue.tools 或 tools 中获取工具数据，如果都不存在则使用空数组
      const tools = server.currentValue?.tools || server.tools || [];

      // 直接更新 model.value 的属性
      Object.assign(model.value, {
        id: server.id,
        namespace: server.namespace,
        name: server.name,
        description: server.description || '',
        authKeys: [...(server.authKeys || [])],
        tools: tools,
        currentValue: server.currentValue,
        releaseValue: server.releaseValue,
        histories: server.histories,
        mode: constant.FORM_MODE_UPDATE,
        createTime: server.createTime,
        lastModifiedMillis: server.lastModifiedMillis,
        updateTime: server.updateTime
      });
      useForm.value = true;
    }
  } catch (error) {
    printApiError(error);
  }
};

const removeItem = (row: any) => {
  dialog.warning({
    title: t('mcpserver.delete_mcpserver'),
    content: template(t('mcpserver.confirm_delete_mcpserver'), {
      name: row.name
    }),
    positiveButtonProps: {
      type: 'primary'
    },
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        const success = await mcpServerApi.removeMcpServerWithErrorHandling(
          row.id
        );

        if (success) {
          message.success(t('mcpserver.delete_success'));
          doHandlePageChange(1);
        }
      } catch (error) {
        printApiError(error);
      }
    }
  });
};

const showCreate = () => {
  // 直接更新 model.value 的属性
  Object.assign(model.value, defaultModelValue);
  useForm.value = true;
};

const closeForm = () => {
  useForm.value = false;
};

const mcpServerDetailRef = ref();

const submitForm = async () => {
  if (model.value.mode === constant.FORM_MODE_DETAIL) {
    useForm.value = false;
    return;
  }

  // 触发详情组件的相应操作
  if (mcpServerDetailRef.value) {
    if (model.value.mode === constant.FORM_MODE_CREATE) {
      await mcpServerDetailRef.value.handleCreate();
    } else if (model.value.mode === constant.FORM_MODE_UPDATE) {
      await mcpServerDetailRef.value.handleSave();
    }
  }
};

// Handle form submission success from detail component
const handleSubmitSuccess = () => {
  useForm.value = false;
  doHandlePageChange(1);
};

// Handle form cancellation from detail component
const handleFormCancel = () => {
  useForm.value = false;
};

const getDetailTitle = computed(() => {
  if (model.value.mode === constant.FORM_MODE_UPDATE) {
    return t('mcpserver.edit_mcpserver');
  } else if (model.value.mode === constant.FORM_MODE_CREATE) {
    return t('mcpserver.create_mcpserver');
  }
  return t('mcpserver.mcpserver_detail');
});

// 转换模式
const getComponentMode = computed(() => {
  if (model.value.mode === constant.FORM_MODE_CREATE) {
    return 'create';
  } else if (model.value.mode === constant.FORM_MODE_UPDATE) {
    return 'update';
  }
  return 'detail';
});

// Create columns for the data table
const columns = createMcpServerColumns(
  detailItem,
  updateItem,
  removeItem,
  webResources
);

const handlePageChange = (page: number) => {
  doHandlePageChange(page);
};

const queryList = () => {
  doHandlePageChange(1);
};

onMounted(() => {
  queryList();
});
</script>
