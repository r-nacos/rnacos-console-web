<template>
  <div class="relative flex flex-col w-full h-ful">
    <div
      class="flex flex-row items-center border-b h-[40px] border-gray-300 bg-white pr-3"
    >
      <div class="flex-1 text-sm leading-[30px] pl-4 truncate">
        <span>{{ this.$t('config.config_history') }}</span>
      </div>
      <div class="flex-none">
        <n-button @click="routerBack">{{ this.$t('common.back') }}</n-button>
      </div>
    </div>

    <div class="m-2">
      <div class="flex flex-col relative bg-white rounded-lg p-4">
        <div class="flex items-baseline justify-between mb-4">
          <n-form label-placement="left" label-width="auto" class="flex-1">
            <div class="flex gap-2 flex-wrap">
              <n-form-item
                :label="this.$t('config.dataId')"
                path="param.dataId"
                class="flex-1 min-w-[200px]"
              >
                <n-input
                  :disabled="true"
                  v-model:value="param.dataId"
                  placeholder=""
                />
              </n-form-item>
              <n-form-item
                :label="this.$t('config.config_group')"
                path="param.group"
                class="flex-1 min-w-[200px]"
              >
                <n-input
                  :disabled="true"
                  v-model:value="param.group"
                  placeholder=""
                />
              </n-form-item>
            </div>
          </n-form>
          <div class="flex items-center ml-2.5">
            <n-button tertiary @click="queryList">{{
              this.$t('common.refresh')
            }}</n-button>
          </div>
        </div>
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
    <n-drawer
      :block-scroll="false"
      :trap-focus="false"
      v-model:show="useForm"
      :width="isMobile ? '100%' : 600"
      placement="right"
      :show-mask="true"
      :mask-closable="true"
      :close-on-esc="true"
      resizable
    >
      <n-drawer-content :title="getDetailTitle" closable>
        <ConfigDetail :model="model" :fromHistory="true" />
        <template #footer>
          <n-space align="baseline">
            <n-button text @click="closeForm">{{
              this.$t('common.return')
            }}</n-button>
            <n-button
              v-if="webResources.canUpdateConfig"
              type="primary"
              @click="submitForm"
              >{{ getSubmitName }}</n-button
            >
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
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
        @submit="submitDiffForm"
      >
        <DiffComponent :src="model.sourceContent" :dst="model.content" />
      </SubContentFullPage>
    </Transition>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { configApi } from '@/api/config';
import { useWebResources } from '@/data/resources';
import { createHistoryColumns } from '@/components/config/ConfigColumns';
import SubContentFullPage from '@/components/common/SubContentFullPage.vue';
import DiffComponent from '@/components/config/DiffComponent.vue';
import ConfigDetail from './ConfigDetail.vue';
import * as constant from '@/types/constant';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  printApiError,
  handleApiResult,
  printApiSuccess
} from '@/utils/request';
import { useProjectSettingStore } from '@/store/modules/projectSetting';
export default defineComponent({
  components: {
    SubContentFullPage,
    ConfigDetail,
    DiffComponent
  },
  setup() {
    const { t } = useI18n();
    let route = useRoute();
    let webResources = useWebResources();
    const projectSettingStore = useProjectSettingStore();
    let query = route.query;
    let param = {
      group: query.group || '',
      dataId: query.dataId || '',
      tenant: query.tenant || ''
    };
    const dataRef = ref([]);
    const loadingRef = ref(false);
    const paramRef = ref(param);
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
    const useFormRef = ref(false);
    const useDiffFormRef = ref(false);

    const modelRef = ref({
      dataId: param.dataId,
      group: param.group,
      md5: '',
      desc: '',
      sourceContent: '',
      content: '',
      mode: constant.FORM_MODE_DETAIL
    });
    const updateParam = (param) => {
      paramRef.value = param;
    };
    const doQueryList = () => {
      return configApi.queryConfigHistoryPage({
        tenant: paramRef.value.tenant,
        dataId: paramRef.value.dataId,
        group: paramRef.value.group,
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
            if (currentPage === 1 && page.list.length > 0) {
              modelRef.value.sourceContent = page.list[0].content;
            }
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

    const showDetail = (row) => {
      useFormRef.value = true;
      modelRef.value.content = row.content;
      /*
      modelRef.value={
        dataId: param.dataId,
        group: param.group,
        md5: "",
        showMd5:false,
        content: row.content,
        mode: constant.FORM_MODE_DETAIL,
      };
      */
    };
    const doRollback = (content) => {
      let config = {
        dataId: param.dataId,
        group: param.group,
        tenant: param.tenant,
        content: content
      };
      configApi
        .setConfigV2(config)
        .then(handleApiResult)
        .then(printApiSuccess)
        .then(() => {
          useFormRef.value = false;
          useDiffFormRef.value = false;
          doHandlePageChange(1);
        })
        .catch(printApiError);
    };
    const rollback = (row) => {
      modelRef.value.content = row.content;
      useDiffFormRef.value = true;
      //doRollback(row.content)
    };
    let columns = createHistoryColumns(showDetail, rollback, webResources);

    return {
      columns,
      webResources,
      data: dataRef,
      pagination: paginationReactive,
      loading: loadingRef,
      param: paramRef,
      useForm: useFormRef,
      useDiffForm: useDiffFormRef,
      model: modelRef,
      updateParam,
      rowKey(rowData) {
        return rowData.id;
      },
      doHandlePageChange,
      doRollback,
      isMobile: computed(() => projectSettingStore.getIsMobile)
    };
  },
  computed: {
    getDetailTitle() {
      return this.$t('config.history_record_content');
    },
    getSubmitName() {
      return this.$t('config.recover_history');
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.queryList();
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
    submitForm() {
      this.useForm = false;
      this.useDiffForm = true;
    },
    closeDiffForm() {
      this.useDiffForm = false;
    },
    submitDiffForm() {
      this.doRollback(this.model.content);
    },
    routerBack() {
      this.$router.go(-1);
    }
  }
});
</script>
