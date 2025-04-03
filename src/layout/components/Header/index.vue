<template>
  <div class="flex items-center p-0 w-full h-16" @click="handleMenuCollapsed">
    <n-icon size="16" v-if="collapsed">
      <MenuUnfoldOutlined />
    </n-icon>
    <n-icon size="16" v-else>
      <MenuFoldOutlined />
    </n-icon>
  </div>

  <div class="flex gap-x-2">
    <MoreSetting class="h-inherit flex-0" />
    <LangSwitch class="h-inherit flex-0" />
  </div>
</template>
<script lang="ts" setup>
import MoreSetting from '@/components/MoreSetting.vue';
import LangSwitch from '@/components/LangSwitch.vue';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@vicons/antd';

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['update:collapsed']);

function handleMenuCollapsed() {
  emits('update:collapsed', !props.collapsed);
}
</script>
