<template>
  <div class="inline-flex flex-row items-center">
    <n-grid
      cols="1 s:1 m:2 l:2 xl:2 2xl:2"
      :y-gap="8"
      responsive="screen"
      class="min-w-[200px] sm:min-w-[260px]"
    >
      <n-gi v-if="value.namespaceId != ''">
        <div class="flex items-center justify-center h-full">
          <div class="inline-flex items-center bg-gray-100">
            <span class="text-gray-700 leading-[30px] text-sm px-2">{{
              value.namespaceId
            }}</span>
            <div
              class="py-1.5 px-2 cursor-pointer hover:bg-gray-400 transition-colors"
              @click="copyId"
            >
              <n-icon size="16" color="#2f6cf7">
                <CopyOutline />
              </n-icon>
            </div>
          </div>
        </div>
      </n-gi>
      <n-gi>
        <div class="flex items-center justify-center h-full">
          <div
            class="bg-white leading-[30px] text-sm px-2 text-gray-700 whitespace-nowrap"
          >
            {{ this.$t('namespace.namespace') }}:
          </div>
          <div class="w-[200px] sm:w-[260px]">
            <n-select
              class="w-full"
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
      </n-gi>
    </n-grid>
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
