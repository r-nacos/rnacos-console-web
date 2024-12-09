<template>
  <div>
    <!-- 
    <div><span>{{ this.$t('config.comparison_of_configuration_changes')}}</span></div>
    -->
    <div class="result-wrap">
      <div class="inner-wrap">
        <div class="result-title">
          {{ this.$t('config.current_configuration') }}:
        </div>
        <div class="result-title">
          {{ this.$t('config.new_configurations_to_be_submitted') }}:
        </div>
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
import { defineComponent, ref } from 'vue';
import { handleDiff, buildDiffResult } from '@/utils/utils';

export default defineComponent({
  props: ['src', 'dst'],
  setup(props) {
    var list = handleDiff(props['src'] || '', props['dst'] || '');
    var res = buildDiffResult(list);
    return {
      ...res
    };
  }
});
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
