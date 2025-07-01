<template>
  <div class="relative">
    <div
      class="flex flex-row items-center border-b border-gray-300 bg-white pr-3"
      :class="{ 'h-[40px]': !isMobile }"
    >
      <div class="flex-1 text-sm pl-4">
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
                  :label="this.$t('monitor.service_node')"
                  path="param.nodeId"
                >
                  <n-select
                    class="w-90"
                    v-model:value="param.nodeId"
                    :options="nodeList"
                    size="medium"
                    @update:value="queryList"
                    scrollable
                  >
                  </n-select>
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item
                  :label="this.$t('service.name')"
                  path="param.serviceParam"
                >
                  <n-input
                    v-model:value="param.serviceParam"
                    :placeholder="this.$t('service.inputName')"
                    clearable
                    @keydown.enter.prevent
                    @keyup.enter="queryList"
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item
                  :label="this.$t('service.groupName')"
                  path="param.groupParam"
                >
                  <n-input
                    v-model:value="param.groupParam"
                    :placeholder="this.$t('service.inputGroupName')"
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
  </div>
</template>

<script>
import { ref, reactive, defineComponent, computed } from 'vue';
import { namingApi } from '@/api/naming';
import { namespaceStore } from '@/data/namespace';
import { createColumns } from '@/components/naming/SuberscriberListColumns.jsx';
import NamespacePopSelect from '@/components/namespace/NamespacePopSelect.vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useProjectSettingStore } from '@/store/modules/projectSetting';
import { clusterApi } from '@/api/cluster.js';
import { handleApiResult, printApiError } from '@/utils/request.js';

export default defineComponent({
  components: {
    NamespacePopSelect
  },
  setup() {
    const { t } = useI18n();
    let route = useRoute();
    const projectSettingStore = useProjectSettingStore();
    const dataRef = ref([]);
    const loadingRef = ref(false);
    let query = route.query;
    const nodeList = ref([
      {
        label: t('monitor.DIRECT_NODE'),
        value: 0
      }
    ]);
    const paramRef = ref({
      serviceParam: query.serviceName,
      groupParam: query.groupName || '',
      namespaceId: query.namespaceId || '',
      nodeId: 0,
      pageNo: 1,
      pageSize: 20
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

    const initNodeData = () => {
      clusterApi
        .queryNodeList()
        .then((resp) => {
          if (resp.status == 200) {
            let data = resp.data.data;
            if (data.length > 0) {
              let list = [
                {
                  label: t('monitor.DIRECT_NODE'),
                  value: 0
                }
              ];
              for (let item of data) {
                list.push({
                  label: item.nodeId + '@' + item.addr,
                  value: item.nodeId
                });
              }
              nodeList.value = list;
            }
          } else {
            window.$message.error('request err,status code:' + resp.status);
          }
        })
        .catch((err) => {
          window.$message.error('request err,message' + err.message);
        });
    };

    const doQueryList = () => {
      return namingApi.queryServiceSubscriberPage({
        namespaceId: namespaceStore.current.value.namespaceId,
        serviceNameParam: paramRef.value.serviceParam,
        groupNameParam: paramRef.value.groupParam,
        nodeId: paramRef.value.nodeId,
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

    let columns = createColumns();
    return {
      columns,
      nodeList,
      initNodeData,
      data: dataRef,
      pagination: paginationReactive,
      loading: loadingRef,
      param: paramRef,
      isMobile: computed(() => projectSettingStore.getIsMobile),
      rowKey(rowData) {
        return (
          rowData.groupName +
          '@@' +
          rowData.serviceName +
          '@@' +
          rowData.ip +
          ':' +
          rowData.port
        );
      },
      doHandlePageChange
    };
  },

  computed: {},
  methods: {
    queryList() {
      this.doHandlePageChange(1);
    },

    handlePageChange(page) {
      this.doHandlePageChange(page);
    }
  },
  mounted() {
    this.queryList();
    this.initNodeData();
  }
});
</script>

<style scoped>
</style>
