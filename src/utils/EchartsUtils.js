import echarts from '@/utils/EchartsWrap.js';
import { toDatetime, toShortHourTime, toTime } from './date';

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

function initOption(title, series) {
  let serieNameList = [];
  let serieList = [];
  for (var item of series) {
    serieNameList.push(item.name);
    serieList.push({
      name: item.name,
      type: 'line',
      data: []
    });
  }
  return {
    title: {
      text: title
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: serieNameList,
      bottom: 'bottom'
    },
    xAxis: {
      data: []
    },
    yAxis: {},
    //animation: false,
    series: serieList
  };
}

function getToTimeStrFunc(intervalSecond) {
  if (typeof intervalSecond != 'number') {
    return toDatetime;
  }
  if (intervalSecond < 3600) {
    return toTime;
  } else if (intervalSecond == 3600) {
    return toShortHourTime;
  }
  return toDatetime;
}

function summaryKeyConvert(v) {
  return (parseFloat(v) * 100).toString() + '%';
}

export class ChartViewManager {
  constructor(chartList) {
    this.chartList = chartList;
    this.innerInit();
    this.isInit = false;
  }

  innerInit() {
    let m = {};
    for (var item of this.chartList) {
      m[item.id] = item;
      if (!item.series) {
        item.series = [{ name: '', key: null, keyType: null, subType: null }];
      }
      this.initChartData(item);
    }
    this.chartMap = m;
  }

  initChartData(item) {
    item.obj = null;
    item.option = initOption(item.title || item.id, item.series);
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
    this.isInit = true;
  }

  getDependKeys() {
    let keySet = new Set();
    for (var item of this.chartList) {
      for (var serie of item.series) {
        keySet.add(serie.key || item.id);
      }
    }
    let keys = [];
    for (var key of keySet) {
      keys.push(key);
    }
    return keys;
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
    for (var i in viewItem.option.series) {
      viewItem.option.series[i].data = dataList[i] || [];
    }
    //viewItem.option.series[0].data = dataList;
    viewItem.obj.setOption(viewItem.option);
  }

  concatItemData(viewItem, indexList, dataList) {
    viewItem.option.xAxis.data = viewItem.option.xAxis.data.concat(indexList);
    for (var i in viewItem.option.series) {
      viewItem.option.series[i].data = viewItem.option.series[i].data.concat(
        dataList[i] || []
      );
    }
    viewItem.obj.setOption(viewItem.option);
  }

  loadData(data) {
    //console.log("ChartManager loadData",data);
    //let indexList = data.timeIndex
    let indexList = [];
    let toTimeStrFunc = getToTimeStrFunc(data.intervalSecond);
    for (var v of data.timeIndex) {
      indexList.push(toTimeStrFunc(new Date(v)));
    }
    if (indexList.length == 0) {
      return;
    }
    for (var viewItem of this.chartList) {
      var dataList = this.buildItemData(viewItem, data, true);
      if (dataList) {
        this.updateItemData(viewItem, indexList, dataList);
      }
    }
  }

  buildItemData(viewItem, data, isAll) {
    var dataList = [];
    for (var serie of viewItem.series) {
      let key = serie.key || viewItem.id;
      if (serie.keyType == 'summary') {
        let summaryObj = data.summeryData[key];
        if (serie.subType == 'average') {
          dataList.push(summaryObj.averageData || []);
        } else if (serie.subType == 'rps') {
          dataList.push(summaryObj.rpsData || []);
        } else if (serie.subType == 'count') {
          dataList.push(summaryObj.countData || []);
        } else {
          //ALL
          let serieList = [];
          let boundKeys = [];
          for (var subKey of summaryObj.boundKeys) {
            let subObj = summaryObj.itemsData[subKey];
            let name = summaryKeyConvert(subKey);
            //console.log("buildItemData summary item",subKey,subObj);
            serieList.push({
              name: name,
              type: 'line',
              data: subObj
            });
            boundKeys.push(name);
            dataList.push(subObj);
          }
          if (isAll || viewItem.option.legend.data.length == 0) {
            //console.log("buildItemData summary",isAll,serieList);
            viewItem.option.legend.data = boundKeys;
            viewItem.option.series = serieList;
            viewItem.obj.setOption(viewItem.option);
            //return null;
          }
        }
      } else {
        let obj = data.gaugeData[key] || [];
        dataList.push(obj);
      }
    }
    return dataList;
  }

  incrementData(data) {
    //console.log('ChartManager incrementData', data);
    let indexList = [];
    let toTimeStrFunc = getToTimeStrFunc(data.intervalSecond);
    for (var v of data.timeIndex) {
      indexList.push(toTimeStrFunc(new Date(v)));
    }
    if (indexList.length == 0) {
      return;
    }
    for (var viewItem of this.chartList) {
      var dataList = this.buildItemData(viewItem, data, false);
      if (dataList) {
        this.concatItemData(viewItem, indexList, dataList);
      }
    }
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
