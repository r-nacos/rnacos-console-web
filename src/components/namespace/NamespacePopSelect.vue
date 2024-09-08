<template>
  <div class="wrap">
    <div class="name">命名空间:</div>
    <div class="popselect">
      <n-select
        class="popselect"
        v-model:value="value.namespaceId"
        :options="optionList"
        :consistent-menu-width="false"
        size="medium"
        @update:value="update"
        scrollable
        filterable
      >
        {{ value.namespaceName || 'public' }}
      </n-select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { namespaceStore } from '../../data/namespace';

export default defineComponent({
  emits: ['change'],
  setup() {},
  data() {
    /*
        var obj={
            namespaceId:namespaceStore.current.namespaceId,
            namespaceName:namespaceStore.current.namespaceName,
        };
        */
    return {
      value: namespaceStore.current,
      optionList: namespaceStore.optionList
    };
  },
  methods: {
    update(v: string) {
      for (var item of this.optionList) {
        if (item.value === v) {
          let obj = {
            namespaceId: item.value,
            namespaceName: item.label
          };
          this.value = obj;
          namespaceStore.setCurrent(obj);
          this.$emit('change');
        }
      }
    }
  },
  created() {
    namespaceStore.initLoad();
  }
});
</script>

<style scoped>
.wrap {
  display: inline-flex;
  flex-direction: row;
}
.name {
  background: #fff;
  line-height: 34px;
  /*
  font-size: 12px;
  */
  padding: 0px 5px;
}
.popselect {
  width: 260px;
}
</style>
