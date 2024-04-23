<template>
  <div class="page-about">
    <div class="content">
      <n-space
        vertical
        class="inner_wrap"
      >
        <n-card
          title="系统简介"
          size="medium"
        >
          <p>r-nacos是一个用rust实现的nacos服务。相较于java nacos来说，是一个提供相同功能，启动更快、占用系统资源更小（初始内存小于10M）、性能更高、运行更稳定的服务。</p>
          <br />
          <p>r-nacos设计上完全兼容最新版本nacos面向client sdk 的协议（包含1.x的http OpenApi，和2.x的grpc协议）, 支持使用nacos服务的应用平迁到 r-nacos。</p>
          <br />
          <p>使用过程有什么问题可以到 github提issue。</p>
          <p>
            <a
              href="https://github.com/r-nacos/r-nacos"
              target="_blank"
            >
              r-nacos github
            </a>
            <br />
            <a
              href="https://gitee.com/hqp/rnacos"
              target="_blank"
            >
              r-nacos gitee
            </a>
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
