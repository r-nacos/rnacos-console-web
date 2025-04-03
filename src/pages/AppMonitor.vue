<template>
  <div class="relative w-full h-full bg-gray-100">
    <div
      class="flex flex-row items-center h-10 border-b border-gray-300 bg-white"
    >
      <div class="flex-1 text-sm leading-[30px] pl-4">
        <span>{{ t('monitor.system_monitor') }}</span>
      </div>
    </div>
    <div class="p-4 bg-gray-100">
      <div class="flex flex-col relative bg-white rounded-lg">
        <n-card :bordered="false">
          <n-form label-placement="left">
            <n-grid
              cols="1 s:1 m:2 l:3 xl:3 2xl:4"
              responsive="screen"
              :x-gap="12"
              :y-gap="8"
            >
              <n-gi>
                <n-form-item
                  :label="t('monitor.service_node')"
                  path="param.nodeId"
                >
                  <n-select
                    class="w-full"
                    v-model:value="param.nodeId"
                    :options="nodeList"
                    size="medium"
                    @update:value="viewGroupUpdate"
                    scrollable
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item :label="t('monitor.interval_type')">
                  <n-select
                    class="w-full"
                    v-model:value="param.timelineGroupName"
                    :options="viewGroup"
                    size="medium"
                    @update:value="viewGroupUpdate"
                    scrollable
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item :label="t('monitor.auto_refresh')">
                  <n-switch
                    size="small"
                    v-model:value="autoLoad.enable"
                    @update:value="updateAutoLoad"
                  />
                </n-form-item>
              </n-gi>
              <n-gi suffix>
                <n-space justify="end" class="ml-2">
                  <n-button tertiary @click="queryList">{{
                    t('common.refresh')
                  }}</n-button>
                </n-space>
              </n-gi>
            </n-grid>
          </n-form>
        </n-card>
        <div class="flex flex-col gap-4 overflow-x-auto">
          <template v-for="(charList, index) in charGroup" :key="index">
            <div
              class="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-nowrap min-h-[280px]"
            >
              <template v-for="item in charList" :key="item.id">
                <div
                  v-if="item.id != null"
                  class="relative bg-white rounded-lg sm:min-w-[300px] flex-1"
                >
                  <div
                    :id="item.id"
                    class="w-full h-[260px] sm:h-[300px]"
                  ></div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { splitAndFillGroup, ChartViewManager } from '@/utils/EchartsUtils.js';
import { metricsApi } from '@/api/metrics';
import { clusterApi } from '@/api/cluster';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

function emptyFunc() {}

