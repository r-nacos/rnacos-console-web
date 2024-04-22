<template>
  <div class="page-about">
    <div class="content">
      <n-space vertical>
        <n-card
          title="系统简介"
          size="medium"
        >
          <p>r-nacos是一个用rust实现的nacos服务。完全兼容nacos sdk协议。</p>
          <p>它相对来说有轻量、快速、稳定、高性能等特点。</p>
          <p>使用过程有什么问题可以到 github提issue。</p>
          <p>
            <a href="https://github.com/heqingpan/rnacos">r-nacos github</a>
            <br />
            <a href="https://gitee.com/hqp/rnacos">r-nacos gitee</a>
          </p>
        </n-card>
        <n-card
          title="系统版本号"
          size="medium"
        >
          {{ webResources.version }}
        </n-card>
        <n-card
          v-if="webResources.username !== ''"
          title="当前用户"
          size="medium"
        >
          {{ webResources.username }}
        </n-card>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts" title="关于" layout="nav">
import { useLayoutSize } from '@/store/index'
import { useWebResources } from '@/data/resources'
import { NSpace, NCard } from 'naive-ui'
let layoutSize = useLayoutSize()
let webResources = useWebResources()
</script>

<style scoped>
.page-about {
  align-items: center;
  flex-direction: column;
  margin: 10px;
}

.wrap {
  align-items: center;
  background: #fff;
  flex-direction: row;
}
.content {
  flex: 1 1 auto;
  font-size: 20px;
  line-height: 60px;
  /*
  text-align: center;
  */
}
.title {
  font-size: 60px;
}
</style>
