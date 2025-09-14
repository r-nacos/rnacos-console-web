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
                  <n-button @click="download" type="info">{{
                    this.$t('toolspec.export_tools')
                  }}</n-button>
                  <n-button
                    v-if="webResources.canUpdateMcpToolSpec"
                    type="info"
                    @click="showCreate"
                    >{{ this.$t('common.add') }}</n-button
                  >
                  <n-dropdown
                    v-if="webResources.canUpdateMcpToolSpec"
                    :options="importOptions"
                    @select="handleImportSelect"
                  >
                    <n-button
                      type="info"
                      :render-icon="renderDropdownIcon"
                      icon-placement="right"
                      >{{ this.$t('common.import') }}</n-button
                    >
                  </n-dropdown>
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
        :submitName="t('common.confirm')"
        @close="closeForm"
        @submit="submitForm"
      >
        <McpToolSpecDetail
          ref="toolSpecDetailRef"
          :model="model"
          @submit-success="handleSubmitSuccess"
          @cancel="handleFormCancel"
          @close="closeForm"
          @update-function="handleUpdateFunction"
          @update-format="handleUpdateFormat"
          @reset-form="handleResetForm"
        />
      </SubContentFullPage>
    </Transition>

    <!-- 导入工具列表弹窗 -->
    <n-modal
      v-model:show="showImportModal"
      preset="dialog"
      :title="t('toolspec.import_tools')"
      :positive-text="t('common.confirm')"
      :negative-text="t('common.cancel')"
      :loading="importLoading"
      @positive-click="handleImportConfirm"
      @negative-click="handleImportCancel"
    >
      <n-form
        ref="importFormRef"
        :model="importForm"
        :rules="importFormRules"
        label-placement="top"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item :label="t('toolspec.group')" path="group">
          <n-input
            v-model:value="importForm.group"
            :placeholder="t('toolspec.input_group')"
            clearable
          />
        </n-form-item>
        <n-form-item :label="t('toolspec.tools_json_list')" path="toolsJson">
          <n-input
            v-model:value="importForm.toolsJson"
            type="textarea"
            :placeholder="t('toolspec.input_tools_json_placeholder')"
            :rows="10"
            clearable
          />
        </n-form-item>
      </n-form>
    </n-modal>

    <!-- 导入ZIP文件弹窗 -->
    <n-modal
      v-model:show="showImportZipModal"
      preset="dialog"
      :title="t('toolspec.import_zip')"
      :positive-text="t('common.confirm')"
      :negative-text="t('common.cancel')"
      :loading="importZipLoading"
      @positive-click="handleImportZipConfirm"
      @negative-click="handleImportZipCancel"
    >
      <n-form
        ref="importZipFormRef"
        :model="importZipForm"
        :rules="importZipFormRules"
        label-placement="top"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item path="zipFile">
          <n-upload
            action="/rnacos/api/console/v2/mcp/toolspec/import"
            :headers="uploadHeader"
            :show-file-list="true"
            :max="1"
            accept=".zip"
            @before-upload="doBeforeZipUpload"
            @finish="handleZipUploadFinish"
          >
            <n-button type="primary" dashed>{{
              t('toolspec.select_zip_file')
            }}</n-button>
          </n-upload>
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script>
import { ref, reactive, defineComponent, computed, h } from 'vue';
import { toolSpecApi } from '@/api/toolspec';
import { namespaceStore } from '@/data/namespace';
import { useWebResources } from '@/data/resources';
import { createColumns } from '@/components/mcptoolspec/McpToolSpecColumns';
import NamespacePopSelect from '@/components/namespace/NamespacePopSelect.vue';
import SubContentFullPage from '@/components/common/SubContentFullPage.vue';
import McpToolSpecDetail from './McpToolSpecDetail.vue';

//import { useI18n } from 'vue-i18n';
import { getMessage } from '@/i18n';
import { printApiError, handleApiResult } from '@/utils/request';
import { useProjectSettingStore } from '@/store/modules/projectSetting';
import { useDialog, NIcon } from 'naive-ui';
import template from 'template_js';
import { ChevronDown } from '@vicons/ionicons5';
import namespaceApi from '@/api/namespace';
import * as constant from '@/types/constant';
import qs from 'qs';
// import axios from 'axios';

