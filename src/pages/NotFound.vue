<template>
  <div class="top" :style="{width:+layoutSize.windowSize.width+'px',height:layoutSize.windowSize.height+'px'}">
    <div class="wrap">
      <div class="notFound">
        <p>404</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useLayoutSize } from "@/data/appdata";

export default defineComponent({
  setup() {
    let layoutSize = useLayoutSize();

    return {
      layoutSize,
    };
  },
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
  font-size: 60px;
}

</style>
