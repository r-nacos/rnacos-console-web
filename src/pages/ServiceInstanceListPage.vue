<template>
  <div class="relative">
    <div class="flex flex-row items-center border-b h-[40px] border-gray-300 bg-white pr-3">
      <div class="flex-1 text-sm leading-[30px] pl-4 truncate">
        <span>{{ this.$t('config.config_history') }}</span>
      </div>
      <div class="flex-none">
        <n-button @click="routerBack">{{ this.$t('common.back') }}</n-button>
      </div>
    </div>
    
    <div class="m-2">
      <div class="flex flex-col relative bg-white rounded-lg p-4">
        <div class="flex flex-row items-baseline justify-between">
          <n-form label-placement="left" label-width="auto">
            <div class="flex flex-row gap-2 flex-wrap">
              <n-form-item
                :label="this.$t('service.name')"
                path="param.serviceParam"
              >
                <n-input :disabled="true" v-model:value="param.serviceName" />
              </n-form-item>
              <n-form-item
                :label="this.$t('service.groupName')"
                path="param.groupParam"
              >
                <n-input :disabled="true" v-model:value="param.groupName" />
              </n-form-item>
            </div>
          </n-form>
          <div class="flex items-center">
            <span class="ml-2.5">
              <n-button tertiary @click="reloadData">{{
                this.$t('common.refresh')
              }}</n-button>
            </span>
          </div>
        </div>
        <n-data-table
          remote
          ref="table"
          :scroll-x="1000"
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
      default-width="600"
      resizable
    >
      <n-drawer-content :title="getDetailTitle" closable>
        <ServiceInstanceDetail :model="model" />
        <template #footer>
          <n-space align="baseline">
            <n-button text @click="closeForm">{{
              this.$t('common.return')
            }}</n-button>
            <n-button type="primary" @click="submitForm">{{
              this.$t('common.confirm')
            }}</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { namingApi } from '@/api/naming';
import { useI18n } from 'vue-i18n';
//import { namespaceStore } from "@/data/namespace";
import { useWebResources } from '@/data/resources';
import { createColumns } from '@/components/naming/InstanceListColumns';
import ServiceInstanceDetail from './ServiceInstanceDetail.vue';
import * as constant from '@/types/constant';
import { useRoute } from 'vue-router';
import {
  handleApiResult,
  printApiError,
  printApiSuccess
} from '@/utils/request';

export default defineComponent({
  components: {
    ServiceInstanceDetail
  },
  setup() {
    let { t } = useI18n();
    let route = useRoute();
    let webResources = useWebResources();
    let query = route.query;
    let param = {
      serviceName: query.serviceName,
      groupName: query.groupName || '',
      namespaceId: query.namespaceId || ''
    };
    const dataRef = ref([]);
    const sourceDataRef = ref([]);
    const loadedRef = ref(false);
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

    const modelRef = ref({
      ip: '',
      port: 0,
      enabled: true,
      weight: 1,
      metadata: '{}',
      mode: constant.FORM_MODE_DETAIL
    });
    const updateParam = (param) => {
      paramRef.value = param;
    };
    const showUpdate = (row) => {
      modelRef.value = {
        ip: row.ip,
        port: row.port,
        enabled: row.enabled,
        weight: row.weight || 1,
        metadata: JSON.stringify(row.metadata || {}),
        mode: constant.FORM_MODE_UPDATE
      };
      useFormRef.value = true;
    };
    const setRowEnabled = (row, enabled) => {
      let instance = {
        namespaceId: param.namespaceId,
        groupName: param.groupName,
        serviceName: param.serviceName,

        ip: row.ip,
        port: row.port,
        //weight: row.weight,
        enabled: enabled
        //metadata: row.metadata,
      };
      namingApi
        .updateInstance(instance)
        .then(handleApiResult)
        .then(() => {
          if (enabled) {
            window.$message.info(
              t('instance.onlineText') + t('common.join') + t('common.success')
            );
          } else {
            window.$message.info(
              t('instance.offlineText') + t('common.join') + t('common.success')
            );
          }
          row.enabled = enabled;
          setCurrentPageData(paginationReactive.page || 1);
        })
        .catch(printApiError);
    };
    const onLine = (row) => {
      setRowEnabled(row, true);
    };
    const offLine = (row) => {
      setRowEnabled(row, false);
    };

    const doQueryList = () => {
      return namingApi.queryServiceInstances({
        serviceName: paramRef.value.serviceName,
        groupName: paramRef.value.groupName,
        namespaceId: paramRef.value.namespaceId
      });
    };

    const setCurrentPageData = (currentPage) => {
      let pageSize = paginationReactive.pageSize;
      let offset = (currentPage - 1) * pageSize;
      let endIndex = Math.min(offset + pageSize, sourceDataRef.value.length);
      let data = [];
      for (var i = offset; i < endIndex; i++) {
        data.push(sourceDataRef.value[i]);
      }
      dataRef.value = data;
    };

    const reloadData = () => {
      loadedRef.value = false;
      doHandlePageChange(paginationReactive.page || 1);
    };
    const doHandlePageChange = (currentPage) => {
      paginationReactive.page = currentPage;
      if (loadedRef.value) {
        setCurrentPageData(currentPage);
        return;
      }
      if (!loadingRef.value) {
        loadingRef.value = true;
        doQueryList()
          .then(handleApiResult)
          .then((page) => {
            loadingRef.value = false;
            let count = page.totalCount;
            let pageSize = paginationReactive.pageSize;
            paginationReactive.itemCount = count;
            paginationReactive.pageCount = Math.round(
              (count + pageSize - 1) / pageSize
            );
            loadedRef.value = true;
            sourceDataRef.value = page.list || [];
            setCurrentPageData(currentPage);
          })
          .catch((err) => {
            printApiError(err);
            dataRef.value = [];
            loadingRef.value = false;
          });
      }
    };

    let columns = createColumns(showUpdate, onLine, offLine, webResources);
    return {
      columns,
      webResources,
      data: dataRef,
      sourceData: sourceDataRef,
      pagination: paginationReactive,
      loading: loadingRef,
      loaded: loadedRef,
      param: paramRef,
      useForm: useFormRef,
      model: modelRef,
      updateParam,
      rowKey(rowData) {
        return rowData.ip + '_' + rowData.port;
      },
      doHandlePageChange,
      reloadData
    };
  },
  computed: {
    getDetailTitle() {
      return this.$t('instance.editTitle');
    }
  },
  data() {
    return {};
  },
  mounted() {
    /*
    let query = this.$route.query;
    let param = {
      serviceName: query.serviceName,
      groupName: query.groupName || "",
      namespaceId: query.namespaceId || "",
    };
    this.updateParam(param);
    */
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
      if (this.model.mode === constant.FORM_MODE_DETAIL) {
        this.useForm = false;
        return;
      }
      let instance = {
        namespaceId: this.param.namespaceId,
        groupName: this.param.groupName,
        serviceName: this.param.serviceName,

        ip: this.model.ip,
        port: this.model.port,
        weight: parseFloat(this.model.weight) || 1,
        enabled: this.model.enabled,
        metadata: this.model.metadata
      };
      if (this.model.mode === constant.FORM_MODE_UPDATE) {
        namingApi
          .updateInstance(instance)
          .then(handleApiResult)
          .then(printApiSuccess)
          .then(() => {
            this.useForm = false;
            this.reloadData();
          })
          .catch(printApiError);
      } else {
        this.useForm = false;
      }
    },
    routerBack() {
      this.$router.go(-1);
    }
  }
});
</script>
