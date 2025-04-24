<template>
  <div class="relative">
    <n-card :bordered="false" :title="t('cluster.cluster_info')"></n-card>
    <div class="mt-4">
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
