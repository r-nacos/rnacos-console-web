<template>
  <div class="relative flex flex-col w-full h-full">
    <div
      class="flex flex-row items-center h-10 border-b border-gray-300 bg-white pr-3"
    >
      <div class="flex-1 text-sm leading-[30px] pl-4">
        <span>{{ this.$t('toolspec.toolspec_list') }}</span>
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
                  :label="this.$t('toolspec.group')"
                  path="param.groupFilter"
                >
                  <n-input
                    v-model:value="param.groupFilter"
                    :placeholder="this.$t('toolspec.input_group')"
                    clearable
                    @keydown.enter.prevent
                    @keyup.enter="queryList"
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item
                  :label="this.$t('toolspec.tool_name')"
                  path="param.toolNameFilter"
                >
                  <n-input
                    v-model:value="param.toolNameFilter"
                    :placeholder="this.$t('toolspec.input_tool_name')"
                    clearable
                    @keydown.enter.prevent
                    @keyup.enter="queryList"
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-space justify="end" class="ml-2">
                  <n-button tertiary @click="queryList">{{
                    this.$t('common.query')
                  }}</n-button>
                  <n-button
                    v-if="webResources.canUpdateConfig"
                    type="info"
                    @click="showCreate"
                    >{{ this.$t('common.add') }}</n-button
                  >
                </n-space>
              </n-gi>
            </n-grid>
          </n-form>
        </n-card>
        
        <n-data-table
          remote
          ref="table"
          :scroll-x="600"
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
        <McpToolSpecDetail
          ref="toolSpecDetailRef"
          :model="model"
          @submit-success="handleSubmitSuccess"
          @cancel="handleFormCancel"
          @close="closeForm"
          @update-parameters="handleUpdateParameters"
          @update-format="handleUpdateFormat"
          @reset-form="handleResetForm"
        />
      </SubContentFullPage>
    </Transition>
  </div>
</template>

<script>
import { ref, reactive, defineComponent, computed, h } from 'vue';
import { toolSpecApi } from '@/api/toolspec';
import { namespaceStore } from '@/data/namespace';
import { useWebResources } from '@/data/resources';
import NamespacePopSelect from '@/components/namespace/NamespacePopSelect.vue';
import SubContentFullPage from '@/components/common/SubContentFullPage.vue';
import McpToolSpecDetail from './McpToolSpecDetail.vue';

import { useI18n } from 'vue-i18n';
import {
  printApiError,
  handleApiResult
} from '@/utils/request';
import { useProjectSettingStore } from '@/store/modules/projectSetting';
import { useDialog } from 'naive-ui';
import template from 'template_js';
import namespaceApi from '@/api/namespace';
import * as constant from '@/types/constant';

