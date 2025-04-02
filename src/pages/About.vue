<template>
  <div class="flex relative items-center flex-col w-full h-full bg-gray-100">
    <div class="block relative w-full h-full mx-auto">
      <div class="flex-1 flex relative text-xl leading-[60px] p-2.5">
        <n-space vertical class="w-full flex-1">
          <n-card :title="$t('about.intro_title')" size="medium">
            <p>{{ $t('about.intro_p01') }}</p>
            <br />
            <p>{{ $t('about.intro_p02') }}</p>
            <br />
            <p>{{ $t('about.intro_p03') }}</p>
            <p>
              <a href="https://github.com/r-nacos/r-nacos" target="_blank" class="text-blue-500 hover:text-blue-700">r-nacos github</a>
              <br />
              <a href="https://gitee.com/hqp/rnacos" target="_blank" class="text-blue-500 hover:text-blue-700">r-nacos gitee</a>
            </p>
          </n-card>
          <n-card :title="$t('about.version_title')" size="medium">
            {{ webResources.version }}
          </n-card>
          <n-card
            v-if="webResources.username !== ''"
            :title="$t('about.user_title')"
            size="medium"
          >
            {{ webResources.username }}
          </n-card>
        </n-space>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWebResources } from '@/data/resources';

const webResources = useWebResources();

const path = computed(() => {
  return route.query.path || '';
});
</script>

