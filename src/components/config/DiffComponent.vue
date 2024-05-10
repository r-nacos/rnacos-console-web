<template>
  <div>
    <div class="result-wrap">
      <div class="inner-wrap">
        <div class="result-title">当前配置:</div>
        <div class="result-title">待提交的新配置:</div>
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

<script lang="ts" setup>
import { handleDiff, buildDiffResult } from '@/utils'
let props = defineProps({
  src: {
    type: String,
  },
  dst: {
    type: String,
  },
})

let list = handleDiff(props['src'] || '', props['dst'] || '')
let { srcNo, srcCode, dstNo, dstCode } = buildDiffResult(list)
</script>

<style scoped>
.result-wrap {
  height: 100%;
  overflow-y: scroll;
}

.inner-wrap {
  width: 100%;
  background: #1f1f1f;
  display: flex;
}

.result-title {
  flex: 1 1 auto;
  width: 50%;
  background: #fff;
}

.diff-result {
  flex: 1 1 auto;
  width: 50%;
  overflow-x: scroll;
  background: #1f1f1f;
  color: #c9c9c9;
  display: flex;
}

.no-code {
  flex: 0 0 none;
  width: 50px;
  /*
  background: #c9c9c9;
  color: #1f1f1f;
  color: #c9c9c9;
  */
  text-align: right;
  padding: 0 3px;
  border: 1px solid #2c2c2c;
}

.code {
  flex: 1 1 auto;
}

/*
.code-pre {
  background: #1f1f1f;
  color: #c9c9c9;
}
*/
</style>
