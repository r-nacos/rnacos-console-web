<template>
  <div class="wrap">
    <div class="header">
      <div class="title">
        <span>{{ this.$t('config.config_history') }}</span>
      </div>
      <div class="header-button">
        <span
          ><n-button @click="routerBack">{{
            this.$t('common.back')
          }}</n-button></span
        >
      </div>
      <div class="namespace"></div>
    </div>
    <div class="content-wrap">
      <div class="form-container">
        <div class="query-params">
          <n-form label-placement="left" label-width="auto">
            <div class="paramWrap">
              <n-form-item
                :label="this.$t('config.dataId')"
                path="param.dataId"
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
              >
                <n-input
                  :disabled="true"
                  v-model:value="param.group"
                  placeholder=""
                />
              </n-form-item>
            </div>
          </n-form>
          <div class="queryButton">
            <span class="query-button-item">
              <n-button tertiary @click="queryList">{{
                this.$t('common.refresh')
              }}</n-button>
            </span>
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
      to="#main_content"
      :block-scroll="false"
      :trap-focus="false"
      v-model:show="useForm"
      default-width="600"
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
    <Transition name="slide-fade">
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
import { defineComponent } from 'vue';
import { configApi } from '@/api/config';
import { useWebResources } from '@/data/resources';
import { createHistoryColumns } from '@/components/config/ConfigColumns';
import SubContentFullPage from '@/components/common/SubContentFullPage';
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
      showMd5: false,
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
      doRollback
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

<style scoped>
.wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #efefef;
}

.content-wrap {
  padding: 10px 10px 10px 10px;
  background: #efefef;
}

.form-container {
  display: flex;
  flex-direction: column;
  position: relative;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px 8px;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  border-bottom: #ccc 1px solid;
  background: #fff;
  padding-right: 3px;
}

.title {
  flex: 1 1 auto;
  font: 14/1.25;
  line-height: 40px;
  padding-left: 15px;
}

.header-button {
  flex: 0 0 auto;
}

.namespace {
  flex: 0 0 auto;
}

.query-params {
  flex: 0 0 auto;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-direction: row;
}

.paramWrap {
  display: flex;
  gap: 8px;
  flex-direction: row;
  flex-wrap: wrap;
}

.queryButton {
  display: flex;
  align-items: center;
}

.query-button-item {
  margin-left: 10px;
}
</style>
