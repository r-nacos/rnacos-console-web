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
      class="transition-all duration-300 ease-in-out"
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
        <McpServerDetail
          ref="mcpServerDetailRef"
          :model="model"
          @submit-success="handleSubmitSuccess"
          @cancel="handleFormCancel"
          @close="closeForm"
        />
      </SubContentFullPage>
    </Transition>
  </div>
</template>

<script>
import { ref, reactive, defineComponent, computed, h } from 'vue';
import { mcpServerApi } from '@/api/mcpserver';
import { namespaceStore } from '@/data/namespace';
import { useWebResources } from '@/data/resources';
import NamespacePopSelect from '@/components/namespace/NamespacePopSelect.vue';
import SubContentFullPage from '@/components/common/SubContentFullPage.vue';
import McpServerDetail from './McpServerDetail.vue';
import { createMcpServerColumns } from '@/components/mcpserver/McpServerColumns';
import { useI18n } from 'vue-i18n';
import { printApiError, handleApiResult } from '@/utils/request';
import { useProjectSettingStore } from '@/store/modules/projectSetting';
import { useDialog, useMessage } from 'naive-ui';
import template from 'template_js';
import namespaceApi from '@/api/namespace';
import * as constant from '@/types/constant';
import { formatMcpServerForDisplay } from '@/api/mcpserver';

