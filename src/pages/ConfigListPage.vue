<template>
  <div class="relative flex flex-col w-full h-ful">
    <div
      class="flex flex-row items-center h-10 border-b border-gray-300 bg-white pr-3"
    >
      <div class="flex-1 text-sm leading-[30px] pl-4">
        <span>{{ this.$t('config.config_list') }}</span>
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
                  :label="this.$t('config.config_id')"
                  path="param.dataParam"
                >
                  <n-input
                    v-model:value="param.dataParam"
                    :placeholder="this.$t('config.input_dataId')"
                    clearable
                    @keydown.enter.prevent
                    @keyup.enter="queryList"
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item
                  :label="this.$t('config.config_group')"
                  path="param.groupParam"
                >
                  <n-input
                    v-model:value="param.groupParam"
                    :placeholder="this.$t('config.input_config_group')"
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

                  <n-button @click="download" type="info">{{
                    this.$t('config.export_config')
                  }}</n-button>

                  <n-upload
                    v-if="webResources.canUpdateConfig"
                    action="/rnacos/api/console/config/import"
                    :headers="uploadHeader"
                    :show-file-list="false"
                    @before-upload="doBeforeUpload"
                    @finish="handlerUploadFinish"
                  >
                    <n-button type="info">{{
                      this.$t('config.import_config')
                    }}</n-button>
                  </n-upload>
                </n-space>
              </n-gi>
            </n-grid>
          </n-form>
        </n-card>
        <div class="flex justify-between items-center mb-2 px-4">
          <div class="flex items-center gap-2">
            <n-button type="info" size="tiny" @click="toggleBatchMode">
              {{ isBatchModeRef ? t('common.exit') : t('common.batch') }}
            </n-button>
            <n-button
              v-if="isBatchModeRef"
              tertiary
              size="tiny"
              :disabled="checkedRowKeysRef.length === 0"
              @click="checkedRowKeysRef = []"
            >
              {{ t('common.cancel') }}
            </n-button>
            <n-button
              v-if="isBatchModeRef"
              type="info"
              size="tiny"
              :disabled="checkedRowKeysRef.length === 0"
              @click="batchDownload"
            >
              {{ t('config.export_config') }}
            </n-button>
            <n-button
              v-if="isBatchModeRef"
              type="error"
              size="tiny"
              :disabled="checkedRowKeysRef.length === 0"
              @click="batchRemove"
            >
              {{ t('common.delete') }}
            </n-button>
          </div>
          <div v-if="isBatchModeRef">
            {{ selectedText }}
          </div>
        </div>
        <n-data-table
          remote
          ref="table"
          :scroll-x="600"
          :bordered="false"
          :columns="computedColumns"
          :data="data"
          :loading="loading"
          :pagination="pagination"
          :row-key="rowKey"
          v-model:checked-row-keys="checkedRowKeysRef"
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
            : t('config.confirm_change')
        "
        @close="closeForm"
        @submit="submitForm"
      >
        <ConfigDetail
          ref="configDetailRef"
          :model="model"
          :fromHistory="false"
        />
      </SubContentFullPage>
    </Transition>
    <Transition
      class="transition-all duration-300 ease-in-out"
      enter-from-class="translate-x-5 opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-5 opacity-0"
    >
      <SubContentFullPage
        v-if="useDiffForm"
        :title="this.$t('config.diff_content')"
        :submitName="this.$t('common.confirm')"
        @close="closeDiffForm"
        @submit="submitData"
      >
        <DiffComponent :src="model.sourceContent" :dst="model.content" />
      </SubContentFullPage>
    </Transition>
  </div>
</template>

<script>
import { ref, reactive, defineComponent, computed, watch } from 'vue';
import { configApi } from '@/api/config';
import { namespaceStore } from '@/data/namespace';
import { useWebResources } from '@/data/resources';
import { createColumns } from '@/components/config/ConfigColumns';
import NamespacePopSelect from '@/components/namespace/NamespacePopSelect.vue';
import SubContentFullPage from '@/components/common/SubContentFullPage.vue';
import DiffComponent from '@/components/config/DiffComponent.vue';
import ConfigDetail from './ConfigDetail.vue';
import { useRouter } from 'vue-router';
import { Close } from '@vicons/ionicons5';
import * as constant from '@/types/constant';
import qs from 'qs';
import { useI18n } from 'vue-i18n';
import {
  printApiError,
  handleApiResult,
  printApiSuccess
} from '@/utils/request';
import { useProjectSettingStore } from '@/store/modules/projectSetting';
import { useDialog } from 'naive-ui';
import template from 'template_js';
import axios from 'axios';
import namespaceApi from '@/api/namespace';

