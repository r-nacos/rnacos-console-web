<template>
  <div
        class="ml-1 layout-header-trigger layout-header-trigger-min"
        @click="handleMenuCollapsed"
  >
        <n-icon size="18" v-if="collapsed">
          <MenuUnfoldOutlined />
        </n-icon>
        <n-icon size="18" v-else>
          <MenuFoldOutlined />
        </n-icon>
  </div>
  <!-- <div class="text-lg">
      <span>R-NACOS</span>
    </div> -->

    <div class="flex gap-x-2">
      <MoreSetting class="more" />
      <LangSwitch />
    </div>
</template>
<script lang="ts" setup>
import MoreSetting from '@/components/MoreSetting.vue';
import LangSwitch from '@/components/LangSwitch.vue';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@vicons/antd';
import { defineEmits, defineProps } from 'vue';
 
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
});
// const collapsed = ref(props.collapsed);

const emits = defineEmits(['update:collapsed']);

function handleMenuCollapsed() {
  emits('update:collapsed', !props.collapsed);
};
</script>

<style>
.more {
  width: 52px;
  height: inherit;
  flex: 0;
}
</style>
