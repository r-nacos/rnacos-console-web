<template>
  <div class="wrap">
    <div class="namespace_id" v-if="value.namespaceId != ''">
      <div class="namespace_text">
        <span>{{ value.namespaceId }}</span>
      </div>
      <div class="copy_icon" @click="copyId">
        <n-icon size="16" color="#2f6cf7">
          <CopyOutline />
        </n-icon>
      </div>
    </div>
    <div class="name">{{ this.$t('namespace.namespace') }}:</div>
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
.wrap {
  display: inline-flex;
  flex-direction: row;
}

.namespace_id {
  display: inline-flex;
  flex-direction: row;
  padding-right: 15px;
  background: #fff;
}

.namespace_text {
  background: #f0f0f0;
  color: #333;
  line-height: 34px;
  font-size: 12px;
  padding: 0px 5px;
}

.copy_icon {
  background: #f0f0f0;
  padding-top: 8px;
  padding-right: 5px;
  cursor: pointer;
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
