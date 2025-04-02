<template>
	<n-layout has-sider>
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
		  class="h-screen transition-all duration-300"
		>
			<Logo :collapsed="collapsed"/>
			<AsideMenu v-model:collapsed="collapsed"/>
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
			 class="h-screen"
			>
				<Logo :collapsed="false"/>
				<AsideMenu :collapsed="false"/>
			</n-layout-sider>
		</n-drawer>

		<n-layout>
      <n-layout-header class="flex justify-between items-center px-4 bg-gray-100">
        <PageHeader v-model:collapsed="collapsed"/>
      </n-layout-header>
			<n-layout-content class="h-screen">
				<router-view></router-view>
			</n-layout-content>
		</n-layout>
	</n-layout>
</template>
  
<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { AsideMenu } from './components/Menu';
import { PageHeader } from './components/Header'
import { Logo } from './components/Logo';
import { useProjectSetting } from '@/hooks/setting/useProjectSetting';
import { useProjectSettingStore } from '@/store/modules/projectSetting';

const {
    // showFooter,
    navMode,
    navTheme,
    headerSetting,
    menuSetting,
    multiTabsSetting,
  } = useProjectSetting();
  
const collapsed = ref(false);
const settingStore = useProjectSettingStore();

const { mobileWidth, menuWidth } = unref(menuSetting);

const isMobile = computed<boolean>({
    get: () => settingStore.getIsMobile,
    set: (val: boolean) => settingStore.setIsMobile(val),
  });

const showSideDrawer = computed<boolean>({
	get: () => isMobile.value && collapsed.value,
    set: (val: boolean) => (collapsed.value = val),
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
/* 移动端样式 */
@media (max-width: 768px) {
	.n-layout-sider {
		position: fixed;
		z-index: 1000;
	}
}

/* 桌面端样式 */
@media (min-width: 769px) {
	.n-layout-sider {
		position: relative;
		z-index: 1;
	}
}
</style>