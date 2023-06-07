<template>
  <div>
    <div class="diff-wrap">
      <div class="diff-item">
        <p>src:</p>
        <div>
          <textarea v-model="src" />
        </div>
      </div>
      <div class="diff-item">
        <p>dst:</p>
        <div>
          <textarea v-model="dst" />
        </div>
      </div>
    </div>
    <div>
      <button @click="doDiff">diff</button>
    </div>
      <p> diff result</p>
    <div class="result-wrap">
      <div class="inner-wrap">
        <div class="result-title">src:</div>
        <div class="result-title">dst:</div>
      </div>
      <div class="inner-wrap">
        <div class="diff-result">
          <code class="no-code">
            <pre class="no-pre"><span v-html="srcNo"></span></pre>
          </code>
          <code class="code">
            <pre class="code-pre"><span v-html="srcCode"></span></pre>
          </code>
        </div>
        <div class="diff-result">
          <code class="no-code">
            <pre class="no-pre"><span v-html="dstNo"></span></pre>
          </code>
          <code class="code">
            <pre class="code-pre"><span v-html="dstCode"></span></pre>
          </code>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent,ref} from 'vue'

import {diffLines} from 'diff';
import {escapeHtml} from '@/utils/utils';

const splitLines = (value) => {
  var subItems = value.split("\n");
  if(subItems[subItems.length-1]==='') {
    subItems.pop();
  }
  return subItems;
}

const handleDiff=function(src,dst) {
  const diffs = diffLines(src,dst);
  var list = [];
  var srcLine = 0;
  var dstLine = 0;
  for(var i in diffs){
    const item = diffs[i];
    if(item.removed){
      var subItems = splitLines(item.value);
      for(var j in subItems){
        srcLine+=1;
        var obj = {'src':subItems[j],'dst':'','srcLine':srcLine,'dstLine':0,'t':'R'}
        list.push(obj)
      }
    }
    else if (item.added){
      var subItems = splitLines(item.value);
      for(var j in subItems){
        dstLine+=1;
        var obj = {'src':'','dst':subItems[j],'srcLine':0,'dstLine':dstLine,'t':'A'}
        list.push(obj)
      }
    }
    else{
      var subItems = splitLines(item.value);
      for(var j in subItems){
        srcLine+=1;
        dstLine+=1;
        var obj = {'src':subItems[j],'dst':subItems[j],'srcLine':dstLine,'dstLine':dstLine,'t':'='}
        list.push(obj)
      }
    }
  }
  return list
}

const buildDiffResult=function(list){
  var srcNo='';
  var srcStr='';
  var dstNo='';
  var dstStr='';

  for(var i in list){
    const item = list[i];
    if(item.t=='='){
      srcStr+=escapeHtml(item['src'])+'\n';
      dstStr+=escapeHtml(item['dst'])+'\n';
      srcNo+=item['srcLine']+'\n';
      dstNo+=item['dstLine']+'\n';
    }
    else if(item.t=='R'){
      srcStr+="<span style='color:#f00'>" + escapeHtml(item['src']) + '</span>\n';
      dstStr += '\n';
      srcNo +="<span style='color:#f00'>" + item['srcLine']+'-</span>\n';
      dstNo += '\n';
    }
    else {
      srcStr += '\n';
      dstStr+="<span style='color:#0ff'>" + escapeHtml(item['dst']) + '</span>\n';
      srcNo += '\n';
      dstNo +="<span style='color:#0ff'>" + item['dstLine']+'+</span>\n';
    }
  }
  return {
    srcNo,
    srcStr,
    dstNo,
    dstStr,
  }
}

export default defineComponent({
  setup() {
    const msgRef = ref('');
    const srcNoRef = ref('');
    const srcCodeRef = ref('');
    const dstNoRef = ref('');
    const dstCodeRef = ref('');

    return {
      doDiff() {
        var list = handleDiff(this.src,this.dst);
        var res = buildDiffResult(list);
        srcNoRef.value = res.srcNo;
        srcCodeRef.value = res.srcStr;
        dstNoRef.value = res.dstNo;
        dstCodeRef.value = res.dstStr;
        /*
        const diffs = diffLines(this.src,this.dst);
        var list =[];
        var msg=[];
        var msgstr = ""
        for(var i in diffs) {
          const item = diffs[i];
          var obj = {'src':'','dst':'','line':''};
          if (item.removed) {
            obj['src']=item.value;
            var sub_items = splitLines(item.value);
            for(var j in sub_items){
              msgstr = msgstr + "<span style='color:#f00'>- "+escapeHtml(sub_items[j])+"</span>\n";
            }
          }
          else if (item.added){
            obj['dst']=item.value;
            var sub_items = splitLines(item.value);
            for(var j in sub_items) {
              msgstr = msgstr + "<span style='color:#0ff'>+ "+escapeHtml(sub_items[j])+"</span>\n";
            }
          }
          else{
            msgstr+=escapeHtml(item.value);
            obj['src']=item.value;
            obj['dst']=item.value;
          }
          list.push(obj)
        }
        console.log(list);
        console.log(msgstr);
        msgRef.value=msgstr;
        window.$message.info("diff ok");
        */
      },
      "src":"",
      "dst":"",
      srcNo:srcNoRef,
      srcCode:srcCodeRef,
      dstNo:dstNoRef,
      dstCode:dstCodeRef,
      "message":msgRef,
    }
  }
})

</script>

<style scoped>
.diff-wrap {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 5px;
}
.diff-item {
  flex-grow: 1;
  padding: 5px;
}

.diff-item textarea {
  width: 100%;
  height: 100px;
}

.result-wrap {
  height: 400px;
  overflow-y: scroll;
}

.inner-wrap {
  width: 800px;
  background: #fff;
  display: flex;
}

.result-title{
  flex: 1 1 auto;
  width: 50%;
}

.diff-result {
  flex: 1 1 auto;
  width: 50%;
  overflow-x:scroll;
  background: #1f1f1f;
  display: flex;
}

.no-code {
  flex:0 0 none;
  width: 50px;
  background: #c9c9c9;
  color: #1f1f1f;
  text-align: right;
  padding: 0 3px;
}

.code {
  flex: 1 1 auto;
}

.code-pre {
  background: #1f1f1f;
  color: #c9c9c9;
}
</style>