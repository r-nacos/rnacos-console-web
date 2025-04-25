<template>
  <div class="relative">
    <div class="flex flex-row items-center border-b h-[40px] border-gray-300 bg-white pr-3">
      <div class="flex-1 text-sm leading-[30px] pl-4 truncate">
        <span>{{ this.$t('cluster.cluster_info') }}</span>
      </div>
    </div>
    <div class="m-2">
      <n-card :bordered="false">
        <n-data-table
          remote
          ref="table"
          :bordered="false"
          :columns="columns"
          :data="data"
          :loading="loading"
          :row-key="rowKey"
        />
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { clusterApi } from '@/api/cluster';
import { createColumns } from '@/components/cluster/ClusterInfoColumns';
import { handleApiResult, printApiError } from '@/utils/request';
import { getMessage as t } from '@/i18n';

const columns = createColumns();
const data = ref([]);
const loading = ref(true);

const doLoadData = () => {
  clusterApi
    .queryNodeList()
    .then(handleApiResult)
    .then((resultData) => {
      data.value = resultData || [];
      loading.value = false;
    })
    .catch((err) => {
      printApiError(err);
      loading.value = false;
    });
};

const rowKey = (rowData) => {
  return rowData.nodeId;
};

onMounted(() => {
  doLoadData();
});
</script>
