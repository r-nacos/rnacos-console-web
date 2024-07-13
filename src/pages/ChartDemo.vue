<template>
  <div class="wrap">
    <div class="params">
      <button @click="updateData">updateData</button>
    </div>
    <div class="char_root">
      <div v-for="charList in charGroup" class="char_group">
        <div v-for="item in charList" class="char_item">
            <div :id="'c'+item.id" class="char"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>

import echarts from '@/utils/echarts'
import {ref,onMounted} from 'vue'

const charList= [
        {   
            id:"1",
            ele: null,
            obj: null
        },
        {   
            id:"2",
            ele: null,
            obj: null
        },
        {   
            id:"3",
            ele: null,
            obj: null
        },
        {   
            id:"4",
            ele: null,
            obj: null
        },
]

const charMap = {}

function getCharGroup(){
    let groupList = []
    let group =[];
    let c=0
    for(var item of charList){
        charMap[item.id]=item;
        group.push(item);
        c+=1;
        if (c==2){
            groupList.push(group);
            group=[]
            c=0;
        }
    }
    if (group.length>0){
        groupList.push(group);
    }
    return groupList;
}
const charGroup = getCharGroup()
const inited=ref(false);

const selectType='showTip';
const unselectType='hideTip';

function updateData(){

}

function followShow(source,params){
    if(!inited.value){
        return;
    }
    for(var item of charList){
        if(item.id===source || item.obj==null) {
            continue;
        }
        item.obj.dispatchAction({
            type: selectType,
            seriesIndex: 0,
            dataIndex: params.batch[0].dataIndex,
        })
    }
}

function unfollowShow(source,params){
    if(!inited.value){
        return;
    }
    for(var item of charList){
        if(item.id===source || item.obj==null) {
            continue;
        }
        item.obj.dispatchAction({
            type: unselectType,
            seriesIndex: 0,
            dataIndex: params.batch[0].dataIndex,
        })
    }
}

function chartEvent(source,params){
    //console.log("chart event",source,params.type);
    if(params.type=="highlight"){
        followShow(source,params);
    }
    else if (params.type=="downplay") {
        unfollowShow(source,params);
    }

}

function buildEventHandle(source){
    return function(params){
        chartEvent(source,params);
    }
}

function entryEvent(source,event){
    let item=charMap[source];
    //console.log("entryEvent",source,item);
    let eventHandle = buildEventHandle(source);
    if(item.obj!==null) {
        item.obj.on('highlight',eventHandle);
        item.obj.on('downplay',eventHandle);
    }
}

function buildEleEntryHandle(source){
    return function(event) {
        entryEvent(source,event);
    }
}

function leaveEvent(source,event){
    let item=charMap[source];
    //console.log("leaveEvent",source,item);
    if(item.obj!==null) {
        item.obj.off('highlight');
        item.obj.off('downplay');
    }
}

function buildEleLeaveHandle(source){
    return function(event) {
        leaveEvent(source,event);
    }
}


function initChart(){
    for(var item of charList) {
        let ele = document.querySelector("#c"+item.id);
        //console.log("query charItem ele",item.id,ele);
        item.ele = ele
        var myChart = echarts.init(ele);
        item.obj=myChart;
        myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['销量'],
          bottom:"bottom"
        },
        xAxis: {
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'line',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
      ele.addEventListener('mouseenter',buildEleEntryHandle(item.id))
      ele.addEventListener('mouseleave',buildEleLeaveHandle(item.id))
    }
}


function refreshChart(){
    for(var item of charList){
        if(item.obj!==null){
            item.obj.resize();
        }
    }
}


onMounted(()=>{
    console.log("onMounted");
    initChart();
    inited.value=true;
})

window.addEventListener('resize',function(){
    refreshChart();
});

</script>


<style scoped>
.wrap {
    position: relative;
    display: flex;
    /*background: #fff;*/
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
    padding: 5px;
}

.char {
    width: 100%;
    height: 400px;
}
</style>