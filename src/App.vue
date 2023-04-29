<script lang="ts" setup>

const themeOverrides = {
    common: {
      primaryColor: '#2f6cf7',
      //hoverColor:'#2f6cf7',
      //overColor: '#2f6cf7',
      //hover:'#2f6cf7',
    },
    Button: {
      //hoverColor:'#2f6cf7',
      textColor: '#595959'
    },
    Select: {
      peers: {
        InternalSelection: {
          primaryColor: '#2f6cf7',
          textColor: '#595959'
        }
      }
    }
    // ...
  }
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
    <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>

</style>
