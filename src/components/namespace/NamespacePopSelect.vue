<template>
  <div class="inline-flex flex-col sm:flex-row items-start sm:items-center">
    <div
      v-if="value.namespaceId != ''"
      class="inline-flex flex-row items-center pr-2 sm:pr-4 mb-2 sm:mb-0"
    >
      <div
        class="bg-gray-100 text-gray-700 text-sm px-2 sm:h-[30px] flex items-center"
      >
        <span class="whitespace-nowrap">{{ value.namespaceId }}</span>
      </div>
      <div
        class="bg-gray-100 sm:h-[30px] px-2 cursor-pointer hover:bg-gray-400 transition-colors flex items-center"
        @click="copyId"
      >
        <n-icon size="16" color="#2f6cf7">
          <CopyOutline />
        </n-icon>
      </div>
    </div>
    <div class="flex flex-row items-center">
      <div
        class="bg-white text-sm px-2 text-gray-700 sm:h-[30px] flex items-center"
      >
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
