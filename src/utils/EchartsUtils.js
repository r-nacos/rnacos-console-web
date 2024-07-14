import echarts from '@/utils/EchartsWrap.js';
import { toDatetime, toTime } from './date';

export function splitAndFillGroup(sourceList, groupNumber, defaultObj = null) {
  let groupList = [];
  let group = [];
  let c = 0;

  for (var item of sourceList) {
    group.push(item);
    c += 1;
    if (c == groupNumber) {
      groupList.push(group);
      group = [];
      c = 0;
    }
  }
  if (group.length > 0) {
    for (var i = group.length; i < groupNumber; i++) {
      group.push(defaultObj);
    }
    groupList.push(group);
  }
  return groupList;
}

const selectType = 'showTip';
const unselectType = 'hideTip';

function initOption(title, series_name) {
  return {
    title: {
      text: title
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: [series_name],
      bottom: 'bottom'
    },
    xAxis: {
      data: []
    },
    yAxis: {},
    //animation: false,
    series: [
      {
        name: series_name,
        type: 'line',
        data: []
      }
    ]
  };
}

export class ChartViewManager {
  constructor(chartList) {
    this.chartList = chartList;
    this.innerInit();
  }

  innerInit() {
    let m = {};
    for (var item of this.chartList) {
      this.initChartData(item);
      m[item.id] = item;
    }
    this.chartMap = m;
  }

  initChartData(item) {
    item.obj = null;
    item.option = initOption(item.title || item.id, item.name || '');
  }

  initChartView() {
    for (var item of this.chartList) {
      let ele = document.querySelector('#' + item.id);
      //console.log("query charItem ele",item.id,ele);
      //item.ele = ele;
      var myChart = echarts.init(ele);
      item.obj = myChart;
      //myChart.setOption(item.option);
      ele.addEventListener('mouseenter', this.buildEleEntryHandle(item.id));
      ele.addEventListener('mouseleave', this.buildEleLeaveHandle(item.id));
    }
  }

  followShow(source, params) {
    let dataIndex = null;
    if (params.batch && params.batch.length > 0) {
      dataIndex = params.batch[0].dataIndex;
    } else {
      return;
    }
    for (var item of this.chartList) {
      if (item.id === source || item.obj == null) {
        continue;
      }
      item.obj.dispatchAction({
        type: selectType,
        seriesIndex: 0,
        dataIndex: dataIndex
      });
    }
  }

  unfollowShow(source, params) {
    let dataIndex = null;
    if (params.batch && params.batch.length > 0) {
      dataIndex = params.batch[0].dataIndex;
    } else {
      return;
    }
    for (var item of this.chartList) {
      if (item.id === source || item.obj == null) {
        continue;
      }
      item.obj.dispatchAction({
        type: unselectType,
        seriesIndex: 0,
        dataIndex: dataIndex
      });
    }
  }

  chartEvent(source, params) {
    //console.log("chart event",source,params.type);
    if (params.type == 'highlight') {
      this.followShow(source, params);
    } else if (params.type == 'downplay') {
      this.unfollowShow(source, params);
    }
  }

  buildEventHandle(source) {
    let This = this;
    return function (params) {
      This.chartEvent(source, params);
    };
  }

  entryEvent(source, event) {
    let item = this.chartMap[source];
    //console.log("entryEvent",source,item);
    let eventHandle = this.buildEventHandle(source);
    if (item.obj !== null) {
      item.obj.on('highlight', eventHandle);
      item.obj.on('downplay', eventHandle);
    }
  }

  buildEleEntryHandle(source) {
    let This = this;
    return function (event) {
      This.entryEvent(source, event);
    };
  }

  leaveEvent(source, event) {
    let item = this.chartMap[source];
    //console.log("leaveEvent",source,item);
    if (item.obj !== null) {
      item.obj.off('highlight');
      item.obj.off('downplay');
    }
  }

  buildEleLeaveHandle(source) {
    let This = this;
    return function (event) {
      This.leaveEvent(source, event);
    };
  }

  updateItemData(viewItem, indexList, dataList) {
    viewItem.option.xAxis.data = indexList;
    viewItem.option.series[0].data = dataList;
    viewItem.obj.setOption(viewItem.option);
  }

  loadData(data) {
    //console.log("ChartManager loadData",data);
    //let indexList = data.timeIndex
    let indexList = [];
    for (var v of data.timeIndex) {
      //indexList.push(toDatetime(new Date(v)));
      indexList.push(toTime(new Date(v)));
    }
    for (var key in data.gaugeData) {
      let viewItem = this.chartMap[key];
      if (!viewItem) {
        continue;
      }
      let obj = data.gaugeData[key];
      this.updateItemData(viewItem, indexList, obj);
    }
  }

  incrementData(data) {
    console.log('ChartManager incrementData', data);
  }

  resize() {
    for (var item of this.chartList) {
      if (item.obj !== null) {
        item.obj.resize();
      }
    }
  }
  dispose() {
    for (var item of this.chartList) {
      if (item.obj !== null) {
        item.obj.dispose();
        item.obj = null;
        item.ele = null;
      }
    }
  }
}
