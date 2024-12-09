<template>
  <div class="top">
    <div class="wrap">
      <div class="content">
        <n-space vertical class="inner_wrap">
          <n-card :title="this.$t('about.intro_title')" size="medium">
            <p>{{ this.$t('about.intro_p01') }}</p>
            <br />
            <p>{{ this.$t('about.intro_p02') }}</p>
            <br />
            <p>{{ this.$t('about.intro_p03') }}</p>
            <p>
              <a href="https://github.com/r-nacos/r-nacos" target="_blank"
                >r-nacos github</a
              >
              <br />
              <a href="https://gitee.com/hqp/rnacos" target="_blank"
                >r-nacos gitee</a
              >
            </p>
          </n-card>
          <n-card :title="this.$t('about.version_title')" size="medium">
            {{ webResources.version }}
          </n-card>
          <n-card
            v-if="webResources.username !== ''"
            :title="this.$t('about.user_title')"
            size="medium"
          >
            {{ webResources.username }}
          </n-card>
        </n-space>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useLayoutSize } from '@/data/appdata';
import { useWebResources } from '@/data/resources';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  setup() {
    let { t } = useI18n();
    let layoutSize = useLayoutSize();
    let webResources = useWebResources();
    return {
      t,
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
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #eeeeee;
}

.wrap {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.content {
  flex: 1 1 auto;
  display: flex;
  position: relative;
  font-size: 20px;
  line-height: 60px;
  padding: 10px;
  /*
  text-align: center;
  */
}

.inner_wrap {
  width: 100%;
  flex: 1 1 auto;
}
.title {
  font-size: 60px;
}
</style>
