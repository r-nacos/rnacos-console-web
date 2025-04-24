<template>
  <div
    class="flex items-center justify-center h-13 line-height-13 whitespace-nowrap"
  >
    <h2 class="m-0">R-NACOS</h2>
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
