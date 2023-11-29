<template>
  <section class="wrap">
    <header
      class="header-wrap"
      :style="{ height: layoutSize.headerHeight + 'px' }"
    >
      <div class="sider-header">R-NACOS</div>
      <div class="header">
        <MoreSetting class="more" />
      </div>
    </header>
    <section class="content_wrap">
      <nav class="side" :style="{ width: layoutSize.siderWidth + 'px' }">
        <SideMenu />
      </nav>
      <main id="main_content" class="content">
        <div
          class="content-inner"
          :style="{
            width: layoutSize.contentWidth + 'px',
            height: layoutSize.contentHeight + 'px'
          }"
        >
          <router-view></router-view>
        </div>
      </main>
    </section>
    <!--
        <div class="footer" :style="{'height':size.footerHeight+'px'}">
            footer
        </div>
        -->
  </section>
</template>

<script>
import SideMenu from '../SideMenu.vue';
import MoreSetting from '../MoreSetting.vue';
import { useMessage } from 'naive-ui';
import { defineComponent } from 'vue';
import { useLayoutSize } from '@/data/appdata';

export default defineComponent({
  components: {
    SideMenu,
    MoreSetting
  },
  setup() {
    window.$message = useMessage();
    let layoutSize = useLayoutSize();
    //layoutSize.updateLayoutSize(undefined);
    return {
      layoutSize: layoutSize
      /*
      doUpdateLayoutSize(){
          layoutSize.updateLayoutSize(undefined);
      }
      */
    };
  },
  methods: {},
  mounted() {
    //var updateLayoutSize=()=>{this.doUpdateLayoutSize()};
    //updateLayoutSize();
    //window.addEventListener("resize",updateLayoutSize)
  }
});
</script>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header-wrap {
  flex: 0 0 auto;
  height: 52px;
  background: #2f6cf7;
  color: #fff;
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
}

.sider-header {
  flex: 0 0 auto;
  height: 52px;
  width: 200px;
  position: relative;
  line-height: 52px;
  text-align: center;
  background: #2f6cf7;
  color: #fff;
}

.header {
  flex: 1 1 auto;
  background: #2f6cf7;
  color: #fff;
  height: 52px;
  position: relative;
  display: flex;
  justify-content: flex-end;
}

.more {
  width: 52px;
  height: inherit;
  flex: 0;
}

.content_wrap {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
}

.side {
  height: calc(100vh - 52px);
  width: 200px;
  background: #fff;
  color: #595959;
  border-right: 1px #ccc solid;
  overflow-y: auto;
  scrollbar-color: var(--rnacos-scrollbar-color) transparent;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--rnacos-scrollbar-color);
  }
}

.content {
  flex-grow: 1;
  background: #ffffff;
  position: relative;
  display: block;
  overflow: hidden;
}

.content-inner {
  position: relative;
  display: block;
  overflow: auto;
  background: #efefef;
}

.footer {
  flex: 0 0 auto;
  height: 30px;
}
</style>
