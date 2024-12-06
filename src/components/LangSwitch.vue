<template>
  <div class="wrap">
    <n-switch
      v-model:value="active"
      :rail-style="railStyle"
      @update:value="handleChange"
    >
      <template #checked>EN</template>
      <template #unchecked>中</template>
    </n-switch>
  </div>
</template>
<script setup>
//import type { CSSProperties } from 'vue';
import { langStore } from '@/data/lang';
import { useI18n } from 'vue-i18n';

const active = ref(langStore.current.value == 'zh');

let railStyle = ({ focused, checked }) => {
  const style = {};
  if (checked) {
    style.background = '#5885EE';
    if (focused) {
      style.boxShadow = '0 0 0 2px #5885EE40';
    }
  } else {
    style.background = '#5885EE';
    if (focused) {
      style.boxShadow = '0 0 0 2px #5885EE40';
    }
  }
  return style;
};

let i18n = useI18n();

let handleChange = function (value) {
  if (value) {
    langStore.setCurrent('zh');
    i18n.locale = 'zh';
  } else {
    langStore.setCurrent('en');
    i18n.locale = 'en';
  }
  location.reload();
};
</script>
<style scoped>
.wrap {
  height: 100%;
  /*align-items: center; /* 居中 */
  justify-content: center; /*垂直于父方向居中*/
  padding-right: 5px;
}
</style>
