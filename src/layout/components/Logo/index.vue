<template>
  <div
    class="flex items-center justify-center h-16 line-height-16 whitespace-nowrap"
  >
    <img
      src="@/assets/images/logo.svg"
      class="w-auto h-8"
      alt="rnacos-logo"
      :class="{ 'mr-2': !collapsed }"
    />
    <h2 v-show="!collapsed" class="m-0">R-NACOS</h2>
  </div>
</template>

<script lang="ts" setup>
const { collapsed } = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
});
</script>
