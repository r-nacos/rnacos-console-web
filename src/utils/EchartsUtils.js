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

export class ChartViewManager {
  constructor(chartList) {
    this.chartList = chartList;
    this.chartMap = (function () {
      let m = {};
      for (var item of chartList) {
        m[item.id] = item;
      }
      return m;
    })();
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
