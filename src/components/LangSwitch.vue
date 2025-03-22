<template>
  <div class="h-full px-2 flex items-center justify-center">
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

