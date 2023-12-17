<template>
  <div class="top">
    <div class="content">
      <n-space vertical>
        <n-card title="系统简介" size="medium">
          <p>r-nacos是一个用rust实现的nacos服务。</p>
          <p>r-nacos是一个轻量、快速、稳定、高性能的注册中心、配置中心服务。</p>
          <p>
            <a href="https://github.com/heqingpan/rnacos">r-nacos github</a>
            <br />
            <a href="https://gitee.com/hqp/rnacos">r-nacos gitee</a>
          </p>
        </n-card>
        <n-card title="系统版本号" size="medium">
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

<script>
import { defineComponent } from 'vue';
import { useLayoutSize } from '@/data/appdata';
import { useWebResources } from '@/data/resources';

export default defineComponent({
  setup() {
    let layoutSize = useLayoutSize();
    let webResources = useWebResources();
    return {
      layoutSize,
      webResources
    };
  },
  computed: {
    path() {
      return this.$route.query.path || '';
    }
  }
});
</script>

<style scoped>
.top {
  display: flex;
  position: relative;
  align-items: center;
  background: #fff;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.wrap {
  flex: 1 1 auto;
  display: flex;
  position: relative;
  align-items: center;
  background: #fff;
  flex-direction: row;
}
.content {
  flex: 1 1 auto;
  margin-top: 20px;
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