export default defineComponent({
  components: {
    NamespacePopSelect,
    SubContentFullPage,
    McpToolSpecDetail
  },
  setup() {
    const { t } = useI18n();
    const dialog = useDialog();
    const projectSettingStore = useProjectSettingStore();

    const webResources = useWebResources();
    
    const dataRef = ref([]);
    const loadingRef = ref(false);
    const useFormRef = ref(false);
    const paramRef = ref({
      groupFilter: '',
      toolNameFilter: '',
      pageNo: 1,
      pageSize: 20
    });
    
    const modelRef = ref({
      namespace: '',
      group: '',
      toolName: '',
      name: '',
      description: '',
      version: 0,
      parameters: '',
      parametersFormat: 'yaml',
      mode: ''
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

    const rowKey = (rowData) => 
      `${rowData.namespace}@@${rowData.group}@@${rowData.toolName}`;

    const doQueryList = () => {
      return toolSpecApi.queryToolSpecPage({
        namespaceId: namespaceStore.current.value.namespaceId,
        groupFilter: paramRef.value.groupFilter,
        toolNameFilter: paramRef.value.toolNameFilter,
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
            const count = page.totalCount || 0;
            const pageSize = paginationReactive.pageSize;
            dataRef.value = page.list || [];
            paginationReactive.itemCount = count;
            paginationReactive.pageCount = Math.max(1, Math.ceil(count / pageSize));
          })
          .catch((error) => {
            loadingRef.value = false;
            console.error('Failed to load ToolSpec list:', error);
            
            // Handle namespace permission error similar to ConfigListPage
            namespaceApi
              .queryList()
              .then(handleApiResult)
              .then((list) => {
                const firstNamespace = list[0];
                if (firstNamespace && namespaceStore.current.value.namespaceId !== firstNamespace.namespaceId) {
                  namespaceStore.setCurrent({
                    namespaceId: firstNamespace.namespaceId,
                    namespaceName: firstNamespace.namespaceName
                  });
                  window.$message.warning(
                    template(
                      t('namespace.namespace_permission_switch_notice'),
                      {
                        name: firstNamespace.namespaceName || 'public'
                      }
                    )
                  );
                  doHandlePageChange(1);
                } else {
                  window.$message.error(
                    t('namespace.no_permission_and_no_namespaces')
                  );
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
        const toolSpec = await toolSpecApi.getToolSpecWithErrorHandling({
          namespace: row.namespace,
          group: row.group,
          toolName: row.toolName
        });
        
        if (toolSpec) {
          modelRef.value = {
            namespace: toolSpec.namespace,
            group: toolSpec.group,
            toolName: toolSpec.toolName,
            name: toolSpec.name || '',
            description: toolSpec.description || '',
            version: toolSpec.version,
            parameters: toolSpec.function ? JSON.stringify(toolSpec.function.parameters, null, 2) : '{}',
            parametersFormat: 'json',
            mode: constant.FORM_MODE_DETAIL
          };
          useFormRef.value = true;
        }
      } catch (error) {
        printApiError(error);
      }
    };

    const updateItem = async (row) => {
      try {
        const toolSpec = await toolSpecApi.getToolSpecWithErrorHandling({
          namespace: row.namespace,
          group: row.group,
          toolName: row.toolName
        });
        
        if (toolSpec) {
          modelRef.value = {
            namespace: toolSpec.namespace,
            group: toolSpec.group,
            toolName: toolSpec.toolName,
            name: toolSpec.name || '',
            description: toolSpec.description || '',
            version: toolSpec.version,
            parameters: toolSpec.function ? JSON.stringify(toolSpec.function.parameters, null, 2) : '{}',
            parametersFormat: 'json',
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
        title: t('toolspec.delete_toolspec'),
        content: template(t('toolspec.confirm_delete_toolspec'), {
          toolName: row.toolName,
          group: row.group
        }),
        positiveButtonProps: {
          type: 'primary'
        },
        positiveText: t('common.confirm'),
        negativeText: t('common.cancel'),
        onPositiveClick: async () => {
          try {
            await toolSpecApi
              .removeToolSpec({
                namespace: row.namespace,
                group: row.group,
                toolName: row.toolName
              })
              .then(handleApiResult);
            
            window.$message.success(t('toolspec.delete_success'));
            doHandlePageChange(1);
          } catch (error) {
            printApiError(error);
          }
        }
      });
    };

    const showCreate = () => {
      modelRef.value = {
        namespace: namespaceStore.current.value.namespaceId,
        group: '',
        toolName: '',
        name: '',
        description: '',
        version: 0,
        parameters: '{}',
        parametersFormat: 'yaml',
        mode: constant.FORM_MODE_CREATE
      };
      useFormRef.value = true;
    };

    const closeForm = () => {
      useFormRef.value = false;
    };

    const toolSpecDetailRef = ref();
    
    const submitForm = async () => {
      if (modelRef.value.mode === constant.FORM_MODE_DETAIL) {
        useFormRef.value = false;
        return;
      }
      
      // Use the detail component's submit method
      if (toolSpecDetailRef.value) {
        const success = await toolSpecDetailRef.value.handleSubmit();
        if (success) {
          useFormRef.value = false;
          doHandlePageChange(1);
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

    // Handle parameters update from detail component
    const handleUpdateParameters = (newParameters) => {
      modelRef.value.parameters = newParameters;
    };

    // Handle format update from detail component
    const handleUpdateFormat = (newFormat) => {
      modelRef.value.parametersFormat = newFormat;
    };

    // Handle form reset from detail component
    const handleResetForm = () => {
      if (modelRef.value.mode === constant.FORM_MODE_CREATE) {
        modelRef.value.namespace = namespaceStore.current.value.namespaceId;
        modelRef.value.group = '';
        modelRef.value.toolName = '';
        modelRef.value.name = '';
        modelRef.value.description = '';
        modelRef.value.parameters = '{}';
        modelRef.value.parametersFormat = 'yaml';
      }
    };

    const getDetailTitle = computed(() => {
      if (modelRef.value.mode === constant.FORM_MODE_UPDATE) {
        return t('toolspec.edit_toolspec');
      } else if (modelRef.value.mode === constant.FORM_MODE_CREATE) {
        return t('toolspec.create_toolspec');
      }
      return t('toolspec.toolspec_detail');
    });

    // Create columns for the data table
    const columns = computed(() => [
      {
        title: t('toolspec.namespace'),
        key: 'namespace',
        width: 120,
        ellipsis: {
          tooltip: true
        }
      },
      {
        title: t('toolspec.group'),
        key: 'group',
        width: 150,
        ellipsis: {
          tooltip: true
        }
      },
      {
        title: t('toolspec.tool_name'),
        key: 'toolName',
        width: 180,
        ellipsis: {
          tooltip: true
        }
      },
      {
        title: t('toolspec.name'),
        key: 'name',
        width: 150,
        ellipsis: {
          tooltip: true
        },
        render(row) {
          return row.name || '-';
        }
      },
      {
        title: t('toolspec.description'),
        key: 'description',
        width: 200,
        ellipsis: {
          tooltip: true
        },
        render(row) {
          return row.description || '-';
        }
      },
      {
        title: t('toolspec.version'),
        key: 'version',
        width: 80,
        render(row) {
          return row.version !== undefined ? row.version : '-';
        }
      },
      {
        title: t('toolspec.create_time'),
        key: 'createTime',
        width: 160,
        render(row) {
          return row.createTime ? new Date(row.createTime).toLocaleString() : '-';
        }
      },
      {
        title: t('toolspec.last_modified'),
        key: 'lastModifiedMillis',
        width: 160,
        render(row) {
          return row.lastModifiedMillis ? new Date(row.lastModifiedMillis).toLocaleString() : '-';
        }
      },
      {
        title: t('toolspec.actions'),
        key: 'actions',
        width: 180,
        render(row) {
          return [
            h(
              'n-button',
              {
                size: 'small',
                type: 'info',
                style: { marginRight: '8px' },
                onClick: () => detailItem(row)
              },
              { default: () => t('common.detail') }
            ),
            h(
              'n-button',
              {
                size: 'small',
                type: 'primary',
                style: { marginRight: '8px' },
                onClick: () => updateItem(row),
                disabled: !webResources.canUpdateConfig
              },
              { default: () => t('common.edit') }
            ),
            h(
              'n-button',
              {
                size: 'small',
                type: 'error',
                onClick: () => removeItem(row),
                disabled: !webResources.canUpdateConfig
              },
              { default: () => t('common.delete') }
            )
          ];
        }
      }
    ]);

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
      toolSpecDetailRef,
      isMobile: computed(() => projectSettingStore.getIsMobile),
      rowKey,
      doQueryList,
      doHandlePageChange,
      showCreate,
      closeForm,
      submitForm,
      handleSubmitSuccess,
      handleFormCancel,
      handleUpdateParameters,
      handleUpdateFormat,
      handleResetForm,
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