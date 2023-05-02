<script>
import { defineComponent, reactive } from "vue";
import { useLayoutSize } from "@/data/appdata";
import { zhCN } from "naive-ui";

export default defineComponent({
  setup() {
    const themeOverrides = {
      common: {
        primaryColor: "#2f6cf7",
        //hoverColor:'#2f6cf7',
        //overColor: '#2f6cf7',
        //hover:'#2f6cf7',
      },
      Button: {
        //hoverColor:'#2f6cf7',
        textColor: "#595959",
      },
      Select: {
        peers: {
          InternalSelection: {
            primaryColor: "#2f6cf7",
            textColor: "#595959",
          },
        },
      },
      // ...
    };
    let layoutSize = useLayoutSize();
    layoutSize.updateLayoutSize(undefined);
    return {
      themeOverrides,
      zhCN,
      layoutSize: layoutSize,
      doUpdateLayoutSize() {
        layoutSize.updateLayoutSize(undefined);
      },
    };
  },
  methods: {},
  mounted() {
    var updateLayoutSize = () => {
      this.doUpdateLayoutSize();
    };
    updateLayoutSize();
    window.addEventListener("resize", updateLayoutSize);
  },
});
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN">
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped></style>
