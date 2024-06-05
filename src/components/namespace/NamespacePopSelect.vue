<template>
  <n-select
    class="on-select"
    v-model:value="namespaceId"
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
import { ref } from 'vue'
import { namespaceStore } from '@/data/namespace'
let value = namespaceStore.current as any
let optionList = namespaceStore.optionList as any
const emits = defineEmits(['change'])
const namespaceId = ref(namespaceStore.current.value.namespaceId || '')
/**
 *
 * @param v 选中项
 */
const update = (v: string) => {
  for (let item of optionList.value) {
    if (item.value === v) {
      let obj = {
        namespaceId: item.value,
        namespaceName: item.label,
      }
      namespaceId.value = item.value
      namespaceStore.setCurrent(obj)
      localStorage.setItem('currentNamespace', JSON.stringify(obj))
      emits('change', obj)
    }
  }
}

onMounted(() => {
  namespaceStore.initLoad()
  let currentNamespace = localStorage.getItem('currentNamespace')
  if (currentNamespace) {
    namespaceId.value = JSON.parse(currentNamespace).namespaceId
    emits('change', JSON.parse(currentNamespace))
  }
})
</script>

<style scoped>
.on-select {
  width: 200px;
}
</style>
