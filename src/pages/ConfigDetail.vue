<template>
  <div class="detailWrap">
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="dataId" label="配置ID">
        <n-input
          :disabled="isReadonly"
          placeholder="输入配置ID"
          v-model:value="model.dataId"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="group" label="配置组">
        <n-input
          :disabled="isReadonly"
          placeholder="输入配置组"
          v-model:value="model.group"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item v-show="model.showMd5" path="md5" label="MD5">
        <n-input
          :disabled="true"
          placeholder=""
          v-model:value="model.md5"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="content" label="配置内容">
        <n-input
          :disabled="isReadonly"
          type="textarea"
          placeholder="输入配置内容"
          :autosize="{ minRows: 5 }"
          v-model:value="model.content"
        />
      </n-form-item>
    </n-form>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: ["model"],
  computed: {
    isReadonly() {
      return this.model.mode === "detail";
    }
  },
  data() {
    const rules = {
      group: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return new Error("需要输入配置组");
            }
            return true;
          },
          trigger: ["input", "blur"]
        }
      ],

      dataId: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return new Error("需要输入配置ID");
            }
            return true;
          },
          trigger: ["input", "blur"]
        }
      ]
    };
    return {
      rules
    };
  },
  methods: {}
});
</script>

<style scoped>
.detailWrap {
  background: #fff;
  padding: 3px;
  border-radius: 5px;
  min-width: 500px;
}
</style>