export default defineComponent({
  components: {
    NamespacePopSelect,
    SubContentFullPage,
    McpToolSpecDetail
  },
  setup() {
    //const { t } = useI18n();
    const t = getMessage;
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

    // 导入相关状态
    const showImportModal = ref(false);
    const showImportZipModal = ref(false);
    const importLoading = ref(false);
    const importZipLoading = ref(false);
    const importFormRef = ref();
    const importZipFormRef = ref();
    const importForm = ref({
      group: '',
      toolsJson: ''
    });
    const uploadHeaderRef = ref({
      namespace: namespaceStore.current.value.namespaceId
    });

    const modelRef = ref({
      namespace: '',
      group: '',
      toolName: '',
      description: '',
      version: 0,
      function: '',
      functionFormat: 'yaml',
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

    // 导入选项配置
    const importOptions = [
      {
        label: t('toolspec.import_tools'),
        key: 'json'
      },
      {
        label: t('toolspec.import_zip'),
        key: 'zip'
      }
    ];

    // 导入表单验证规则
    const importFormRules = {
      group: [
        {
          required: true,
          message: t('validation.required', { field: t('toolspec.group') })
        }
      ],
      toolsJson: [
        {
          required: true,
          message: t('validation.required', {
            field: t('toolspec.tools_json_list')
          })
        },
        {
          validator: (rule, value) => {
            if (!value) return true;
            try {
              const tools = JSON.parse(value);
              if (!Array.isArray(tools)) {
                return new Error(t('toolspec.tools_json_must_be_array'));
              }
              // 验证每个工具的格式
              for (let i = 0; i < tools.length; i++) {
                const tool = tools[i];
                if (!tool.type || tool.type !== 'function') {
                  return new Error(
                    t('toolspec.tool_type_must_be_function', { index: i + 1 })
                  );
                }
                if (
                  !tool.function ||
                  !tool.function.name ||
                  !tool.function.description
                ) {
                  return new Error(
                    t('toolspec.tool_function_incomplete', { index: i + 1 })
                  );
                }
              }
              return true;
            } catch (error) {
              return new Error(t('toolspec.invalid_json_format'));
            }
          }
        }
      ]
    };

    const importZipFormRules = {};

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
            paginationReactive.pageCount = Math.max(
              1,
              Math.ceil(count / pageSize)
            );
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
                if (
                  firstNamespace &&
                  namespaceStore.current.value.namespaceId !==
                    firstNamespace.namespaceId
                ) {
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
            description: toolSpec.description || '',
            version: toolSpec.version,
            function: toolSpec.function
              ? JSON.stringify(toolSpec.function.inputSchema, null, 2)
              : '{}',
            functionFormat: 'json',
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
            description: toolSpec.description || '',
            version: toolSpec.version,
            function: toolSpec.function
              ? JSON.stringify(toolSpec.function.inputSchema, null, 2)
              : '{}',
            functionFormat: 'json',
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
        description: '',
        version: 0,
        function: '{}',
        functionFormat: 'yaml',
        mode: constant.FORM_MODE_CREATE
      };
      useFormRef.value = true;
    };

    // 显示导入弹窗
    const showImport = () => {
      importForm.value = {
        group: '',
        toolsJson: ''
      };
      showImportModal.value = true;
    };

    // 处理导入选项选择
    const handleImportSelect = (key) => {
      if (key === 'json') {
        showImport();
      } else if (key === 'zip') {
        showImportZip();
      }
    };

    // 显示ZIP导入弹窗
    const showImportZip = () => {
      showImportZipModal.value = true;
    };

    // 处理导入确认
    const handleImportConfirm = async () => {
      try {
        await importFormRef.value?.validate();
        importLoading.value = true;

        // 解析JSON
        const tools = JSON.parse(importForm.value.toolsJson);

        // 转换为IToolSpecParams格式
        const toolSpecParams = tools.map((tool) => {
          return {
            namespace: namespaceStore.current.value.namespaceId,
            group: importForm.value.group,
            toolName: tool.function.name,
            function: {
              name: tool.function.name, // 使用toolName的值设置name字段
              description: tool.function.description,
              inputSchema:
                tool.function.parameters || tool.function.inputSchema || {}
            }
          };
        });

        // 调用批量更新接口
        const success =
          await toolSpecApi.batchUpdateToolSpecWithErrorHandling(
            toolSpecParams
          );

        if (success) {
          window.$message.success(
            t('toolspec.import_success', { count: toolSpecParams.length })
          );
          showImportModal.value = false;
          doHandlePageChange(1); // 刷新列表
        }
      } catch (error) {
        console.error('导入失败:', error);
        if (error instanceof Error) {
          window.$message.error(error.message);
        } else {
          window.$message.error(t('toolspec.import_failed'));
        }
      } finally {
        importLoading.value = false;
      }
    };

    // 处理导入取消
    const handleImportCancel = () => {
      showImportModal.value = false;
    };

    // ZIP文件上传前处理
    const doBeforeZipUpload = () => {
      uploadHeaderRef.value = {
        namespace: namespaceStore.current.value.namespaceId
      };
    };

    // 处理ZIP导入取消
    const handleImportZipCancel = () => {
      showImportZipModal.value = false;
    };

    // 处理ZIP导入确认
    const handleImportZipConfirm = async () => {
      try {
        await importZipFormRef.value?.validate();
        importZipLoading.value = true;
        // 验证通过后，等待用户选择文件并上传
        // 实际的上传处理在 handleZipUploadFinish 中
        // 这里不自动关闭弹窗，让用户选择文件
      } catch (error) {
        console.error('ZIP导入表单验证失败:', error);
        if (error instanceof Error) {
          window.$message.error(error.message);
        }
        return false; // 阻止弹窗关闭
      } finally {
        importZipLoading.value = false;
      }
    };

    // 处理ZIP文件上传完成
    const handleZipUploadFinish = ({ event }) => {
      if (event.target.status === 200) {
        window.$message.success(t('toolspec.import_zip_success'));
        showImportZipModal.value = false;
        doHandlePageChange(1);
      } else {
        window.$message.error(t('toolspec.import_zip_failed'));
      }
    };

    // 下载 ToolSpec
    // 渲染下拉图标
    const renderDropdownIcon = () => {
      return h(NIcon, null, { default: () => h(ChevronDown) });
    };

    const download = () => {
      const params = {
        namespaceId: namespaceStore.current.value.namespaceId,
        groupFilter: paramRef.value.groupFilter,
        toolNameFilter: paramRef.value.toolNameFilter,
        pageNo: 1,
        pageSize: 20
      };
      var queryString = qs.stringify(params);
      var url = '/rnacos/api/console/v2/mcp/toolspec/download?' + queryString;
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.href = url;
      link.click();
      document.body.removeChild(link);
      return true;
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

    // Handle function update from detail component
    const handleUpdateFunction = (newFunction) => {
      modelRef.value.function = newFunction;
    };

    // Handle format update from detail component
    const handleUpdateFormat = (newFormat) => {
      modelRef.value.functionFormat = newFormat;
    };

    // Handle form reset from detail component
    const handleResetForm = () => {
      if (modelRef.value.mode === constant.FORM_MODE_CREATE) {
        modelRef.value.namespace = namespaceStore.current.value.namespaceId;
        modelRef.value.group = '';
        modelRef.value.toolName = '';
        modelRef.value.description = '';
        modelRef.value.function = '{}';
        modelRef.value.functionFormat = 'yaml';
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
    const columns = createColumns(
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
      toolSpecDetailRef,
      isMobile: computed(() => projectSettingStore.getIsMobile),
      rowKey,
      doQueryList,
      doHandlePageChange,
      showCreate,
      showImport,
      closeForm,
      submitForm,
      handleSubmitSuccess,
      handleFormCancel,
      handleUpdateFunction,
      handleUpdateFormat,
      handleResetForm,
      getDetailTitle,
      // 导入相关
      showImportModal,
      showImportZipModal,
      importLoading,
      importZipLoading,
      importFormRef,
      importZipFormRef,
      importForm,
      importFormRules,
      importZipFormRules,
      importOptions,
      handleImportConfirm,
      handleImportCancel,
      handleImportSelect,
      showImportZip,
      handleImportZipConfirm,
      handleImportZipCancel,
      doBeforeZipUpload,
      handleZipUploadFinish,
      uploadHeader: uploadHeaderRef,
      download,
      renderDropdownIcon
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
