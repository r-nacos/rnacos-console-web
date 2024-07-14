<template>
  <div class="wrap">
    <div class="params"></div>
    <div class="char_root">
      <div v-for="charList in charGroup" class="char_group">
        <div v-for="item in charList" class="char_item">
          <div v-if="item.id != null" :id="item.id" class="char"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import echarts from '@/utils/EchartsWrap.js';
import { splitAndFillGroup, ChartViewManager } from '@/utils/EchartsUtils.js';
import { ref, onMounted, onUnmounted } from 'vue';

const charList = [
  {
    id: 'c1',
    ele: null,
    obj: null
  },
  {
    id: 'c2',
    ele: null,
    obj: null
  },
  {
    id: 'c3',
    ele: null,
    obj: null
  },
  {
    id: 'c4',
    ele: null,
    obj: null
  },
  {
    id: 'c5',
    ele: null,
    obj: null
  },
  {
    id: 'c6',
    ele: null,
    obj: null
  },
  {
    id: 'c7',
    ele: null,
    obj: null
  },
  {
    id: 'c8',
    ele: null,
    obj: null
  }
  /*
   */
];

const charGroup = splitAndFillGroup(charList, 3, { id: null });
const chartManager = new ChartViewManager(charList);
const inited = ref(false);

function updateData() {}

function initChart() {
  for (var item of charList) {
    let ele = document.querySelector('#' + item.id);
    //console.log("query charItem ele",item.id,ele);
    item.ele = ele;
    var myChart = echarts.init(ele);
    item.obj = myChart;
    myChart.setOption({
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['销量'],
        bottom: 'bottom'
      },
      xAxis: {
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {},
      //animation: false,
      series: [
        {
          name: '销量',
          type: 'line',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    });
    //ele.addEventListener('mouseenter', buildEleEntryHandle(item.id));
    //ele.addEventListener('mouseleave', buildEleLeaveHandle(item.id));
    ele.addEventListener(
      'mouseenter',
      chartManager.buildEleEntryHandle(item.id)
    );
    ele.addEventListener(
      'mouseleave',
      chartManager.buildEleLeaveHandle(item.id)
    );
  }
}

function resize() {
  chartManager.resize();
}

onMounted(() => {
  console.log('onMounted');
  initChart();
  inited.value = true;
});

onUnmounted(() => {
  console.log('onUnmounted');
  chartManager.dispose();
});

window.addEventListener('resize', function () {
  resize();
});
</script>

<style scoped>
.wrap {
  position: relative;
  display: flex;
  padding: 8px 8px 0px;
}

.params {
  position: relative;
  flex: 0;
}

.char_root {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 8px 0px;
  /*
      background: #fff;
      */
}
.char_group {
  position: relative;
  display: flex;
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
</style>