export default defineComponent({
  components: {
    NamespacePopSelect,
    Close,
    SubContentFullPage,
    ConfigDetail,
    DiffComponent
  },
  setup() {
    const checkedRowKeysRef = ref([]);
    const isBatchModeRef = ref(false);
    function toggleBatchMode() {
      isBatchModeRef.value = !isBatchModeRef.value;
      if (!isBatchModeRef.value) {
        checkedRowKeysRef.value = [];
      }
    }
    const rowKey = (rowData) => rowData.group + '@@' + rowData.dataId;

    const toggleSelectAll = (checked) => {
      if (checked) {
        checkedRowKeysRef.value = dataRef.value.map(rowKey);
      } else {
        checkedRowKeysRef.value = [];
      }
    };

    const dialog = useDialog();
    const batchRemove = () => {
      if (checkedRowKeysRef.value.length === 0) return;
      dialog.warning({
        title: t('config.batch_delete'),
        content: template(t('config.confirm_batch_delete_config_action'), {
          count: checkedRowKeysRef.value.length
        }),
        positiveButtonProps: {
          type: 'primary'
        },
        positiveText: t('common.confirm'),
        negativeText: t('common.cancel'),
        onPositiveClick: async () => {
          try {
            for (const key of checkedRowKeysRef.value) {
              const [group, dataId] = key.split('@@');
              await configApi
                .removeConfigV2({
                  tenant: namespaceStore.current.value.namespaceId,
                  group,
                  dataId
                })
                .then(handleApiResult);
            }

            window.$message.success(
              template(t('config.batch_delete_success'), {
                count: checkedRowKeysRef.value.length
              })
            );

            checkedRowKeysRef.value = [];
            doHandlePageChange(1);
          } catch (error) {
            printApiError(error);
          }
        }
      });
    };

    const { t } = useI18n();
    const projectSettingStore = useProjectSettingStore();
    let router = useRouter();
    let webResources = useWebResources();
    const dataRef = ref([]);
    const useFormRef = ref(false);
    const useDiffFormRef = ref(false);
    const loadingRef = ref(false);
    const paramRef = ref({
      dataParam: '',
      groupParam: '',
      tenant: '',
      pageNo: 1,
      pageSize: 20
    });
    const uploadHeaderRef = ref({
      tenant: namespaceStore.current.value.namespaceId
    });
    const modelRef = ref({
      dataId: '',
      group: '',
      md5: '',
      desc: '',
      sourceContent: '',
      content: '',
      configType: 'text',
      mode: ''
    });
    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      itemCount: 0,
      showSizePicker: true,
      pageSizes: [10, 20, 50, 100],
      onUpdatePageSize: (pageSize) => {
        paginationReactive.pageSize = pageSize;
        paginationReactive.page = 1;
        doHandlePageChange(1);
      },
      prefix({ itemCount }) {
        return t('common.total') + `: ${itemCount}`;
      }
    });
    const doBeforeUpload = () => {
      uploadHeaderRef.value = {
        tenant: namespaceStore.current.value.namespaceId
      };
    };
    const doQueryList = () => {
      return configApi.queryConfigPage({
        tenant: namespaceStore.current.value.namespaceId,
        dataParam: paramRef.value.dataParam,
        groupParam: paramRef.value.groupParam,
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
            //console.log('page response:', page);
            loadingRef.value = false;
            let count = page.totalCount;
            let pageSize = paginationReactive.pageSize;
            dataRef.value = page.list;
            paginationReactive.itemCount = count;
            paginationReactive.pageCount = Math.round(
              (count + pageSize - 1) / pageSize
            );
          })
          .catch((err) => {
            loadingRef.value = false;

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
              .catch((err) => {
                printApiError(err);
              });
          });
      }
    };
    const doShowConfigDetail = (row, mode) => {
      let config = {
        tenant: row.tenant,
        group: row.group,
        dataId: row.dataId
      };
      configApi
        .getConfigV2(config)
        .then(handleApiResult)
        .then((data) => {
          if (mode == constant.FORM_MODE_CREATE) {
            config.dataId = null;
          }
          modelRef.value = {
            mode: mode,
            content: data.value,
            sourceContent: data.value,
            md5: data.md5 || '',
            desc: data.desc,
            configType: data.configType || 'text',
            ...config
          };
          useFormRef.value = true;
        })
        .catch(printApiError);
    };
    const updateItem = (row) => {
      doShowConfigDetail(row, constant.FORM_MODE_UPDATE);
    };
    const cloneItem = (row) => {
      doShowConfigDetail(row, constant.FORM_MODE_CREATE);
    };
    const detailItem = (row) => {
      doShowConfigDetail(row, constant.FORM_MODE_DETAIL);
    };
    const removeItem = (row) => {
      let config = {
        tenant: row.tenant,
        group: row.group,
        dataId: row.dataId
      };
      configApi
        .removeConfigV2(config)
        .then(handleApiResult)
        .then(printApiSuccess)
        .then(() => {
          doHandlePageChange(1);
        })
        .catch(printApiError);
    };
    const showHistory = (row) => {
      router.push({
        path: '/manage/config/history',
        query: {
          tenant: row.tenant,
          group: row.group,
          dataId: row.dataId
        }
      });
    };
    const showCreate = () => {
      modelRef.value = {
        dataId: '',
        group: 'DEFAULT_GROUP',
        md5: '',
        desc: '',
        content: '',
        configType: 'text',
        sourceContent: '',
        mode: constant.FORM_MODE_CREATE
      };
      useFormRef.value = true;
    };
    let columns = createColumns(
      detailItem,
      showHistory,
      updateItem,
      cloneItem,
      removeItem,
      webResources
    );

    const computedColumns = computed(() => {
      if (isBatchModeRef.value) {
        return [{ type: 'selection', width: 48 }, ...columns];
      }
      return columns;
    });

    const selectedText = computed(() =>
      template(t('config.selected_items'), {
        count: checkedRowKeysRef.value.length
      })
    );

    async function batchDownload() {
      const body = checkedRowKeysRef.value.map((key) => {
        const [group, dataId] = key.split('@@');
        return {
          tenant: namespaceStore.current.value.namespaceId,
          group,
          dataId
        };
      });

      const response = await axios.post(
        '/rnacos/api/console/config/download',
        body,
        {
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `rnacos_config_export_${Date.now()}.zip`;
      link.click();

      window.URL.revokeObjectURL(url);
      checkedRowKeysRef.value = [];
    }
    watch(
      () => namespaceStore.current.value.namespaceId,
      () => {
        checkedRowKeysRef.value = [];
      }
    );
    return {
      computedColumns,
      webResources,
      data: dataRef,
      useForm: useFormRef,
      useDiffForm: useDiffFormRef,
      pagination: paginationReactive,
      loading: loadingRef,
      model: modelRef,
      uploadHeader: uploadHeaderRef,
      doBeforeUpload,
      showCreate,
      param: paramRef,
      namespaceId: '',
      constant,
      t,
      isMobile: computed(() => projectSettingStore.getIsMobile),
      rowKey,
      doQueryList,
      doHandlePageChange,
      handlerUploadFinish({ event }) {
        if (event.target.status == 200) {
          window.$message.info('上传成功');
          doHandlePageChange(1);
        } else {
          window.$message.error('上传处理失败');
        }
      },
      checkedRowKeysRef,
      toggleSelectAll,
      batchRemove,
      toggleBatchMode,
      isBatchModeRef,
      selectedText,
      batchDownload
    };
  },
  computed: {
    getTenant() {
      return namespaceStore.current.value.namespaceId;
    },
    getDetailTitle() {
      if (this.model.mode === constant.FORM_MODE_UPDATE) {
        return '编辑配置';
      } else if (this.model.mode === constant.FORM_MODE_CREATE) {
        return '新增配置';
      }
      return '编辑详情';
    }
  },
  methods: {
    handlePageChange(page) {
      this.doHandlePageChange(page);
    },
    queryList() {
      this.doHandlePageChange(1);
    },
    closeForm() {
      this.useForm = false;
    },
    closeDiffForm() {
      this.useDiffForm = false;
    },
    submitData() {
      let config = {
        dataId: this.model.dataId,
        group: this.model.group,
        tenant: this.getTenant,
        content: this.model.content,
        configType: this.model.configType,
        desc: this.model.desc
      };
      configApi
        .setConfigV2(config)
        .then(handleApiResult)
        .then(printApiSuccess)
        .then(() => {
          this.useForm = false;
          this.useDiffForm = false;
          this.queryList();
        })
        .catch(printApiError);
    },
    submitForm() {
      if (this.model.mode === constant.FORM_MODE_DETAIL) {
        this.useForm = false;
        return;
      }
      this.$refs.configDetailRef.submitValidate(() => {
        if (this.model.mode === constant.FORM_MODE_CREATE) {
          this.useForm = false;
          this.submitData();
        } else {
          this.useDiffForm = true;
        }
      });
    },
    download() {
      this.param.tenant = namespaceStore.current.value.namespaceId;
      var params = qs.stringify(this.param);
      var url = '/rnacos/api/console/config/download?' + params;
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.href = url;
      link.click();
      document.body.removeChild(link);
      return true;
    }
  },
  created() {
    this.queryList();
  }
});
</script>
