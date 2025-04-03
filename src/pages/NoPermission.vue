<template>
  <div class="flex relative items-center bg-white flex-col w-full h-full">
    <div class="flex-1 flex relative items-center bg-white flex-row">
      <div class="flex-1 text-3xl leading-[60px] text-center">
        <p class="text-6xl">No permission</p>
        <p>{{ path }}</p>
        <router-link
          class="text-blue-500 hover:text-blue-700"
          :to="{ path: '/' }"
        >
          {{ $t('common.home') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const path = computed(() => {
  return route.query.path || '';
});
</script>
