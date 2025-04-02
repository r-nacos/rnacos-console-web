<template>
  <div class="relative w-full h-full bg-gray-100">
    <div class="flex flex-row items-center h-10 border-b border-gray-300 bg-white pr-3">
      <div class="flex-1 text-sm leading-[30px] pl-4">
        <span>{{ this.$t('menu.subscriber_list') }}</span>
      </div>
      <div class="flex-none">
        <NamespacePopSelect @change="queryList" />
      </div>
    </div>
    <div class="p-2.5 bg-gray-100">
      <div class="flex flex-col relative bg-white rounded-lg p-4">
        <div class="flex flex-row items-baseline justify-between">
          <n-form label-placement="left" label-width="auto">
            <div class="flex flex-row gap-2 flex-wrap">
              <n-form-item :label="this.$t('service.name')" path="param.serviceParam">
                <n-input
                  v-model:value="param.serviceParam"
                  :placeholder="this.$t('service.inputName')"
                  clearable
                  @keydown.enter.prevent
                  @keyup.enter="queryList"
                />
              </n-form-item>
              <n-form-item :label="this.$t('service.groupName')" path="param.groupParam">
                <n-input
                  v-model:value="param.groupParam"
                  :placeholder="this.$t('service.inputGroupName')"
                  clearable
                  @keydown.enter.prevent
                  @keyup.enter="queryList"
                />
              </n-form-item>
            </div>
          </n-form>
          <div class="flex items-center">
            <span class="ml-2.5">
              <n-button tertiary @click="queryList">{{ this.$t('common.query') }}</n-button>
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
  </div>
</template>

<script>
import { ref, reactive, defineComponent } from 'vue';
import { namingApi } from '@/api/naming';
import { namespaceStore } from '@/data/namespace';
import { createColumns } from '@/components/naming/SuberscriberListColumns.jsx';
import NamespacePopSelect from '@/components/namespace/NamespacePopSelect.vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: {
    NamespacePopSelect
  },
  setup() {
    const { t } = useI18n();
    let route = useRoute();
    const dataRef = ref([]);
    const loadingRef = ref(false);
    let query = route.query;
    const paramRef = ref({
      serviceParam: query.serviceName,
      groupParam: query.groupName || '',
      namespaceId: query.namespaceId || '',
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

    const doQueryList = () => {
      return namingApi.querySubscriberPage({
        namespaceId: namespaceStore.current.value.namespaceId,
        accessToken: null,
        serviceName: paramRef.value.serviceParam,
        groupName: paramRef.value.groupParam,
        pageNo: paginationReactive.page,
        pageSize: paginationReactive.pageSize
      });
    };

    const doHandlePageChange = (currentPage) => {
      paginationReactive.page = currentPage;
      if (!loadingRef.value) {
        loadingRef.value = true;
        doQueryList()
          .then((res) => {
            loadingRef.value = false;
            if (res.status == 200) {
              let count = res.data.count;
              let pageSize = paginationReactive.pageSize;
              console.info(res);
              dataRef.value = res.data.subscribers;
              paginationReactive.itemCount = count;
              paginationReactive.pageCount = Math.round(
                (count + pageSize - 1) / pageSize
              );
            } else {
              window.$message.error('request err,status code:' + res.status);
              dataRef.value = [];
            }
          })
          .catch((err) => {
            window.$message.error('request err,message' + err.message);
            dataRef.value = [];
            loadingRef.value = false;
          });
      }
    };

    let columns = createColumns();
    return {
      columns,
      data: dataRef,
      pagination: paginationReactive,
      loading: loadingRef,
      param: paramRef,
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
  }
});
</script>

<style scoped>
/* 移除所有 scoped 样式，因为已经转换为 Tailwind 类名 */
</style>
