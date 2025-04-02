<template>
  <div class="relative w-full h-full bg-gray-100">
    <div class="flex flex-row items-center h-10 border-b border-gray-300 bg-white pr-3">
      <div class="flex-1 text-sm leading-[30px] pl-4">
        <span>{{ t('cluster.cluster_info') }}</span>
      </div>
    </div>
    <div class="p-2.5 bg-gray-100">
      <div class="flex flex-col relative bg-white rounded-lg">
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
    .catch(err => {
      printApiError(err);
      loading.value = false;
    });
}

const rowKey = (rowData) => {
  return rowData.nodeId;
};

onMounted(() => {
  doLoadData();
});
</script>
