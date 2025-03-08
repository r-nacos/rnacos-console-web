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
		  :width="240"
		  :native-scrollbar="false"
		  class="h-screen"
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
		>
			<n-layout-sider
			 :position="'left'"
			 :width="menuWidth"
			 :collapsed="false"
			 :collapsed-width="64"
            :native-scrollbar="false"
			>
			<Logo :collapsed="collapsed"/>
			<AsideMenu />
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
import { ref, computed, onMounted } from 'vue';
import { AsideMenu } from './components/Menu';
import { PageHeader } from './components/Header'
import { Logo } from './components/Logo';

const menuWidth = ref(200);
const collapsed = ref(false);
const isMobileState = ref(window.innerWidth <= 768);

const isMobile = computed<boolean>({
	get() {return isMobileState.value},
	set(val:boolean) {isMobileState.value = val}
  });

  const showSideDrawer = computed<boolean>({
	get() {return isMobile.value && collapsed.value},
	set(val:boolean) {collapsed.value = val}
  });
  //判断是否触发移动端模式
  function checkMobileMode() {
	if(document.body.clientWidth <= 768) {
		isMobile.value = true;
	} else {
		isMobile.value = false;
	}
	collapsed.value = false;
  };

  function watchWidth() {
    const width = document.body.clientWidth;
	collapsed.value = width <= 950;
	checkMobileMode();
  }
  onMounted(() => {
	checkMobileMode();
	window.addEventListener('resize', watchWidth);
  });

  onUnmounted(() => {
	window.removeEventListener('resize', watchWidth);
  });
</script>