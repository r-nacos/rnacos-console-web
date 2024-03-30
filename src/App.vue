<template>
  <n-config-provider
    :theme-overrides="themeOverrides"
    :locale="zhCN"
    abstract
  >
    <n-modal-provider>
      <n-dialog-provider>
        <n-message-provider>
          <router-view></router-view>
        </n-message-provider>
      </n-dialog-provider>
    </n-modal-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { useLayoutSize } from '@/store/index'
import { zhCN, NModalProvider } from 'naive-ui'
import type { GlobalThemeOverrides, NConfigProvider, NMessageProvider } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#2f6cf7',
    //hoverColor:'#2f6cf7',
    //overColor: '#2f6cf7',
    //hover:'#2f6cf7',
  },
  Button: {
    //hoverColor:'#2f6cf7',
    textColor: '#595959',
  },
  Select: {
    peers: {
      InternalSelection: {
        textColor: '#595959',
      },
    },
  },
  Drawer: {
    titleFontSize: '14px',
    footerPadding: '5px 5px',
    headerPadding: '11px 15px',
  },
}

const layoutSize = useLayoutSize()

function updateLayoutSize() {
  layoutSize.updateLayoutSize(undefined)
}
onMounted(updateLayoutSize)
onMounted(() => window.addEventListener('resize', updateLayoutSize))
onUnmounted(() => window.removeEventListener('resize', updateLayoutSize))
</script>
