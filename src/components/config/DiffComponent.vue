<template>
  <div class="h-full overflow-y-scroll bg-[#1f1f1f]">
    <div class="w-full flex flex-col md:flex-row">
      <div class="w-full md:w-1/2 bg-[#1f1f1f] p-2">
        <div class="text-white font-medium mb-2 sticky top-0 bg-[#1f1f1f] z-10">
          {{ this.$t('config.current_configuration') }}
        </div>
        <div class="overflow-x-auto bg-[#1f1f1f] text-[#c9c9c9] flex">
          <div
            class="flex-none w-[64px] text-right px-2 border-r border-[#2c2c2c] select-none sticky left-0 bg-[#1f1f1f]"
          >
            <pre class="no-pre line-pre"><span v-html="srcNo"></span></pre>
          </div>
          <div class="flex-1 min-w-0">
            <pre class="code-pre line-pre"><span v-html="srcCode"></span></pre>
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/2 bg-[#1f1f1f] p-2">
        <div class="text-white font-medium mb-2 sticky top-0 bg-[#1f1f1f] z-10">
          {{ this.$t('config.new_configurations_to_be_submitted') }}
        </div>
        <div class="overflow-x-auto bg-[#1f1f1f] text-[#c9c9c9] flex">
          <div
            class="flex-none w-[64px] text-right px-2 border-r border-[#2c2c2c] select-none sticky left-0 bg-[#1f1f1f]"
          >
            <pre class="no-pre line-pre"><span v-html="dstNo"></span></pre>
          </div>
          <div class="flex-1 min-w-0">
            <pre class="code-pre line-pre"><span v-html="dstCode"></span></pre>
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
.no-pre, .code-pre, .line-pre {
  margin: 0;
  padding: 0;
  font-family: 'Fira Code', monospace;
  line-height: 1.7;
  font-size: 14px;
  /* 保证数字等宽 */
  letter-spacing: 0.05em;
  /* 让每行高度一致 */
  min-height: 1.7em;
  /* 禁止自动换行 */
  white-space: pre;
}


/* 未改变的行 */
:deep(.unchanged) {
  color: #c9c9c9;
  width: 100%;
  background: transparent;
}

/* 删除的行 */
:deep(.removed-line) {
  color: #f00;
}

/* 新增的行 */
:deep(.added-line) {
  color: #0ff;
}

/* 保证内容区的差异行也有背景色 */
:deep(.removed-line),
:deep(.added-line),
:deep(.unchanged) {
  padding: 2px 0;
}
</style>
