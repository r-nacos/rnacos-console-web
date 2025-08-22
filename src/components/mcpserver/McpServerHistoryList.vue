<template>
  <div class="mcpserver-history-list">
    <n-empty description="历史版本列表功能将在后续任务中实现">
      <template #icon>
        <n-icon size="48" color="#d1d5db">
          <time-outline />
        </n-icon>
      </template>
    </n-empty>
  </div>
</template>

<script setup lang="ts">
import { NEmpty, NIcon } from 'naive-ui';
import { TimeOutline } from '@vicons/ionicons5';

interface Props {
  serverId: number;
}

interface Emits {
  (e: 'publish-version', versionId: number): void;
  (e: 'view-version', version: any): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
.mcpserver-history-list {
  padding: 24px;
  text-align: center;
}
</style>
