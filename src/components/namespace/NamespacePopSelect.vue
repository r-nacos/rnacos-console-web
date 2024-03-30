<template>
  <n-select
    class="on-select"
    v-model:value="value.namespaceId"
    :options="optionList"
    size="medium"
    @update:value="update"
    scrollable
  >
    <n-button style="margin-right: 8px">
      {{ value.namespaceName || 'public' }}
    </n-button>
  </n-select>
</template>

<script lang="ts" setup>
import { namespaceStore } from '@/data/namespace'
let value = namespaceStore.current as any
let optionList = namespaceStore.optionList as any
const emits = defineEmits(['change'])
const update = (v: string) => {
  for (let item of optionList) {
    if (item.value === v) {
      let obj = {
        namespaceId: item.value,
        namespaceName: item.label,
      }
      value = obj
      namespaceStore.setCurrent(obj)
      emits('change')
    }
  }
}

onMounted(() => {
  namespaceStore.initLoad()
})
</script>

<style scoped>
.on-select {
  width: 200px;
}
</style>
