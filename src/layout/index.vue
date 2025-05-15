<template>
  <n-layout class="flex flex-auto flex-row h-screen" has-sider>
    <n-layout-sider
      v-if="!isMobile"
      show-trigger="bar"
      @collapse="collapsed = true"
      :position="'left'"
      @expand="collapsed = false"
      :collapsed="collapsed"
      collapse-mode="width"
      :collapsed-width="64"
      :width="leftMenuWidth"
      :native-scrollbar="false"
      class="h-full shadow-md transition-all duration-200 ease-in-out relative"
    >
      <Logo :collapsed="collapsed" />
      <AsideMenu v-model:collapsed="collapsed" />
    </n-layout-sider>

    <n-drawer
      v-model:show="showSideDrawer"
      :width="menuWidth"
      :placement="'left'"
      :trap-focus="showSideDrawer"
      :auto-focus="false"
    >
      <n-layout-sider
        :position="'left'"
        :width="menuWidth"
        :collapsed="false"
        :collapsed-width="64"
        :native-scrollbar="false"
        class="h-full shadow-md transition-all duration-200 ease-in-out relative"
      >
        <Logo :collapsed="false" />
        <AsideMenu :collapsed="false" />
      </n-layout-sider>
    </n-drawer>

    <n-layout
      :native-scrollbar="false"
      class="!bg-gray-100 flex flex-col h-full relative"
    >
      <n-layout-header class="flex-none absolute top-0 right-0 left-0 z-50">
        <PageHeader v-model:collapsed="collapsed" />
      </n-layout-header>
      <n-layout-content class="flex-1 !bg-gray-100 min-h-0 pt-[52px]">
        <!-- 面包屑 pt-16 -->
        <div class="m-0 relative">
          <div class="pt-0">
            <router-view></router-view>
          </div>
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { AsideMenu } from './components/Menu';
import { PageHeader } from './components/Header';
import { Logo } from './components/Logo';
import { useProjectSetting } from '@/hooks/setting/useProjectSetting';
import { useProjectSettingStore } from '@/store/modules/projectSetting';

const {
  // showFooter,
  navMode,
  navTheme,
  headerSetting,
  menuSetting,
  multiTabsSetting
} = useProjectSetting();

const settingStore = useProjectSettingStore();

const { mobileWidth, menuWidth } = unref(menuSetting);

const collapsed = computed<boolean>({
  get: () => settingStore.getMenuSetting.collapsed,
  set: (val: boolean) => settingStore.setMenuCollapsed(val)
});

const isMobile = computed<boolean>({
  get: () => settingStore.getIsMobile,
  set: (val: boolean) => settingStore.setIsMobile(val)
});

const showSideDrawer = computed<boolean>({
  get: () => isMobile.value && collapsed.value,
  set: (val: boolean) => (collapsed.value = val)
});

const leftMenuWidth = computed(() => {
  const { minMenuWidth, menuWidth } = unref(menuSetting);
  return collapsed.value ? minMenuWidth : menuWidth;
});

// 检查并设置移动端模式
const checkMobileMode = () => {
  if (document.body.clientWidth <= mobileWidth) {
    isMobile.value = true;
  } else {
    isMobile.value = false;
  }
  collapsed.value = false;
};

// 监听窗口大小变化
const handleResize = () => {
  checkMobileMode();
};

onMounted(() => {
  checkMobileMode();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
:deep(.n-scrollbar)::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.n-layout-sider::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.n-layout-content::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
