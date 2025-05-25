<template>
  <div
    class="flex items-center bg-[#2f6cf7] text-white justify-center h-13 line-height-13 whitespace-nowrap"
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
