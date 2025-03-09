<template>
  <div class="wrap">
    <div class="header">
      <div class="title">
        <span> {{ t('monitor.system_monitor') }} </span>
      </div>
    </div>
    <div class="content-wrap">
      <div class="form-container">
        <div class="query-params">
          <n-form label-placement="left" label-width="auto">
            <div class="paramWrap">
              <n-form-item
                :label="t('monitor.service_node')"
                path="param.nodeId"
              >
                <n-select
                  class="paramselect"
                  v-model:value="param.nodeId"
                  :options="nodeList"
                  size="medium"
                  @update:value="viewGroupUpdate"
                  scrollable
                >
                </n-select>
              </n-form-item>
              <n-form-item :label="t('monitor.interval_type')">
                <n-select
                  class="paramselect"
                  v-model:value="param.timelineGroupName"
                  :options="viewGroup"
                  size="medium"
                  @update:value="viewGroupUpdate"
                  scrollable
                >
                </n-select>
              </n-form-item>
              <n-form-item :label="t('monitor.auto_refresh')">
                <n-switch
                  size="small"
                  v-model:value="autoLoad.enable"
                  @update:value="updateAutoLoad"
                />
              </n-form-item>
            </div>
          </n-form>
          <div class="queryButton">
            <span class="query-button-item">
              <n-button tertiary @click="queryList">{{
                t('common.refresh')
              }}</n-button>
            </span>
          </div>
        </div>
        <div class="char_root">
          <div v-for="charList in charGroup" class="char_group">
            <div v-for="item in charList" class="char_item">
              <div v-if="item.id != null" :id="item.id" class="char"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
//import echarts from '@/utils/EchartsWrap.js';
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
  resize();
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
  line-height: 30px;
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

.char_root {
  position: relative;
  /*
    background: #fff;
  */
}
.char_group {
  position: relative;
  display: flex;
  flex-direction: row;
  flex: 1;
}

.char_item {
  flex: 1;
  position: relative;
  width: 100%;
  padding: 2px;
}

.char {
  width: 100%;
  height: 300px;
  background: #fff;
}

.paramselect {
  width: 200px;
}
</style>
