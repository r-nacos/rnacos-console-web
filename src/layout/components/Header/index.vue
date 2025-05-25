<template>
  <div
    class="flex justify-between bg-[#2f6cf7] text-white items-center p-0 h-13 shadow transition-all duration-200 ease-in-out w-full z-11"
  >
    <div class="flex items-center">
      <div
        class="ml-1 cursor-pointer items-center text-center w-auto p-2"
        @click="handleMenuCollapsed"
      >
        <n-icon size="18" v-if="collapsed">
          <MenuUnfoldOutlined />
        </n-icon>
        <n-icon size="18" v-else>
          <MenuFoldOutlined />
        </n-icon>
      </div>
    </div>

    <div class="flex items-center justify-center mr-5">
      <div
        class="inline-flex h-16 text-center cursor-pointer transition-all duration-200 ease-in-out"
      >
        <MoreSetting class="h-inherit" />
      </div>
      <div
        class="inline-block h-16 text-center cursor-pointer transition-all duration-200 ease-in-out"
      >
        <LangSwitch class="h-inherit flex-0" />
      </div>
    </div>
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
