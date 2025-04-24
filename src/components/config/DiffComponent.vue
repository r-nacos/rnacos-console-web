<template>
  <div class="h-full overflow-y-scroll bg-[#1f1f1f]">
    <div class="w-full flex flex-col md:flex-row">
      <div class="w-full md:w-1/2 bg-[#1f1f1f] p-2">
        <div class="text-white font-medium mb-2 sticky top-0 bg-[#1f1f1f] z-10">
          {{ this.$t('config.current_configuration') }}
        </div>
        <div class="overflow-x-auto bg-[#1f1f1f] text-[#c9c9c9] flex">
          <div
            class="flex-none w-[50px] text-right px-2 border-r border-[#2c2c2c] select-none sticky left-0"
          >
            <pre class="no-pre"><span v-html="srcNo"></span></pre>
          </div>
          <div class="flex-1 min-w-0">
            <pre class="code-pre"><span v-html="srcCode"></span></pre>
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/2 bg-[#1f1f1f] p-2">
        <div class="text-white font-medium mb-2 sticky top-0 bg-[#1f1f1f] z-10">
          {{ this.$t('config.new_configurations_to_be_submitted') }}
        </div>
        <div class="overflow-x-auto bg-[#1f1f1f] text-[#c9c9c9] flex">
          <div
            class="flex-none w-[50px] text-right px-2 border-r border-[#2c2c2c] select-none sticky left-0"
          >
            <pre class="no-pre"><span v-html="dstNo"></span></pre>
          </div>
          <div class="flex-1 min-w-0">
            <pre class="code-pre"><span v-html="dstCode"></span></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { handleDiff, buildDiffResult } from '@/utils/utils';
import { useProjectSettingStore } from '@/store/modules/projectSetting';
import { computed } from 'vue';

const props = defineProps(['src', 'dst']);
const projectSettingStore = useProjectSettingStore();
const isMobile = computed(() => projectSettingStore.getIsMobile);
const list = handleDiff(props['src'] || '', props['dst'] || '');
const res = buildDiffResult(list);
const { srcNo, srcCode, dstNo, dstCode } = res;
</script>

<style scoped>
.no-pre {
  margin: 0;
  padding: 0;
  font-family: 'Fira Code', monospace;
  line-height: 1.5;
  font-size: 14px;
}

.code-pre {
  margin: 0;
  padding: 0;
  font-family: 'Fira Code', monospace;
  line-height: 1.5;
  white-space: pre-wrap;
  font-size: 14px;
  word-break: break-word;
}

:deep(span[style*='color:#f00']) {
  background-color: rgba(255, 0, 0, 0.1);
  color: #ff6b6b;
  display: inline-block;
  width: 100%;
  padding: 2px 0;
  text-decoration: line-through;
}

:deep(span[style*='color:#0ff']) {
  background-color: rgba(0, 255, 255, 0.1);
  color: #4dabf7;
  display: inline-block;
  width: 100%;
  padding: 2px 0;
}

:deep(.line-number) {
  color: #6c757d;
}

:deep(.removed-line) {
  color: #ff6b6b;
}

:deep(.added-line) {
  color: #4dabf7;
}
</style>
