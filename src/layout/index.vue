<template>
  <n-layout class="flex flex-auto flex-row min-h-screen" has-sider>
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
      class="h-screen shadow-md transition-all duration-200 ease-in-out relative"
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
      class="md:hidden"
    >
      <n-layout-sider
        :position="'left'"
        :width="menuWidth"
        :collapsed="false"
        :collapsed-width="64"
        :native-scrollbar="false"
        class="h-screen shadow-md transition-all duration-200 ease-in-out relative"
      >
        <Logo :collapsed="false" />
        <AsideMenu :collapsed="false" />
      </n-layout-sider>
    </n-drawer>

    <n-layout
      :native-scrollbar="false"
      class="!bg-gray-100"
      :class="{ 'h-screen': isMobile }"
    >
      <n-layout-header>
        <PageHeader v-model:collapsed="collapsed" />
      </n-layout-header>
      <n-layout-content class="flex-1 !bg-gray-100 min-h-0">
        <!-- 面包屑 pt-16 -->
        <div class="m-0 mb-[10px] mx-[10px] relative pt-3">
          <div class="pt-0">
            <router-view></router-view>
          </div>
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { AsideMenu } from './components/Menu';
import { PageHeader } from './components/Header';
import { Logo } from './components/Logo';
import { useLayoutSize } from '@/data/appdata';
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

const layoutSize = useLayoutSize();
const collapsed = ref(false);
const settingStore = useProjectSettingStore();

const { mobileWidth, menuWidth } = unref(menuSetting);

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

// 组件挂载时初始化
onMounted(() => {
  checkMobileMode();
  window.addEventListener('resize', handleResize);
});

// 组件卸载时清理
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
