<template>
  <div class="inline-flex flex-row items-center">
    <div
      v-if="value.namespaceId != ''"
      class="inline-flex flex-row items-center pr-4"
    >
      <div class="bg-gray-100 text-gray-700 leading-[30px] text-sm px-2">
        <span>{{ value.namespaceId }}</span>
      </div>
      <div
        class="bg-gray-100 py-1.5 px-2 cursor-pointer hover:bg-gray-400 transition-colors"
        @click="copyId"
      >
        <n-icon size="16" color="#2f6cf7">
          <CopyOutline />
        </n-icon>
      </div>
    </div>
    <div class="bg-white leading-[30px] text-sm px-2 text-gray-700">
      {{ this.$t('namespace.namespace') }}:
    </div>
    <div class="w-[260px]">
      <n-select
        class="w-[260px]"
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

<script>
import { defineComponent } from 'vue';
import { CopyOutline } from '@vicons/ionicons5';

import { namespaceStore } from '../../data/namespace';
import { copyText } from '@/utils/utils';

export default defineComponent({
  emits: ['change'],
  components: {
    CopyOutline
  },
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
    update(v) {
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
    },
    copyId() {
      let namespaceId = this.value.namespaceId;
      copyText(namespaceId);
      window.$message.info(
        this.$t('namespace.the_namespace_id_has_been_copied')
      );
    }
  },
  created() {
    namespaceStore.initLoad();
  }
});
</script>

<style scoped>
/* 移除所有 scoped 样式，因为已经转换为 Tailwind 类名 */
</style>
