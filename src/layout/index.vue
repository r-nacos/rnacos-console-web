<template>
	<n-layout has-sider>
		<n-layout-sider
		  v-show="!isMobile"
		  class="h-screen"
		  collapse-mode="width"
		  :collapsed-width="64"
		  :width="240"
		  :collapsed="collapsed"
		  show-trigger="bar"
		  @collapse="collapsed = true"
		  @expand="collapsed = false"
		>
			<Logo :collapsed="collapsed"/>
			<AsideMenu v-model:collapsed="collapsed"/>
		</n-layout-sider>

		<!-- <n-drawer v-model:show="showSideDrawer" :width="240" :placement="isMobile ? 'left' : 'right'">
		<n-layout-sider>111</n-layout-sider>	
		</n-drawer> -->


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
const collapsed = ref(false);
const isMobileState = ref(window.innerWidth <= 768);


const isMobile = computed<boolean>({
	get() {return isMobileState.value},
	set(val:boolean) {isMobileState.value = val}
  });

  const showSideDrawer = computed<boolean>({
	get() {return isMobile.value && collapsed.value},
	set(val:boolean) {isMobile.value = val}
  });
  //判断是否触发移动端模式
  function checkMobileMode() {
	isMobile.value = document.body.clientWidth <= 768;
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
</script>