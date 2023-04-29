<template>
  <div class="detailWrap">
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="dataId" label="配置ID">
        <n-input :disabled="isReadonly" v-model:value="model.dataId" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item path="group" label="配置组">
        <n-input :disabled="isReadonly" v-model:value="model.group" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item path="md5" label="MD5">
        <n-input :disabled="true" v-model:value="model.md5" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item path="content" label="配置内容">
        <n-input :disabled="isReadonly" 
          type="textarea" 
          :autosize="{minRows:5}"
          v-model:value="model.content" 
          @keydown.enter.prevent />
      </n-form-item>
    </n-form>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props:[
    "model",
  ],
  computed:{
    isReadonly(){
      return this.model.mode==="detail"
    }
  },
  data() {
    return {};
  },
  methods: {},
});
</script>

<style scoped></style>
