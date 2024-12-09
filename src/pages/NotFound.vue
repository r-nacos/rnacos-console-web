<template>
  <div
    class="top"
    :style="{
      width: +layoutSize.windowSize.width + 'px',
      height: layoutSize.windowSize.height + 'px'
    }"
  >
    <div class="wrap">
      <div class="notFound">
        <p class="title">404</p>
        <p>{{ path }}</p>
        <router-link class="link" :to="{ path: '/' }">{{
          this.$t('common.home')
        }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useLayoutSize } from '@/data/appdata';

export default defineComponent({
  setup() {
    let layoutSize = useLayoutSize();
    return {
      layoutSize
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
}

.wrap {
  flex: 1 1 auto;
  display: flex;
  position: relative;
  align-items: center;
  background: #fff;
  flex-direction: row;
}
.notFound {
  flex: 1 1 auto;
  font-size: 30px;
  line-height: 60px;
  text-align: center;
}
.title {
  font-size: 60px;
}
</style>