export default defineComponent({
  components: {
    NamespacePopSelect,
    SubContentFullPage,
    McpServerDetail
  },
  setup() {
    const { t } = useI18n();
    const dialog = useDialog();
    const message = useMessage();
    const projectSettingStore = useProjectSettingStore();

    const webResources = useWebResources();

    const dataRef = ref([]);
    const loadingRef = ref(false);
    const useFormRef = ref(false);
    const paramRef = ref({
      nameFilter: '',
      pageNo: 1,
      pageSize: 20
    });

    const modelRef = ref({
      id: 0,
      namespace: '',
      name: '',
      description: '',
      authKeys: [],
      tools: [],
      mode: '',
      currentValue: undefined
    });

    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 20,
      itemCount: 0,
      showSizePicker: true,
      pageSizes: [10, 20, 50, 100],
      onUpdatePageSize: (pageSize) => {
        paginationReactive.pageSize = pageSize;
        paginationReactive.page = 1;
        paramRef.value.pageSize = pageSize;
        doHandlePageChange(1);
      },
      prefix({ itemCount }) {
        return t('common.total') + `: ${itemCount}`;
      }
    });

    const rowKey = (rowData) => rowData.id;

    const doQueryList = () => {
      return mcpServerApi.queryMcpServerPage({
        namespaceId: namespaceStore.current.value.namespaceId,
        nameFilter: paramRef.value.nameFilter,
        pageNo: paginationReactive.page,
        pageSize: paginationReactive.pageSize
      });
    };

    const doHandlePageChange = (currentPage) => {
      paginationReactive.page = currentPage;
      if (!loadingRef.value) {
        loadingRef.value = true;
        doQueryList()
          .then(handleApiResult)
          .then((page) => {
            loadingRef.value = false;
            const count = page.total || 0;
            const pageSize = paginationReactive.pageSize;
            dataRef.value = (page.list || []).map((item) =>
              formatMcpServerForDisplay(item)
            );
            paginationReactive.itemCount = count;
            paginationReactive.pageCount = Math.max(
              1,
              Math.ceil(count / pageSize)
            );
          })
          .catch((error) => {
            loadingRef.value = false;
            console.error('Failed to load McpServer list:', error);

            // Handle namespace permission error similar to ConfigListPage
            namespaceApi
              .queryList()
              .then(handleApiResult)
              .then((list) => {
                const firstNamespace = list[0];
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
                    template(
                      t('namespace.namespace_permission_switch_notice'),
                      {
                        name: firstNamespace.namespaceName || 'public'
                      }
                    )
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
                dataRef.value = [];
                paginationReactive.itemCount = 0;
                paginationReactive.pageCount = 1;
              });
          });
      }
    };

    const detailItem = async (row) => {
      try {
        const server = await mcpServerApi.getMcpServerWithErrorHandling(row.id);
        console.log('detailItem', server);

        if (server) {
          // 从 currentValue.tools 或 tools 中获取工具数据，如果都不存在则使用空数组
          const tools = server.currentValue?.tools || server.tools || [];

          modelRef.value = {
            id: server.id,
            namespace: server.namespace,
            name: server.name,
            description: server.description || '',
            authKeys: [...(server.authKeys || [])],
            tools: tools,
            currentValue: server.currentValue,
            mode: constant.FORM_MODE_DETAIL
          };
          useFormRef.value = true;
          console.log('detailItem 001', JSON.stringify(modelRef.value));
        }
      } catch (error) {
        console.log('detailItem error:' + error);
        printApiError(error);
      }
    };

    const updateItem = async (row) => {
      try {
        const server = await mcpServerApi.getMcpServerWithErrorHandling(row.id);

        if (server) {
          // 从 currentValue.tools 或 tools 中获取工具数据，如果都不存在则使用空数组
          const tools = server.currentValue?.tools || server.tools || [];

          modelRef.value = {
            id: server.id,
            namespace: server.namespace,
            name: server.name,
            description: server.description || '',
            authKeys: [...(server.authKeys || [])],
            tools: tools,
            currentValue: server.currentValue,
            mode: constant.FORM_MODE_UPDATE
          };
          useFormRef.value = true;
        }
      } catch (error) {
        printApiError(error);
      }
    };

    const removeItem = (row) => {
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
      modelRef.value = {
        id: 0,
        namespace: namespaceStore.current.value.namespaceId,
        name: '',
        description: '',
        authKeys: [''],
        tools: [],
        currentValue: undefined,
        mode: constant.FORM_MODE_CREATE
      };
      useFormRef.value = true;
    };

    const closeForm = () => {
      useFormRef.value = false;
    };

    const mcpServerDetailRef = ref();

    const submitForm = async () => {
      if (modelRef.value.mode === constant.FORM_MODE_DETAIL) {
        useFormRef.value = false;
        return;
      }

      // Use the detail component's submit method
      if (mcpServerDetailRef.value) {
        try {
          // Trigger form validation and submission in the detail component
          const isValid = await mcpServerDetailRef.value.validateForm();
          if (isValid) {
            if (modelRef.value.mode === constant.FORM_MODE_CREATE) {
              // Handle create operation
              const apiParams = {
                namespace: modelRef.value.namespace,
                name: modelRef.value.name,
                description: modelRef.value.description,
                authKeys: modelRef.value.authKeys.filter((key) => key.trim()),
                tools: modelRef.value.tools
              };

              const success =
                await mcpServerApi.addMcpServerWithErrorHandling(apiParams);
              if (success) {
                message.success(t('mcpserver.create_success'));
                handleSubmitSuccess();
              }
            } else if (modelRef.value.mode === constant.FORM_MODE_UPDATE) {
              // Handle update operation
              const apiParams = {
                id: modelRef.value.id,
                namespace: modelRef.value.namespace,
                name: modelRef.value.name,
                description: modelRef.value.description,
                authKeys: modelRef.value.authKeys.filter((key) => key.trim()),
                tools: modelRef.value.tools
              };

              const success =
                await mcpServerApi.updateMcpServerWithErrorHandling(apiParams);
              if (success) {
                message.success(t('mcpserver.update_success'));
                handleSubmitSuccess();
              }
            }
          }
        } catch (error) {
          console.error('Form submission failed:', error);
          printApiError(error);
        }
      }
    };

    // Handle form submission success from detail component
    const handleSubmitSuccess = () => {
      useFormRef.value = false;
      doHandlePageChange(1);
    };

    // Handle form cancellation from detail component
    const handleFormCancel = () => {
      useFormRef.value = false;
    };

    const getDetailTitle = computed(() => {
      if (modelRef.value.mode === constant.FORM_MODE_UPDATE) {
        return t('mcpserver.edit_mcpserver');
      } else if (modelRef.value.mode === constant.FORM_MODE_CREATE) {
        return t('mcpserver.create_mcpserver');
      }
      return t('mcpserver.mcpserver_detail');
    });

    // Create columns for the data table
    const columns = createMcpServerColumns(
      detailItem,
      updateItem,
      removeItem,
      webResources
    );

    return {
      webResources,
      data: dataRef,
      pagination: paginationReactive,
      loading: loadingRef,
      useForm: useFormRef,
      param: paramRef,
      model: modelRef,
      columns,
      t,
      constant,
      mcpServerDetailRef,
      isMobile: computed(() => projectSettingStore.getIsMobile),
      rowKey,
      doQueryList,
      doHandlePageChange,
      showCreate,
      closeForm,
      submitForm,
      handleSubmitSuccess,
      handleFormCancel,
      getDetailTitle
    };
  },
  methods: {
    handlePageChange(page) {
      this.doHandlePageChange(page);
    },
    queryList() {
      this.doHandlePageChange(1);
    }
  },
  created() {
    this.queryList();
  }
});
</script>
