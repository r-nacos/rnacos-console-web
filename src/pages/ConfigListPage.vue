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
        :submitName="this.$t('config.confirm_change')"
        @close="closeDiffForm"
        @submit="submitData"
      >
        <DiffComponent :src="model.sourceContent" :dst="model.content" />
      </SubContentFullPage>
    </Transition>
  </div>
</template>

<script>
import { ref, reactive, defineComponent, computed } from 'vue';
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

export default defineComponent({
  components: {
    NamespacePopSelect,
    Close,
    SubContentFullPage,
    ConfigDetail,
    DiffComponent
  },
  setup() {
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
            printApiError(err);
            dataRef.value = [];
            loadingRef.value = false;
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
    return {
      columns,
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
      rowKey(rowData) {
        return rowData.group + '@@' + rowData.dataId;
      },
      doQueryList,
      doHandlePageChange,
      handlerUploadFinish({ event }) {
        if (event.target.status == 200) {
          window.$message.info('上传成功');
          doHandlePageChange(1);
        } else {
          window.$message.error('上传处理失败');
        }
      }
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
    namespaceStore.initLoad();
    const first = namespaceStore.optionList.value[0];
    if (first) {
      namespaceStore.current.value = {
        namespaceId: first.value,
        namespaceName: first.label
      };
    }
    this.queryList();
  }
});
</script>
