<template>
  <div class="h-full overflow-y-scroll bg-[#1f1f1f]">
    <div class="w-full flex flex-col md:flex-row">
      <div class="w-full md:w-1/2 bg-[#1f1f1f] p-2">
        <div class="text-white font-medium mb-2 sticky top-0 bg-[#1f1f1f] z-10">
          {{ t('config.current_configuration') }}
        </div>
        <div class="overflow-x-auto bg-[#1f1f1f] text-[#c9c9c9] flex">
          <div
            class="flex-none w-[50px] text-right px-1 border-r border-[#2c2c2c] select-none sticky left-0 bg-[#1f1f1f]"
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
          {{ t('config.new_configurations_to_be_submitted') }}
        </div>
        <div class="overflow-x-auto bg-[#1f1f1f] text-[#c9c9c9] flex">
          <div
            class="flex-none w-[50px] text-right px-1 border-l-2 border-r-1 border-[#2c2c2c] select-none sticky left-0 bg-[#1f1f1f]"
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
import { getMessage as t } from '@/i18n';
const props = defineProps(['src', 'dst']);
const list = handleDiff(props['src'] || '', props['dst'] || '');
const res = buildDiffResult(list);
const { srcNo, srcCode, dstNo, dstCode } = res;
</script>