const charList = [
  {
    id: 'app_cpu_usage',
    title: t('monitor.app_cpu_usage'),
    series: [
      {
        name: t('monitor.app_cpu_usage_percent'),
        key: null,
        keyType: null,
        subType: null
      }
    ]
  },
  {
    id: 'app_memory_usage',
    title: t('monitor.app_memory_usage'),
    series: [
      {
        name: t('monitor.app_memory_usage_percent'),
        key: 'app_memory_usage',
        keyType: null,
        subType: null
      }
      //{ name: '内存(M)', key: 'app_rss_memory', keyType: null, subType: null }
    ]
  },
  {
    id: 'app_rss_memory',
    title: t('monitor.app_rss_memory'),
    series: [
      {
        name: t('monitor.app_rss_memory_m'),
        key: 'app_rss_memory',
        keyType: null,
        subType: null
      }
    ]
  },

  {
    id: 'http_request_rps',
    title: t('monitor.http_request_rps'),
    series: [
      {
        name: t('monitor.http_request_rps'),
        key: 'http_request_handle_rt_summary',
        keyType: 'summary',
        subType: 'rps'
      }
    ]
  },
  {
    id: 'http_request_count',
    title: t('monitor.http_request_count'),
    series: [
      {
        name: t('monitor.http_request_count'),
        key: 'http_request_handle_rt_summary',
        keyType: 'summary',
        subType: 'count'
      }
    ]
  },
  {
    id: 'http_request_rt',
    title: t('monitor.http_request_rt'),
    series: [
      {
        name: t('monitor.http_request_rt_ms'),
        key: 'http_request_handle_rt_summary',
        keyType: 'summary',
        subType: 'average'
      }
    ]
  },
  {
    id: 'grpc_request_rps',
    title: t('monitor.grpc_request_rps'),
    series: [
      {
        name: t('monitor.grpc_request_rps'),
        key: 'grpc_request_handle_rt_summary',
        keyType: 'summary',
        subType: 'rps'
      }
    ]
  },
  {
    id: 'grpc_request_count',
    title: t('monitor.grpc_request_count'),
    series: [
      {
        name: t('monitor.grpc_request_count'),
        key: 'grpc_request_handle_rt_summary',
        keyType: 'summary',
        subType: 'count'
      }
    ]
  },
  {
    id: 'grpc_request_rt',
    title: t('monitor.grpc_request_rt'),
    series: [
      {
        name: t('monitor.grpc_request_rt_ms'),
        key: 'grpc_request_handle_rt_summary',
        keyType: 'summary',
        subType: 'average'
      }
    ]
  },
  {
    id: 'config_data_size',
    title: t('monitor.config_data_size'),
    series: [
      {
        name: t('monitor.config_data_size_n'),
        key: null,
        keyType: null,
        subType: null
      }
    ]
  },
  {
    id: 'config_listener_client_size',
    title: t('monitor.config_listener_client_size'),
    series: [
      {
        name: t('monitor.config_listener_client_size_n'),
        key: null,
        keyType: null,
        subType: null
      }
    ]
  },
  {
    id: 'config_subscriber_client_size',
    title: t('monitor.config_subscriber_client_size'),
    series: [
      {
        name: t('monitor.config_subscriber_client_size_n'),
        key: null,
        keyType: null,
        subType: null
      }
    ]
  },
  {
    id: 'naming_service_size',
    title: t('monitor.naming_service_size'),
    series: [
      {
        name: t('monitor.naming_service_size_n'),
        key: null,
        keyType: null,
        subType: null
      }
    ]
  },
  {
    id: 'naming_instance_size',
    title: t('monitor.naming_instance_size'),
    series: [
      {
        name: t('monitor.naming_instance_size_n'),
        key: null,
        keyType: null,
        subType: null
      }
    ]
  },
  {
    id: 'naming_subscriber_client_size',
    title: t('monitor.naming_subscriber_client_size'),
    series: [
      {
        name: t('monitor.naming_subscriber_client_size_n'),
        key: null,
        keyType: null,
        subType: null
      }
    ]
  },
  {
    id: 'http_request_handle_rt_summary',
    title: t('monitor.http_request_handle_rt_summary_percent_ms'),
    series: [
      {
        name: t('monitor.http_request_handle_rt_summary'),
        key: 'http_request_handle_rt_summary',
        keyType: 'summary',
        subType: null
      }
    ]
  },
  {
    id: 'grpc_request_handle_rt_summary',
    title: t('monitor.grpc_request_handle_rt_summary_percent_ms'),
    series: [
      {
        name: t('monitor.grpc_request_handle_rt_summary'),
        key: 'grpc_request_handle_rt_summary',
        keyType: 'summary',
        subType: null
      }
    ]
  }
];

const viewGroup = [
  {
    label: t('monitor.LEAST'),
    value: 'LEAST'
  },
  {
    label: t('monitor.MINUTE'),
    value: 'MINUTE'
  },
  {
    label: t('monitor.HOUR'),
    value: 'HOUR'
  }
];

const nodeList = ref([
  {
    label: t('monitor.DIRECT_NODE'),
    value: 0
  }
]);

/*
function initChartData(item){
  item.obj=null;
  item.option =initOption(item.title || item.id,item.name || "");
  return item;
}
charList.forEach((e)=>{initChartData(item)});
*/

const charGroup = splitAndFillGroup(charList, 3, { id: null });
const chartManager = new ChartViewManager(charList);
const inited = ref(false);

