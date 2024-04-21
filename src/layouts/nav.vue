<template>
  <n-layout>
    <n-layout-header>
      <div class="vi-logo">R-NACOS</div>
      <SystemMoreSetting></SystemMoreSetting>
    </n-layout-header>
    <n-layout has-sider>
      <n-layout-sider>
        <SystemSideMenu />
      </n-layout-sider>
      <n-layout-content style="padding: 0; margin: 0">
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import { NLayout, NLayoutHeader, NLayoutSider, NLayoutContent } from 'naive-ui'
</script>

<style scoped lang="scss">
.n-layout-header {
  padding: 24px;
  height: 52px;
  background: #2f6cf7;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.n-layout-sider,
.n-layout-content {
  height: calc(100vh - 52px);
}

.n-layout-sider {
  background: #fff;
}

.n-layout-content {
  background: #f2f2f2;
  padding: 15px;
}
</style>
