<template>
  <div
        class="flex items-center p-0 w-full h-16"
        @click="handleMenuCollapsed"
  >
        <n-icon size="18" v-if="collapsed">
          <MenuUnfoldOutlined />
        </n-icon>
        <n-icon size="18" v-else>
          <MenuFoldOutlined />
        </n-icon>
  </div>

    <div class="flex gap-x-2">
      <MoreSetting class="w-12 h-inherit flex-0" />
      <LangSwitch class="w-12 h-inherit flex-0"/>
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

const emits = defineEmits(['update:collapsed']);

function handleMenuCollapsed() {
  emits('update:collapsed', !props.collapsed);
};
</script>