const metricKeys = chartManager.getDependKeys();

const param = ref({
  nodeId: 0,
  timelineGroupName: 'LEAST'
});

const autoLoad = ref({
  enable: true,
  interval: 60000,
  lastTimestamp: 0,
  timeoutId: null,
  running: false,
  resetting: false
});

function viewGroupUpdate(e) {
  //console.log("viewGroupUpdate",e,param.value.timelineGroupName);
  queryList();
}

function updateAutoLoad(v) {
  //console.log('updateAutoLoad', v, autoLoad.value.enable);
}

function resetAutoLoad() {
  //console.log('resetAutoLoad');
  autoLoad.value.resetting = true;
  if (
    autoLoad.value.enable &&
    autoLoad.value.running &&
    autoLoad.value.timeoutId != null
  ) {
    //console.log('resetAutoLoad clear oldTimeout');
    clearTimeout(autoLoad.value.timeoutId);
  }
  autoLoad.value.resetting = false;
  tryAutoLoad(true);
}

function closeAutoLoad() {
  if (
    autoLoad.value.enable &&
    autoLoad.value.running &&
    autoLoad.value.timeoutId != null
  ) {
    //console.log('resetAutoLoad clear oldTimeout');
    clearTimeout(autoLoad.value.timeoutId);
  }
}

function tryAutoLoad(continuous) {
  if (
    inited.value &&
    autoLoad.value.enable &&
    !autoLoad.value.resetting &&
    (continuous || !autoLoad.value.running)
  ) {
    autoLoad.value.running = true;
    //console.log('tryAutodelayLoad', autoLoad.value.interval);
    autoLoad.value.timeoutId = setTimeout(
      incrementLoadData,
      autoLoad.value.interval
    );
  } else {
    //console.log('tryAutodelayLoad stop');
    autoLoad.value.running = false;
  }
}

function incrementLoadData() {
  autoLoad.value.timeoutId = null;
  if (!autoLoad.value.enable) {
    //console.log('incrementLoadData stop');
    autoLoad.value.running = false;
    return;
  }
  //console.log('incrementLoadData');
  doIncrementLoadData().then(emptyFunc);
  tryAutoLoad(true);
}

async function doIncrementLoadData() {
  let paramObj = {
    keys: metricKeys,
    startTime: autoLoad.value.lastTimestamp,
    ...param.value
  };
  let resp = await metricsApi.queryTimeLine(paramObj);
  if (resp.status != 200 || !resp.data.success) {
    throw new Error('queryTimeLine error');
  }
  let data = resp.data.data;
  if (data.lastTime > autoLoad.value.lastTimestamp) {
    autoLoad.value.lastTimestamp = data.lastTime;
  }
  chartManager.incrementData(data);
}

async function loadData() {
  let paramObj = {
    keys: metricKeys,
    ...param.value
  };
  let resp = await metricsApi.queryTimeLine(paramObj);
  if (resp.status != 200 || !resp.data.success) {
    throw new Error('queryTimeLine error');
  }
  let data = resp.data.data;
  if (data.intervalSecond > 0) {
    autoLoad.value.interval = data.intervalSecond * 1000;
    autoLoad.value.lastTimestamp = data.lastTime;
  }
  chartManager.loadData(data);
}

async function initNodeData() {
  let resp = await clusterApi.queryNodeList();
  if (resp.status != 200 || !resp.data.success) {
    //console.log('initNodeData', resp);
    throw new Error('queryNodeList error');
  }
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
}

function queryList() {
  loadData().then(resetAutoLoad);
}

function resize() {
  chartManager.resize();
}

onMounted(() => {
  //console.log('onMounted');
  initNodeData().then(emptyFunc);
  //initChart();
  chartManager.initChartView();
  inited.value = true;
  loadData().then(() => tryAutoLoad(false));
});

onUnmounted(() => {
  //console.log('onUnmounted');
  chartManager.dispose();
  closeAutoLoad();
  inited.value = false;
});

window.addEventListener('resize', function () {
  console.log('resize 事件');
  resize();
});
</script>
